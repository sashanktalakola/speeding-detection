#!/bin/bash

set -e

# Build the Docker image
echo "Building Docker image..."
docker build -t gcr.io/starlit-tube-450017-k7/notification-service:latest .

# Push the image to Google Container Registry
echo "Pushing Docker image to Google Container Registry..."
docker push gcr.io/starlit-tube-450017-k7/notification-service:latest

# Deploy to Google App Engine
echo "Deploying to Google App Engine..."
gcloud app deploy
# gcloud app deploy --quiet

echo "Deployment completed successfully!"