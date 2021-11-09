FROM cr.yandex/crpk51ud2cjku2i8e2b6/node:12-alpine


ENV PORT 3000
ENV HOST '0.0.0.0'
ENV API_URL 'https://eds.umax.dev/api/'
ENV API_URL_BROWSER 'https://eds.umax.dev/api/'
# ENV API_URL 'https://efroneds.eds.umax.dev/api/'
# ENV API_URL_BROWSER 'https://efroneds.eds.umax.dev/api/'
# ENV API_URL 'https://localhost:8000/api/'
# ENV API_URL_BROWSER 'https://localhost:8000/api/'
ARG PROD_ENV

ENV PROD_ENV ${PROD_ENV}

# USER node
WORKDIR /home/node

COPY . /home/node

RUN npm i
ENTRYPOINT npm run serve
