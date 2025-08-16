FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer toutes les dépendances (y compris devDependencies pour le build)
RUN npm ci --include=dev

# Copier le code source
COPY . .

# Build de l'application
RUN npm run build

# Nettoyer les dépendances de développement après le build
RUN npm prune --production

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0

# Rendre le script exécutable et l'utiliser comme commande de démarrage
RUN chmod +x start.sh
CMD ["./start.sh"] 