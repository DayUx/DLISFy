FROM node:16.20.2-alpine3.18

# Set the working directory
WORKDIR /app


# Copy the package.json and package-lock.json files
COPY package*.json ./


# Install the application dependencies
RUN npm install
#RUN ECHO $(pwd)

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

#RUN npm install -g serve


# Uses port which is used by the actual application
EXPOSE 80

# Run application
CMD [ "npm","run", "preview", "--","--host", "0.0.0.0", "--port", "80" ]
#CMD serve -s dist