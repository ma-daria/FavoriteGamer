FROM node:12-slim

RUN apt update \
  && apt install -y python g++ make

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3000

CMD npm start