const { ObjectId } = require("mongodb");

// Listar usuarios
exports.listarUsuarios = async function (request, reply) {
  const usuarios = await this.mongo.db.collection("usuarios").find().toArray();
  return reply.send(usuarios);
};

// Crear un nuevo usuario
exports.crearUsuario = async function (request, reply) {
  const { nombre, apellido, correo, genero, pais } = request.body;
  if (!nombre || !apellido || !correo) {
    return reply.status(400).send({ error: "Faltan datos del usuario." });
  }
  const resultado = await this.mongo.db.collection("usuarios").insertOne({
    nombre,
    apellido,
    correo,
    genero,
    pais,
    fechaCreacion: new Date(),
  });

  return reply.status(201).send({
    mensaje: `Usuario ${nombre} creado correctamente.`,
    id: resultado.insertedId,
  });
};

// Actualizar un usuario por ID
exports.actualizarUsuario = async function (request, reply) {
  const { id } = request.params;
  const { nombre, apellido, correo, genero, pais } = request.body;

  if (!ObjectId.isValid(id)) {
    return reply.status(400).send({ error: "ID de usuario no válido." });
  }

  const camposAActualizar = {};

  if (nombre) camposAActualizar.nombre = nombre;
  if (apellido) camposAActualizar.apellido = apellido;
  if (correo) camposAActualizar.correo = correo;
  if (genero) camposAActualizar.genero = genero;
  if (pais) camposAActualizar.pais = pais;

  if (Object.keys(camposAActualizar).length === 0) {
    return reply.status(400).send({ error: "No se proporcionaron datos para actualizar." });
  }

  const resultado = await this.mongo.db
    .collection("usuarios")
    .updateOne({ _id: new ObjectId(id) }, { $set: camposAActualizar });

  if (resultado.matchedCount === 0) {
    return reply.status(404).send({ error: "Usuario no encontrado." });
  }

  return reply.send({
    mensaje: `Usuario ${id} actualizado correctamente.`,
  });
};

// Eliminar un usuario por ID
exports.eliminarUsuario = async function (request, reply) {
  const { id } = request.params;
  if (!ObjectId.isValid(id)) {
    return reply.status(400).send({ error: "ID de usuario no válido." });
  }

  const usuario = await this.mongo.db
    .collection("usuarios")
    .findOne({ _id: new ObjectId(id) });

  if (!usuario) {
    return reply.status(404).send({ error: "Usuario no encontrado." });
  }
  const resultado = await this.mongo.db
    .collection("usuarios")
    .deleteOne({ _id: new ObjectId(id) });
  if (resultado.deletedCount === 0) {
    return reply.status(404).send({ error: "Usuario no encontrado." });
  } 

    return reply.send({
      mensaje: `Usuario ${usuario.nombre} eliminado correctamente.`,
      ID: id
    });
};
