FROM node:12.18.0

WORKDIR /chocolate

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY ./ .

RUN npm run build

EXPOSE 80

CMD npm run serve