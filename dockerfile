FROM node:22-alpine

WORKDIR ./trabajo/

COPY ./contenedor/ .

RUN npm install

EXPOSE 3001

CMD ["node", "start"]