# Base image
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose the desired port 
EXPOSE 2999

# Run the server
CMD [ "npm", "run", "start" ]
