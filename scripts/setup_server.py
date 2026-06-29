#!/usr/bin/env python3
"""One-time server setup and initial deploy via SSH."""
import os
import sys
import stat
from pathlib import Path

import paramiko

sys.path.insert(0, str(Path(__file__).resolve().parent))
from nginx_config import APP_PATH, HOST, WEB_ROOT, nginx_site_conf

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
KEY_DIR = ROOT / ".deploy"
PRIVATE_KEY = KEY_DIR / "deploy_key"
PUBLIC_KEY = KEY_DIR / "deploy_key.pub"

USER = os.environ.get("DEPLOY_USER", "root")
PASSWORD = os.environ.get("DEPLOY_PASSWORD", "")
HOST = os.environ.get("DEPLOY_HOST", HOST)


def ensure_deploy_key():
    KEY_DIR.mkdir(exist_ok=True)
    if PRIVATE_KEY.exists():
        return PRIVATE_KEY.read_text(), PUBLIC_KEY.read_text()

    from cryptography.hazmat.primitives import serialization
    from cryptography.hazmat.primitives.asymmetric import ed25519

    private_key = ed25519.Ed25519PrivateKey.generate()
    private_bytes = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.OpenSSH,
        encryption_algorithm=serialization.NoEncryption(),
    )
    public_bytes = private_key.public_key().public_bytes(
        encoding=serialization.Encoding.OpenSSH,
        format=serialization.PublicFormat.OpenSSH,
    )
    pub_line = f"{public_bytes.decode().strip()} github-actions-deploy@barber\n"

    PRIVATE_KEY.write_bytes(private_bytes)
    PUBLIC_KEY.write_text(pub_line)
    os.chmod(PRIVATE_KEY, stat.S_IRUSR | stat.S_IWUSR)

    return private_bytes.decode(), pub_line


def run(client, cmd, check=True):
    print(f"$ {cmd}")
    _, stdout, stderr = client.exec_command(cmd, get_pty=True)
    out = stdout.read().decode(errors="replace")
    err = stderr.read().decode(errors="replace")
    code = stdout.channel.recv_exit_status()
    if out.strip():
        print(out.strip())
    if err.strip():
        print(err.strip(), file=sys.stderr)
    if check and code != 0:
        raise RuntimeError(f"Command failed ({code}): {cmd}")
    return out, code


def upload_dir(sftp, local_dir: Path, remote_dir: str):
    run_sftp_mkdir(sftp, remote_dir)
    for item in local_dir.rglob("*"):
        rel = item.relative_to(local_dir).as_posix()
        remote_path = f"{remote_dir}/{rel}".replace("//", "/")
        if item.is_dir():
            run_sftp_mkdir(sftp, remote_path)
        else:
            sftp.put(str(item), remote_path)
            print(f"  uploaded {rel}")


def run_sftp_mkdir(sftp, path):
    parts = path.strip("/").split("/")
    current = ""
    for part in parts:
        current += f"/{part}"
        try:
            sftp.stat(current)
        except FileNotFoundError:
            sftp.mkdir(current)


def main():
    if not PASSWORD:
        print("Set DEPLOY_PASSWORD env var for initial server setup.", file=sys.stderr)
        sys.exit(1)

    if not DIST.is_dir():
        print("Run npm run build first.", file=sys.stderr)
        sys.exit(1)

    _, pub_key = ensure_deploy_key()

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print(f"Connecting to {HOST}...")
    client.connect(HOST, username=USER, password=PASSWORD, timeout=30)

    try:
        run(client, "export DEBIAN_FRONTEND=noninteractive && apt-get update -qq")
        run(
            client,
            "export DEBIAN_FRONTEND=noninteractive && "
            "apt-get install -y -qq nginx rsync",
        )

        run(client, f"mkdir -p {WEB_ROOT}")
        run(client, f"chown -R www-data:www-data {WEB_ROOT}")

        sftp = client.open_sftp()
        with sftp.file("/etc/nginx/sites-available/bs-garage", "w") as f:
            f.write(nginx_site_conf())
        sftp.close()

        run(client, "ln -sf /etc/nginx/sites-available/bs-garage /etc/nginx/sites-enabled/bs-garage")
        run(client, "rm -f /etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/parser")
        run(client, "nginx -t")
        run(client, "systemctl enable nginx")
        run(client, "systemctl restart nginx")

        auth_keys_path = "/root/.ssh/authorized_keys"
        grep_out, _ = run(client, f"grep -F 'github-actions-deploy@barber' {auth_keys_path} || true", check=False)
        if "github-actions-deploy@barber" not in grep_out:
            run(client, f"mkdir -p /root/.ssh && chmod 700 /root/.ssh")
            escaped = pub_key.strip().replace("'", "'\\''")
            run(client, f"echo '{escaped}' >> {auth_keys_path}")
            run(client, f"chmod 600 {auth_keys_path}")

        app_root = f"{WEB_ROOT}{APP_PATH}"
        run(client, f"mkdir -p {app_root}")
        run(client, f"rm -rf {app_root}/*")
        sftp = client.open_sftp()
        upload_dir(sftp, DIST, app_root)
        sftp.close()

        run(client, f"chown -R www-data:www-data {app_root}")
        run(client, "systemctl reload nginx")

        print("\nServer setup complete.")
        print(f"Site: http://{HOST}{APP_PATH}/")
    finally:
        client.close()


if __name__ == "__main__":
    main()
