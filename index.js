import express from 'express';
import fs from 'node:fs';

const app = express();
app.use(express.json()); // Para manejar solicitudes JSON
app.use(express.urlencoded({ extended: true })); // Para manejar solicitudes con valores codificados en URL

const port = 8080;
const filePath = './users.json';

app.listen(port, () => {
  console.log(`Server abierto en: ${port}`);
});

// Función para leer los usuarios desde el archivo
const readUsersFromFile = () => {
  if (!fs.existsSync(filePath)) {
    // Si el archivo no existe, devolver un array vacío
    return [];
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

// Función para escribir los usuarios en el archivo
const writeUsersToFile = (users) => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8');
};

// Ruta para obtener todos los usuarios
app.get('/api/users', (req, res) => {
  const dataUsers = readUsersFromFile();
  res.send(dataUsers);
});

// Ruta para agregar un nuevo usuario
app.post('/api/users/new', (req, res) => {
  let { id, firstName, lastName } = req.body;

  // Verificar que todos los campos estén presentes
  if (!firstName || !lastName || !id) {
    return res.status(400).json({ message: "Faltan campos requeridos." });
  }

  // Convertir id a número
  id = parseInt(id, 10);

  // Verificar que el id es un número válido y mayor que 0
  if (isNaN(id)) {
    return res.status(400).json({ message: "El ID debe ser un número." });
  }
  if (id < 1) {
    return res.status(400).send("El ID debe ser un número mayor a 0.");
  }

  // Validar tipos de datos
  if (typeof (firstName) !== "string") {
    return res.status(400).send("El nombre debe ser un texto.");
  }
  if (typeof (lastName) !== "string") {
    return res.status(400).send("El apellido debe ser un texto.");
  }

  // Verificar si el usuario ya existe
  const dataUsers = readUsersFromFile();
  const userExists = dataUsers.some((user) => user.id === id);
  if (userExists) {
    return res.status(400).send("El usuario con este ID ya existe.");
  }

  // Agregar el nuevo usuario
  const newUser = { id, firstName, lastName };
  dataUsers.push(newUser);

  // Guardar los cambios en el archivo
  writeUsersToFile(dataUsers);

  res.status(201).send(newUser);
});

// Ruta para obtener un usuario por ID
app.get('/api/users/:userId', (req, res) => {
  const pathUserId = parseInt(req.params.userId, 10);

  if (isNaN(pathUserId)) {
    return res.status(400).json({ message: "ID de usuario invalido. Debe ser un número." });
  }

  const dataUsers = readUsersFromFile();
  const userFound = dataUsers.find((user) => user.id === pathUserId);

  userFound ? res.send(userFound) : res.status(404).json({ message: `No existe ningun usuario con el id: ${pathUserId}` });
});


// Ruta para actualizar un usuario por ID
app.put('/api/users/:userId', (req, res) => {
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

  // Verificar que al menos uno de los campos a actualizar esté presente
  if (!firstName && !lastName) {
    return res.status(400).json({ message: "Debe proporcionar al menos uno de los campos para actualizar (firstName o lastName)." });
  }

  let userUpdated = false; // Bandera para verificar si se realizaron cambios
  const updateMessages = {}; // Mensaje de respuesta

  // Validar y actualizar el nombre
  if (firstName) {
    if (typeof firstName !== "string") {
      return res.status(400).json({ message: "El nombre debe ser un texto." });
    }
    if (dataUsers[userIndex].firstName !== firstName) {
      const firstNameAntiguo = dataUsers[userIndex].firstName;
      updateMessages.firstName = `${firstNameAntiguo} => ${firstName}`;
      dataUsers[userIndex].firstName = firstName;
      userUpdated = true; // Marcar que se realizaron cambios
    }
  }

  // Validar y actualizar el apellido
  if (lastName) {
    if (typeof lastName !== "string") {
      return res.status(400).json({ message: "El apellido debe ser un texto." });
    }
    if (dataUsers[userIndex].lastName !== lastName) {
      const lastNameAntiguo = dataUsers[userIndex].lastName;
      updateMessages.lastName = `${lastNameAntiguo} => ${lastName}`;
      dataUsers[userIndex].lastName = lastName;
      userUpdated = true; // Marcar que se realizaron cambios
    }
  }

  // Verificar si se realizaron cambios
  if (!userUpdated) {
    return res.status(304).json({ message: "No se realizaron cambios." });
  }

  // Guardar los cambios en el archivo
  writeUsersToFile(dataUsers);

  return res.status(200).json({ Modificaciones: updateMessages });
});

// Ruta para eliminar un usuario por ID
app.delete('/api/users/:userId', (req, res) => {
  const pathUserId = parseInt(req.params.userId, 10);

  if (isNaN(pathUserId)) {
    return res.status(400).json({ message: "ID de usuario invalido. Debe ser un número." });
  }

  const dataUsers = readUsersFromFile();
  const userIndex = dataUsers.findIndex((user) => user.id === pathUserId);

  if (userIndex === -1) {
    return res.status(404).json({ message: `No existe ningun usuario con el id: ${pathUserId}` });
  }

  // Eliminar el usuario del array
  const [deletedUser] = dataUsers.splice(userIndex, 1);

  // Guardar los cambios en el archivo
  writeUsersToFile(dataUsers);

  // Devolver una respuesta adecuada
  res.status(200).json({ message: `Usuario con id ${pathUserId} eliminado`, deletedUser });
});

// Ruta para manejar rutas no encontradas
app.get('*', (req, res) => {
  res.send('Ruta no encontrada :/');
});
