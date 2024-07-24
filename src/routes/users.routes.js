// Importas el Router, lo invocás, le agregas las rutas y luego lo exportas.
import { Router } from 'express';
import fs from 'node:fs';

import { getUsers, newUser, getUser, updateUser, deleteUser} from "../controllers/users.controller.js";
const router = Router();
const filePath = 'src/dataBase/users.json';

// Función para leer los usuarios desde el archivo
const readUsersFromFile = () => {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

// Función para escribir los usuarios en el archivo
const writeUsersToFile = (users) => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8');
};

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

export default router;
