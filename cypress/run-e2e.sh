#!/bin/bash

cd "$(dirname "$0")/docker"

echo "🧹 Cleaning up existing containers..."
docker-compose -f docker-compose.e2e.yaml down --volumes

echo "🚀 Starting e2e environment..."
docker-compose -f docker-compose.e2e.yaml up -d --build

cd ../../

echo "🔍 Running tests..."
CYPRESS_BASE_URL=http://localhost:3005 pnpx cypress run --browser chrome

echo "🧹 Cleaning up e2e environment..."
cd "$(dirname "$0")/docker"
docker-compose -f docker-compose.e2e.yaml down --volumes