#!/usr/bin/env python3
"""Deploy dist to server and update nginx config via SSH key."""
import sys
from pathlib import Path

import paramiko

HOST = "213.109.202.145"
USER = "root"
WEB_ROOT = "/var/www/bs-garage"
APP_PATH = "/barber"
DOMAIN = "bs-garage.ru"

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
KEY = ROOT / ".deploy" / "deploy_key"

NGINX_CONF = f"""server {{
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name {DOMAIN} www.{DOMAIN} {HOST} _;

    root {WEB_ROOT};
    index index.html;

    location {APP_PATH}/ {{
        try_files $uri $uri/ {APP_PATH}/index.html;
    }}

    location ~* ^{APP_PATH}/.*\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|webp|txt)$ {{
        expires 30d;
        add_header Cache-Control "public, immutable";
    }}

    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
}}
"""


def run(client, cmd):
    print(f"$ {cmd}")
    _, stdout, stderr = client.exec_command(cmd, get_pty=True)
    out = stdout.read().decode(errors="replace")
    err = stderr.read().decode(errors="replace")
    code = stdout.channel.recv_exit_status()
    if out.strip():
        print(out.strip())
    if err.strip():
        print(err.strip(), file=sys.stderr)
    if code != 0:
        raise RuntimeError(f"Command failed ({code}): {cmd}")


def upload_dir(sftp, local_dir: Path, remote_dir: str):
    parts = remote_dir.strip("/").split("/")
    current = ""
    for part in parts:
        current += f"/{part}"
        try:
            sftp.stat(current)
        except FileNotFoundError:
            sftp.mkdir(current)

    for item in local_dir.rglob("*"):
        rel = item.relative_to(local_dir).as_posix()
        remote_path = f"{remote_dir}/{rel}".replace("//", "/")
        if item.is_dir():
            try:
                sftp.stat(remote_path)
            except FileNotFoundError:
                sftp.mkdir(remote_path)
        else:
            sftp.put(str(item), remote_path)
            print(f"  uploaded {rel}")


def main():
    if not DIST.is_dir():
        print("Run npm run build first.", file=sys.stderr)
        sys.exit(1)
    if not KEY.exists():
        print("Deploy key not found at .deploy/deploy_key", file=sys.stderr)
        sys.exit(1)

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    key = paramiko.Ed25519Key.from_private_key_file(str(KEY))
    print(f"Connecting to {HOST}...")
    client.connect(HOST, username=USER, pkey=key, timeout=30)

    try:
        sftp = client.open_sftp()
        with sftp.file("/etc/nginx/sites-available/bs-garage", "w") as f:
            f.write(NGINX_CONF)
        sftp.close()

        run(client, "nginx -t")
        app_root = f"{WEB_ROOT}{APP_PATH}"
        run(client, f"mkdir -p {app_root}")
        run(client, f"rm -rf {app_root}/*")

        sftp = client.open_sftp()
        upload_dir(sftp, DIST, app_root)
        sftp.close()

        run(client, f"chown -R www-data:www-data {app_root}")
        run(client, "systemctl reload nginx")
        print(f"\nDeployed: http://{HOST}{APP_PATH}/")
    finally:
        client.close()


if __name__ == "__main__":
    main()
