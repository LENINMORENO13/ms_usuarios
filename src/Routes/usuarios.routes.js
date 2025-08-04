const usuariosController = require("../Controller/usuarios.controller");

module.exports = async function (fastify, opts) {
  // Esquema para crear usuario (todos los campos requeridos)
  const crearUsuarioSchema = {
    body: {
      type: "object",
      required: ["nombre", "apellido", "correo", "genero", "pais"],
      properties: {
        nombre: { type: "string", minLength: 3 },
        apellido: { type: "string", minLength: 3 },
        correo: { type: "string", format: "email" },
        genero: { type: "string", enum: ["masculino", "femenino", "otro"] },
        pais: { type: "string", minLength: 3 },
      },
    },
  };

  // Esquema para actualizar usuario (todos los campos opcionales)
  const actualizarUsuarioSchema = {
    body: {
      type: "object",
      properties: {
        nombre: { type: "string", minLength: 3 },
        apellido: { type: "string", minLength: 3 },
        correo: { type: "string", format: "email" },
        genero: { type: "string", enum: ["masculino", "femenino", "otro"] },
        pais: { type: "string", minLength: 3 },
      },
      additionalProperties: false,
    },
  };

  // Rutas
  fastify.get("/", usuariosController.listarUsuarios);

  fastify.post("/", {
    schema: crearUsuarioSchema,
    handler: usuariosController.crearUsuario,
  });

  fastify.put("/:id", {
    schema: actualizarUsuarioSchema,
    handler: usuariosController.actualizarUsuario,
  });

  fastify.delete("/:id", usuariosController.eliminarUsuario);
};
