
FROM node:10

WORKDIR /app
RUN npm install \
        && npm install typescript -g
COPY . ./
RUN npm run build
EXPOSE 3003

ENTRYPOINT ["npm", "start"]