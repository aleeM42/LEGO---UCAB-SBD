const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));
// Servir archivos estáticos de la raíz (para index.html)
app.use(express.static(path.join(__dirname, '..')));

// Ruta de prueba para verificar que el servidor funciona
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta de prueba para verificar conexión a la base de datos
app.get('/api/db-test', async (req, res) => {
  try {
    const { testConnection } = require('./db');
    
    // Verificar que las variables de entorno estén configuradas
    const requiredVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return res.json({
        connected: false,
        message: `Variables de entorno faltantes: ${missingVars.join(', ')}. Revisa tu archivo .env`
      });
    }
    
    // Intentar conectar con la base de datos
    const result = await testConnection();
    
    if (result.success) {
      res.json({
        connected: true,
        message: 'Conexión exitosa con la base de datos'
      });
    } else {
      res.json({
        connected: false,
        message: result.message || 'No se pudo conectar con la base de datos'
      });
    }
  } catch (error) {
    res.json({
      connected: false,
      message: `Error: ${error.message}. Verifica tu configuración en el archivo .env y que tu servidor de BD esté corriendo`
    });
  }
});

// Ruta raíz - servir index.html desde la raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📁 Archivos estáticos servidos desde: ${path.join(__dirname, '../frontend')}`);
  console.log(`🔧 Puerto: ${PORT}`);
});

