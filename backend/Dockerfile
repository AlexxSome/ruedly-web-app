# --- Etapa de build ---
FROM node:20-alpine AS build
WORKDIR /app

# Instala dependencias (incluye devDependencies para compilar)
COPY package*.json ./
RUN npm ci

# Compila TypeScript -> dist/
COPY . .
RUN npm run build

# Elimina devDependencies para el runtime
RUN npm prune --omit=dev

# --- Etapa de runtime ---
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copia sólo lo necesario para ejecutar
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

EXPOSE 3000

# Healthcheck contra /api/v1/health
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:'+(process.env.PORT||3000)+'/api/v1/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "dist/main.js"]
