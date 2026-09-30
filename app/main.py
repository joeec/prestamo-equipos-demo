"""
IT Asset Manager V3 - Demo Edition
FastAPI Server para despliegue local o pruebas con Uvicorn.
Sirve la SPA estática con persistencia en LocalStorage y emulador de IA.
"""

import os
from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI(
    title="IT Asset Manager V3 (Demo Edition)",
    description="Servidor FastAPI para la versión demo de IT Asset Manager",
    version="3.1.0-demo"
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, "static")
INDEX_FILE = os.path.join(BASE_DIR, "index.html")

# Montar carpeta de archivos estáticos (CSS, JS, imágenes)
if os.path.isdir(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


class AISpecificationRequest(BaseModel):
    search_query: str


# Endpoint de IA simulado (por si se llama por HTTP desde backend o herramientas externas)
@app.post("/api/assets/ai-specifications")
async def ai_specifications(payload: AISpecificationRequest):
    query = payload.search_query.strip()
    lower = query.lower()

    marca = "Dell" if "dell" in lower else "Lenovo" if "lenovo" in lower else "HP" if "hp" in lower else "Apple" if "macbook" in lower or "apple" in lower else "Asus" if "asus" in lower else "Genérica"
    proc = "Intel Core i7-1365U vPro (10 núcleos, hasta 5.20 GHz)" if "i7" in lower or "dell" in lower else "AMD Ryzen 7 PRO 7840U" if "lenovo" in lower else "Intel Core i5-1335U"

    return {
        "success": True,
        "encontrado": True,
        "coincidencia_exacta": True,
        "marca": marca,
        "familia": "",
        "modelo": query,
        "tipo": "Portátil corporativo",
        "anio_aproximado": 2023,
        "procesadores_disponibles": [proc, "Intel Core i5-1335U (10 núcleos)"],
        "ram_tipo": "DDR4-3200MHz / DDR5-5200MHz",
        "ram_maxima": "64 GB",
        "ranuras_ram": 2,
        "almacenamiento_tipo": "SSD M.2 NVMe PCIe 4.0",
        "pantalla_tamano": '14.0" Full HD (1920x1080) Antirreflejo',
        "resoluciones_disponibles": ["1920x1080"],
        "graficos": ["Intel Iris Xe Graphics"],
        "puertos": ["2x Thunderbolt 4", "2x USB 3.2", "1x HDMI", "1x Audio 3.5mm"],
        "wifi": "Wi-Fi 6E (802.11ax)",
        "bluetooth": "Bluetooth 5.3",
        "bateria": "54 Wh ExpressCharge Capable",
        "sistema_operativo": "Windows 11 Pro 64-bit",
        "advertencia": "Especificaciones técnicas generadas por el servidor demo local.",
        "requiere_confirmacion": True,
        "components_suggestion": {
            "processor": proc,
            "processor_options": [proc, "Intel Core i5-1335U (10 núcleos)"],
            "generation": "13va Generación",
            "ram": "Hasta 64 GB",
            "ram_slots": "2",
            "ram_type": "DDR4-3200MHz",
            "primary_disk": "SSD M.2 NVMe 512GB",
            "secondary_disk": "",
            "storage_capacity": "512 GB",
            "storage_type": "SSD M.2 NVMe",
            "graphics": "Intel Iris Xe Graphics",
            "display": '14.0" Full HD (1920x1080)',
            "resolution": "1920x1080",
            "resolution_options": ["1920x1080"],
            "battery": "54 Wh ExpressCharge",
            "windows": "Windows 11 Pro 64-bit",
            "notes": "Especificaciones analizadas por el simulador de IA."
        }
    }


# Endpoint de Ping para diagnóstico n8n
@app.get("/api/diagnostics/ping")
async def ping_n8n():
    return {
        "status": "ok",
        "latency_ms": 35,
        "mode": "fastapi_demo",
        "message": "Servidor FastAPI respondiendo correctamente"
    }


# Ruta principal
@app.get("/")
async def root():
    return FileResponse(INDEX_FILE)


# Ruta catch-all para servir index.html o archivos solicitados
@app.get("/{full_path:path}")
async def catch_all(full_path: str):
    file_path = os.path.join(BASE_DIR, full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    return FileResponse(INDEX_FILE)

