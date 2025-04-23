# Stage 1: Build the Vite frontend
FROM node:23-slim

# Set the working directory
WORKDIR /app

# Copy the frontend package.json and package-lock.json
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . ./

# Build the frontend
RUN npm run build

# Copy the Vite build output to the Nginx web server
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the Nginx port
EXPOSE 4173

# Start Nginx
CMD ["npm", "run", "dev"]
