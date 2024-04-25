# Use an official Node.js runtime as the base image
FROM node:16-alpine as build-step

# Declaring env
ENV NODE_ENV production
ARG REACT_APP_BACKEND
ENV REACT_APP_BACKEND=$REACT_APP_BACKEND

# Set the working directory in the container
WORKDIR /app

# Installing dependencies
COPY ./package.json ./
RUN npm install

# Copying all the files in our project
COPY . .

# Building our application
RUN npm run build

# Build step #2: build an nginx container
FROM nginx:stable-alpine
COPY --from=build-step /app/build /usr/share/nginx/html
COPY nginx.default.conf /etc/nginx/conf.d/default.conf



