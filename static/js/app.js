/**
 * IT Asset Manager V3 - Main Application Module (GitHub Demo Edition)
 * Pure Vanilla JavaScript with LocalStorage persistence, in-browser AI engine,
 * digital signature capture, QR generator, and interactive modals.
 */

(() => {
  'use strict';

  const PAGE_SIZE = 8;

  // DOM Helper
  const create = (tag, options = {}) => Object.assign(document.createElement(tag), options);
  const escapeHtml = str => String(str ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);

  /* ==========================================================================
     Toast Notifications
     ========================================================================== */
  function toast(message, type = 'success') {
    let stack = document.querySelector('.toast-stack');
    if (!stack) {
      stack = create('div', { className: 'toast-stack', 'aria-live': 'polite' });
      document.body.append(stack);
    }
    const item = create('div', { className: `toast ${type}` });
    const icon = create('strong', {
      textContent: type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ',
      style: `color: var(--${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'primary'}); margin-right: 6px;`
    });
    item.append(icon, document.createTextNode(message));
    stack.append(item);

    window.setTimeout(() => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(24px)';
      item.style.transition = 'all 0.25s ease';
      window.setTimeout(() => item.remove(), 260);
    }, 3300);
  }

  window.toast = toast;

  /* ==========================================================================
     Loaders & Button Feedback
     ========================================================================== */
  function setButtonLoading(button, loading, label = 'Guardando…') {
    if (!button) return;
    if (loading) {
      button.dataset.originalLabel ??= button.textContent.trim();
      button.disabled = true;
      button.classList.add('is-loading');
      button.setAttribute('aria-busy', 'true');
      button.replaceChildren(
        create('span', { className: 'button-spinner', 'aria-hidden': 'true' }),
        document.createTextNode(` ${label}`)
      );
      return;
    }
    button.disabled = false;
    button.classList.remove('is-loading');
    button.removeAttribute('aria-busy');
    if (button.dataset.originalLabel) button.textContent = button.dataset.originalLabel;
  }

  window.setButtonLoading = setButtonLoading;

  function showPageLoader(label = 'Cargando…') {
    let loader = document.getElementById('page-loader');
    if (!loader) {
      loader = create('div', { id: 'page-loader', className: 'page-loader', role: 'status' });
      loader.append(
        create('span', { className: 'page-loader-spinner', 'aria-hidden': 'true' }),
        create('span', { className: 'page-loader-label' })
      );
      document.body.append(loader);
    }
    loader.querySelector('.page-loader-label').textContent = label;
    loader.classList.add('active');
    window.setTimeout(() => loader.classList.remove('active'), 500);
  }

  window.showPageLoader = showPageLoader;

  /* ==========================================================================
     Modals Management
     ========================================================================== */
  function syncModalState() {
    const hasActiveModal = Boolean(document.querySelector('.modal.active'));
    document.body.classList.toggle('modal-open', hasActiveModal);
  }

  function abrirModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    if (modal.parentElement !== document.body) document.body.append(modal);

    // Poblar dinámicamente selects según el modal
    if (id === 'modalIncident') {
      const lapSel = document.getElementById('incident-laptop-select');
      const empSel = document.getElementById('incident-employee-select');
      if (lapSel && window.store) {
        lapSel.innerHTML = '<option value="">Selecciona el equipo</option>' +
          store.getLaptops().map(l => `<option value="${l.id}">${escapeHtml(l.service_tag)} · ${escapeHtml(l.marca)} ${escapeHtml(l.modelo)}</option>`).join('');
      }
      if (empSel && window.store) {
        empSel.innerHTML = '<option value="">Sin colaborador asignado</option>' +
          store.getEmployees().map(e => `<option value="${e.id}">${escapeHtml(e.nombre)} (${escapeHtml(e.departamento || 'General')})</option>`).join('');
      }
    } else if (id === 'modalMaintenance') {
      const lapSel = document.getElementById('maintenance-laptop-select');
      const techSel = document.getElementById('maintenance-tech-select');
      const recAt = document.getElementById('maintenance-received-at');
      if (lapSel && window.store) {
        lapSel.innerHTML = '<option value="">Selecciona el equipo</option>' +
          store.getLaptops().map(l => `<option value="${l.id}">${escapeHtml(l.service_tag)} · ${escapeHtml(l.marca)} ${escapeHtml(l.modelo)}</option>`).join('');
      }
      if (techSel && window.store) {
        techSel.innerHTML = '<option value="">Sin técnico asignado</option>' +
          store.getTechnicians().map(t => `<option value="${t.id}">${escapeHtml(t.name)}</option>`).join('');
      }
      if (recAt) recAt.value = new Date().toISOString().split('T')[0];
    } else if (id === 'modalTechniciansList') {
      const tbody = document.getElementById('technicians-table-body');
      if (tbody && window.store) {
        tbody.innerHTML = store.getTechnicians().map(t => `
          <tr>
            <td><strong>${escapeHtml(t.name)}</strong></td>
            <td>${escapeHtml(t.email)} · ${escapeHtml(t.phone)}</td>
            <td><span class="badge ${t.active ? 'green' : 'red'}">${t.active ? 'Activo' : 'Inactivo'}</span></td>
          </tr>
        `).join('');
      }
    } else if (id === 'modalUser') {
      const empSel = document.getElementById('user-employee-select');
      if (empSel && window.store) {
        empSel.innerHTML = '<option value="">Sin colaborador vinculado</option>' +
          store.getEmployees().map(e => `<option value="${e.id}">${escapeHtml(e.nombre)} (${escapeHtml(e.cedula)})</option>`).join('');
      }
    }

    modal.classList.add('active');
    syncModalState();

    // Redimensionar canvas de firma dentro del modal si existen
    modal.querySelectorAll('.signature-canvas').forEach(canvas => {
      canvas.dispatchEvent(new Event('signature:visible'));
    });

    // Auto-focus en el primer input
    const firstInput = modal.querySelector('input:not([type=hidden]), select, textarea');
    if (firstInput) window.setTimeout(() => firstInput.focus(), 80);
  }

  function cerrarModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('active');
      syncModalState();
    }
  }

  window.abrirModal = abrirModal;
  window.cerrarModal = cerrarModal;

  /* ==========================================================================
     Custom Dialogs & Confirmations
     ========================================================================== */
  function showConfirm(title, message, onAccept) {
    const overlay = create('div', { className: 'confirm-dialog' });
    const card = create('div', { className: 'confirm-card' });
    const actions = create('div', { className: 'confirm-actions' });
    const cancel = create('button', { className: 'btn secondary', type: 'button', textContent: 'Cancelar' });
    const accept = create('button', { className: 'btn primary', type: 'button', textContent: 'Confirmar' });

    card.append(create('h3', { textContent: title }), create('p', { textContent: message }));
    actions.append(cancel, accept);
    card.append(actions);
    overlay.append(card);
    document.body.append(overlay);

    const remove = () => overlay.remove();
    cancel.onclick = remove;
    accept.onclick = () => { remove(); onAccept(); };
    overlay.addEventListener('click', event => { if (event.target === overlay) remove(); });
  }

  window.showConfirm = showConfirm;

  /* ==========================================================================
     Digital Signature Canvas
     ========================================================================== */
  function setupSignature(canvas) {
    const card = canvas.closest('.signature-card, .signature-box') || canvas.parentElement;
    const hidden = card.querySelector('input[type=hidden]');
    const context = canvas.getContext('2d');
    let drawing = false;
    let lastPoint;
    let ready = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width) return false;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      context.scale(dpr, dpr);
      context.lineWidth = 2.5;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = '#1e1b4b';
      ready = true;
      return true;
    };

    const point = event => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    canvas.addEventListener('signature:visible', () => { if (!ready) resize(); });
    window.addEventListener('resize', () => { if (ready) resize(); });

    canvas.onpointerdown = event => {
      if (!ready && !resize()) return;
      drawing = true;
      lastPoint = point(event);
      canvas.setPointerCapture(event.pointerId);
    };

    canvas.onpointermove = event => {
      if (!drawing) return;
      const nextPoint = point(event);
      context.beginPath();
      context.moveTo(lastPoint.x, lastPoint.y);
      context.lineTo(nextPoint.x, nextPoint.y);
      context.stroke();
      lastPoint = nextPoint;
    };

    canvas.onpointerup = () => {
      drawing = false;
      if (hidden) hidden.value = canvas.toDataURL('image/png');
    };

    card.querySelector('.clear-signature')?.addEventListener('click', () => {
      if (!ready) resize();
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (hidden) hidden.value = '';
    });
  }

  window.setupSignature = setupSignature;

  /* ==========================================================================
     Table Search, Filter & Pagination
     ========================================================================== */
  function setupTable(table) {
    const body = table.tBodies[0];
    if (!body) return;
    const rows = [...body.rows].filter(row => !row.querySelector('.empty'));
    let currentPage = 1;
    const pager = document.querySelector(`[data-pagination="${table.id}"]`);

    const render = () => {
      const visible = rows.filter(row => row.dataset.match !== 'false' && row.dataset.filter !== 'false');
      const pages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
      currentPage = Math.min(currentPage, pages);

      rows.forEach(row => { row.style.display = 'none'; });
      visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).forEach(row => {
        row.style.display = '';
      });

      let filterEmptyRow = body.querySelector('.filter-empty-row');
      if (visible.length === 0 && rows.length > 0) {
        if (!filterEmptyRow) {
          filterEmptyRow = create('tr', { className: 'filter-empty-row' });
          const colSpan = table.querySelectorAll('thead th').length || 6;
          const td = create('td', {
            className: 'empty',
            textContent: 'No se encontraron registros que coincidan con los filtros aplicados.'
          });
          td.colSpan = colSpan;
          filterEmptyRow.append(td);
          body.append(filterEmptyRow);
        }
        filterEmptyRow.style.display = '';
      } else if (filterEmptyRow) {
        filterEmptyRow.style.display = 'none';
      }

      if (!pager) return;
      pager.replaceChildren();
      if (pages <= 1) return;

      for (let page = 1; page <= pages; page += 1) {
        const button = create('button', {
          textContent: page,
          className: page === currentPage ? 'active' : '',
          type: 'button',
          'aria-label': `Página ${page}`
        });
        button.onclick = () => { currentPage = page; render(); };
        pager.append(button);
      }
    };

    document.querySelectorAll(`[data-table-search="${table.id}"]`).forEach(input => {
      input.addEventListener('input', () => {
        const query = input.value.toLowerCase().trim();
        rows.forEach(row => {
          row.dataset.match = String(!query || String(row.innerText).toLowerCase().includes(query));
        });
        currentPage = 1;
        render();
      });
    });

    const filterInputs = document.querySelectorAll(`[data-table-filter="${table.id}"]`);
    const applyFilters = () => {
      const activeFilters = [...filterInputs].map(sel => ({
        column: Number(sel.dataset.column),
        query: sel.value.replace(/\s+/g, ' ').trim().toLowerCase()
      })).filter(f => Boolean(f.query));

      rows.forEach(row => {
        const matchesAll = activeFilters.every(({ column, query }) => {
          const cellText = (row.cells[column]?.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
          return cellText === query;
        });
        row.dataset.filter = String(matchesAll);
      });
      currentPage = 1;
      render();
    };

    filterInputs.forEach(input => {
      input.addEventListener('change', applyFilters);
    });

    applyFilters();
  }

  window.setupTable = setupTable;

  /* ==========================================================================
     QR Popup Modal con Generador Local
     ========================================================================== */
  function mostrarQR(id, tag, info, serial) {
    const modal = document.getElementById('modalQR');
    if (!modal) return;
    document.getElementById('qr-title').textContent = info;
    document.getElementById('qr-service-tag').textContent = 'Service Tag: ' + tag;
    document.getElementById('qr-serial').textContent = serial ? 'Serial: ' + serial : '';

    const imgContainer = document.getElementById('qr-popup-image-box');
    imgContainer.replaceChildren();

    // Generar URL del detalle
    const fullUrl = new URL(location.href.split('#')[0] + `#/laptops/${id}`, location.origin).href;

    if (window.QRCode) {
      new window.QRCode(imgContainer, {
        text: fullUrl,
        width: 220,
        height: 220,
        colorDark: '#0f172a',
        colorLight: '#ffffff',
        correctLevel: window.QRCode.CorrectLevel.H
      });
    }

    const printBtn = document.getElementById('qr-print-btn');
    if (printBtn) {
      printBtn.onclick = () => {
        const popup = window.open('', '_blank', 'width=500,height=650');
        if (!popup) { toast('El navegador bloqueó la ventana de impresión.', 'error'); return; }
        const qrCanvas = imgContainer.querySelector('canvas');
        const imgData = qrCanvas ? qrCanvas.toDataURL('image/png') : '';
        popup.document.write(`
          <!doctype html><html><head><title>QR ${escapeHtml(tag)} - ${escapeHtml(info)}</title>
          <style>body{font-family:system-ui,sans-serif;text-align:center;padding:30px}img{width:260px;height:260px;margin-top:20px}code{font-family:monospace;background:#f1f5f9;padding:2px 6px;border-radius:4px}</style></head>
          <body><h2>${escapeHtml(info)}</h2><p>Service Tag: <b>${escapeHtml(tag)}</b> · Serial: <code>${escapeHtml(serial)}</code></p><img src="${imgData}" onload="window.print()"></body></html>
        `);
        popup.document.close();
      };
    }

    abrirModal('modalQR');
  }

  window.mostrarQR = mostrarQR;

  /* ==========================================================================
     Acta Oficial de Entrega / Devolución en PDF (Modal Imprimible)
     ========================================================================== */
  function abrirActaPDF(loanId) {
    const loan = store.getLoan(loanId);
    if (!loan) {
      toast('Préstamo no encontrado.', 'error');
      return;
    }

    const modal = document.getElementById('modalActaPDF');
    const content = document.getElementById('acta-document-content');
    if (!modal || !content) return;

    const comp = store.getComponents(loan.laptop?.id) || {};
    const tiSig = loan.signatures.find(s => s.signature_type.includes('tecnico'));
    const empSig = loan.signatures.find(s => s.signature_type.includes('colaborador'));

    content.innerHTML = `
      <div class="acta-print-sheet">
        <div class="acta-header">
          <div class="acta-brand">
            <span class="acta-logo">◆</span>
            <div>
              <h3>IT ASSET MANAGEMENT</h3>
              <p>ACTA DE ENTREGA / RESPONSIVA DE EQUIPO TECNOLÓGICO</p>
            </div>
          </div>
          <div class="acta-folio">
            <strong>ACTA Nº: IT-${String(loan.id).padStart(5, '0')}</strong>
            <small>Fecha: ${loan.fecha_entrega}</small>
          </div>
        </div>

        <hr style="border:0;border-top:2px solid var(--border);margin:16px 0">

        <section class="acta-section">
          <h4>1. DATOS DEL COLABORADOR ASIGNADO</h4>
          <table class="acta-table">
            <tr>
              <td><strong>Nombre Completo:</strong></td>
              <td>${escapeHtml(loan.employee?.nombre || '—')}</td>
              <td><strong>Cédula / ID:</strong></td>
              <td>${escapeHtml(loan.employee?.cedula || '—')}</td>
            </tr>
            <tr>
              <td><strong>Departamento:</strong></td>
              <td>${escapeHtml(loan.employee?.departamento || 'General')}</td>
              <td><strong>Correo:</strong></td>
              <td>${escapeHtml(loan.employee?.correo || '—')}</td>
            </tr>
          </table>
        </section>

        <section class="acta-section" style="margin-top:16px">
          <h4>2. ESPECIFICACIONES DEL EQUIPO ASIGNADO</h4>
          <table class="acta-table">
            <tr>
              <td><strong>Service Tag / Activo:</strong></td>
              <td><b>${escapeHtml(loan.laptop?.service_tag)}</b></td>
              <td><strong>Número de Serie:</strong></td>
              <td><code>${escapeHtml(loan.laptop?.serial)}</code></td>
            </tr>
            <tr>
              <td><strong>Marca y Modelo:</strong></td>
              <td colspan="3">${escapeHtml(loan.laptop?.marca)} ${escapeHtml(loan.laptop?.modelo)}</td>
            </tr>
            <tr>
              <td><strong>Procesador:</strong></td>
              <td>${escapeHtml(comp.processor || 'Configuración estándar')}</td>
              <td><strong>Memoria RAM:</strong></td>
              <td>${escapeHtml(comp.ram || '16 GB')}</td>
            </tr>
            <tr>
              <td><strong>Almacenamiento:</strong></td>
              <td>${escapeHtml(comp.primary_disk || 'SSD M.2 NVMe')}</td>
              <td><strong>Sistema Operativo:</strong></td>
              <td>${escapeHtml(comp.windows || 'Windows 11 Pro')}</td>
            </tr>
          </table>
        </section>

        <section class="acta-section" style="margin-top:16px">
          <h4>3. ACCESORIOS Y PERIFÉRICOS ENTREGADOS</h4>
          <p style="font-size:13px;color:var(--text);margin:6px 0">
            ${loan.accessories && loan.accessories.length ? loan.accessories.map(a => `• ${escapeHtml(a.nombre || a.tipo)} (${a.estado || 'Entregado'})`).join('<br>') : '• Cargador original y cable de poder estándar.'}
          </p>
        </section>

        <section class="acta-section" style="margin-top:16px">
          <h4>4. TÉRMINOS Y COMPROMISO DE CUSTODIA</h4>
          <p style="font-size:11px;color:var(--muted);line-height:1.5;text-align:justify">
            El receptor declara haber recibido el equipo y accesorios en condiciones operativas óptimas. Se compromete a utilizar el dispositivo exclusivamente para fines laborales de la organización, cumplir con las políticas de ciberseguridad, no realizar modificaciones de hardware no autorizadas y notificar de inmediato cualquier extravío o daño físico al departamento de TI.
          </p>
        </section>

        <div class="acta-signatures" style="display:flex;justify-content:space-around;margin-top:36px;gap:24px">
          <div style="flex:1;text-align:center;border-top:1px solid #94a3b8;padding-top:8px">
            <div style="height:60px;display:flex;align-items:center;justify-content:center">
              ${tiSig && tiSig.image_data ? `<img src="${tiSig.image_data}" style="max-height:55px">` : `<em style="color:var(--muted);font-size:12px">Firma digital registrada</em>`}
            </div>
            <strong>Entregado por: Departamento de TI</strong>
            <small style="display:block;color:var(--muted)">Soporte & Infraestructura</small>
          </div>
          <div style="flex:1;text-align:center;border-top:1px solid #94a3b8;padding-top:8px">
            <div style="height:60px;display:flex;align-items:center;justify-content:center">
              ${empSig && empSig.image_data ? `<img src="${empSig.image_data}" style="max-height:55px">` : `<em style="color:var(--muted);font-size:12px">Firma de conformidad registrada</em>`}
            </div>
            <strong>Recibido por: ${escapeHtml(loan.employee?.nombre || 'Colaborador')}</strong>
            <small style="display:block;color:var(--muted)">Cédula: ${escapeHtml(loan.employee?.cedula || '—')}</small>
          </div>
        </div>
      </div>
    `;

    abrirModal('modalActaPDF');
  }

  window.abrirActaPDF = abrirActaPDF;

  /* ==========================================================================
     Acciones de CRUD y Modales en JavaScript Puro
     ========================================================================== */

  // Nuevo Préstamo
  window.abrirNuevoPrestamo = function (preselectedLaptopId = null) {
    const employeeSelect = document.getElementById('loan-employee-select');
    const laptopSelect = document.getElementById('loan-laptop-select');
    const accessoriesContainer = document.getElementById('loan-accessories-checkboxes');

    if (employeeSelect) {
      const employees = store.getEmployees();
      employeeSelect.innerHTML = `<option value="">Selecciona un colaborador</option>` +
        employees.map(e => `<option value="${e.id}">${escapeHtml(e.nombre)} (${escapeHtml(e.cedula)})</option>`).join('');
    }

    if (laptopSelect) {
      const laptops = store.getLaptops().filter(l => ['Disponible', 'Para préstamo'].includes(l.estado) || Number(l.id) === Number(preselectedLaptopId));
      laptopSelect.innerHTML = `<option value="">Selecciona un equipo</option>` +
        laptops.map(l => `<option value="${l.id}">${escapeHtml(l.service_tag)} · ${escapeHtml(l.marca)} ${escapeHtml(l.modelo)}${l.estado === 'Para préstamo' ? ' [Para préstamo / Eventos]' : ''}</option>`).join('');
      if (preselectedLaptopId) laptopSelect.value = preselectedLaptopId;
    }

    if (accessoriesContainer) {
      const accessories = store.getAccessories().filter(a => a.estado === 'Disponible');
      accessoriesContainer.innerHTML = accessories.map(a => `
        <label class="checkbox-card" style="font-size:13px;padding:8px 12px">
          <input type="checkbox" name="loan_accessory" value="${a.id}">
          <span>${escapeHtml(a.nombre)}</span>
        </label>
      `).join('');
    }

    // Configurar fechas
    const fechaEntregaInput = document.getElementById('loan-fecha-entrega');
    if (fechaEntregaInput) fechaEntregaInput.value = new Date().toISOString().split('T')[0];

    // Limpiar firmas
    document.querySelectorAll('#modalLoan .signature-canvas').forEach(canvas => {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    document.querySelectorAll('#modalLoan input[type=hidden]').forEach(h => { h.value = ''; });

    abrirModal('modalLoan');
  };

  window.guardarNuevoPrestamo = function (event) {
    event.preventDefault();
    const form = event.target;
    const employeeId = form.querySelector('[name="employee_id"]').value;
    const laptopId = form.querySelector('[name="laptop_id"]').value;
    const fechaEntrega = form.querySelector('[name="fecha_entrega"]').value;
    const fechaDevolucion = form.querySelector('[name="fecha_devolucion"]')?.value || null;
    const signatureTI = form.querySelector('[name="signature_ti"]')?.value || '';
    const signatureEmp = form.querySelector('[name="signature_employee"]')?.value || '';

    const selectedAccessories = [...form.querySelectorAll('[name="loan_accessory"]:checked')].map(cb => {
      const acc = store.getAccessory(cb.value);
      return {
        accessory_id: Number(cb.value),
        nombre: acc ? acc.nombre : 'Accesorio',
        tipo: acc ? acc.tipo : 'Accesorio',
        estado: 'Prestado'
      };
    });

    try {
      store.createLoan({
        employee_id: employeeId,
        laptop_id: laptopId,
        fecha_entrega: fechaEntrega,
        fecha_devolucion: fechaDevolucion,
        accessories: selectedAccessories,
        signature_ti: signatureTI,
        signature_employee: signatureEmp
      });

      cerrarModal('modalLoan');
      toast('Préstamo asignado correctamente.');
      window.router.handleRoute();
    } catch (e) {
      toast(e.message || 'Error al registrar el préstamo.', 'error');
    }
  };

  // Devolución de Préstamo
  window.abrirDevolucionPrestamo = function (loanId) {
    const loan = store.getLoan(loanId);
    if (!loan) return;

    document.getElementById('return-loan-id').value = loan.id;
    document.getElementById('return-loan-info').textContent =
      `Préstamo #${loan.id} · ${loan.employee?.nombre || ''} · ${loan.laptop?.service_tag || ''}`;

    abrirModal('modalReturnLoan');
  };

  window.guardarDevolucionPrestamo = function (event) {
    event.preventDefault();
    const form = event.target;
    const loanId = form.querySelector('[name="loan_id"]').value;
    const laptopState = form.querySelector('[name="laptop_state"]').value;
    const notes = form.querySelector('[name="return_notes"]').value;

    try {
      store.returnLoan(loanId, {
        laptop_state: laptopState,
        notes: notes,
        returned_at: new Date().toISOString().split('T')[0]
      });

      cerrarModal('modalReturnLoan');
      toast('Devolución del equipo registrada con éxito.');
      window.router.handleRoute();
    } catch (e) {
      toast(e.message || 'Error al procesar devolución.', 'error');
    }
  };

  window.confirmarEntrega = function (loanId) {
    showConfirm('Confirmar entrega', '¿Confirmas que la laptop programada fue entregada físicamente al colaborador?', () => {
      store.confirmScheduledDelivery(loanId);
      toast('Entrega confirmada y préstamo activo.');
      window.router.handleRoute();
    });
  };

  window.eliminarPrestamo = function (loanId) {
    showConfirm('Eliminar préstamo', `¿Eliminar el registro de préstamo #${loanId}? Esta acción cancelará la asignación.`, () => {
      store.deleteLoan(loanId);
      toast('Préstamo cancelado / eliminado.');
      window.router.handleRoute();
    });
  };

  // Equipos CRUD
  window.guardarEquipo = function (event) {
    event.preventDefault();
    const form = event.target;
    const id = form.querySelector('[name="laptop_id"]')?.value;
    const serviceTag = form.querySelector('[name="service_tag"]').value.trim();
    const serial = form.querySelector('[name="serial"]').value.trim();
    const marca = form.querySelector('[name="marca"]').value.trim();
    const modelo = form.querySelector('[name="modelo"]').value.trim();
    const estado = form.querySelector('[name="estado"]').value;
    const observaciones = form.querySelector('[name="observaciones"]').value.trim();

    try {
      const saved = store.saveLaptop({
        id: id ? Number(id) : undefined,
        service_tag: serviceTag,
        serial,
        marca,
        modelo,
        estado,
        observaciones
      });

      // Si había especificaciones de IA pendientes en sessionStorage
      const pendingKey = 'it-loans.pending-ai-components';
      const pending = sessionStorage.getItem(pendingKey);
      if (pending) {
        try {
          const parsed = JSON.parse(pending);
          if (parsed && parsed.data) {
            store.saveComponents(saved.id, parsed.data);
          }
        } catch (_) {}
        sessionStorage.removeItem(pendingKey);
      }

      form.reset();
      cerrarModal('modalLaptop');
      toast(`Equipo "${serviceTag}" guardado correctamente.`);
      window.router.handleRoute();
    } catch (e) {
      toast(e.message || 'Error guardando equipo.', 'error');
    }
  };

  window.editarDatosEquipo = function (id) {
    const laptop = store.getLaptop(id);
    if (!laptop) return;

    const modal = document.getElementById('modalLaptop');
    modal.querySelector('[name="laptop_id"]').value = laptop.id;
    modal.querySelector('[name="service_tag"]').value = laptop.service_tag;
    modal.querySelector('[name="serial"]').value = laptop.serial;
    modal.querySelector('[name="marca"]').value = laptop.marca;
    modal.querySelector('[name="modelo"]').value = laptop.modelo;
    modal.querySelector('[name="estado"]').value = laptop.estado;
    modal.querySelector('[name="observaciones"]').value = laptop.observaciones || '';
    modal.querySelector('h2').textContent = 'Editar equipo tecnológico';

    abrirModal('modalLaptop');
  };

  window.eliminarEquipo = function (id, tag) {
    showConfirm('Eliminar equipo', `¿Eliminar "${tag}" del inventario? Esta acción no se puede deshacer.`, () => {
      try {
        store.deleteLaptop(id);
        toast(`Equipo ${tag} eliminado del inventario.`);
        window.router.handleRoute();
      } catch (e) {
        toast(e.message || 'No se pudo eliminar el equipo.', 'error');
      }
    });
  };

  window.cambiarDisponibilidad = function (id, tag, info, estado) {
    const modal = document.getElementById('modalAvailability');
    if (!modal) return;
    document.getElementById('avail-title').textContent = tag + ' · ' + info;
    document.getElementById('avail-laptop-id').value = id;
    const select = document.getElementById('avail-select');
    select.value = estado;

    const isLoaned = ['Prestado', 'Próximo a entrega'].includes(estado);
    document.getElementById('avail-loan-warning').style.display = isLoaned ? 'block' : 'none';
    select.disabled = isLoaned;
    document.getElementById('avail-submit-btn').style.display = isLoaned ? 'none' : 'inline-flex';
    document.getElementById('avail-loans-btn').style.display = isLoaned ? 'inline-flex' : 'none';

    abrirModal('modalAvailability');
  };

  window.guardarDisponibilidad = function (event) {
    event.preventDefault();
    const id = document.getElementById('avail-laptop-id').value;
    const estado = document.getElementById('avail-select').value;
    try {
      store.saveLaptop({ id: Number(id), estado });
      cerrarModal('modalAvailability');
      toast('Estado del equipo actualizado correctamente.');
      window.router.handleRoute();
    } catch (e) {
      toast(e.message || 'Error actualizando estado.', 'error');
    }
  };

  // Componentes de Hardware
  window.abrirModalEditarComponentes = function (laptopId) {
    const laptop = store.getLaptop(laptopId);
    const comp = store.getComponents(laptopId) || {};
    const modal = document.getElementById('modalComponents');
    if (!modal) return;

    document.getElementById('comp-laptop-id').value = laptopId;
    document.getElementById('comp-laptop-title').textContent = `${laptop.marca} ${laptop.modelo} (${laptop.service_tag})`;

    const fields = ['processor', 'generation', 'ram', 'ram_slots', 'ram_type', 'primary_disk', 'secondary_disk', 'storage_capacity', 'storage_type', 'graphics', 'display', 'resolution', 'battery', 'battery_cycles', 'battery_health', 'mac_address', 'ip_address', 'bios', 'tpm', 'windows', 'office', 'antivirus', 'notes'];

    fields.forEach(field => {
      const input = modal.querySelector(`[name="${field}"]`);
      if (input) input.value = comp[field] || '';
    });

    abrirModal('modalComponents');
  };

  window.guardarComponentes = function (event) {
    event.preventDefault();
    const modal = document.getElementById('modalComponents');
    const laptopId = document.getElementById('comp-laptop-id').value;
    const fields = ['processor', 'generation', 'ram', 'ram_slots', 'ram_type', 'primary_disk', 'secondary_disk', 'storage_capacity', 'storage_type', 'graphics', 'display', 'resolution', 'battery', 'battery_cycles', 'battery_health', 'mac_address', 'ip_address', 'bios', 'tpm', 'windows', 'office', 'antivirus', 'notes'];

    const data = {};
    fields.forEach(f => {
      const input = modal.querySelector(`[name="${f}"]`);
      if (input) data[f] = input.value.trim();
    });

    try {
      store.saveComponents(laptopId, data);
      cerrarModal('modalComponents');
      toast('Especificaciones técnicas actualizadas.');
      window.router.handleRoute();
    } catch (e) {
      toast(e.message || 'Error guardando componentes.', 'error');
    }
  };

  // Personas CRUD
  window.guardarPersona = function (event) {
    event.preventDefault();
    const form = event.target;
    const nombre = form.querySelector('[name="nombre"]').value.trim();
    const cedula = form.querySelector('[name="cedula"]').value.trim();
    const departamento = form.querySelector('[name="departamento"]').value.trim();
    const correo = form.querySelector('[name="correo"]').value.trim();
    const telefono = form.querySelector('[name="telefono"]').value.trim();

    try {
      store.saveEmployee({ nombre, cedula, departamento, correo, telefono });
      form.reset();
      cerrarModal('modalEmployee');
      toast(`Colaborador "${nombre}" guardado.`);
      window.router.handleRoute();
    } catch (e) {
      toast(e.message || 'Error guardando colaborador.', 'error');
    }
  };

  window.eliminarPersona = function (id, nombre) {
    showConfirm('Eliminar colaborador', `¿Eliminar a "${nombre}"? Esta acción no se puede deshacer.`, () => {
      try {
        store.deleteEmployee(id);
        toast(`Colaborador "${nombre}" eliminado.`);
        window.router.handleRoute();
      } catch (e) {
        toast(e.message || 'No se pudo eliminar el colaborador.', 'error');
      }
    });
  };

  // Accesorios CRUD
  window.guardarAccesorio = function (event) {
    event.preventDefault();
    const form = event.target;
    const id = form.querySelector('[name="accessory_id"]')?.value;
    const nombre = form.querySelector('[name="nombre"]').value.trim();
    const tipo = form.querySelector('[name="tipo"]').value;
    const cantidad_total = Number(form.querySelector('[name="cantidad_total"]').value);
    const estado = form.querySelector('[name="estado"]').value;

    try {
      store.saveAccessory({
        id: id ? Number(id) : undefined,
        nombre,
        tipo,
        cantidad_total,
        estado
      });
      form.reset();
      cerrarModal('modalAccessory');
      toast(`Accesorio "${nombre}" guardado.`);
      window.router.handleRoute();
    } catch (e) {
      toast(e.message || 'Error guardando accesorio.', 'error');
    }
  };

  window.editarAccesorio = function (id) {
    const acc = store.getAccessory(id);
    if (!acc) return;
    const modal = document.getElementById('modalAccessory');
    modal.querySelector('[name="accessory_id"]').value = acc.id;
    modal.querySelector('[name="nombre"]').value = acc.nombre;
    modal.querySelector('[name="tipo"]').value = acc.tipo;
    modal.querySelector('[name="cantidad_total"]').value = acc.cantidad_total;
    modal.querySelector('[name="estado"]').value = acc.estado;
    modal.querySelector('h2').textContent = 'Editar accesorio';
    abrirModal('modalAccessory');
  };

  window.eliminarAccesorio = function (id, nombre) {
    showConfirm('Eliminar accesorio', `¿Eliminar "${nombre}" del almacén?`, () => {
      store.deleteAccessory(id);
      toast(`Accesorio "${nombre}" eliminado.`);
      window.router.handleRoute();
    });
  };

  // Incidencias CRUD
  window.guardarIncidencia = function (event) {
    event.preventDefault();
    const form = event.target;
    const laptop_id = Number(form.querySelector('[name="laptop_id"]').value);
    const employee_id = form.querySelector('[name="employee_id"]').value ? Number(form.querySelector('[name="employee_id"]').value) : null;
    const category = form.querySelector('[name="category"]').value.trim();
    const priority = form.querySelector('[name="priority"]').value;
    const status = form.querySelector('[name="status"]').value;
    const notes = form.querySelector('[name="notes"]').value.trim();

    try {
      store.saveIncident({
        laptop_id,
        employee_id,
        category,
        priority,
        status,
        notes
      });
      form.reset();
      cerrarModal('modalIncident');
      toast('Incidencia registrada.');
      window.router.handleRoute();
    } catch (e) {
      toast(e.message || 'Error registrando incidencia.', 'error');
    }
  };

  window.gestionarIncidencia = function (id) {
    const inc = store.getIncidents().find(i => Number(i.id) === Number(id));
    if (!inc) return;
    showConfirm(
      `Incidencia #${inc.id} (${inc.category})`,
      `Estado actual: ${inc.status}. ¿Deseas marcar esta incidencia como Cerrada / Solucionada?`,
      () => {
        store.saveIncident({ id: inc.id, status: 'Cerrada' });
        toast(`Incidencia #${inc.id} cerrada con éxito.`);
        window.router.handleRoute();
      }
    );
  };

  // Mantenimiento CRUD
  window.guardarMantenimiento = function (event) {
    event.preventDefault();
    const form = event.target;
    const laptop_id = Number(form.querySelector('[name="laptop_id"]').value);
    const technician_id = form.querySelector('[name="technician_id"]').value ? Number(form.querySelector('[name="technician_id"]').value) : null;
    const status = form.querySelector('[name="status"]').value;
    const received_at = form.querySelector('[name="received_at"]').value;
    const estimated_delivery = form.querySelector('[name="estimated_delivery"]').value;
    const hours_spent = Number(form.querySelector('[name="hours_spent"]').value || 0);
    const repair_cost = Number(form.querySelector('[name="repair_cost"]').value || 0);
    const initial_diagnosis = form.querySelector('[name="initial_diagnosis"]').value.trim();

    try {
      store.saveMaintenance({
        laptop_id,
        technician_id,
        status,
        received_at,
        estimated_delivery,
        hours_spent,
        repair_cost,
        initial_diagnosis
      });
      form.reset();
      cerrarModal('modalMaintenance');
      toast('Mantenimiento técnico registrado.');
      window.router.handleRoute();
    } catch (e) {
      toast(e.message || 'Error guardando mantenimiento.', 'error');
    }
  };

  window.gestionarMantenimiento = function (id) {
    const item = store.getMaintenances().find(m => Number(m.id) === Number(id));
    if (!item) return;
    showConfirm(
      `Mantenimiento de ${item.laptop?.service_tag}`,
      `Estado: ${item.status}. Diagnóstico: "${item.initial_diagnosis}". ¿Deseas finalizar este servicio y marcar el equipo como Disponible?`,
      () => {
        store.saveMaintenance({ id: item.id, status: 'Finalizado' });
        store.saveLaptop({ id: item.laptop_id, estado: 'Disponible' });
        toast('Mantenimiento finalizado y equipo liberado a Disponible.');
        window.router.handleRoute();
      }
    );
  };

  // Usuarios CRUD
  window.guardarUsuario = function (event) {
    event.preventDefault();
    const form = event.target;
    const username = form.querySelector('[name="username"]').value.trim();
    const role = form.querySelector('[name="role"]').value;
    const employee_id = form.querySelector('[name="employee_id"]').value ? Number(form.querySelector('[name="employee_id"]').value) : null;

    try {
      store.saveUser({ username, role, employee_id });
      form.reset();
      cerrarModal('modalUser');
      toast(`Usuario "${username}" creado correctamente.`);
      window.router.handleRoute();
    } catch (e) {
      toast(e.message || 'Error guardando usuario.', 'error');
    }
  };

  window.editarUsuario = function (id) {
    const u = store.getUsers().find(user => Number(user.id) === Number(id));
    if (!u) return;
    showConfirm(
      `Usuario "${u.username}"`,
      `El usuario tiene actualmente el rol "${u.role}". ¿Deseas alternar su rol a "${u.role === 'admin' ? 'Visitante' : 'Administrador'}"?`,
      () => {
        store.saveUser({ id: u.id, role: u.role === 'admin' ? 'visitor' : 'admin' });
        toast(`Rol de ${u.username} actualizado.`);
        window.router.handleRoute();
      }
    );
  };

  window.eliminarUsuario = function (id, username) {
    showConfirm('Eliminar usuario', `¿Eliminar la cuenta "${username}"?`, () => {
      store.deleteUser(id);
      toast(`Usuario "${username}" eliminado.`);
      window.router.handleRoute();
    });
  };

  // Filtros de Auditoría
  window.filtrarAuditoria = function () {
    const fecha = document.getElementById('audit-filter-date')?.value || '';
    const modulo = document.getElementById('audit-filter-module')?.value || '';
    const accion = document.getElementById('audit-filter-action')?.value || '';
    const q = document.getElementById('audit-filter-q')?.value || '';

    const logs = store.getAuditLogs({ fecha, modulo, accion, q });
    const tbody = document.getElementById('audit-table-body');
    if (tbody) tbody.innerHTML = window.views.renderAuditRows(logs);
  };

  window.limpiarFiltrosAuditoria = function () {
    const fDate = document.getElementById('audit-filter-date');
    const fMod = document.getElementById('audit-filter-module');
    const fAct = document.getElementById('audit-filter-action');
    const fQ = document.getElementById('audit-filter-q');
    if (fDate) fDate.value = '';
    if (fMod) fMod.value = '';
    if (fAct) fAct.value = '';
    if (fQ) fQ.value = '';
    window.filtrarAuditoria();
  };

  // Probar Ping n8n en Diagnóstico
  window.probarConexionN8N = async function () {
    const btn = document.getElementById('btnPingN8n');
    const resultBox = document.getElementById('pingResult');
    const msg = document.getElementById('pingMsg');
    setButtonLoading(btn, true, 'Probando ping…');
    if (resultBox) resultBox.style.display = 'none';

    try {
      const res = await fetch('/api/diagnostics/ping');
      const data = await res.json();
      if (resultBox && msg) {
        resultBox.style.display = 'flex';
        msg.textContent = `Latencia: ${data.latency_ms}ms (${data.mode})`;
      }
      toast('Conexión con simulador n8n verificada exitosamente.');
    } catch {
      toast('Error comprobando ping.', 'error');
    } finally {
      setButtonLoading(btn, false);
    }
  };

  // Alternar Rol de Usuario (Admin <-> Visitante)
  window.toggleUserRole = function () {
    const current = store.getCurrentUser();
    const newRole = current.role === 'admin' ? 'visitor' : 'admin';
    store.switchRole(newRole);
    toast(`Has cambiado al modo: ${newRole === 'admin' ? 'Administrador (Acceso total)' : 'Visitante (Solo lectura y solicitudes)'}`);
    window.router.handleRoute();
  };

  // Restablecer Datos Demo
  window.restablecerDemo = function () {
    showConfirm(
      'Restablecer datos demo',
      '¿Deseas reiniciar toda la base de datos de prueba a sus valores originales de fábrica? Se perderán las modificaciones locales.',
      () => {
        store.resetDemoData(true);
        window.router.handleRoute();
      }
    );
  };

  // Login Handlers
  window.handleLoginSubmit = function (event) {
    event.preventDefault();
    const form = event.target;
    const username = form.querySelector('[name="username"]').value.trim();
    if (username.toLowerCase() === 'visitante') {
      store.switchRole('visitor');
    } else {
      store.switchRole('admin');
    }
    toast(`¡Bienvenido de nuevo, ${username}!`);
    location.hash = '#/dashboard';
  };

  window.handleVisitorLogin = function () {
    store.switchRole('visitor');
    toast('Has iniciado sesión como visitante.');
    location.hash = '#/dashboard';
  };

  /* ==========================================================================
     Global Listeners & Startup
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    // Tema claro / oscuro
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle?.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark');
    }

    // Toggle de sidebar móvil
    document.querySelector('.menu-toggle')?.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.toggle('open');
    });

    // Colapsar sidebar en escritorio
    const sidebarCollapse = document.querySelector('.sidebar-collapse');
    const syncSidebarCollapse = collapsed => {
      document.body.classList.toggle('sidebar-collapsed', collapsed);
      sidebarCollapse?.setAttribute('aria-label', collapsed ? 'Desplegar menú' : 'Contraer menú');
      sidebarCollapse?.setAttribute('title', collapsed ? 'Desplegar menú' : 'Contraer menú');
    };
    const savedSidebarState = localStorage.getItem('sidebar-collapsed') === 'true';
    syncSidebarCollapse(savedSidebarState);
    sidebarCollapse?.addEventListener('click', () => {
      const collapsed = !document.body.classList.contains('sidebar-collapsed');
      syncSidebarCollapse(collapsed);
      localStorage.setItem('sidebar-collapsed', String(collapsed));
    });

    // Cerrar modal al hacer click fuera o presionar Esc
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', event => {
        if (event.target === modal) {
          modal.classList.remove('active');
          syncModalState();
        }
      });
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => modal.classList.remove('active'));
        syncModalState();
      }
    });

    // Checkbox de fecha de devolución indefinida
    document.querySelectorAll('[data-indefinite-return]').forEach(checkbox => {
      const dateInput = checkbox.form?.querySelector('[data-return-date]');
      if (!dateInput) return;
      const sync = () => {
        dateInput.disabled = checkbox.checked;
        if (checkbox.checked) dateInput.value = '';
      };
      checkbox.addEventListener('change', sync);
      sync();
    });

    // Inicializar canvas de firma
    document.querySelectorAll('.signature-canvas').forEach(setupSignature);
  });
})();
