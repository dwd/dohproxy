# Use official Node.js runtime as a base image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the app dependencies using npm
RUN npm install

# Copy the rest of the source code into the container
COPY . .

RUN npm run build

# Expose port 8000
EXPOSE 8000

# Start the app
CMD [ "npm", "run", "start" ]