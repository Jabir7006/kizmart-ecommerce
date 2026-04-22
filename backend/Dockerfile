FROM node:24.15-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:24.15-alpine
WORKDIR /app
COPY package*.json .
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 3000
CMD [ "npm", "start" ]