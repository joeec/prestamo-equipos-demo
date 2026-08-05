## IT Asset Manager — Demo estática

La raíz del repositorio contiene una versión completamente estática para portafolio. Abre `index.html` o publica la rama en GitHub Pages; no requiere servidor, Python ni base de datos. Los datos y la sesión se guardan en `localStorage`.

### Accesos de demostración

- Administrador: `admin@demo.com` / `admin123`
- Usuario: `user@demo.com` / `user123`

Los datos iniciales están en `app/static/js/demo-data.js` y toda la lógica local en `app/static/js/demo-app.js`. Desde **Auditoría → Restablecer demo** se recupera el estado inicial.

### Aplicación original (desarrollo local)

Aplicacion web para registrar laptops, personas, accesorios y prestamos de TI.

### Ejecutar

1. Activa el entorno virtual: `.\.venv\Scripts\Activate.ps1`
2. Instala dependencias: `pip install -r requirements.txt`
3. Para uso desde la red inicia: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
4. Abre `http://IP-DEL-SERVIDOR:8000` desde cualquier equipo autorizado.

Configura `DATABASE_URL` en `.env` para una base de datos concreta. Si no se define MySQL, la aplicacion crea y utiliza `it_loans.db` localmente.

### Accesos iniciales

- Administrador: `admin` / `admin123`
- Visitante: `visitante` / `visitante123`

Al primer inicio se crea la tabla `users` en MySQL y el visitante queda vinculado al empleado `Visitante` de la tabla `employees`. Antes de publicar la aplicacion, cambia las contrasenas y define `SESSION_SECRET` en `.env`.

### Integración de especificaciones con n8n

Configura `N8N_LAPTOP_SPECS_WEBHOOK_URL`, `N8N_WEBHOOK_API_KEY` (opcional) y `N8N_REQUEST_TIMEOUT` en `.env`. La aplicación envía `{"search_query":"Dell Latitude 5440"}` al webhook mediante el servidor; el navegador nunca llama directamente a n8n.

La Test URL de n8n funciona sólo mientras el workflow está escuchando. La Production URL funciona cuando el workflow está activo. El flujo debe iniciar con un nodo Webhook POST (`laptop-specifications`) y finalizar con Respond to Webhook devolviendo JSON HTTP 200.

Prueba autenticada:

```text
curl -X POST http://localhost:8000/api/assets/ai-specifications -H "Content-Type: application/json" -d "{\"search_query\":\"Dell Latitude 5440\"}"
```
