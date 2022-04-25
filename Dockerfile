FROM node:alpine
RUN npm install extract-zip -g
VOLUME /golem/input
WORKDIR /golem/work