FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Créer le dossier data pour la base SQLite
RUN mkdir -p data

COPY . .

RUN npm run build

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0

# Rendre le script exécutable et l'utiliser comme commande de démarrage
RUN chmod +x start.sh
CMD ["./start.sh"] 