FROM node:lts-alpine

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
#RUN npm run build

#RUN npm install -g serve


# Uses port which is used by the actual application
EXPOSE 4000

# Run application
CMD [ "npm","run", "preview", "--","--host", "0.0.0.0", "--port", "4000" ]
#CMD serve -s dist