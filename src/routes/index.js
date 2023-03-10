const { Router } = require('express');

const router = Router();

const {
  getUsers, getUsersByID, createUser, deleteUser, updateUser,
} = require('../controllers/index.controller');
// Rutas

// obtener informacion
router.get('/users', getUsers);
router.get('/users/:id', getUsersByID);
router.put('/users/:id', updateUser);
router.post('/users', createUser);
router.delete('/users', deleteUser);

// metodo post - guardar info

module.exports = router;
