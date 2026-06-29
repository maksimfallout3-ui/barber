#!/usr/bin/env python3
"""Shared nginx site config for barber + /tt parser on one server."""

HOST = "213.109.202.145"
WEB_ROOT = "/var/www/bs-garage"
APP_PATH = "/barber"
DOMAIN = "bs-garage.ru"


def nginx_site_conf():
    return f"""server {{
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name {DOMAIN} www.{DOMAIN} {HOST} _;

    client_max_body_size 20M;

    root {WEB_ROOT};
    index index.html;

    location /tt/ {{
        proxy_pass http://127.0.0.1:8080/tt/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 60s;
        proxy_send_timeout 300s;
    }}

    location = /tt {{
        return 301 /tt/;
    }}

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
