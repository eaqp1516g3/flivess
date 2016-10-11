# Tells the Docker which base image to start.
FROM node:latest

# Adds files from the host file system into the Docker container.
ADD . /app

# Sets the current working directory for subsequent instructions
WORKDIR /app

RUN npm install
RUN npm install -g bower
WORKDIR /app/public
RUN bower install --allow-root

WORKDIR /app
RUN npm install -g nodemon

#expose a port to allow external access
EXPOSE 3001

# Start mean application
CMD nodemon app.js
