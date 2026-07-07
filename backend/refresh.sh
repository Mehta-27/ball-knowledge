#!/usr/bin/env bash
# Scheduled ETL refresh — run from cron / systemd timer
# Example (daily at 3am):
#   0 3 * * * /path/to/backend/refresh.sh >> /var/log/ball-knowledge/refresh.log 2>&1

set -euo pipefail
cd "$(dirname "$0")"
.venv/Scripts/python src/refresh.py "$@"
