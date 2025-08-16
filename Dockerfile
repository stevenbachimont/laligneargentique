FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Définir les variables d'environnement par défaut pour EmailJS
ENV VITE_EMAILJS_SERVICE_ID=default_service_id
ENV VITE_EMAILJS_TEMPLATE_ID=default_template_id
ENV VITE_EMAILJS_PUBLIC_KEY=default_public_key

RUN npm run build

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0

# Rendre le script exécutable et l'utiliser comme commande de démarrage
RUN chmod +x start.sh
CMD ["./start.sh"] 