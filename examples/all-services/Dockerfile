# Specifies the image of your engine
FROM uselagoon/node-18:latest

# The working directory inside your container
WORKDIR /app

# Get the package.json first to install dependencies
COPY package.json yarn.lock /app/

# This will install those dependencies
RUN yarn install

# Copy the rest of the app to the working directory
COPY . /app

EXPOSE 3000

# Run the container
CMD ["yarn", "run", "start"]