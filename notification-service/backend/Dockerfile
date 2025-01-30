FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies and netcat
RUN apt-get update && apt-get install -y netcat && npm install

# Copy application code
COPY . .

# Add wait-for-mongo script
COPY wait-for-mongo.sh /usr/src/app/wait-for-mongo.sh
RUN chmod +x /usr/src/app/wait-for-mongo.sh

# Define the command to start the service
CMD ["sh", "./wait-for-mongo.sh", "npm", "start"]
