# Use Node.js v21.7.2 as base image
FROM node:21.7.2-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 5173

# Start the app
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"] 