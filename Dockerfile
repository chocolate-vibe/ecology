FROM node:12.18.0

WORKDIR /chocolate

COPY package.json .

RUN npm install

COPY ./ .

RUN npm run build

EXPOSE 80

CMD npm run serve