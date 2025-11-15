// Verificar conexión con la base de datos al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    const dbStatusDiv = document.getElementById('db-status');
    dbStatusDiv.className = 'db-status loading';
    
    try {
        // Intentar conectar con el endpoint de prueba de BD
        const response = await fetch('/api/db-test');
        const data = await response.json();
        
        if (response.ok && data.connected) {
            dbStatusDiv.className = 'db-status success';
            dbStatusDiv.textContent = '✅ Base de datos conectada correctamente';
        } else if (response.ok && !data.connected) {
            dbStatusDiv.className = 'db-status error';
            dbStatusDiv.textContent = `❌ ${data.message || 'Error al conectar con la base de datos'}`;
        } else {
            throw new Error(data.message || 'Error en la respuesta del servidor');
        }
    } catch (error) {
        dbStatusDiv.className = 'db-status error';
        dbStatusDiv.textContent = `❌ Error: ${error.message}`;
        console.error('Error al verificar conexión con BD:', error);
    }
});

