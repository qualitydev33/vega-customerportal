FROM node:lts-alpine
WORKDIR /app
COPY . .
ENV PORT=3000
EXPOSE ${PORT}
RUN npm install
#What would be the correct command?
CMD ["nx", "customerportal:deploy"]
