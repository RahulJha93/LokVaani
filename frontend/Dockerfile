# Use Node.js image for frontend
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . ./
RUN npm run build
EXPOSE 5173
CMD ["npx", "vite", "preview", "--host"]
