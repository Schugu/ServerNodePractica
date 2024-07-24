import { Router } from 'express';
import fs from 'node:fs';

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
router.get('/users', (req, res) => {
  const dataUsers = readUsersFromFile();
  res.send(dataUsers);
});

// Ruta para agregar un nuevo usuario
router.post('/users/new', (req, res) => {
  let { id, firstName, lastName } = req.body;

  if (!firstName || !lastName || !id) {
    return res.status(400).json({ message: "Faltan campos requeridos." });
  }

  id = parseInt(id, 10);

  if (isNaN(id) || id < 1) {
    return res.status(400).json({ message: "El ID debe ser un número mayor a 0." });
  }

  if (typeof firstName !== "string" || typeof lastName !== "string") {
    return res.status(400).json({ message: "El nombre y el apellido deben ser texto." });
  }

  const dataUsers = readUsersFromFile();
  if (dataUsers.some((user) => user.id === id)) {
    return res.status(400).json({ message: "El usuario con este ID ya existe." });
  }

  const newUser = { id, firstName, lastName };
  dataUsers.push(newUser);
  writeUsersToFile(dataUsers);

  res.status(201).json(newUser);
});

// Ruta para obtener un usuario por ID
router.get('/users/:userId', (req, res) => {
  const pathUserId = parseInt(req.params.userId, 10);

  if (isNaN(pathUserId)) {
    return res.status(400).json({ message: "ID de usuario invalido. Debe ser un número." });
  }

  const dataUsers = readUsersFromFile();
  const userFound = dataUsers.find((user) => user.id === pathUserId);

  userFound ? res.send(userFound) : res.status(404).json({ message: `No existe ningun usuario con el id: ${pathUserId}` });
});

// Ruta para actualizar un usuario por ID
router.put('/users/:userId', (req, res) => {
  const pathUserId = parseInt(req.params.userId, 10);

  if (isNaN(pathUserId)) {
    return res.status(400).json({ message: "ID de usuario invalido. Debe ser un número." });
  }

  const dataUsers = readUsersFromFile();
  const userIndex = dataUsers.findIndex((user) => user.id === pathUserId);

  if (userIndex === -1) {
    return res.status(404).json({ message: `No existe ningun usuario con el id: ${pathUserId}` });
  }

  const { firstName, lastName } = req.body;

  if (!firstName && !lastName) {
    return res.status(400).json({ message: "Debe proporcionar al menos uno de los campos para actualizar (firstName o lastName)." });
  }

  let userUpdated = false;
  const updateMessages = {};

  if (firstName && typeof firstName === "string" && dataUsers[userIndex].firstName !== firstName) {
    const firstNameAntiguo = dataUsers[userIndex].firstName;
    updateMessages.firstName = `${firstNameAntiguo} => ${firstName}`;
    dataUsers[userIndex].firstName = firstName;
    userUpdated = true;
  }

  if (lastName && typeof lastName === "string" && dataUsers[userIndex].lastName !== lastName) {
    const lastNameAntiguo = dataUsers[userIndex].lastName;
    updateMessages.lastName = `${lastNameAntiguo} => ${lastName}`;
    dataUsers[userIndex].lastName = lastName;
    userUpdated = true;
  }

  if (!userUpdated) {
    return res.status(304).json({ message: "No se realizaron cambios." });
  }

  writeUsersToFile(dataUsers);
  return res.status(200).json({ Modificaciones: updateMessages });
});

// Ruta para eliminar un usuario por ID
router.delete('/users/:userId', (req, res) => {
  const pathUserId = parseInt(req.params.userId, 10);

  if (isNaN(pathUserId)) {
    return res.status(400).json({ message: "ID de usuario invalido. Debe ser un número." });
  }

  const dataUsers = readUsersFromFile();
  const userIndex = dataUsers.findIndex((user) => user.id === pathUserId);

  if (userIndex === -1) {
    return res.status(404).json({ message: `No existe ningun usuario con el id: ${pathUserId}` });
  }

  const [deletedUser] = dataUsers.splice(userIndex, 1);
  writeUsersToFile(dataUsers);

  res.status(200).json({ message: `Usuario con id ${pathUserId} eliminado`, deletedUser });
});

export default router;
