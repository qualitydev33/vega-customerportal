FROM docker.io/nginx:stable-alpine
COPY dist/apps/adminui/ /usr/share/nginx/html/
ADD nginx.conf /etc/nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
