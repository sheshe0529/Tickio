# Etapa 1: build de Vite
FROM node:20-alpine AS builder
WORKDIR /app

# Copiamos solo lo necesario para instalar deps
COPY package*.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

# Variable para la URL del backend (API)
# Se la pasaremos desde docker-compose
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build de producción
RUN npm run build

# Etapa 2: servir con Nginx
FROM nginx:alpine
# Copiamos el build a la carpeta pública de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Opcional: configurar Nginx (SPA, rutas, etc.)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
