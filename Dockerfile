# Use Node.js alpine image
FROM node:lts-alpine

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only necessary files to install dependencies
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

# Install dependencies and ensure bcrypt is compiled for the correct architecture
RUN npm install --production --silent && npm rebuild bcrypt && mv node_modules ../

# Copy the rest of the application code into the container
COPY . .

# Expose port for the API
EXPOSE 3002

# Run the Node.js application
CMD ["node", "bin/www"]
