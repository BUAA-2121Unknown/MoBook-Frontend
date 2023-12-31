FROM node:20.5-alpine as build

WORKDIR /usr/MoBook-Frontend/
COPY package*.json ./
RUN npm config set registry http://registry.npm.taobao.org
RUN npm install -g npm@9.8.1
RUN npm install
COPY . .
RUN npm run build

# CMD ["node", "/usr/MoBook-Frontend/src/utils/editor/server.mjs"]

FROM nginx:1.21.5-alpine as serve
COPY --from=build /usr/MoBook-Frontend/dist /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
