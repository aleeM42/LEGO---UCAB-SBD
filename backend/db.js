// Archivo para configuración y conexión a la base de datos Oracle

require('dotenv').config();

// Configuración para Oracle Database
// Oracle usa connectString en formato: host:port/service_name
const dbConfig = {
  user: process.env.DB_USER || 'system',
  password: process.env.DB_PASSWORD || '',
  connectString: `${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 1521}/${process.env.DB_NAME || 'FREEPDB1'}`,
  // Opciones adicionales de Oracle
  // poolMin: 2,
  // poolMax: 10,
  // poolIncrement: 1,
  // poolTimeout: 60
};

// Función para verificar la conexión a Oracle
async function testConnection() {
  let connection;
  try {
    // Verificar que las variables de entorno estén configuradas
    if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_NAME || 
        !process.env.DB_USER || process.env.DB_PASSWORD === undefined) {
      throw new Error('Configuración incompleta en archivo .env');
    }
    
    // Intentar cargar el módulo oracledb
    let oracledb;
    try {
      oracledb = require('oracledb');
    } catch (moduleError) {
      throw new Error('El módulo oracledb no está instalado. Ejecuta: npm install oracledb');
    }
    
    console.log('Intentando conectar a Oracle Database...');
    console.log('Configuración:', {
      user: dbConfig.user,
      connectString: dbConfig.connectString
    });
    
    // Crear conexión
    connection = await oracledb.getConnection(dbConfig);
    
    // Ejecutar una consulta simple para verificar la conexión
    const result = await connection.execute('SELECT 1 FROM DUAL');
    
    console.log('✅ Conexión a Oracle Database exitosa');
    await connection.close();
    
    return { 
      success: true, 
      message: 'Conexión exitosa con Oracle Database' 
    };
  } catch (error) {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        // Ignorar errores al cerrar
      }
    }
    
    console.error('❌ Error al conectar a Oracle Database:', error.message);
    
    // Mensajes de error más descriptivos
    if (error.message.includes('ORA-01017')) {
      throw new Error('Usuario o contraseña incorrectos. Verifica DB_USER y DB_PASSWORD en tu archivo .env');
    } else if (error.message.includes('ORA-12541') || error.message.includes('TNS')) {
      throw new Error('No se puede conectar al servidor. Verifica DB_HOST y DB_PORT en tu archivo .env y que Oracle esté corriendo');
    } else if (error.message.includes('ORA-12514')) {
      throw new Error('Service name incorrecto. Verifica DB_NAME en tu archivo .env (debe ser el service name, ej: FREEPDB1)');
    } else if (error.message.includes('no está instalado')) {
      throw error;
    }
    
    throw error;
  }
}

module.exports = {
  dbConfig,
  testConnection
};

