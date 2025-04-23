# Use Node.js image
FROM node:23-slim

# Set the working directory
WORKDIR /app

# Copy the backend package.json and package-lock.json
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend code
COPY . ./

# Expose the backend port
EXPOSE 3000

# Start the Express server
CMD ["node", "index.js"]
