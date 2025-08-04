# Imagen base oficial de Node.js LTS
FROM node:18-alpine

# Instalar git para clonar el repositorio
RUN apk add --no-cache git

# Crear y establecer el directorio de trabajo
WORKDIR /app

# Clonar el repositorio con tu microservicio
RUN git clone https://github.com/LENINMORENO13/ms_usuarios.git .

# Instalar dependencias sin las de desarrollo
RUN npm install --omit=dev

# Exponer el puerto HTTPS que usas (443)
EXPOSE 443

# Comando para ejecutar el microservicio
CMD ["node", "src/index.js"]
