#!/bin/sh

echo "Waiting for MongoDB to start..."

# Update the hostname to match the container name in your docker-compose.yml
until nc -z -v -w30 user-db 27017; do
  echo "Waiting for MongoDB..."
  sleep 1
done

echo "MongoDB is up!"
exec "$@"