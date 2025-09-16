# 1. 빌드 스테이지
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Production stage (Node.js 서버로 정적 파일 제공)
FROM node:18-alpine

WORKDIR /app

# 빌드 결과물 복사
COPY --from=build /app/build ./build
COPY package*.json ./
RUN npm install --production

# 간단한 Express 서버 설치
RUN npm install express

# 서버 파일 작성
RUN echo "const express = require('express');\
const path = require('path');\
const app = express();\
app.use(express.static(path.join(__dirname, 'build')));\
app.get('/*', (req, res) => { res.sendFile(path.join(__dirname, 'build', 'index.html')); });\
const PORT = process.env.PORT || 80;\
app.listen(PORT, () => console.log('Server running on port ' + PORT));" > server.js

EXPOSE 80
CMD ["node", "server.js"]
