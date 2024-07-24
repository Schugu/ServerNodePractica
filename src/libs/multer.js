// middlewares/upload.js

import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const upload = (userId) => {
  // Configura el almacenamiento para multer
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Crear una ruta dinámica para la carpeta del usuario
      const uploadPath = path.join(__dirname, '../../', 'public', "profiles", userId);

      // Verificar si la carpeta existe y crearla si no
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath); // Configura multer para usar esta ruta
    },
    filename: function (req, file, cb) {
      // Usa el nombre original del archivo o un nombre único
      cb(null, "profilePicture.png");
    }
  });

  // Devuelve el middleware de multer con la configuración
  return multer({ storage });
};
