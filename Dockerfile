FROM node:20.5-buster

ARG COMMIT_HASH
ENV COMMIT_HASH=${COMMIT_HASH}

WORKDIR /mock-pfis

COPY package.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
RUN npm run server

EXPOSE 4000
EXPOSE 5000
EXPOSE 8000
EXPOSE 8080
EXPOSE 9000

ENTRYPOINT ["node", "dist/main.js"]