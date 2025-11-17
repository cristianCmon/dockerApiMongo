FROM node:22-alpine

WORKDIR .

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]

# docker build . -t api-express-docker
# docker run api-express-docker