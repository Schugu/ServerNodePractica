// Importas el Router, lo invocás, le agregas las rutas y luego lo exportas.
import { Router } from 'express';

import { getUsers, newUser, getUser, updateUser, deleteUser, uploadProfilePicture } from "../controllers/users.controller.js";

const router = Router();

// Ruta para obtener todos los usuarios
router.get('/users', getUsers);

// Ruta para obtener un usuario por ID
router.get('/users/:userId', getUser);

// Ruta para agregar un nuevo usuario
router.post('/users/new', newUser);

// Ruta para actualizar un usuario por ID
router.put('/users/:userId', updateUser);

// Ruta para eliminar un usuario por ID
router.delete('/users/:userId', deleteUser);


// Rutas Foto de perfil
router.post('/users/:userId/profilePicture', uploadProfilePicture);

export default router;
