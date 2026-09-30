/**
 * IT Asset Manager V3 - LocalStorage State & Store
 * Full offline database management with initial seed data, reactive CRUD,
 * relational joins, and audit logging.
 */

(() => {
  'use strict';

  const STORAGE_PREFIX = 'it_asset_demo_';
  const SEED_VERSION = 'v3.1';

  // Fechas de referencia
  const today = new Date().toISOString().split('T')[0];

  // Helper para generar fechas relativas
  const offsetDays = days => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  // 1. Datos iniciales de demostración
  const INITIAL_SEED = {
    laptops: [
      {
        id: 1,
        service_tag: 'DEL-5440-01',
        serial: '8HG4KL2',
        marca: 'Dell',
        modelo: 'Latitude 5440',
        estado: 'Prestado',
        observaciones: 'Equipo asignado con cargador original tipo C y mouse.',
        created_at: offsetDays(-60)
      },
      {
        id: 2,
        service_tag: 'DEL-7420-02',
        serial: '4JK89MN',
        marca: 'Dell',
        modelo: 'Latitude 7420',
        estado: 'Disponible',
        observaciones: 'Chasis impecable. Recién revisado por soporte.',
        created_at: offsetDays(-55)
      },
      {
        id: 3,
        service_tag: 'LEN-T14-01',
        serial: 'PF3AB12',
        marca: 'Lenovo',
        modelo: 'ThinkPad T14 Gen 4',
        estado: 'Para préstamo',
        observaciones: 'Reservado para guardias, eventos y capacitaciones.',
        created_at: offsetDays(-40)
      },
      {
        id: 4,
        service_tag: 'HP-EB840-01',
        serial: '5CD2349',
        marca: 'HP',
        modelo: 'EliteBook 840 G10',
        estado: 'Disponible',
        observaciones: 'Nuevo ingreso corporativo. Batería al 100%.',
        created_at: offsetDays(-30)
      },
      {
        id: 5,
        service_tag: 'APL-MBP-01',
        serial: 'C02DF0G',
        marca: 'Apple',
        modelo: 'MacBook Pro 14" M3',
        estado: 'Prestado',
        observaciones: 'Asignado a Dirección Legal con adaptador USB-C y funda.',
        created_at: offsetDays(-45)
      },
      {
        id: 6,
        service_tag: 'DEL-5440-02',
        serial: '9JK5PL1',
        marca: 'Dell',
        modelo: 'Latitude 5440',
        estado: 'Mantenimiento',
        observaciones: 'Reporta parpadeo ocasional en pantalla al mover la bisagra.',
        created_at: offsetDays(-25)
      },
      {
        id: 7,
        service_tag: 'LEN-X1-01',
        serial: 'LR08872',
        marca: 'Lenovo',
        modelo: 'ThinkPad X1 Carbon Gen 11',
        estado: 'No disponible',
        observaciones: 'En proceso de migración de perfil ejecutivo.',
        created_at: offsetDays(-20)
      },
      {
        id: 8,
        service_tag: 'ASUS-ZB-01',
        serial: 'N1NXCV0',
        marca: 'Asus',
        modelo: 'ZenBook 14 OLED',
        estado: 'Dañado',
        observaciones: 'Teclado con teclas pegajosas tras derrame accidental de café.',
        created_at: offsetDays(-15)
      }
    ],

    components: {
      1: {
        processor: 'Intel Core i7-1365U vPro (10 núcleos, hasta 5.20 GHz)',
        generation: '13va Generación',
        ram: '16 GB',
        ram_slots: '2',
        ram_type: 'DDR4-3200MHz',
        primary_disk: 'SSD M.2 NVMe 512GB',
        secondary_disk: '—',
        storage_capacity: '512 GB',
        storage_type: 'SSD PCIe NVMe M.2',
        graphics: 'Intel Iris Xe Graphics',
        display: '14.0" Full HD (1920x1080) WVA Antirreflejo',
        resolution: '1920x1080',
        battery: '54 Wh ExpressCharge Capable (Salud: 98%)',
        battery_cycles: '24',
        battery_health: '98%',
        mac_address: '00:1A:2B:3C:4D:5E',
        ip_address: '192.168.1.105',
        bios: 'Dell UEFI 1.12.0 Secure Boot ON',
        tpm: 'TPM 2.0 Habilitado',
        windows: 'Windows 11 Pro 64-bit (23H2)',
        office: 'Microsoft 365 Apps for Enterprise',
        antivirus: 'Windows Defender / CrowdStrike Falcon EDR',
        notes: 'Configuración estándar para gerencia y operaciones.'
      },
      2: {
        processor: 'Intel Core i5-1145G7 vPro (4 núcleos, hasta 4.40 GHz)',
        generation: '11va Generación',
        ram: '16 GB',
        ram_slots: '0 (Soldada)',
        ram_type: 'LPDDR4x-4266MHz',
        primary_disk: 'SSD M.2 NVMe 256GB',
        secondary_disk: '—',
        storage_capacity: '256 GB',
        storage_type: 'SSD PCIe NVMe M.2',
        graphics: 'Intel Iris Xe Graphics',
        display: '14.0" FHD (1920x1080) IPS 400 nits',
        resolution: '1920x1080',
        battery: '63 Wh ExpressCharge (Salud: 95%)',
        battery_cycles: '58',
        battery_health: '95%',
        mac_address: '00:1A:2B:3C:7F:8A',
        ip_address: '192.168.1.112',
        bios: 'Dell UEFI 1.18.1 Secure Boot ON',
        tpm: 'TPM 2.0 Habilitado',
        windows: 'Windows 11 Pro 64-bit',
        office: 'Microsoft 365 Apps',
        antivirus: 'Windows Defender',
        notes: 'Equipo restaurado a imagen limpia con sysprep.'
      },
      3: {
        processor: 'AMD Ryzen 7 PRO 7840U (8 núcleos, 16 hilos, hasta 5.10 GHz)',
        generation: 'Zen 4',
        ram: '32 GB',
        ram_slots: '1',
        ram_type: 'LPDDR5x-6400MHz',
        primary_disk: 'SSD M.2 2280 1TB PCIe 4.0 Opal',
        secondary_disk: '—',
        storage_capacity: '1 TB',
        storage_type: 'SSD NVMe PCIe 4.0',
        graphics: 'AMD Radeon 780M Graphics',
        display: '14.0" WUXGA (1920x1200) IPS 300 nits Antirreflejo',
        resolution: '1920x1200',
        battery: '52.5 Wh con Rapid Charge (Salud: 100%)',
        battery_cycles: '8',
        battery_health: '100%',
        mac_address: 'F4:4D:30:6E:9B:11',
        ip_address: '192.168.1.120',
        bios: 'Lenovo UEFI N3MET38W',
        tpm: 'Microsoft Pluton / TPM 2.0',
        windows: 'Windows 11 Pro 64-bit',
        office: 'Microsoft 365 Apps',
        antivirus: 'CrowdStrike Falcon EDR',
        notes: 'Reservado para capacitaciones, guardias y eventos especiales.'
      },
      4: {
        processor: 'Intel Core i7-1355U (10 núcleos, hasta 5.0 GHz)',
        generation: '13va Generación',
        ram: '16 GB',
        ram_slots: '2',
        ram_type: 'DDR5-5200MHz',
        primary_disk: 'SSD M.2 NVMe 512GB PCIe Gen 4',
        secondary_disk: '—',
        storage_capacity: '512 GB',
        storage_type: 'SSD PCIe NVMe M.2',
        graphics: 'Intel Iris Xe Graphics',
        display: '14.0" WUXGA (1920x1200) IPS 400 nits',
        resolution: '1920x1200',
        battery: '51 Wh HP Long Life 3 celdas (Salud: 100%)',
        battery_cycles: '3',
        battery_health: '100%',
        mac_address: 'E8:6A:64:12:34:56',
        ip_address: '192.168.1.125',
        bios: 'HP Sure Start Gen 8',
        tpm: 'TPM 2.0 Habilitado',
        windows: 'Windows 11 Pro 64-bit',
        office: 'Microsoft 365 Apps',
        antivirus: 'HP Wolf Pro Security + Defender',
        notes: 'Activo nuevo listo para asignación.'
      },
      5: {
        processor: 'Apple M3 Pro (CPU 12-core, GPU 18-core)',
        generation: 'Apple Silicon M3',
        ram: '18 GB',
        ram_slots: '0 (Unificada)',
        ram_type: 'Memoria Unificada',
        primary_disk: 'SSD 512GB integrado',
        secondary_disk: '—',
        storage_capacity: '512 GB',
        storage_type: 'SSD Integrado PCIe Gen 4',
        graphics: 'GPU integrada Apple M3 Pro 18-core',
        display: '14.2" Liquid Retina XDR (3024x1964) ProMotion 120Hz',
        resolution: '3024x1964',
        battery: '70 Wh Li-Po (Salud: 99%)',
        battery_cycles: '18',
        battery_health: '99%',
        mac_address: 'A4:83:E7:45:90:AB',
        ip_address: '192.168.1.130',
        bios: 'Apple Secure Enclave Bootloader',
        tpm: 'Apple T2 / Enclave de Seguridad',
        windows: 'macOS Sonoma 14.5',
        office: 'Microsoft 365 for Mac',
        antivirus: 'XProtect + Jamf Protect EDR',
        notes: 'Asignado a gerencia legal.'
      }
    },

    employees: [
      {
        id: 1,
        nombre: 'Joel Domínguez',
        cedula: '001-0982341-2',
        departamento: 'TI & Infraestructura',
        correo: 'jdominguez@empresa.com',
        telefono: '+1 809 555 0101',
        created_at: offsetDays(-90)
      },
      {
        id: 2,
        nombre: 'Carlos Ramírez',
        cedula: '001-8765432-1',
        departamento: 'Operaciones',
        correo: 'cramirez@empresa.com',
        telefono: '+1 809 555 0145',
        created_at: offsetDays(-70)
      },
      {
        id: 3,
        nombre: 'Laura Fernández',
        cedula: '001-5678901-4',
        departamento: 'Legal',
        correo: 'lfernandez@empresa.com',
        telefono: '+1 809 555 0188',
        created_at: offsetDays(-65)
      },
      {
        id: 4,
        nombre: 'María González',
        cedula: '001-1456789-3',
        departamento: 'Finanzas',
        correo: 'mgonzalez@empresa.com',
        telefono: '+1 809 555 0122',
        created_at: offsetDays(-50)
      },
      {
        id: 5,
        nombre: 'Roberto Morales',
        cedula: '001-2345678-5',
        departamento: 'Recursos Humanos',
        correo: 'rmorales@empresa.com',
        telefono: '+1 809 555 0177',
        created_at: offsetDays(-45)
      },
      {
        id: 6,
        nombre: 'Ana Beltrán',
        cedula: '001-3456789-6',
        departamento: 'Marketing & Ventas',
        correo: 'abeltran@empresa.com',
        telefono: '+1 809 555 0166',
        created_at: offsetDays(-35)
      }
    ],

    accessories: [
      { id: 1, nombre: 'Cargador Dell USB-C 65W Original', tipo: 'Cargador', cantidad_total: 12, estado: 'Disponible' },
      { id: 2, nombre: 'Cargador Lenovo USB-C 65W', tipo: 'Cargador', cantidad_total: 8, estado: 'Disponible' },
      { id: 3, nombre: 'Cargador Apple MagSafe 3 70W', tipo: 'Cargador', cantidad_total: 4, estado: 'Disponible' },
      { id: 4, nombre: 'Mouse Inalámbrico Logitech M185', tipo: 'Mouse', cantidad_total: 25, estado: 'Disponible' },
      { id: 5, nombre: 'Mouse Óptico USB Dell MS116', tipo: 'Mouse', cantidad_total: 15, estado: 'Disponible' },
      { id: 6, nombre: 'Adaptador Multipuerto USB-C a HDMI/USB 3.0', tipo: 'Adaptador', cantidad_total: 10, estado: 'Disponible' },
      { id: 7, nombre: 'Auriculares con Micrófono Jabra Evolve 20', tipo: 'Auriculares', cantidad_total: 6, estado: 'Disponible' },
      { id: 8, nombre: 'Mochila Corporativa Porta Laptop 15.6"', tipo: 'Maletín', cantidad_total: 18, estado: 'Disponible' },
      { id: 9, nombre: 'Monitor Dell 24" P2422H FHD IPS', tipo: 'Monitor', cantidad_total: 5, estado: 'Disponible' }
    ],

    loans: [
      {
        id: 1,
        employee_id: 2, // Carlos Ramírez
        laptop_id: 1,   // DEL-5440-01
        fecha_entrega: offsetDays(-20),
        fecha_devolucion: null, // Asignación indefinida
        estado: 'Activo',
        accessories: [
          { accessory_id: 1, nombre: 'Cargador Dell USB-C 65W Original', tipo: 'Cargador', estado: 'Prestado' },
          { accessory_id: 4, nombre: 'Mouse Inalámbrico Logitech M185', tipo: 'Mouse', estado: 'Prestado' }
        ],
        signatures: [
          { id: 101, signature_type: 'entrega_tecnico', signer: 'TI (Entrega)', date: offsetDays(-20) },
          { id: 102, signature_type: 'recibido_colaborador', signer: 'Carlos Ramírez', date: offsetDays(-20) }
        ],
        return_notes: null,
        returned_at: null,
        created_at: offsetDays(-20)
      },
      {
        id: 2,
        employee_id: 3, // Laura Fernández
        laptop_id: 5,   // APL-MBP-01
        fecha_entrega: offsetDays(-25),
        fecha_devolucion: offsetDays(-4), // ¡Vencido!
        estado: 'Activo',
        accessories: [
          { accessory_id: 3, nombre: 'Cargador Apple MagSafe 3 70W', tipo: 'Cargador', estado: 'Prestado' },
          { accessory_id: 6, nombre: 'Adaptador Multipuerto USB-C', tipo: 'Adaptador', estado: 'Prestado' }
        ],
        signatures: [
          { id: 103, signature_type: 'entrega_tecnico', signer: 'TI (Entrega)', date: offsetDays(-25) },
          { id: 104, signature_type: 'recibido_colaborador', signer: 'Laura Fernández', date: offsetDays(-25) }
        ],
        return_notes: null,
        returned_at: null,
        created_at: offsetDays(-25)
      },
      {
        id: 3,
        employee_id: 5, // Roberto Morales
        laptop_id: 2,   // DEL-7420-02
        fecha_entrega: offsetDays(-45),
        fecha_devolucion: offsetDays(-15),
        estado: 'Devuelto',
        accessories: [
          { accessory_id: 1, nombre: 'Cargador Dell USB-C 65W Original', tipo: 'Cargador', estado: 'Devuelto' }
        ],
        signatures: [
          { id: 105, signature_type: 'entrega_tecnico', signer: 'TI (Entrega)', date: offsetDays(-45) },
          { id: 106, signature_type: 'devolucion_tecnico', signer: 'TI (Recepción)', date: offsetDays(-15) }
        ],
        return_notes: 'Equipo devuelto en excelente estado de funcionamiento e higiene.',
        returned_at: offsetDays(-15),
        created_at: offsetDays(-45)
      },
      {
        id: 4,
        employee_id: 4, // María González
        laptop_id: 3,   // LEN-T14-01
        fecha_entrega: offsetDays(2), // Programado para dentro de 2 días
        fecha_devolucion: offsetDays(16),
        estado: 'Programado',
        accessories: [
          { accessory_id: 2, nombre: 'Cargador Lenovo USB-C 65W', tipo: 'Cargador', estado: 'Reservado' }
        ],
        signatures: [],
        return_notes: null,
        returned_at: null,
        created_at: offsetDays(-2)
      }
    ],

    technicians: [
      { id: 1, name: 'Alex Técnico', email: 'atecnico@empresa.com', phone: '+1 809 555 0201', active: true },
      { id: 2, name: 'Sara Soporte', email: 'ssoporte@empresa.com', phone: '+1 809 555 0202', active: true }
    ],

    maintenance: [
      {
        id: 1,
        laptop_id: 6, // DEL-5440-02
        technician_id: 1,
        status: 'En proceso',
        received_at: offsetDays(-3),
        estimated_delivery: offsetDays(3),
        hours_spent: 3,
        repair_cost: 120.0,
        initial_diagnosis: 'Revisión y reemplazo del cable eDP de la pantalla para eliminar parpadeo.',
        resolution_notes: 'Repuesto en camino desde el proveedor oficial.'
      },
      {
        id: 2,
        laptop_id: 8, // ASUS-ZB-01
        technician_id: null,
        status: 'Pendiente',
        received_at: offsetDays(-1),
        estimated_delivery: offsetDays(5),
        hours_spent: 1,
        repair_cost: 250.0,
        initial_diagnosis: 'Limpieza ultrasónica de motherboard y cotización de top-case con teclado.',
        resolution_notes: ''
      },
      {
        id: 3,
        laptop_id: 2, // DEL-7420-02
        technician_id: 2,
        status: 'Finalizado',
        received_at: offsetDays(-35),
        estimated_delivery: offsetDays(-33),
        hours_spent: 2,
        repair_cost: 45.0,
        initial_diagnosis: 'Mantenimiento preventivo, limpieza interna y renovación de pasta térmica.',
        resolution_notes: 'Equipo verificado con temperaturas estables en test de estrés. Operativo.'
      }
    ],

    incidents: [
      {
        id: 1,
        laptop_id: 6,
        employee_id: 5,
        category: 'Pantalla y Video',
        priority: 'Alta',
        status: 'En proceso',
        technician_id: 1,
        notes: 'Parpadeo intermitente al inclinar la tapa de la laptop.',
        created_at: offsetDays(-3)
      },
      {
        id: 2,
        laptop_id: 8,
        employee_id: 1,
        category: 'Derrame de Líquidos',
        priority: 'Crítica',
        status: 'Abierta',
        technician_id: null,
        notes: 'Derrame accidental de café sobre el teclado. Se apagó el equipo inmediatamente.',
        created_at: offsetDays(-1)
      },
      {
        id: 3,
        laptop_id: 3,
        employee_id: 2,
        category: 'Firmware y BIOS',
        priority: 'Baja',
        status: 'Cerrada',
        technician_id: 1,
        notes: 'Actualización obligatoria de seguridad del BIOS Lenovo v1.38 completada con éxito.',
        created_at: offsetDays(-12)
      }
    ],

    users: [
      { id: 1, username: 'admin', role: 'admin', employee_id: 1 },
      { id: 2, username: 'visitante', role: 'visitor', employee_id: 4 },
      { id: 3, username: 'soporte', role: 'admin', employee_id: 2 }
    ],

    audit_logs: [
      {
        id: 1,
        fecha_hora: `${offsetDays(-20)} 09:30:14`,
        usuario: 'admin',
        modulo: 'préstamos',
        accion: 'CREAR_PRESTAMO',
        tabla_afectada: 'loans',
        registro_id: 1,
        valores_anteriores: null,
        valores_nuevos: '{"laptop_id":1,"employee_id":2,"fecha_entrega":"' + offsetDays(-20) + '"}',
        direccion_ip: '192.168.1.100'
      },
      {
        id: 2,
        fecha_hora: `${offsetDays(-15)} 16:45:02`,
        usuario: 'admin',
        modulo: 'préstamos',
        accion: 'DEVOLVER_PRESTAMO',
        tabla_afectada: 'loans',
        registro_id: 3,
        valores_anteriores: '{"estado":"Activo"}',
        valores_nuevos: '{"estado":"Devuelto"}',
        direccion_ip: '192.168.1.100'
      },
      {
        id: 3,
        fecha_hora: `${offsetDays(-3)} 11:15:20`,
        usuario: 'admin',
        modulo: 'mantenimiento',
        accion: 'CREAR_MANTENIMIENTO',
        tabla_afectada: 'maintenance',
        registro_id: 1,
        valores_anteriores: null,
        valores_nuevos: '{"laptop_id":6,"technician_id":1,"costo":120.0}',
        direccion_ip: '192.168.1.100'
      }
    ],

    inspections: []
  };

  // Helper para interactuar con LocalStorage
  const getRaw = key => {
    try {
      const data = localStorage.getItem(STORAGE_PREFIX + key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  };

  const setRaw = (key, value) => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error('Error guardando en LocalStorage:', e);
    }
  };

  // Inicialización del almacén
  function initStore() {
    const initialized = localStorage.getItem(STORAGE_PREFIX + 'seed_version');
    if (initialized !== SEED_VERSION) {
      resetDemoData(false);
    }
  }

  function resetDemoData(showNotice = true) {
    Object.entries(INITIAL_SEED).forEach(([key, val]) => {
      setRaw(key, val);
    });
    localStorage.setItem(STORAGE_PREFIX + 'seed_version', SEED_VERSION);

    // Asegurar usuario por defecto
    if (!getCurrentUser()) {
      setCurrentUser({ id: 1, username: 'admin', role: 'admin', employee_id: 1 });
    }

    if (showNotice && window.toast) {
      window.toast('Datos demo restablecidos a su estado inicial de fábrica.');
    }
  }

  // Auditoría automática
  function logAudit(accion, modulo, tabla_afectada, registro_id, valores_anteriores = null, valores_nuevos = null) {
    const logs = getRaw('audit_logs') || [];
    const user = getCurrentUser()?.username || 'admin';
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const fechaHora = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const newLog = {
      id: (logs[0]?.id || 0) + 1,
      fecha_hora: fechaHora,
      usuario: user,
      modulo,
      accion,
      tabla_afectada,
      registro_id,
      valores_anteriores: typeof valores_anteriores === 'object' && valores_anteriores !== null ? JSON.stringify(valores_anteriores) : valores_anteriores,
      valores_nuevos: typeof valores_nuevos === 'object' && valores_nuevos !== null ? JSON.stringify(valores_nuevos) : valores_nuevos,
      direccion_ip: '127.0.0.1 (Navegador Demo)'
    };

    logs.unshift(newLog);
    setRaw('audit_logs', logs.slice(0, 100)); // Mantener últimos 100 registros
  }

  // Sesión y Usuario
  function getCurrentUser() {
    return getRaw('current_user') || { id: 1, username: 'admin', role: 'admin', employee_id: 1 };
  }

  function setCurrentUser(user) {
    setRaw('current_user', user);
  }

  function switchRole(role) {
    const user = getCurrentUser();
    user.role = role;
    if (role === 'visitor') {
      user.username = 'visitante';
      user.employee_id = 4;
    } else {
      user.username = 'admin';
      user.employee_id = 1;
    }
    setCurrentUser(user);
    logAudit('CAMBIAR_ROL', 'autenticación', 'users', user.id, null, { role, username: user.username });
  }

  // --- CRUD LAPTOPS ---
  function getLaptops() {
    return getRaw('laptops') || [];
  }

  function getLaptop(id) {
    const list = getLaptops();
    return list.find(item => Number(item.id) === Number(id)) || null;
  }

  function saveLaptop(laptopData) {
    const list = getLaptops();
    let record;
    if (laptopData.id) {
      const index = list.findIndex(item => Number(item.id) === Number(laptopData.id));
      if (index >= 0) {
        const oldVal = { ...list[index] };
        record = { ...list[index], ...laptopData };
        list[index] = record;
        logAudit('MODIFICAR_EQUIPO', 'laptops', 'laptops', record.id, oldVal, record);
      }
    } else {
      // Verificar si Service Tag ya existe
      const exists = list.some(item => item.service_tag.trim().toLowerCase() === laptopData.service_tag.trim().toLowerCase());
      if (exists) {
        throw new Error('Ya existe un equipo registrado con ese Service Tag.');
      }
      const newId = Math.max(0, ...list.map(l => l.id)) + 1;
      record = {
        ...laptopData,
        id: newId,
        created_at: today
      };
      list.unshift(record);
      logAudit('CREAR_EQUIPO', 'laptops', 'laptops', record.id, null, record);
    }
    setRaw('laptops', list);
    return record;
  }

  function deleteLaptop(id) {
    const list = getLaptops();
    const item = list.find(l => Number(l.id) === Number(id));
    if (!item) return false;

    // Verificar si tiene préstamos activos
    const loans = getLoans();
    const hasActiveLoan = loans.some(loan => Number(loan.laptop_id) === Number(id) && loan.estado === 'Activo');
    if (hasActiveLoan) {
      throw new Error('No se puede eliminar un equipo que tiene un préstamo activo en curso.');
    }

    const filtered = list.filter(l => Number(l.id) !== Number(id));
    setRaw('laptops', filtered);
    logAudit('ELIMINAR_EQUIPO', 'laptops', 'laptops', id, item, null);
    return true;
  }

  // --- COMPONENTES DE HARDWARE ---
  function getComponents(laptopId) {
    const comps = getRaw('components') || {};
    return comps[laptopId] || null;
  }

  function saveComponents(laptopId, componentData) {
    const comps = getRaw('components') || {};
    const oldVal = comps[laptopId] || {};
    comps[laptopId] = { ...oldVal, ...componentData };
    setRaw('components', comps);
    logAudit('ACTUALIZAR_COMPONENTES', 'laptops', 'laptop_components', laptopId, oldVal, comps[laptopId]);
    return comps[laptopId];
  }

  // --- PERSONAS / EMPLEADOS ---
  function getEmployees() {
    return getRaw('employees') || [];
  }

  function getEmployee(id) {
    const list = getEmployees();
    return list.find(item => Number(item.id) === Number(id)) || null;
  }

  function saveEmployee(employeeData) {
    const list = getEmployees();
    let record;
    if (employeeData.id) {
      const idx = list.findIndex(e => Number(e.id) === Number(employeeData.id));
      if (idx >= 0) {
        const oldVal = { ...list[idx] };
        record = { ...list[idx], ...employeeData };
        list[idx] = record;
        logAudit('MODIFICAR_PERSONA', 'personas', 'employees', record.id, oldVal, record);
      }
    } else {
      const newId = Math.max(0, ...list.map(e => e.id)) + 1;
      record = { ...employeeData, id: newId, created_at: today };
      list.unshift(record);
      logAudit('CREAR_PERSONA', 'personas', 'employees', record.id, null, record);
    }
    setRaw('employees', list);
    return record;
  }

  function deleteEmployee(id) {
    const list = getEmployees();
    const item = list.find(e => Number(e.id) === Number(id));
    if (!item) return false;

    // Validar si tiene préstamos activos
    const loans = getLoans();
    const hasActiveLoan = loans.some(l => Number(l.employee_id) === Number(id) && l.estado === 'Activo');
    if (hasActiveLoan) {
      throw new Error('No se puede eliminar un colaborador con préstamos activos asignados.');
    }

    const filtered = list.filter(e => Number(e.id) !== Number(id));
    setRaw('employees', filtered);
    logAudit('ELIMINAR_PERSONA', 'personas', 'employees', id, item, null);
    return true;
  }

  // --- ACCESORIOS ---
  function getAccessories() {
    return getRaw('accessories') || [];
  }

  function getAccessory(id) {
    const list = getAccessories();
    return list.find(a => Number(a.id) === Number(id)) || null;
  }

  function saveAccessory(data) {
    const list = getAccessories();
    let record;
    if (data.id) {
      const idx = list.findIndex(a => Number(a.id) === Number(data.id));
      if (idx >= 0) {
        const old = { ...list[idx] };
        record = { ...list[idx], ...data };
        list[idx] = record;
        logAudit('MODIFICAR_ACCESORIO', 'accesorios', 'accessories', record.id, old, record);
      }
    } else {
      const newId = Math.max(0, ...list.map(a => a.id)) + 1;
      record = { ...data, id: newId };
      list.unshift(record);
      logAudit('CREAR_ACCESORIO', 'accesorios', 'accessories', record.id, null, record);
    }
    setRaw('accessories', list);
    return record;
  }

  function deleteAccessory(id) {
    const list = getAccessories();
    const item = list.find(a => Number(a.id) === Number(id));
    if (!item) return false;
    const filtered = list.filter(a => Number(a.id) !== Number(id));
    setRaw('accessories', filtered);
    logAudit('ELIMINAR_ACCESORIO', 'accesorios', 'accessories', id, item, null);
    return true;
  }

  // --- PRÉSTAMOS ---
  function getLoans() {
    return getRaw('loans') || [];
  }

  function getLoan(id) {
    const loans = getLoans();
    const loan = loans.find(l => Number(l.id) === Number(id));
    if (!loan) return null;
    return populateLoan(loan);
  }

  function populateLoan(loan) {
    const laptop = getLaptop(loan.laptop_id) || { service_tag: 'DESCONOCIDO', marca: '—', modelo: '—' };
    const employee = getEmployee(loan.employee_id) || { nombre: 'Desconocido', cedula: '—', departamento: '—' };
    return {
      ...loan,
      laptop,
      employee
    };
  }

  function createLoan(data) {
    const loans = getLoans();
    const laptop = getLaptop(data.laptop_id);
    if (!laptop) throw new Error('Equipo no encontrado');

    const isScheduled = data.fecha_entrega > today;
    const initialStatus = isScheduled ? 'Programado' : 'Activo';

    const newId = Math.max(0, ...loans.map(l => l.id)) + 1;

    const signatures = [];
    if (data.signature_ti) {
      signatures.push({
        id: Date.now() + 1,
        signature_type: 'entrega_tecnico',
        signer: 'TI (Entrega)',
        image_data: data.signature_ti,
        date: data.fecha_entrega
      });
    }
    if (data.signature_employee) {
      signatures.push({
        id: Date.now() + 2,
        signature_type: 'recibido_colaborador',
        signer: 'Colaborador (Receptor)',
        image_data: data.signature_employee,
        date: data.fecha_entrega
      });
    }

    const newLoan = {
      id: newId,
      employee_id: Number(data.employee_id),
      laptop_id: Number(data.laptop_id),
      fecha_entrega: data.fecha_entrega,
      fecha_devolucion: data.fecha_devolucion || null,
      estado: initialStatus,
      accessories: data.accessories || [],
      signatures,
      return_notes: null,
      returned_at: null,
      created_at: today
    };

    loans.unshift(newLoan);
    setRaw('loans', loans);

    // Actualizar estado del equipo
    const newLaptopState = isScheduled ? 'Próximo a entrega' : 'Prestado';
    saveLaptop({ id: laptop.id, estado: newLaptopState });

    logAudit('CREAR_PRESTAMO', 'préstamos', 'loans', newId, null, newLoan);
    return populateLoan(newLoan);
  }

  function returnLoan(id, returnData = {}) {
    const loans = getLoans();
    const index = loans.findIndex(l => Number(l.id) === Number(id));
    if (index < 0) throw new Error('Préstamo no encontrado');

    const loan = loans[index];
    const oldVal = { ...loan };

    loan.estado = 'Devuelto';
    loan.returned_at = returnData.returned_at || today;
    loan.return_notes = returnData.notes || 'Devolución registrada en el sistema.';

    if (returnData.signature) {
      loan.signatures.push({
        id: Date.now(),
        signature_type: 'devolucion_tecnico',
        signer: 'TI (Recepción)',
        image_data: returnData.signature,
        date: loan.returned_at
      });
    }

    // Actualizar accesorios prestados
    if (loan.accessories && Array.isArray(loan.accessories)) {
      loan.accessories.forEach(a => { a.estado = 'Devuelto'; });
    }

    loans[index] = loan;
    setRaw('loans', loans);

    // Liberar equipo en inventario
    const newEquipmentState = returnData.laptop_state || 'Disponible';
    saveLaptop({ id: loan.laptop_id, estado: newEquipmentState });

    logAudit('DEVOLVER_PRESTAMO', 'préstamos', 'loans', id, oldVal, loan);
    return populateLoan(loan);
  }

  function confirmScheduledDelivery(id) {
    const loans = getLoans();
    const idx = loans.findIndex(l => Number(l.id) === Number(id));
    if (idx < 0) return false;
    loans[idx].estado = 'Activo';
    setRaw('loans', loans);
    saveLaptop({ id: loans[idx].laptop_id, estado: 'Prestado' });
    logAudit('CONFIRMAR_ENTREGA', 'préstamos', 'loans', id, { estado: 'Programado' }, { estado: 'Activo' });
    return true;
  }

  function deleteLoan(id) {
    const loans = getLoans();
    const loan = loans.find(l => Number(l.id) === Number(id));
    if (!loan) return false;

    // Si estaba activo o programado, restaurar disponibilidad del equipo
    if (['Activo', 'Programado'].includes(loan.estado)) {
      saveLaptop({ id: loan.laptop_id, estado: 'Disponible' });
    }

    const filtered = loans.filter(l => Number(l.id) !== Number(id));
    setRaw('loans', filtered);
    logAudit('CANCELAR_PRESTAMO', 'préstamos', 'loans', id, loan, null);
    return true;
  }

  // --- MANTENIMIENTO ---
  function getMaintenances() {
    const list = getRaw('maintenance') || [];
    const techs = getTechnicians();
    const laptops = getLaptops();
    return list.map(item => ({
      ...item,
      laptop: laptops.find(l => Number(l.id) === Number(item.laptop_id)) || { service_tag: '—', marca: '—', modelo: '—' },
      technician: techs.find(t => Number(t.id) === Number(item.technician_id)) || null
    }));
  }

  function saveMaintenance(data) {
    const list = getRaw('maintenance') || [];
    let record;
    if (data.id) {
      const idx = list.findIndex(m => Number(m.id) === Number(data.id));
      if (idx >= 0) {
        const old = { ...list[idx] };
        record = { ...list[idx], ...data };
        list[idx] = record;
        logAudit('MODIFICAR_MANTENIMIENTO', 'mantenimiento', 'maintenance', record.id, old, record);
      }
    } else {
      const newId = Math.max(0, ...list.map(m => m.id)) + 1;
      record = { ...data, id: newId };
      list.unshift(record);
      // Poner equipo en estado Mantenimiento si está activo
      if (['Pendiente', 'En proceso'].includes(data.status)) {
        saveLaptop({ id: data.laptop_id, estado: 'Mantenimiento' });
      }
      logAudit('CREAR_MANTENIMIENTO', 'mantenimiento', 'maintenance', record.id, null, record);
    }
    setRaw('maintenance', list);
    return record;
  }

  // --- TÉCNICOS ---
  function getTechnicians() {
    return getRaw('technicians') || [];
  }

  function saveTechnician(data) {
    const list = getTechnicians();
    let record;
    if (data.id) {
      const idx = list.findIndex(t => Number(t.id) === Number(data.id));
      if (idx >= 0) {
        record = { ...list[idx], ...data };
        list[idx] = record;
      }
    } else {
      const newId = Math.max(0, ...list.map(t => t.id)) + 1;
      record = { ...data, id: newId, active: true };
      list.push(record);
    }
    setRaw('technicians', list);
    return record;
  }

  // --- INCIDENCIAS ---
  function getIncidents() {
    const list = getRaw('incidents') || [];
    const laptops = getLaptops();
    const employees = getEmployees();
    const techs = getTechnicians();
    return list.map(item => ({
      ...item,
      laptop: laptops.find(l => Number(l.id) === Number(item.laptop_id)) || { service_tag: '—', marca: '—', modelo: '—' },
      employee: employees.find(e => Number(e.id) === Number(item.employee_id)) || null,
      technician: techs.find(t => Number(t.id) === Number(item.technician_id)) || null
    }));
  }

  function saveIncident(data) {
    const list = getRaw('incidents') || [];
    let record;
    if (data.id) {
      const idx = list.findIndex(i => Number(i.id) === Number(data.id));
      if (idx >= 0) {
        const old = { ...list[idx] };
        record = { ...list[idx], ...data };
        list[idx] = record;
        logAudit('MODIFICAR_INCIDENCIA', 'incidencias', 'incidents', record.id, old, record);
      }
    } else {
      const newId = Math.max(0, ...list.map(i => i.id)) + 1;
      record = { ...data, id: newId, created_at: today };
      list.unshift(record);
      logAudit('CREAR_INCIDENCIA', 'incidencias', 'incidents', record.id, null, record);
    }
    setRaw('incidents', list);
    return record;
  }

  // --- USUARIOS ---
  function getUsers() {
    return getRaw('users') || [];
  }

  function saveUser(data) {
    const list = getUsers();
    let record;
    if (data.id) {
      const idx = list.findIndex(u => Number(u.id) === Number(data.id));
      if (idx >= 0) {
        record = { ...list[idx], ...data };
        list[idx] = record;
      }
    } else {
      const newId = Math.max(0, ...list.map(u => u.id)) + 1;
      record = { ...data, id: newId };
      list.push(record);
    }
    setRaw('users', list);
    logAudit('GUARDAR_USUARIO', 'usuarios', 'users', record.id, null, { username: record.username, role: record.role });
    return record;
  }

  function deleteUser(id) {
    const list = getUsers();
    const filtered = list.filter(u => Number(u.id) !== Number(id));
    setRaw('users', filtered);
    logAudit('ELIMINAR_USUARIO', 'usuarios', 'users', id, null, null);
    return true;
  }

  // --- BITÁCORA DE AUDITORÍA ---
  function getAuditLogs(filters = {}) {
    let logs = getRaw('audit_logs') || [];
    if (filters.fecha) {
      logs = logs.filter(l => l.fecha_hora.startsWith(filters.fecha));
    }
    if (filters.usuario) {
      logs = logs.filter(l => l.usuario === filters.usuario);
    }
    if (filters.modulo) {
      logs = logs.filter(l => l.modulo === filters.modulo);
    }
    if (filters.accion) {
      logs = logs.filter(l => l.accion === filters.accion);
    }
    if (filters.q) {
      const query = filters.q.toLowerCase();
      logs = logs.filter(l =>
        l.usuario.toLowerCase().includes(query) ||
        l.modulo.toLowerCase().includes(query) ||
        l.accion.toLowerCase().includes(query) ||
        String(l.valores_nuevos || '').toLowerCase().includes(query)
      );
    }
    return logs;
  }

  // --- MÉTRICAS Y ESTADÍSTICAS EN TIEMPO REAL ---
  function getStats() {
    const laptops = getLaptops();
    const loans = getLoans();
    const maintenance = getRaw('maintenance') || [];
    const incidents = getRaw('incidents') || [];
    const employees = getEmployees();
    const users = getUsers();
    const technicians = getTechnicians();
    const auditLogs = getRaw('audit_logs') || [];

    const available = laptops.filter(l => l.estado === 'Disponible').length;
    const for_loan = laptops.filter(l => l.estado === 'Para préstamo').length;
    const loaned = laptops.filter(l => l.estado === 'Prestado').length;
    const in_maintenance = laptops.filter(l => l.estado === 'Mantenimiento').length;
    const active_loans = loans.filter(l => l.estado === 'Activo').length;

    // Préstamos vencidos
    const overdue = loans.filter(l => l.estado === 'Activo' && l.fecha_devolucion && l.fecha_devolucion < today).map(populateLoan);

    // Gráfico: Activos por Estado
    const stateCounts = {};
    laptops.forEach(l => {
      stateCounts[l.estado] = (stateCounts[l.estado] || 0) + 1;
    });
    const assets_state = Object.entries(stateCounts).sort((a, b) => b[1] - a[1]);

    // Gráfico: Activos por Marca
    const brandCounts = {};
    laptops.forEach(l => {
      brandCounts[l.marca] = (brandCounts[l.marca] || 0) + 1;
    });
    const assets_brand = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]);

    // Movimientos recientes (últimos 5 préstamos)
    const recent_loans = loans.slice(0, 5).map(populateLoan);

    return {
      available,
      for_loan,
      loaned,
      maintenance: in_maintenance,
      active_loans,
      total_assets: laptops.length,
      overdue,
      charts: {
        assets_state,
        assets_brand
      },
      recent_loans,
      aboutStats: {
        assets: laptops.length,
        users: users.length,
        maintenance: in_maintenance,
        available: available + for_loan,
        assigned: loaned,
        technicians: technicians.length,
        incidents: incidents.length,
        audit_logs: auditLogs.length
      }
    };
  }

  // Inicializar store al cargar el script
  initStore();

  // Exportar al objeto global
  window.store = {
    init: initStore,
    resetDemoData,
    logAudit,
    getCurrentUser,
    setCurrentUser,
    switchRole,
    getLaptops,
    getLaptop,
    saveLaptop,
    deleteLaptop,
    getComponents,
    saveComponents,
    getEmployees,
    getEmployee,
    saveEmployee,
    deleteEmployee,
    getAccessories,
    getAccessory,
    saveAccessory,
    deleteAccessory,
    getLoans,
    getLoan,
    createLoan,
    returnLoan,
    confirmScheduledDelivery,
    deleteLoan,
    getMaintenances,
    saveMaintenance,
    getTechnicians,
    saveTechnician,
    getIncidents,
    saveIncident,
    getUsers,
    saveUser,
    deleteUser,
    getAuditLogs,
    getStats
  };
})();

