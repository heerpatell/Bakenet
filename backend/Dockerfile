# instruction for the image
# every instruction will tell docker to make an image from this 
# and from images, we're going to create container
FROM node 

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . . 

EXPOSE 5000
CMD [ "npm","start" ]