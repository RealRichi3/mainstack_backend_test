# Use a base image
FROM node:alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install -g npm@10.2.4

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Expose a port
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"]
