#This script will take exactly one argument and that is the image tag
nx run adminui:build:production
docker build -t "$1" -f adminui.Dockerfile .
