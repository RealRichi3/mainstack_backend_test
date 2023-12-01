# Use a base image
FROM node

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Expose a port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
