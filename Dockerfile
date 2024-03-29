#########################
# multi stage Dockerfile
# 1. set up the build environment and compile the app
# 2. run it with nginx
#########################
FROM node:16-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY ./ .
RUN apk add git
RUN npm install -g gulp-cli gulp-git
RUN npm run build
RUN gulp gitlog

#########################
# now move on to deploying it
#########################

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
