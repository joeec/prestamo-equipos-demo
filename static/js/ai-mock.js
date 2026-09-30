/**
 * IT Asset Manager V3 - Pre-made AI Specifications Engine
 * Replaces n8n / external webhook with an offline, in-browser AI knowledge base
 * and smart heuristic generator for any laptop model.
 */

(() => {
  'use strict';

  // 1. Catálogo pre-cargado de modelos comunes con especificaciones de fabricante
  const KNOWLEDGE_BASE = [
    {
      keywords: ['dell', 'latitude', '5440'],
      data: {
        marca: 'Dell',
        familia: 'Latitude',
        modelo: '5440',
        tipo: 'Portátil empresarial corporativo',
        anio_aproximado: 2023,
        procesadores_disponibles: [
          'Intel Core i7-1365U vPro (10 núcleos, hasta 5.20 GHz, 12MB Cache)',
          'Intel Core i5-1335U (10 núcleos, hasta 4.60 GHz, 12MB Cache)',
          'Intel Core i5-1345U vPro (10 núcleos, hasta 4.70 GHz, 12MB Cache)',
          'Intel Core i7-1355U (10 núcleos, hasta 5.00 GHz, 12MB Cache)'
        ],
        ram_tipo: 'DDR4-3200MHz / DDR5-4800MHz',
        ram_maxima: '64 GB',
        ranuras_ram: 2,
        almacenamiento_tipo: 'SSD M.2 2230/2280 PCIe NVMe Gen 4x4',
        pantalla_tamano: '14.0" FHD (1920x1080) WVA Antirreflejo 250 nits',
        resoluciones_disponibles: ['1920x1080', '1366x768'],
        graficos: ['Intel Iris Xe Graphics', 'NVIDIA GeForce MX550 2GB GDDR6'],
        puertos: [
          '2x Thunderbolt 4 con USB4 Type-C (Power Delivery & DP)',
          '2x USB 3.2 Gen 1 (uno con PowerShare)',
          '1x HDMI 2.0',
          '1x RJ-45 Gigabit Ethernet',
          '1x Conector audio/micrófono 3.5mm',
          '1x Ranura MicroSD'
        ],
        wifi: 'Intel Wi-Fi 6E AX211 2x2 802.11ax',
        bluetooth: 'Bluetooth 5.3',
        bateria: '3 celdas 54 Wh ExpressCharge Capable',
        sistema_operativo: 'Windows 11 Pro 64-bit',
        advertencia: 'Datos de catálogo oficial Dell. Verifica la etiqueta física para la variante exacta de procesador y memoria.'
      }
    },
    {
      keywords: ['dell', 'latitude', '7420'],
      data: {
        marca: 'Dell',
        familia: 'Latitude',
        modelo: '7420',
        tipo: 'Ultrabook corporativo premium',
        anio_aproximado: 2021,
        procesadores_disponibles: [
          'Intel Core i7-1185G7 vPro (4 núcleos, hasta 4.80 GHz)',
          'Intel Core i5-1145G7 vPro (4 núcleos, hasta 4.40 GHz)',
          'Intel Core i5-1135G7 (4 núcleos, hasta 4.20 GHz)'
        ],
        ram_tipo: 'LPDDR4x-4266MHz soldada',
        ram_maxima: '32 GB',
        ranuras_ram: 0,
        almacenamiento_tipo: 'SSD M.2 2280 PCIe NVMe Gen 3/4',
        pantalla_tamano: '14.0" FHD (1920x1080) IPS 400 nits Antirreflejo',
        resoluciones_disponibles: ['1920x1080', '3840x2160 UHD 4K'],
        graficos: ['Intel Iris Xe Graphics'],
        puertos: [
          '2x Thunderbolt 4 con Power Delivery y DisplayPort',
          '1x USB 3.2 Gen 1 con PowerShare',
          '1x HDMI 2.0',
          '1x Conector universal audio 3.5mm'
        ],
        wifi: 'Intel Wi-Fi 6 AX201 2x2',
        bluetooth: 'Bluetooth 5.1',
        bateria: '4 celdas 63 Wh ExpressCharge',
        sistema_operativo: 'Windows 11 Pro 64-bit',
        advertencia: 'Memoria RAM soldada en placa madre. No permite ampliación posterior.'
      }
    },
    {
      keywords: ['lenovo', 'thinkpad', 't14'],
      data: {
        marca: 'Lenovo',
        familia: 'ThinkPad',
        modelo: 'T14 Gen 4',
        tipo: 'Estación de trabajo empresarial',
        anio_aproximado: 2023,
        procesadores_disponibles: [
          'AMD Ryzen 7 PRO 7840U (8 núcleos, 16 hilos, hasta 5.10 GHz)',
          'AMD Ryzen 5 PRO 7540U (6 núcleos, 12 hilos, hasta 4.90 GHz)',
          'Intel Core i7-1355U (10 núcleos, hasta 5.00 GHz)',
          'Intel Core i5-1335U (10 núcleos, hasta 4.60 GHz)'
        ],
        ram_tipo: 'LPDDR5x-6400MHz / DDR5-5600MHz',
        ram_maxima: '32 GB',
        ranuras_ram: 1,
        almacenamiento_tipo: 'SSD M.2 2280 PCIe 4.0x4 NVMe Opal 2.0',
        pantalla_tamano: '14.0" WUXGA (1920x1200) IPS 300 nits Antirreflejo 16:10',
        resoluciones_disponibles: ['1920x1200', '2240x1400 2.2K', '2880x1800 OLED'],
        graficos: ['AMD Radeon 780M Graphics', 'Intel Iris Xe Graphics'],
        puertos: [
          '2x USB-C (Thunderbolt 4 / USB4 40Gbps)',
          '2x USB 3.2 Gen 1 (uno siempre activo)',
          '1x HDMI 2.1',
          '1x Ethernet RJ-45',
          '1x Conector combinado auriculares/micro'
        ],
        wifi: 'Wi-Fi 6E Qualcomm / Intel AX211',
        bluetooth: 'Bluetooth 5.3',
        bateria: '52.5 Wh con Rapid Charge (80% en 60 min)',
        sistema_operativo: 'Windows 11 Pro 64-bit',
        advertencia: 'Chasis probado bajo estándares militares MIL-STD-810H.'
      }
    },
    {
      keywords: ['lenovo', 'thinkpad', 'x1'],
      data: {
        marca: 'Lenovo',
        familia: 'ThinkPad',
        modelo: 'X1 Carbon Gen 11',
        tipo: 'Ultrabook corporativo insignia',
        anio_aproximado: 2023,
        procesadores_disponibles: [
          'Intel Core i7-1365U vPro (10 núcleos, hasta 5.2 GHz)',
          'Intel Core i7-1355U (10 núcleos, hasta 5.0 GHz)',
          'Intel Core i5-1335U (10 núcleos, hasta 4.6 GHz)'
        ],
        ram_tipo: 'LPDDR5-6400MHz soldada',
        ram_maxima: '32 GB / 64 GB',
        ranuras_ram: 0,
        almacenamiento_tipo: 'SSD M.2 2280 PCIe 4.0x4 Performance NVMe',
        pantalla_tamano: '14.0" WUXGA (1920x1200) IPS Low Power 400 nits',
        resoluciones_disponibles: ['1920x1200', '2880x1800 2.8K OLED'],
        graficos: ['Intel Iris Xe Graphics'],
        puertos: ['2x Thunderbolt 4', '2x USB 3.2 Gen 1', '1x HDMI 2.0b', '1x Audio 3.5mm'],
        wifi: 'Intel Wi-Fi 6E AX211',
        bluetooth: 'Bluetooth 5.2',
        bateria: '57 Wh con Rapid Charge',
        sistema_operativo: 'Windows 11 Pro 64-bit',
        advertencia: 'Estructura ultraligera de fibra de carbono y aleación de magnesio.'
      }
    },
    {
      keywords: ['hp', 'elitebook', '840'],
      data: {
        marca: 'HP',
        familia: 'EliteBook',
        modelo: '840 G10',
        tipo: 'Portátil corporativo seguro',
        anio_aproximado: 2023,
        procesadores_disponibles: [
          'Intel Core i7-1365U vPro (10 núcleos, hasta 5.2 GHz)',
          'Intel Core i7-1355U (10 núcleos, hasta 5.0 GHz)',
          'Intel Core i5-1345U vPro (10 núcleos, hasta 4.7 GHz)',
          'Intel Core i5-1335U (10 núcleos, hasta 4.6 GHz)'
        ],
        ram_tipo: 'DDR5-5200MHz SODIMM',
        ram_maxima: '64 GB',
        ranuras_ram: 2,
        almacenamiento_tipo: 'SSD M.2 2280 PCIe Gen 4x4 NVMe',
        pantalla_tamano: '14.0" WUXGA (1920x1200) IPS 400 nits Antirreflejo 16:10',
        resoluciones_disponibles: ['1920x1200', '2560x1600'],
        graficos: ['Intel Iris Xe Graphics'],
        puertos: [
          '2x Thunderbolt 4 con USB4 Type-C 40Gbps',
          '2x SuperSpeed USB Type-A 5Gbps',
          '1x HDMI 2.1',
          '1x Toma combinada auriculares/micro'
        ],
        wifi: 'Intel Wi-Fi 6E AX211 (2x2)',
        bluetooth: 'Bluetooth 5.3',
        bateria: 'HP Long Life 3 celdas 51 Wh Li-ion',
        sistema_operativo: 'Windows 11 Pro 64-bit',
        advertencia: 'Incluye suite de seguridad HP Wolf Security for Business.'
      }
    },
    {
      keywords: ['hp', 'probook', '450'],
      data: {
        marca: 'HP',
        familia: 'ProBook',
        modelo: '450 G9/G10',
        tipo: 'Portátil empresarial versátil',
        anio_aproximado: 2023,
        procesadores_disponibles: [
          'Intel Core i7-1355U (10 núcleos, hasta 5.0 GHz)',
          'Intel Core i5-1335U (10 núcleos, hasta 4.6 GHz)'
        ],
        ram_tipo: 'DDR4-3200MHz / DDR5-4800MHz',
        ram_maxima: '32 GB',
        ranuras_ram: 2,
        almacenamiento_tipo: 'SSD M.2 NVMe PCIe',
        pantalla_tamano: '15.6" FHD (1920x1080) IPS 250 nits',
        resoluciones_disponibles: ['1920x1080'],
        graficos: ['Intel Iris Xe Graphics', 'NVIDIA GeForce RTX 2050 4GB'],
        puertos: ['1x USB-C 10Gbps', '3x USB-A 5Gbps', '1x HDMI 2.1', '1x RJ-45', '1x Audio 3.5mm'],
        wifi: 'Wi-Fi 6E',
        bluetooth: 'Bluetooth 5.3',
        bateria: '3 celdas 51 Wh',
        sistema_operativo: 'Windows 11 Pro'
      }
    },
    {
      keywords: ['macbook', 'pro'],
      data: {
        marca: 'Apple',
        familia: 'MacBook Pro',
        modelo: '14" M3 Pro',
        tipo: 'Estación de trabajo creativa',
        anio_aproximado: 2023,
        procesadores_disponibles: [
          'Apple M3 Pro (CPU 12 núcleos, GPU 18 núcleos, Neural Engine 16 núcleos)',
          'Apple M3 (CPU 8 núcleos, GPU 10 núcleos, Neural Engine 16 núcleos)',
          'Apple M3 Max (CPU 14 núcleos, GPU 30 núcleos)'
        ],
        ram_tipo: 'Memoria Unificada Apple Silicon',
        ram_maxima: '36 GB / 96 GB',
        ranuras_ram: 0,
        almacenamiento_tipo: 'SSD integrado ultrarrápido PCIe Gen 4',
        pantalla_tamano: '14.2" Liquid Retina XDR (3024x1964) ProMotion 120Hz 1000 nits sostenidos',
        resoluciones_disponibles: ['3024x1964'],
        graficos: ['GPU integrada Apple M3 Pro 18-core', 'GPU integrada Apple M3 10-core'],
        puertos: [
          '3x Thunderbolt 4 / USB-C',
          '1x Puerto HDMI',
          '1x Ranura para tarjeta SDXC',
          '1x Puerto MagSafe 3',
          '1x Toma auriculares 3.5mm'
        ],
        wifi: 'Wi-Fi 6E (802.11ax)',
        bluetooth: 'Bluetooth 5.3',
        bateria: 'Polímero de litio 70 Wh con adaptador MagSafe 3 de 70W/96W',
        sistema_operativo: 'macOS Sonoma (actualizable)',
        advertencia: 'Arquitectura unificada no ampliable por hardware.'
      }
    },
    {
      keywords: ['macbook', 'air'],
      data: {
        marca: 'Apple',
        familia: 'MacBook Air',
        modelo: '13" M2/M3',
        tipo: 'Ultrabook portátil sin ventilador',
        anio_aproximado: 2023,
        procesadores_disponibles: [
          'Apple M3 (CPU 8 núcleos, GPU 10 núcleos)',
          'Apple M2 (CPU 8 núcleos, GPU 8 núcleos)'
        ],
        ram_tipo: 'Memoria Unificada',
        ram_maxima: '24 GB',
        ranuras_ram: 0,
        almacenamiento_tipo: 'SSD integrado PCIe',
        pantalla_tamano: '13.6" Liquid Retina (2560x1664) 500 nits',
        resoluciones_disponibles: ['2560x1664'],
        graficos: ['GPU integrada Apple Silicon 10-core'],
        puertos: ['2x Thunderbolt / USB 4', '1x Puerto de carga MagSafe 3', '1x Toma 3.5mm'],
        wifi: 'Wi-Fi 6E',
        bluetooth: 'Bluetooth 5.3',
        bateria: '52.6 Wh con autonomía de hasta 18 horas',
        sistema_operativo: 'macOS Sonoma'
      }
    },
    {
      keywords: ['asus', 'zenbook'],
      data: {
        marca: 'Asus',
        familia: 'ZenBook',
        modelo: '14 OLED (UX3405)',
        tipo: 'Ultrabook premium con pantalla OLED',
        anio_aproximado: 2024,
        procesadores_disponibles: [
          'Intel Core Ultra 7 155H (16 núcleos, hasta 4.8 GHz con Intel AI Boost NPU)',
          'Intel Core Ultra 5 125H (14 núcleos, hasta 4.5 GHz con NPU)',
          'Intel Core Ultra 9 185H (16 núcleos, hasta 5.1 GHz)'
        ],
        ram_tipo: 'LPDDR5X-7467MHz soldada',
        ram_maxima: '32 GB',
        ranuras_ram: 0,
        almacenamiento_tipo: 'SSD M.2 NVMe PCIe 4.0',
        pantalla_tamano: '14.0" 3K (2880x1800) OLED 120Hz 0.2ms 500 nits HDR',
        resoluciones_disponibles: ['2880x1800', '1920x1200'],
        graficos: ['Intel Arc Graphics'],
        puertos: ['2x Thunderbolt 4', '1x USB 3.2 Gen 1 Type-A', '1x HDMI 2.1 TMDS', '1x Jack 3.5mm'],
        wifi: 'Wi-Fi 6E (802.11ax)',
        bluetooth: 'Bluetooth 5.3',
        bateria: '75 Wh 4 celdas Li-ion',
        sistema_operativo: 'Windows 11 Home / Pro'
      }
    }
  ];

  // 2. Generador heurístico inteligente para cualquier consulta arbitraria
  function generateHeuristicSpecs(query) {
    const raw = query.trim();
    const lower = raw.toLowerCase();

    // Detección de marca
    let marca = 'Genérica';
    if (lower.includes('dell')) marca = 'Dell';
    else if (lower.includes('lenovo')) marca = 'Lenovo';
    else if (lower.includes('hp') || lower.includes('hewlett')) marca = 'HP';
    else if (lower.includes('apple') || lower.includes('macbook')) marca = 'Apple';
    else if (lower.includes('asus')) marca = 'Asus';
    else if (lower.includes('acer')) marca = 'Acer';
    else if (lower.includes('toshiba') || lower.includes('dynabook')) marca = 'Toshiba';
    else if (lower.includes('samsung')) marca = 'Samsung';
    else if (lower.includes('microsoft') || lower.includes('surface')) marca = 'Microsoft';
    else if (lower.includes('msi')) marca = 'MSI';
    else {
      // Tomar primera palabra como marca
      const parts = raw.split(' ');
      marca = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    }

    // Extracción de modelo
    const modelParts = raw.split(' ').filter(part => {
      const p = part.toLowerCase();
      return p !== marca.toLowerCase() && !['laptop', 'notebook', 'pc', 'core', 'intel', 'amd', 'ryzen'].includes(p);
    });
    const modelo = modelParts.join(' ') || raw;

    // Inferencia de procesador
    let processors = [];
    if (lower.includes('i9') || lower.includes('ryzen 9')) {
      processors = [
        'Intel Core i9-13900H (14 núcleos, hasta 5.4 GHz)',
        'AMD Ryzen 9 7940HS (8 núcleos / 16 hilos, hasta 5.2 GHz)'
      ];
    } else if (lower.includes('i7') || lower.includes('ryzen 7')) {
      processors = [
        'Intel Core i7-1365U vPro (10 núcleos, hasta 5.20 GHz)',
        'Intel Core i7-1355U (10 núcleos, hasta 5.00 GHz)',
        'AMD Ryzen 7 PRO 7840U (8 núcleos, hasta 5.10 GHz)'
      ];
    } else if (lower.includes('i5') || lower.includes('ryzen 5')) {
      processors = [
        'Intel Core i5-1335U (10 núcleos, hasta 4.60 GHz)',
        'Intel Core i5-1245U (10 núcleos, hasta 4.40 GHz)',
        'AMD Ryzen 5 PRO 7540U (6 núcleos, hasta 4.90 GHz)'
      ];
    } else if (lower.includes('i3')) {
      processors = ['Intel Core i3-1315U (6 núcleos, hasta 4.50 GHz)', 'Intel Core i3-1215U'];
    } else if (lower.includes('ultra')) {
      processors = [
        'Intel Core Ultra 7 155H (16 núcleos con NPU de IA)',
        'Intel Core Ultra 5 125H (14 núcleos con NPU de IA)'
      ];
    } else if (marca === 'Apple') {
      processors = ['Apple M3 (CPU 8-core, GPU 10-core)', 'Apple M2 (CPU 8-core, GPU 8-core)'];
    } else {
      processors = [
        'Intel Core i7-1355U (10 núcleos, hasta 5.0 GHz)',
        'Intel Core i5-1335U (10 núcleos, hasta 4.6 GHz)',
        'AMD Ryzen 7 7730U (8 núcleos, hasta 4.5 GHz)'
      ];
    }

    const isApple = marca === 'Apple';
    const os = isApple ? 'macOS Sonoma' : 'Windows 11 Pro 64-bit';
    const ramMax = isApple ? '24 GB' : '32 GB';
    const ramType = isApple ? 'Memoria Unificada' : 'DDR4-3200MHz / DDR5-5200MHz';

    return {
      marca,
      familia: '',
      modelo: modelo.trim(),
      tipo: 'Portátil para uso corporativo',
      anio_aproximado: 2023,
      procesadores_disponibles: processors,
      ram_tipo: ramType,
      ram_maxima: ramMax,
      ranuras_ram: isApple ? 0 : 2,
      almacenamiento_tipo: 'SSD M.2 PCIe NVMe',
      pantalla_tamano: '14.0" Full HD (1920x1080) Antirreflejo',
      resoluciones_disponibles: ['1920x1080', '1366x768'],
      graficos: isApple ? ['GPU integrada Apple'] : ['Intel Iris Xe Graphics', 'AMD Radeon Graphics'],
      puertos: ['2x USB-C', '2x USB 3.2', '1x HDMI', '1x Audio 3.5mm'],
      wifi: 'Wi-Fi 6 (802.11ax)',
      bluetooth: 'Bluetooth 5.2',
      bateria: 'Batería de iones de litio con carga rápida',
      sistema_operativo: os,
      advertencia: 'Especificaciones deducidas por la IA offline del simulador a partir de los datos comerciales. Revisa la etiqueta física para confirmar.'
    };
  }

  // 3. Conversor al formato canónico esperado por el frontend
  function formatResponse(base) {
    const ramClean = base.ram_maxima && !base.ram_maxima.toLowerCase().startsWith('hasta ')
      ? `Hasta ${base.ram_maxima}`
      : (base.ram_maxima || '16 GB');

    const proc = base.procesadores_disponibles?.[0] || 'Intel Core i5';
    const res = base.resoluciones_disponibles?.[0] || '1920x1080';

    return {
      success: true,
      encontrado: true,
      coincidencia_exacta: true,
      marca: base.marca,
      familia: base.familia || '',
      modelo: base.modelo,
      tipo: base.tipo || 'Laptop',
      anio_aproximado: base.anio_aproximado || 2023,
      procesadores_disponibles: base.procesadores_disponibles || [proc],
      ram_tipo: base.ram_tipo || 'DDR4',
      ram_maxima: base.ram_maxima || '32 GB',
      ranuras_ram: base.ranuras_ram ?? 2,
      almacenamiento_tipo: base.almacenamiento_tipo || 'SSD M.2 NVMe',
      pantalla_tamano: base.pantalla_tamano || '14.0" FHD',
      resoluciones_disponibles: base.resoluciones_disponibles || [res],
      graficos: base.graficos || ['Gráficos integrados'],
      puertos: base.puertos || ['USB 3.0', 'HDMI'],
      wifi: base.wifi || 'Wi-Fi 6',
      bluetooth: base.bluetooth || 'Bluetooth 5.2',
      bateria: base.bateria || 'Batería integrada',
      sistema_operativo: base.sistema_operativo || 'Windows 11 Pro',
      advertencia: base.advertencia || 'Datos de referencia provistos por el motor de IA local.',
      requiere_confirmacion: true,
      components_suggestion: {
        processor: proc,
        processor_options: base.procesadores_disponibles || [proc],
        generation: '',
        ram: ramClean,
        ram_slots: String(base.ranuras_ram ?? 2),
        ram_type: base.ram_tipo || 'DDR4',
        primary_disk: base.almacenamiento_tipo || 'SSD M.2 NVMe 512GB',
        secondary_disk: '',
        storage_capacity: '512 GB',
        storage_type: base.almacenamiento_tipo || 'SSD M.2 NVMe',
        graphics: base.graficos?.[0] || 'Gráficos integrados',
        display: base.pantalla_tamano || '14.0" FHD',
        resolution: res,
        resolution_options: base.resoluciones_disponibles || [res],
        battery: base.bateria || 'Batería integrada',
        mac_address: '',
        ip_address: '',
        bios: 'UEFI Secure Boot',
        tpm: 'TPM 2.0 Habilitado',
        windows: base.sistema_operativo || 'Windows 11 Pro',
        office: 'Microsoft 365 Apps',
        antivirus: 'Windows Defender / EDR Corporativo',
        notes: [base.advertencia, 'Datos analizados por IA local. Deben confirmarse físicamente.'].filter(Boolean).join('\n')
      }
    };
  }

  // 4. Función de búsqueda principal
  window.mockAiSearch = async function (query) {
    // Simular latencia de red realista (450ms)
    await new Promise(resolve => window.setTimeout(resolve, 450));

    const clean = query.trim().toLowerCase();
    const words = clean.split(/\s+/).filter(Boolean);

    // Búsqueda en la base de conocimiento
    let bestMatch = null;
    let maxScore = 0;

    for (const entry of KNOWLEDGE_BASE) {
      let score = 0;
      for (const kw of entry.keywords) {
        if (clean.includes(kw)) score += 2;
        else if (words.some(w => kw.includes(w) || w.includes(kw))) score += 1;
      }
      if (score > maxScore) {
        maxScore = score;
        bestMatch = entry.data;
      }
    }

    // Si coincide con al menos 2 palabras clave, usamos el catálogo exacto
    if (bestMatch && maxScore >= 2) {
      return formatResponse(bestMatch);
    }

    // De lo contrario, activamos el generador heurístico
    const generated = generateHeuristicSpecs(query);
    return formatResponse(generated);
  };

  // 5. Interceptar fetch global para `/api/assets/ai-specifications` y endpoints locales
  const originalFetch = window.fetch;
  window.fetch = async function (url, options = {}) {
    const urlString = String(url);

    // Mock para `/api/assets/ai-specifications`
    if (urlString.includes('/api/assets/ai-specifications')) {
      try {
        const body = options.body ? JSON.parse(options.body) : {};
        const query = body.search_query || '';
        const result = await window.mockAiSearch(query);
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ detail: err.message || 'Error en IA local' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Mock para ping de diagnóstico n8n
    if (urlString.includes('/api/diagnostics/ping') || urlString.includes('/diagnostics/ping')) {
      await new Promise(resolve => window.setTimeout(resolve, 380));
      return new Response(JSON.stringify({
        status: 'ok',
        latency_ms: 38,
        mode: 'demo_simulated',
        message: 'Conexión simulada con éxito para la Demo en GitHub'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return originalFetch.apply(this, arguments);
  };

  console.info('⚡ IT Asset Manager Demo: Motor de IA local y simulación de n8n inicializados.');
})();

