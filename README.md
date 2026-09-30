# IT Asset Manager V3 · Demo Edition (GitHub Pages / Standalone)

Aplicación web completa y moderna para la **gestión de laptops, colaboradores, accesorios, préstamos, mantenimientos e incidencias de TI**.

Esta versión es una **copia demo autónoma** diseñada especialmente para funcionar directamente en **GitHub Pages** o en cualquier navegador web sin requerir backend en Python, base de datos MySQL ni conexión externa con n8n.

---

## 🚀 Características de la Versión Demo

- **100% Client-Side en el Navegador**: Funciona con HTML5, CSS3 moderno y Vanilla JavaScript. No requiere servidores, runtimes ni dependencias externas.
- **Persistencia en LocalStorage**: Todos los equipos, colaboradores, préstamos, accesorios, técnicos, usuarios y registros de auditoría se guardan y actualizan localmente en tu navegador.
- **Motor de IA Offline (Prehecho + Heurístico)**:
  - Emula las respuestas de Google Gemini AI sin necesitar n8n ni API Keys.
  - Base de conocimiento integrada para modelos empresariales populares (*Dell Latitude 5440/7420, Lenovo ThinkPad T14/X1, HP EliteBook 840, Apple MacBook Pro/Air, Asus ZenBook, etc.*).
  - Generador heurístico inteligente: si buscas cualquier otro modelo, deduce marca, procesador, memoria y especificaciones técnicas de forma realista.
- **Generador de Códigos QR Offline**: Genera e imprime códigos QR para cada equipo físico utilizando la librería local `qrcode.min.js`.
- **Firma Digital en Canvas**: Permite firmar entregas y devoluciones tanto con mouse como con pantallas táctiles en dispositivos móviles.
- **Acta Oficial Imprimible / Guardar en PDF**: Genera el Acta Oficial de Entrega y Responsiva con membrete, especificaciones de hardware, accesorios entregados y firmas digitales incrustadas, lista para imprimir o guardar como PDF mediante el navegador (`Ctrl + P`).
- **Simulador de Roles**: Alterna en 1 clic entre el rol de **Administrador** (acceso total a operaciones y altas) y **Visitante** (portal de consulta y autoservicio).
- **Tema Claro / Oscuro**: Detección automática y conmutador manual con persistencia.
- **Botón de Restablecimiento**: Puedes añadir, modificar, prestar y eliminar registros con total libertad. En cualquier momento puedes pulsar **"Restablecer datos"** para volver al estado inicial de fábrica.

---

## 📂 Estructura del Proyecto

```text
SistemaPrestamo_V3_Demo/
├── index.html                   # Shell principal de la Single Page Application (SPA)
├── README.md                    # Documentación y guía de despliegue
└── static/
    ├── css/
    │   ├── style.css            # Sistema de diseño, variables y componentes
    │   ├── responsive.css       # Adaptabilidad móvil y tablets
    │   ├── sidebar.css          # Menú lateral colapsable
    │   ├── loading.css          # Spinners y loaders animados
    │   ├── about.css            # Estilos de la página de información
    │   └── login.css            # Pantalla de acceso y autenticación
    ├── img/
    │   └── favicon.svg          # Isotipo de la plataforma
    └── js/
        ├── store.js             # Base de datos en LocalStorage, modelos y semillas iniciales
        ├── ai-mock.js           # Motor de IA local (reemplazo offline de n8n)
        ├── ai-components.js     # Modal interactivo y sugerencias de componentes
        ├── views.js             # Renderizadores declarativos de vistas
        ├── router.js            # Enrutador por hash (#/dashboard, #/loans, #/laptops...)
        ├── app.js               # Controladores de UI, modales, firmas y tablas
        └── qrcode.min.js        # Motor de generación de códigos QR local
```

---

## 💻 Cómo ejecutarlo localmente

### Opción 1: Con FastAPI y Uvicorn (Recomendada con `.venv`)

El entorno [`.venv`](file:///c:/Users/jdominguez/Desktop/proyectos/SistemaPrestamo_V3_Demo/.venv) y el archivo [`app/main.py`](file:///c:/Users/jdominguez/Desktop/proyectos/SistemaPrestamo_V3_Demo/app/main.py) ya están listos.

**En PowerShell / Terminal:**
```powershell
# 1. Activar el entorno virtual:
.\.venv\Scripts\Activate.ps1

# 2. Iniciar con uvicorn en el puerto 8001:
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```
Abre en tu navegador: `http://localhost:8001` (o desde cualquier equipo en la red `http://IP-DEL-SERVIDOR:8001`).

---

### Opción 2: Con servidor estándar (Sin dependencias adicionales)
```powershell
python server.py
```
O haz doble clic en [`iniciar.bat`](file:///c:/Users/jdominguez/Desktop/proyectos/SistemaPrestamo_V3_Demo/iniciar.bat). Abre automáticamente en `http://localhost:8000`.

---

### Opción 3: Sin ningún servidor (Directo en el navegador)
Haz doble clic sobre el archivo [`index.html`](file:///c:/Users/jdominguez/Desktop/proyectos/SistemaPrestamo_V3_Demo/index.html) en tu explorador de archivos para abrirlo en Chrome, Edge, Firefox o Safari. Como toda la lógica corre en el navegador, no requiere ningún servidor.

---

## 🌐 Cómo publicarlo en GitHub Pages (1 Clic)

1. Sube este directorio a un repositorio de GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: IT Asset Manager V3 Demo para GitHub Pages"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
   git push -u origin main
   ```

2. En tu repositorio de GitHub:
   - Ve a **Settings** → **Pages**.
   - En **Build and deployment** > **Source**, selecciona **Deploy from a branch**.
   - En **Branch**, selecciona `main` y carpeta `/ (root)`.
   - Haz clic en **Save**.

3. En pocos segundos, tu demo estará disponible públicamente en:
   `https://TU-USUARIO.github.io/TU-REPOSITORIO/`

---

## 🔑 Accesos y Credenciales de Demostración

| Rol | Usuario | Contraseña | Descripción |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin` | `admin123` | Control total del inventario, altas, mantenimientos, usuarios y bitácora. |
| **Visitante** | `visitante` | `visitante123` | Vista de consulta para colaboradores y solicitud de equipos. |

*Nota: También puedes usar el botón superior **"👤 Cambiar Rol (Admin/Visitante)"** para alternar de rol al instante sin necesidad de salir de la sesión.*

---

## 🛠️ Tecnologías Empleadas

- **HTML5 & CSS3 nativo** (sin frameworks pesados, con soporte WCAG AA para contrastes).
- **Vanilla JavaScript moderno** (ES6+ modular, sin jQuery ni dependencias bloated).
- **LocalStorage API** para almacenamiento estructurado offline.
- **HTML5 Canvas API** para la captura de firmas biométricas.
- **QRCode.js** para renderizado dinámico de etiquetas en alta resolución.

---

Desarrollado originalmente por **Joel Domínguez** · Adaptado a versión Demo interactiva para GitHub.

