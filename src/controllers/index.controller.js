/*
  Creado por: carlos.vicente@groupnova.com.gt
  Fecha creación: 27-Feb-2023
  Modificado por: carlos.vicente@groupnova.com.gt
  Fecha modificación: 27-Feb-2023
  Descripción: Función creada
*/

// Importación de la conexión
const { getConn } = require('../conn/bdd');

// Obtiene todos los usuarios que exiten en NOVA
const getUsers = async (req, res) => {
  const response = await getConn.query('select * from nova.users u');
  res.status(200).json(response.rows);
};

// Obtiene los usuarios por medio del id
const getUsersByID = async (req, res) => {
  const response = await getConn.query('select * from nova.users where id = $1', [req.params.id]);
  res.status(200).json(response.rows);
};

// Inserta los usuarios
const createUser = async (req, res) => {
  // creando variables apartir de un objeto
  const { name, email } = req.body;
  await getConn.query('INSERT INTO nova.users (nombre, email) VALUES ($1, $2)', [name, email]);

  res.json({
    message: 'User Added Successfully',
    body: {
      user: { name, email },
    },
  });
};

// Actualiza usuarios en base al id
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  await getConn.query('UPDATE nova.users SET nombre = $1, email = $2 where id = $3', [name, email, id]);

  res.json({
    message: 'User Updated Successfully',
    body: {
      user: { id, name, email },
    },
  });
};

// Elimina usuarios en base al id
const deleteUser = async (req, res) => {
  // creando variables apartir de un objeto
  const { id } = req.body;
  await getConn.query('DELETE  FROM nova.users WHERE id = $1', [id]);

  res.json({
    message: 'User Deleted Successfully',
    body: {
      user: { id },
    },
  });
};

module.exports = {
  getUsers,
  getUsersByID,
  createUser,
  updateUser,
  deleteUser,
};
