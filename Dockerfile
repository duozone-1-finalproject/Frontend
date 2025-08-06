# frontend/Dockerfile
# 1. 빌드 스테이지
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2. 프로덕션 스테이지
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# 이미지 빌드
# docker build -t frontend-image .