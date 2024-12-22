
# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the rest of the application code
RUN npm install

# Expose the port the app runs on
COPY . .

# Use the official Node.js image as the base image
EXPOSE 5000 

# Command to run the application
CMD [ "sh", "-c", "node ./db/indexing.js && node app.js" ]

