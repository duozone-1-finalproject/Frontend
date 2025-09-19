# Stage 1: Build React App
FROM node:18-alpine AS build

WORKDIR /app

# 패키지 설치
COPY package*.json ./
RUN npm install

# 소스 및 환경 변수 파일 복사
COPY . .

# production 환경 변수 파일이 있으면 빌드에 자동 반영됨
# (예: REACT_APP_API_BASE_URL 등)
COPY .env.production .env.production

RUN npm run build

# Stage 2: Nginx
FROM nginx:alpine

# React build 결과 복사
COPY --from=build /app/build /usr/share/nginx/html

# SPA 라우팅을 위한 nginx 설정 복사
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
