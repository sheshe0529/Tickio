FROM node:20-alpine
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

RUN npx prisma generate

RUN npm run build

# Variables de entorno se las pasaremos desde docker-compose
ENV NODE_ENV=production

# Puerto en el que escucha tu backend
EXPOSE 3000

# Si usas TS compilado:
CMD ["npx", "ts-node", "src/server.ts"]
