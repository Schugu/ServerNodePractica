import express from 'express';
import usersRoutes from './routes/users.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el nombre del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json()); // Para manejar solicitudes JSON
app.use(express.urlencoded({ extended: true })); // Para manejar solicitudes con valores codificados en URL

// Servir archivos estáticos desde el directorio "public"
app.use('/static', express.static(path.join(__dirname, '..', 'public'))); // Ajuste aquí, ya que 'public' está fuera de 'src'

app.use('/api', usersRoutes);

// Ruta para manejar rutas no encontradas
app.get('*', (req, res) => {
  res.status(404).send('Ruta no encontrada :/');
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server abierto en: ${PORT}`);
});

export default app;
