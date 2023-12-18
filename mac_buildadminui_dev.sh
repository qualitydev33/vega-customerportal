#This script will take exactly one argument and that is the image tag
nx run adminui:build:development
docker buildx build --platform=linux/amd64 -t "$1" -f adminui.Dockerfile .
