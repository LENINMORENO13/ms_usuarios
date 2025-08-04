const fs = require("fs");
const dotenv = require("dotenv");

// Cargar variables de entorno desde el .env (que estará en la raíz del proyecto o montado en Docker)
dotenv.config({ path: "/app/.env" });

// Crear la instancia de Fastify con HTTPS (certificados en /app/certs dentro del contenedor)
const fastify = require("fastify")({
  logger: true,
  https: {
    key: fs.readFileSync("/app/certs/key.pem"),
    cert: fs.readFileSync("/app/certs/cert.pem"),
  },
});

// Rutas y plugins
const usuariosRoutes = require("./Routes/usuarios.routes");
const fastifyMongoDB = require("@fastify/mongodb");

// Conexión a MongoDB usando variable de entorno
fastify.register(fastifyMongoDB, {
  url: process.env.MONGO_URL || "mongodb://localhost:27017/ms-usuarios",
});

// Registrar las rutas de usuarios
fastify.register(usuariosRoutes, { prefix: "/usuarios" });

// Iniciar el servidor
const start = async () => {
  try {
    await fastify.listen({
      port: 443,
      host: "0.0.0.0", 
    });
    console.log(
      `Servidor corriendo en https://www.solfeapp.com:443`
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};


start();
