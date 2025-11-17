FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]

# docker build . -t api-express-docker
# docker run -p 4000:3000 api-express-docker