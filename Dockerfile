# Build Stage
# 💡 'as'를 대문자 'AS'로 변경하여 도커 빌드 경고(FromAsCasing)를 해결했습니다.
FROM node:18-alpine AS build

WORKDIR /app

# 1. 패키지 관련 파일만 먼저 복사 (레이어 캐싱 극대화)
COPY package.json package-lock.json* ./

# 2. npm install 대신 npm ci 사용 (설치 속도 2배 이상 향상)
RUN npm ci

# 3. 소스 코드 복사 
# ⚠️ 주의: 프로젝트 루트에 반드시 .dockerignore 파일이 있어야 COPY 단계의 속도 저하를 막습니다.
COPY . .

# 4. 앱 빌드
RUN npm run build

# Production Stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]