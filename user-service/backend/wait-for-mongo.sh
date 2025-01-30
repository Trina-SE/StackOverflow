#!/bin/sh

echo "Waiting for MongoDB to start..."

until nc -z -v -w30 mongo 27017; do
  echo "Waiting for MongoDB..."
  sleep 1
done

echo "MongoDB is up!"
exec "$@"
