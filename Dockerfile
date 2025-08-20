FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Définir les variables d'environnement par défaut pour l'email
ENV EMAIL_USER=default_email_user
ENV EMAIL_APP_PASSWORD=default_email_password
ENV ADMIN_EMAIL=default_admin_email

RUN npm run build

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0

# Rendre le script exécutable et l'utiliser comme commande de démarrage
RUN chmod +x start.sh
CMD ["./start.sh"] 