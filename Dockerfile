FROM node:20

WORKDIR /app

COPY . /app

run npm i -g @nestjs/cli
RUN npm install --force

EXPOSE 3005

CMD ["npm", "run", "start"]

