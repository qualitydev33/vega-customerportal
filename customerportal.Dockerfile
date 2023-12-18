# This is for admin ui, change adminui to customerportal
# make sure to run nx build <appname>
FROM docker.io/nginx:stable-alpine
COPY dist/apps/customerportal/ /usr/share/nginx/html/
ADD nginx.conf /etc/nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
