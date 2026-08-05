(function () {
  'use strict';
  const today = new Date();
  const iso = offset => { const d = new Date(today); d.setDate(d.getDate() + offset); return d.toISOString().slice(0, 10); };
  window.DEMO_SEED = {
    version: 3,
    users: [
      { id: 1, username: 'Administrador', email: 'admin@demo.com', password: 'admin123', role: 'admin', employee_id: 1 },
      { id: 2, username: 'Usuario', email: 'user@demo.com', password: 'user123', role: 'visitor', employee_id: 2 }
    ],
    employees: [
      { id: 1, nombre: 'Ana Martínez', cedula: '001-1847362-5', departamento: 'Tecnología', correo: 'ana.martinez@empresa.do', telefono: '809-555-0101' },
      { id: 2, nombre: 'Carlos Rodríguez', cedula: '001-0928451-7', departamento: 'Finanzas', correo: 'carlos.rodriguez@empresa.do', telefono: '809-555-0102' },
      { id: 3, nombre: 'María Pérez', cedula: '402-2183746-9', departamento: 'Recursos Humanos', correo: 'maria.perez@empresa.do', telefono: '829-555-0103' },
      { id: 4, nombre: 'José Ramírez', cedula: '031-1458293-4', departamento: 'Operaciones', correo: 'jose.ramirez@empresa.do', telefono: '849-555-0104' },
      { id: 5, nombre: 'Laura Gómez', cedula: '001-2193847-2', departamento: 'Ventas', correo: 'laura.gomez@empresa.do', telefono: '809-555-0105' }
    ],
    laptops: [
      { id: 1, service_tag: 'DL5440-A91K', marca: 'Dell', modelo: 'Latitude 5440', serial: '8GH2KQ3', estado: 'Prestado', observaciones: 'Equipo corporativo', components: { processor:'Intel Core i7-1365U', generation:'13ª', ram:'16 GB', ram_slots:'2', ram_type:'DDR5', primary_disk:'512 GB NVMe', storage_capacity:'512 GB', storage_type:'NVMe', graphics:'Intel Iris Xe', display:'14 pulgadas', resolution:'1920×1080', battery:'54 Wh', battery_cycles:'84', battery_health:'Excelente', mac_address:'A4:BB:6D:21:9F:10', ip_address:'192.168.1.42', bios:'1.14.0', tpm:'2.0', windows:'Windows 11 Pro', office:'Microsoft 365', antivirus:'Microsoft Defender' } },
      { id: 2, service_tag: 'HP840-G8X2', marca: 'HP', modelo: 'EliteBook 840 G8', serial: '5CG1479K2M', estado: 'Disponible', observaciones: 'Listo para asignar', components: { processor:'Intel Core i5-1145G7', generation:'11ª', ram:'16 GB', storage_capacity:'512 GB', storage_type:'NVMe', windows:'Windows 11 Pro' } },
      { id: 3, service_tag: 'LN-T14-7Q2P', marca: 'Lenovo', modelo: 'ThinkPad T14 Gen 3', serial: 'PF3X7J2Q', estado: 'Mantenimiento', observaciones: 'Revisión de batería', components: { processor:'AMD Ryzen 7 PRO 6850U', ram:'16 GB', storage_capacity:'1 TB', storage_type:'NVMe', windows:'Windows 11 Pro' } },
      { id: 4, service_tag: 'DL7420-P4M8', marca: 'Dell', modelo: 'Latitude 7420', serial: 'J8K4MT3', estado: 'Disponible', observaciones: '', components: { processor:'Intel Core i7-1185G7', ram:'16 GB', storage_capacity:'512 GB', storage_type:'NVMe' } },
      { id: 5, service_tag: 'AC-A515-92Z', marca: 'Acer', modelo: 'Aspire 5', serial: 'NXA1ZAA004', estado: 'Dañado', observaciones: 'Pantalla con líneas verticales', components: { processor:'Intel Core i5-1235U', ram:'8 GB', storage_capacity:'512 GB', storage_type:'SSD' } },
      { id: 6, service_tag: 'HP450-G9C7', marca: 'HP', modelo: 'ProBook 450 G9', serial: '5CD2398LQW', estado: 'Prestado', observaciones: '', components: { processor:'Intel Core i5-1235U', ram:'16 GB', storage_capacity:'512 GB', storage_type:'NVMe' } }
    ],
    accessories: [
      { id: 1, nombre: 'Mouse Logitech M185', tipo: 'Mouse' }, { id: 2, nombre: 'Cargador Dell 65W USB-C', tipo: 'Cargador' },
      { id: 3, nombre: 'Docking Station WD19', tipo: 'Dock' }, { id: 4, nombre: 'Mochila Targus 15.6', tipo: 'Mochila' },
      { id: 5, nombre: 'Monitor Dell P2422H', tipo: 'Monitor' }
    ],
    loans: [
      { id: 1, employee_id: 2, laptop_id: 1, fecha_entrega: iso(-18), fecha_devolucion: iso(12), estado: 'Activo', accessory_ids:[2,4], observaciones:'Asignación temporal', signatures:[{type:'Entrega', data:''}] },
      { id: 2, employee_id: 5, laptop_id: 6, fecha_entrega: iso(-35), fecha_devolucion: iso(-5), estado: 'Activo', accessory_ids:[1,3], observaciones:'Equipo de ventas', signatures:[{type:'Entrega', data:''}] },
      { id: 3, employee_id: 3, laptop_id: 4, fecha_entrega: iso(-60), fecha_devolucion: iso(-30), fecha_retorno:iso(-31), estado: 'Devuelto', accessory_ids:[1], observaciones:'Proyecto trimestral', signatures:[{type:'Entrega', data:''},{type:'Devolución',data:''}] }
    ],
    incidents: [
      { id: 1, laptop_id: 3, employee_id: 4, technician_id: 1, priority:'Alta', category:'Batería', status:'En proceso', description:'El equipo se apaga al desconectarlo.', solution:'', created_at:iso(-4) },
      { id: 2, laptop_id: 5, employee_id: 3, technician_id: 2, priority:'Crítica', category:'Pantalla', status:'Abierta', description:'Líneas verticales y parpadeo.', solution:'', created_at:iso(-2) },
      { id: 3, laptop_id: 2, employee_id: 1, technician_id: 1, priority:'Media', category:'Software', status:'Cerrada', description:'Error al iniciar Microsoft Teams.', solution:'Se reparó la instalación.', created_at:iso(-12) }
    ],
    technicians: [
      { id:1, name:'Miguel Santos', specialty:'Hardware y redes', email:'miguel.santos@empresa.do', phone:'809-555-0120', active:true },
      { id:2, name:'Patricia León', specialty:'Soporte de aplicaciones', email:'patricia.leon@empresa.do', phone:'829-555-0121', active:true }
    ],
    maintenance: [
      { id:1, laptop_id:3, incident_id:1, technician_id:1, status:'En reparación', priority:'Alta', received_at:iso(-4), estimated_delivery:iso(3), initial_diagnosis:'Batería agotada', solution:'', parts_used:'Batería compatible solicitada', notes:'', hours_spent:2.5, repair_cost:3200, warranty_days:30 }
    ],
    inspections: [],
    audit: [
      { id:1, date:new Date().toISOString(), user:'Administrador', action:'Inicio de demo', detail:'Datos de demostración cargados' },
      { id:2, date:new Date(Date.now()-86400000).toISOString(), user:'Administrador', action:'Equipo actualizado', detail:'DL5440-A91K' }
    ]
  };
}());
