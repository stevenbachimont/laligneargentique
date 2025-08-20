FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Copier les fichiers Prisma
COPY prisma ./prisma/

# Définir DATABASE_URL pour le build
ENV DATABASE_URL=file:./prisma/dev.db

# Générer le client Prisma
RUN npx prisma generate

# Créer la base de données SQLite si elle n'existe pas
RUN npx prisma db push

COPY . .

RUN npm run build

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0

# Rendre le script exécutable et l'utiliser comme commande de démarrage
RUN chmod +x start.sh
CMD ["./start.sh"] 