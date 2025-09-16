FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# serve 설치
RUN npm install -g serve

EXPOSE 80
CMD ["serve", "-s", "build", "-l", "80"]
