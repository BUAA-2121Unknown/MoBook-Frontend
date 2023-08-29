FROM node:20.5-alpine as build

WORKDIR /usr/MoBook-Frontend/editor_server/
COPY . .
RUN npm config set registry http://registry.npm.taobao.org
RUN npm install -g npm@9.8.1
RUN npm install

CMD ["node", "/usr/MoBook-Frontend/editor_server/server.mjs"]
