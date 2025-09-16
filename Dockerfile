# frontend/Dockerfile
# 1. 빌드 스테이지
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
