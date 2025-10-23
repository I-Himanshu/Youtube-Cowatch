# Dockerfile

# 1. Base Image: Use an official Node.js image
FROM node:18-alpine AS base

# 2. Set up the working directory
WORKDIR /app

# 3. Install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy the rest of your application code
COPY . .

# 5. Build the application
# You'll need to pass your MONGODB_URI as a build argument
ARG MONGODB_URI
ENV MONGODB_URI=$MONGODB_URI

# 5.1 Build here
RUN npm run build

# 6. Set the command to start the application
CMD ["npm", "start"]
