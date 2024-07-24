import express from 'express';
import usersRoutes from './routes/users.routes.js';

const app = express();
app.use(express.json()); // Para manejar solicitudes JSON
app.use(express.urlencoded({ extended: true })); // Para manejar solicitudes con valores codificados en URL

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server abierto en: ${PORT}`);
});

app.use('/api', usersRoutes);

// Ruta para manejar rutas no encontradas
app.get('*', (req, res) => {
  res.status(404).send('Ruta no encontrada :/');
});
