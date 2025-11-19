FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "./index.js"]

# CMD ["node", "./index.js"]
# docker build . -t api-express-docker
# docker run -p 4000:3000 api-express-docker

# docker run -p 3000:3000 -e PORT=3000 -e USER=cristian -e MONGO_URI =mongo ejemplo-api 