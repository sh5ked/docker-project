# this command starts from image that already node js installed in version 20;
FROM node:20-alpine 


#sets/app as the working directory inside the container
WORKDIR /app

# copy packege.json and packge-lock.json first to take advantage of docker layer
COPY package*.json ./

# install all dependecies defined in packge.json
RUN npm install

#copy the entire project into the container
COPY . .

# inform docker that the application uses port 3000
EXPOSE 3000

#execute this command when the container starts
CMD [ "node", "app.js" ]

