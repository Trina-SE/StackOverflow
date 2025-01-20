#!/bin/bash

# Check and remove MongoDB lock file if present
if [ -f /data/db/mongod.lock ]; then
  echo "Removing mongod.lock to ensure clean start..."
  rm /data/db/mongod.lock
fi

exec "$@"
