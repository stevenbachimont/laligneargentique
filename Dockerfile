FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0

# Rendre le script exécutable et l'utiliser comme commande de démarrage
COPY start.sh ./
RUN chmod +x start.sh
CMD ["./start.sh"] 