FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install -g typescript

RUN npm install 

RUN tsc 

EXPOSE 3000

CMD [ "node", "dist/index.js" ]

