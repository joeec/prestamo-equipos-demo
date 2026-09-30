/**
 * IT Asset Manager V3 - SPA View Templates & Renderers
 * Pure JavaScript declarative views matching original FastAPI Jinja2 templates.
 */

(() => {
  'use strict';

  const escapeHtml = str => String(str ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);

  const badgeColorForState = state => {
    switch (state) {
      case 'Disponible': return 'green';
      case 'Para préstamo': return 'blue';
      case 'Próximo a entrega': return 'purple';
      case 'Prestado': case 'No disponible': case 'Mantenimiento': return 'amber';
      case 'Dañado': case 'Baja': return 'red';
      case 'Activo': return 'amber';
      case 'Devuelto': return 'green';
      case 'Programado': return 'purple';
      case 'Alta': case 'Crítica': return 'red';
      case 'Media': return 'amber';
      case 'Baja': return 'green';
      case 'Cerrada': return 'green';
      case 'En proceso': return 'amber';
      default: return 'blue';
    }
  };

  const views = {};

  // =========================================================================
  // VIEW: DASHBOARD / RESUMEN
  // =========================================================================
  views.dashboard = function () {
    const user = store.getCurrentUser();
    const stats = store.getStats();
    const charts = stats.charts;
    const overdue = stats.overdue;
    const recent = stats.recent_loans;

    return `
      ${user.role === 'admin' ? `
        <section class="toolbar">
          <div>
            <h2>Gestión de préstamos</h2>
            <p>Entrega una laptop disponible y asígnala a una persona en pocos pasos.</p>
          </div>
          <button class="btn primary" onclick="abrirNuevoPrestamo()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nuevo préstamo
          </button>
        </section>
      ` : ''}

      <section class="metrics">
        <article>
          <span>Laptops disponibles</span>
          <strong>${stats.available}${stats.for_loan ? ` <small style="font-size:12px;font-weight:500;color:var(--info)" title="Equipos reservados para préstamos y eventos">(+${stats.for_loan} p/ préstamo)</small>` : ''}</strong>
          <a href="#/laptops">Ver equipos <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
        </article>
        <article>
          <span>Equipos prestados</span>
          <strong>${stats.loaned}</strong>
          <a href="#/loans">Ver préstamos <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
        </article>
        <article>
          <span>En mantenimiento</span>
          <strong>${stats.maintenance}</strong>
          <a href="#/maintenance">Gestionar <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
        </article>
        <article>
          <span>Préstamos activos</span>
          <strong>${stats.active_loans}</strong>
          <a href="#/loans">Gestionar <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
        </article>
      </section>

      ${overdue && overdue.length ? `
        <section class="notice warning">
          <div>
            <strong>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--warning);vertical-align:-2px;margin-right:4px"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Hay ${overdue.length} préstamo(s) con fecha de devolución vencida
            </strong>
            <p>Revisa las fechas previstas de entrega y retorno para regularizar los equipos.</p>
          </div>
          <a class="btn secondary" href="#/loans">Ver alertas</a>
        </section>
      ` : ''}

      <section class="chart-grid compact-charts">
        <article class="panel">
          <h2>Activos por estado</h2>
          <div class="native-chart">
            ${charts.assets_state.map(([label, val]) => `
              <div class="bar-row">
                <span>${escapeHtml(label || 'Sin dato')}</span>
                <div class="bar-track">
                  <i style="width: ${Math.round((val / (stats.total_assets || 1)) * 100)}%"></i>
                </div>
                <b>${val}</b>
              </div>
            `).join('')}
          </div>
        </article>

        <article class="panel">
          <h2>Activos por marca</h2>
          <div class="native-chart">
            ${charts.assets_brand.map(([label, val]) => `
              <div class="bar-row">
                <span>${escapeHtml(label || 'Sin dato')}</span>
                <div class="bar-track">
                  <i style="width: ${Math.round((val / (stats.total_assets || 1)) * 100)}%"></i>
                </div>
                <b>${val}</b>
              </div>
            `).join('')}
          </div>
        </article>
      </section>

      <section class="panel">
        <div class="panel-title">
          <div>
            <h2>Actividad reciente</h2>
            <p>Últimos movimientos de entrega y devolución registrados</p>
          </div>
          <a class="btn secondary" href="#/loans">Ver todos los préstamos</a>
        </div>
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Persona</th>
                <th>Equipo</th>
                <th>Fecha Entrega</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${recent.length ? recent.map(loan => `
                <tr>
                  <td><strong>${escapeHtml(loan.employee?.nombre || '—')}</strong></td>
                  <td>${escapeHtml(loan.laptop?.service_tag || '—')} · ${escapeHtml(loan.laptop?.marca || '')}</td>
                  <td>${escapeHtml(loan.fecha_entrega || '—')}</td>
                  <td>
                    <span class="badge ${badgeColorForState(loan.estado)}">
                      ${escapeHtml(loan.estado)}
                    </span>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="4" class="empty">Aún no hay movimientos de préstamo registrados.</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </section>
    `;
  };

  // =========================================================================
  // VIEW: LAPTOPS / EQUIPOS
  // =========================================================================
  views.laptops = function () {
    const user = store.getCurrentUser();
    const laptops = store.getLaptops();

    return `
      <section class="toolbar">
        <div class="filters">
          <input class="search" data-table-search="laptops-table" placeholder="Buscar por Service Tag, marca, modelo o serial">
          <select data-table-filter="laptops-table" data-column="4">
            <option value="">Todos los estados</option>
            <option value="Disponible">Disponible</option>
            <option value="Para préstamo">Para préstamo</option>
            <option value="No disponible">No disponible</option>
            <option value="Próximo a entrega">Próximo a entrega</option>
            <option value="Prestado">Prestado</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Dañado">Dañado</option>
          </select>
        </div>
        ${user.role === 'admin' ? `
          <div class="toolbar-actions">
            <button class="btn secondary" type="button" onclick="abrirModal('modalLaptopAI')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>
              Añadir con IA
            </button>
            <button class="btn primary" type="button" onclick="abrirModal('modalLaptop')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Nuevo equipo
            </button>
          </div>
        ` : ''}
      </section>

      <section class="panel">
        <div class="table-scroll">
          <table id="laptops-table">
            <thead>
              <tr>
                <th data-sort>Service Tag</th>
                <th data-sort>Marca</th>
                <th data-sort>Modelo</th>
                <th>Serial</th>
                <th data-sort>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${laptops.length ? laptops.map(laptop => `
                <tr>
                  <td>
                    <a class="link" href="#/laptops/${laptop.id}" title="Ver especificaciones y detalles">
                      <strong>${escapeHtml(laptop.service_tag)}</strong>
                    </a>
                  </td>
                  <td>${escapeHtml(laptop.marca)}</td>
                  <td>${escapeHtml(laptop.modelo)}</td>
                  <td><code>${escapeHtml(laptop.serial)}</code></td>
                  <td>
                    <span class="badge ${badgeColorForState(laptop.estado)}">
                      ${escapeHtml(laptop.estado)}
                    </span>
                  </td>
                  <td class="row-actions">
                    <a class="icon-btn" href="#/laptops/${laptop.id}" title="Ver ficha técnica" aria-label="Ver ficha técnica">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                    ${['Disponible', 'Para préstamo'].includes(laptop.estado) && user.role === 'admin' ? `
                      <a class="icon-btn" href="#/loans?laptop_id=${laptop.id}" title="Entregar a colaborador" aria-label="Entregar a colaborador">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>
                      </a>
                    ` : ''}
                    ${user.role === 'admin' ? `
                      <button class="icon-btn" type="button" onclick="cambiarDisponibilidad(${laptop.id}, '${escapeHtml(laptop.service_tag)}', '${escapeHtml(laptop.marca)} ${escapeHtml(laptop.modelo)}', '${laptop.estado}')" title="Cambiar disponibilidad" aria-label="Cambiar disponibilidad">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                      </button>
                    ` : ''}
                    <button class="icon-btn" type="button" onclick="mostrarQR(${laptop.id}, '${escapeHtml(laptop.service_tag)}', '${escapeHtml(laptop.marca)} ${escapeHtml(laptop.modelo)}', '${escapeHtml(laptop.serial)}')" title="Código QR" aria-label="Ver código QR de ${escapeHtml(laptop.service_tag)}">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    </button>
                    ${user.role === 'admin' ? `
                      <button class="icon-btn danger" type="button" onclick="eliminarEquipo(${laptop.id}, '${escapeHtml(laptop.service_tag)}')" title="Eliminar" aria-label="Eliminar ${escapeHtml(laptop.service_tag)}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    ` : ''}
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="6" class="empty">No hay equipos registrados en el inventario.</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
        <div class="pagination" data-pagination="laptops-table"></div>
      </section>
    `;
  };

  // =========================================================================
  // VIEW: LAPTOP DETAIL / FICHA TÉCNICA
  // =========================================================================
  views.laptop_detail = function (id) {
    const user = store.getCurrentUser();
    const laptop = store.getLaptop(id);
    if (!laptop) {
      return `
        <div class="notice warning">
          <p>El equipo solicitado no existe o fue eliminado.</p>
          <a class="btn primary" href="#/laptops">Volver a equipos</a>
        </div>
      `;
    }

    const component = store.getComponents(id) || {};
    const loans = store.getLoans().filter(l => Number(l.laptop_id) === Number(id)).map(store.getLoan);
    const maintenances = store.getMaintenances().filter(m => Number(m.laptop_id) === Number(id));

    return `
      <a class="back" href="#/laptops">← Volver a inventario de equipos</a>

      <section class="panel detail">
        <div>
          <p class="eyebrow">${escapeHtml(laptop.service_tag)}</p>
          <h2>${escapeHtml(laptop.marca)} ${escapeHtml(laptop.modelo)}</h2>
          <span class="badge ${badgeColorForState(laptop.estado)}">
            ${escapeHtml(laptop.estado)}
          </span>
          <dl>
            <dt>Número de serie</dt>
            <dd><code>${escapeHtml(laptop.serial)}</code></dd>
            <dt>Observaciones</dt>
            <dd>${escapeHtml(laptop.observaciones || 'Sin observaciones registradas')}</dd>
          </dl>
          ${user.role === 'admin' ? `
            <div style="margin-top:12px;display:flex;gap:8px">
              <button class="btn secondary" type="button" style="font-size:12px;padding:6px 12px" onclick="editarDatosEquipo(${laptop.id})">Editar datos del equipo</button>
              ${['Disponible', 'Para préstamo'].includes(laptop.estado) ? `
                <a class="btn primary" href="#/loans?laptop_id=${laptop.id}" style="font-size:12px;padding:6px 12px">Entregar a colaborador</a>
              ` : ''}
            </div>
          ` : ''}
        </div>
        <div class="qr" style="display:flex;flex-direction:column;align-items:center;gap:12px">
          <div id="laptop-detail-qr" style="width:140px;height:140px;background:#fff;padding:8px;border-radius:12px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center"></div>
          <button class="btn secondary" type="button" onclick="mostrarQR(${laptop.id}, '${escapeHtml(laptop.service_tag)}', '${escapeHtml(laptop.marca)} ${escapeHtml(laptop.modelo)}', '${escapeHtml(laptop.serial)}')" style="font-size:12px">Ver / Imprimir QR</button>
        </div>
      </section>

      <section class="panel">
        <div class="panel-title">
          <div>
            <h2>Componentes y Hardware</h2>
            <p>Especificaciones técnicas del dispositivo</p>
          </div>
          ${user.role === 'admin' ? `
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
              <button class="btn secondary" type="button" onclick="abrirModalAIConModelo('${escapeHtml(laptop.marca)} ${escapeHtml(laptop.modelo)}')">Autocompletar con IA</button>
              <button class="btn primary" type="button" onclick="abrirModalEditarComponentes(${laptop.id})">Editar especificaciones</button>
            </div>
          ` : ''}
        </div>
        <div class="component-list">
          <span>Procesador: <b>${escapeHtml(component.processor || '—')}</b></span>
          <span>RAM: <b>${escapeHtml(component.ram || '—')}</b></span>
          <span>Disco Principal: <b>${escapeHtml(component.primary_disk || '—')}</b></span>
          <span>Gráficos: <b>${escapeHtml(component.graphics || '—')}</b></span>
          <span>Pantalla: <b>${escapeHtml(component.display || '—')}</b></span>
          <span>Batería: <b>${escapeHtml(component.battery || '—')}</b></span>
          <span>Dirección MAC: <b>${escapeHtml(component.mac_address || '—')}</b></span>
          <span>Sistema Operativo: <b>${escapeHtml(component.windows || '—')}</b></span>
          <span>Antivirus: <b>${escapeHtml(component.antivirus || '—')}</b></span>
        </div>
      </section>

      <section class="panel">
        <div class="panel-title">
          <div>
            <h2>Historial de mantenimientos</h2>
            <p>Servicios técnicos y reparaciones realizadas a este equipo</p>
          </div>
        </div>
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Fecha Ingreso</th>
                <th>Técnico</th>
                <th>Estado</th>
                <th>Diagnóstico</th>
                <th>Costo ($)</th>
              </tr>
            </thead>
            <tbody>
              ${maintenances.length ? maintenances.map(item => `
                <tr>
                  <td>${escapeHtml(item.received_at)}</td>
                  <td>${escapeHtml(item.technician?.name || 'Sin asignar')}</td>
                  <td><span class="badge ${badgeColorForState(item.status)}">${escapeHtml(item.status)}</span></td>
                  <td>${escapeHtml(item.initial_diagnosis || '—')}</td>
                  <td>$${Number(item.repair_cost || 0).toFixed(2)}</td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="5" class="empty">Este equipo no tiene historial de mantenimientos.</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </section>

      <section class="panel">
        <div class="panel-title">
          <div>
            <h2>Historial de préstamos</h2>
            <p>Asignaciones y colaboradores que han utilizado este equipo</p>
          </div>
        </div>
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Persona</th>
                <th>Fecha Entrega</th>
                <th>Fecha Devolución</th>
                <th>Estado</th>
                <th>Acta</th>
              </tr>
            </thead>
            <tbody>
              ${loans.length ? loans.map(loan => `
                <tr>
                  <td>
                    <a class="link" href="#/employees/${loan.employee?.id}">
                      <strong>${escapeHtml(loan.employee?.nombre || '—')}</strong>
                    </a>
                  </td>
                  <td>${escapeHtml(loan.fecha_entrega)}</td>
                  <td>${escapeHtml(loan.fecha_devolucion || 'Indefinido')}</td>
                  <td>
                    <span class="badge ${badgeColorForState(loan.estado)}">
                      ${escapeHtml(loan.estado)}
                    </span>
                  </td>
                  <td class="row-actions">
                    <button class="icon-btn" type="button" onclick="abrirActaPDF(${loan.id})" title="Descargar / Ver Acta Oficial" aria-label="Ver Acta Oficial">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    </button>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="5" class="empty">Este equipo no ha sido asignado en ningún préstamo aún.</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </section>
    `;
  };

  // =========================================================================
  // VIEW: LOANS / ENTREGA DE LAPTOPS
  // =========================================================================
  views.loans = function () {
    const user = store.getCurrentUser();
    const loans = store.getLoans().map(l => store.getLoan(l.id));
    const todayStr = new Date().toISOString().split('T')[0];

    return `
      <section class="toolbar">
        <div class="filters">
          <input class="search" data-table-search="loans-table" placeholder="Buscar por persona, Service Tag o estado">
          <select data-table-filter="loans-table" data-column="4">
            <option value="">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Programado">Programado</option>
            <option value="Devuelto">Devuelto</option>
          </select>
        </div>
        ${user.role === 'admin' ? `
          <button class="btn primary" onclick="abrirNuevoPrestamo()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nuevo préstamo
          </button>
        ` : ''}
      </section>

      <section class="panel">
        <div class="table-scroll">
          <table id="loans-table">
            <thead>
              <tr>
                <th>Persona</th>
                <th>Equipo / Accesorios</th>
                <th>Fecha Entrega</th>
                <th>Fecha Devolución</th>
                <th>Estado</th>
                <th>Firmas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${loans.length ? loans.map(loan => `
                <tr>
                  <td>
                    <strong>${escapeHtml(loan.employee?.nombre || '—')}</strong>
                    <small style="display:block;color:var(--muted)">${escapeHtml(loan.employee?.departamento || 'General')}</small>
                  </td>
                  <td>
                    <strong>${escapeHtml(loan.laptop?.service_tag || '—')}</strong>
                    <small style="color:var(--muted)"> · ${escapeHtml(loan.laptop?.marca || '')} ${escapeHtml(loan.laptop?.modelo || '')}</small>
                    ${loan.accessories && loan.accessories.length ? `
                      <div style="font-size:0.8rem;color:var(--muted);margin-top:3px">
                        + Accesorios: ${loan.accessories.map(a => `<span>${escapeHtml(a.nombre || a.tipo)}</span>`).join(', ')}
                      </div>
                    ` : ''}
                  </td>
                  <td>${escapeHtml(loan.fecha_entrega)}</td>
                  <td>${escapeHtml(loan.fecha_devolucion || 'Indefinida')}</td>
                  <td>
                    <span class="badge ${badgeColorForState(loan.estado)}">
                      ${escapeHtml(loan.estado)}
                    </span>
                  </td>
                  <td>
                    ${loan.signatures && loan.signatures.length ? loan.signatures.map(s => `
                      <span class="badge green" style="font-size:11px" title="Firma digital registrada">${escapeHtml(s.signer || 'Firmado')}</span>
                    `).join(' ') : `<span style="color:var(--muted)">—</span>`}
                  </td>
                  <td class="row-actions">
                    <button class="icon-btn" type="button" onclick="abrirActaPDF(${loan.id})" title="Descargar Acta Oficial en PDF" aria-label="Descargar Acta Oficial en PDF">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    </button>
                    ${user.role === 'admin' ? `
                      ${loan.estado === 'Activo' ? `
                        <button class="btn secondary" style="font-size:12px;padding:4px 10px" onclick="abrirDevolucionPrestamo(${loan.id})">Devolver</button>
                      ` : ''}
                      ${loan.estado === 'Programado' && loan.fecha_entrega <= todayStr ? `
                        <button class="btn primary" style="font-size:12px;padding:4px 10px" onclick="confirmarEntrega(${loan.id})">Confirmar entrega</button>
                      ` : loan.estado === 'Programado' ? `
                        <span class="badge purple" style="font-size:11px">Reservada hasta ${loan.fecha_entrega}</span>
                      ` : ''}
                      <button class="icon-btn danger" type="button" onclick="eliminarPrestamo(${loan.id})" title="Cancelar o eliminar préstamo" aria-label="Cancelar o eliminar préstamo">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    ` : ''}
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="7" class="empty">No hay préstamos ni asignaciones registradas.</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
        <div class="pagination" data-pagination="loans-table"></div>
      </section>
    `;
  };

  // =========================================================================
  // VIEW: EMPLOYEES / PERSONAS
  // =========================================================================
  views.employees = function () {
    const user = store.getCurrentUser();
    const employees = store.getEmployees();

    return `
      <section class="toolbar">
        <input class="search" data-table-search="employees-table" placeholder="Buscar por nombre, cédula, correo o departamento">
        ${user.role === 'admin' ? `
          <button class="btn primary" onclick="abrirModal('modalEmployee')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nueva persona
          </button>
        ` : ''}
      </section>

      <section class="panel">
        <div class="table-scroll">
          <table id="employees-table">
            <thead>
              <tr>
                <th data-sort>Nombre completo</th>
                <th>Cédula / Identificación</th>
                <th data-sort>Departamento</th>
                <th>Correo electrónico</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${employees.length ? employees.map(emp => `
                <tr>
                  <td>
                    <a class="link" href="#/employees/${emp.id}">
                      <strong>${escapeHtml(emp.nombre)}</strong>
                    </a>
                  </td>
                  <td><code>${escapeHtml(emp.cedula)}</code></td>
                  <td>${escapeHtml(emp.departamento || '—')}</td>
                  <td>${escapeHtml(emp.correo || '—')}</td>
                  <td class="row-actions">
                    <a class="icon-btn" href="#/employees/${emp.id}" title="Ver perfil y préstamos" aria-label="Ver perfil y préstamos">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                    ${user.role === 'admin' ? `
                      <button class="icon-btn danger" type="button" onclick="eliminarPersona(${emp.id}, '${escapeHtml(emp.nombre)}')" title="Eliminar persona" aria-label="Eliminar persona">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    ` : ''}
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="5" class="empty">No hay personas ni colaboradores registrados.</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
        <div class="pagination" data-pagination="employees-table"></div>
      </section>
    `;
  };

  // =========================================================================
  // VIEW: EMPLOYEE DETAIL / PERFIL DE COLABORADOR
  // =========================================================================
  views.employee_detail = function (id) {
    const emp = store.getEmployee(id);
    if (!emp) {
      return `
        <div class="notice warning">
          <p>El colaborador solicitado no existe.</p>
          <a class="btn primary" href="#/employees">Volver a personas</a>
        </div>
      `;
    }

    const loans = store.getLoans().filter(l => Number(l.employee_id) === Number(id)).map(store.getLoan);

    return `
      <a class="back" href="#/employees">← Volver a personas</a>

      <section class="panel detail">
        <div>
          <p class="eyebrow">${escapeHtml(emp.departamento || 'GENERAL')}</p>
          <h2>${escapeHtml(emp.nombre)}</h2>
          <dl>
            <dt>Cédula / Identificación</dt>
            <dd><code>${escapeHtml(emp.cedula)}</code></dd>
            <dt>Correo electrónico</dt>
            <dd>${escapeHtml(emp.correo || '—')}</dd>
            <dt>Teléfono / Flota</dt>
            <dd>${escapeHtml(emp.telefono || '—')}</dd>
          </dl>
        </div>
        <div class="stat-circle" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:140px;height:140px;border-radius:50%;background:var(--primary-soft);color:var(--primary);text-align:center;padding:14px">
          <strong style="font-size:32px;line-height:1">${loans.length}</strong>
          <span style="font-size:11px;font-weight:700;margin-top:4px;text-transform:uppercase">Préstamos<br>totales</span>
        </div>
      </section>

      <section class="panel">
        <div class="panel-title">
          <div>
            <h2>Historial de préstamos y asignaciones</h2>
            <p>Registro de todos los equipos asignados a este colaborador</p>
          </div>
        </div>
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Equipo</th>
                <th>Fecha Entrega</th>
                <th>Fecha Devolución</th>
                <th>Estado</th>
                <th>Acta</th>
              </tr>
            </thead>
            <tbody>
              ${loans.length ? loans.map(loan => `
                <tr>
                  <td>
                    <a class="link" href="#/laptops/${loan.laptop?.id}">
                      <strong>${escapeHtml(loan.laptop?.service_tag || '—')}</strong>
                    </a>
                    <small style="color:var(--muted)"> · ${escapeHtml(loan.laptop?.marca || '')} ${escapeHtml(loan.laptop?.modelo || '')}</small>
                  </td>
                  <td>${escapeHtml(loan.fecha_entrega)}</td>
                  <td>${escapeHtml(loan.fecha_devolucion || 'Indefinido')}</td>
                  <td>
                    <span class="badge ${badgeColorForState(loan.estado)}">
                      ${escapeHtml(loan.estado)}
                    </span>
                  </td>
                  <td class="row-actions">
                    <button class="icon-btn" type="button" onclick="abrirActaPDF(${loan.id})" title="Descargar / Ver Acta Oficial" aria-label="Ver Acta Oficial">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    </button>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="5" class="empty">Este colaborador no tiene historial de préstamos.</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </section>
    `;
  };

  // =========================================================================
  // VIEW: ACCESSORIES / ACCESORIOS
  // =========================================================================
  views.accessories = function () {
    const user = store.getCurrentUser();
    const accessories = store.getAccessories();
    const loans = store.getLoans();

    // Calcular cuántos de cada accesorio están prestados
    const assignedCounts = {};
    loans.forEach(loan => {
      if (loan.estado === 'Activo' && Array.isArray(loan.accessories)) {
        loan.accessories.forEach(acc => {
          assignedCounts[acc.accessory_id] = (assignedCounts[acc.accessory_id] || 0) + 1;
        });
      }
    });

    let totalAcc = 0;
    let totalAssigned = 0;
    let lowStockCount = 0;
    const lowStockAlerts = [];

    const items = accessories.map(a => {
      const assigned = assignedCounts[a.id] || 0;
      const available = Math.max(0, a.cantidad_total - assigned);
      totalAcc += a.cantidad_total;
      totalAssigned += assigned;
      if (available <= 2 && a.estado !== 'Baja') {
        lowStockCount += 1;
        lowStockAlerts.push({ nombre: a.nombre, tipo: a.tipo, available, total: a.cantidad_total });
      }
      return { ...a, assigned, available };
    });

    const types = [...new Set(accessories.map(a => a.tipo))];

    return `
      <section class="metrics">
        <article>
          <span>Total accesorios</span>
          <strong>${totalAcc}</strong>
          <small style="color:var(--muted)">En inventario global</small>
        </article>
        <article>
          <span>Disponibles en almacén</span>
          <strong style="color:var(--success)">${totalAcc - totalAssigned}</strong>
          <small style="color:var(--muted)">Listos para asignación</small>
        </article>
        <article>
          <span>Asignados / Prestados</span>
          <strong style="color:var(--primary)">${totalAssigned}</strong>
          <small style="color:var(--muted)">En poder de colaboradores</small>
        </article>
        <article>
          <span>Alertas de stock bajo</span>
          <strong style="color:${lowStockCount > 0 ? 'var(--danger)' : 'var(--muted)'}">${lowStockCount}</strong>
          <small style="color:var(--muted)">Artículos con ≤ 2 unidades</small>
        </article>
      </section>

      ${lowStockCount > 0 ? `
        <div class="notice warning" style="margin-bottom:22px">
          <div>
            <strong style="display:inline-flex;align-items:center;gap:6px">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Alerta de Stock Mínimo en Almacén
            </strong>
            <p>
              Las siguientes referencias tienen pocas unidades disponibles para asignación:
              ${lowStockAlerts.map(al => `
                <span class="badge ${al.available === 0 ? 'red' : 'amber'}" style="margin:2px 4px">
                  ${escapeHtml(al.nombre)}: ${al.available} disp. (de ${al.total})
                </span>
              `).join('')}
              · Se recomienda reposición de suministros.
            </p>
          </div>
        </div>
      ` : ''}

      <section class="toolbar">
        <div class="filters">
          <input class="search" data-table-search="accessories-table" placeholder="Buscar por accesorio o tipo">
          <select data-table-filter="accessories-table" data-column="1">
            <option value="">Todos los tipos</option>
            ${types.map(t => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join('')}
          </select>
          <select data-table-filter="accessories-table" data-column="2">
            <option value="">Todos los estados</option>
            <option value="Disponible">Disponible</option>
            <option value="Baja">Baja</option>
          </select>
        </div>
        ${user.role === 'admin' ? `
          <button class="btn primary" onclick="abrirModal('modalAccessory')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nuevo accesorio
          </button>
        ` : ''}
      </section>

      <section class="panel">
        <div class="table-scroll">
          <table id="accessories-table">
            <thead>
              <tr>
                <th data-sort>Accesorio</th>
                <th data-sort>Tipo</th>
                <th data-sort>Estado</th>
                <th>Total</th>
                <th>Disponibles</th>
                <th>Prestados</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${items.length ? items.map(a => `
                <tr>
                  <td><strong>${escapeHtml(a.nombre)}</strong></td>
                  <td><span class="badge ${badgeColorForState(a.tipo)}">${escapeHtml(a.tipo)}</span></td>
                  <td><span class="badge ${a.estado === 'Disponible' ? 'green' : 'red'}">${escapeHtml(a.estado)}</span></td>
                  <td><b>${a.cantidad_total}</b></td>
                  <td><span style="color:var(--success);font-weight:600">${a.available}</span></td>
                  <td><span style="color:var(--primary);font-weight:600">${a.assigned}</span></td>
                  <td class="row-actions">
                    ${user.role === 'admin' ? `
                      <button class="icon-btn" type="button" onclick="editarAccesorio(${a.id})" title="Editar accesorio">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button class="icon-btn danger" type="button" onclick="eliminarAccesorio(${a.id}, '${escapeHtml(a.nombre)}')" title="Eliminar accesorio">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    ` : '<span style="color:var(--muted)">—</span>'}
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="7" class="empty">No hay accesorios en almacén.</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
        <div class="pagination" data-pagination="accessories-table"></div>
      </section>
    `;
  };

  // =========================================================================
  // VIEW: INCIDENTS / INCIDENCIAS
  // =========================================================================
  views.incidents = function () {
    const user = store.getCurrentUser();
    const incidents = store.getIncidents();

    return `
      <section class="toolbar">
        <input class="search" data-table-search="incidents-table" placeholder="Buscar por equipo, categoría o prioridad">
        ${user.role === 'admin' ? `
          <button class="btn primary" onclick="abrirModal('modalIncident')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nueva incidencia
          </button>
        ` : ''}
      </section>

      <section class="panel">
        <div class="table-scroll">
          <table id="incidents-table">
            <thead>
              <tr>
                <th>Equipo</th>
                <th>Categoría</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Técnico asignado</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${incidents.length ? incidents.map(item => `
                <tr>
                  <td>
                    <a class="link" href="#/laptops/${item.laptop?.id}">
                      <strong>${escapeHtml(item.laptop?.service_tag || '—')}</strong>
                    </a>
                  </td>
                  <td>${escapeHtml(item.category)}</td>
                  <td><span class="badge ${badgeColorForState(item.priority)}">${escapeHtml(item.priority)}</span></td>
                  <td><span class="badge ${badgeColorForState(item.status)}">${escapeHtml(item.status)}</span></td>
                  <td>${escapeHtml(item.technician?.name || 'Sin asignar')}</td>
                  <td>${escapeHtml(item.created_at)}</td>
                  <td class="row-actions">
                    ${user.role === 'admin' ? `
                      <button class="btn secondary" style="font-size:12px;padding:4px 8px" onclick="gestionarIncidencia(${item.id})">Gestionar</button>
                    ` : '<span style="color:var(--muted)">—</span>'}
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="7" class="empty">No hay incidencias registradas en el sistema.</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </section>
    `;
  };

  // =========================================================================
  // VIEW: MAINTENANCE / MANTENIMIENTO
  // =========================================================================
  views.maintenance = function () {
    const user = store.getCurrentUser();
    const items = store.getMaintenances();
    const techs = store.getTechnicians();

    // Estadísticas por técnico
    const techStats = techs.map(t => {
      const records = items.filter(m => Number(m.technician_id) === Number(t.id));
      const pending = records.filter(m => m.status !== 'Finalizado').length;
      const finished = records.filter(m => m.status === 'Finalizado').length;
      const totalHours = records.reduce((acc, cur) => acc + (Number(cur.hours_spent) || 0), 0);
      const avgHours = records.length ? (totalHours / records.length).toFixed(1) : '0';
      return {
        tech: t,
        total: records.length,
        pending,
        finished,
        avg: avgHours
      };
    });

    return `
      <section class="toolbar">
        <div>
          <h2>Gestión de Mantenimientos</h2>
          <p>Seguimiento de reparaciones, costos y asignación de técnicos.</p>
        </div>
        ${user.role === 'admin' ? `
          <div class="toolbar-actions">
            <button class="btn secondary" onclick="abrirModal('modalTechniciansList')">Técnicos</button>
            <button class="btn primary" onclick="abrirModal('modalMaintenance')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Nuevo mantenimiento
            </button>
          </div>
        ` : ''}
      </section>

      <section class="panel">
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Equipo</th>
                <th>Técnico</th>
                <th>Estado</th>
                <th>Fecha Ingreso</th>
                <th>Entrega Estimada</th>
                <th>Horas</th>
                <th>Costo ($)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${items.length ? items.map(item => `
                <tr>
                  <td>
                    <a class="link" href="#/laptops/${item.laptop?.id}">
                      <strong>${escapeHtml(item.laptop?.service_tag || '—')}</strong>
                    </a>
                  </td>
                  <td>${escapeHtml(item.technician?.name || 'Sin asignar')}</td>
                  <td><span class="badge ${badgeColorForState(item.status)}">${escapeHtml(item.status)}</span></td>
                  <td>${escapeHtml(item.received_at)}</td>
                  <td>${escapeHtml(item.estimated_delivery || '—')}</td>
                  <td>${item.hours_spent || 0} hrs</td>
                  <td>$${Number(item.repair_cost || 0).toFixed(2)}</td>
                  <td class="row-actions">
                    ${user.role === 'admin' ? `
                      <button class="btn secondary" style="font-size:12px;padding:4px 8px" onclick="gestionarMantenimiento(${item.id})">Gestionar</button>
                    ` : '<span style="color:var(--muted)">—</span>'}
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="8" class="empty">No hay registros de mantenimiento activos.</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </section>

      <section class="panel">
        <div class="panel-title">
          <div>
            <h2>Estadísticas por técnico</h2>
            <p>Métricas de desempeño y carga de trabajo</p>
          </div>
        </div>
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Técnico</th>
                <th>Total Realizados</th>
                <th>Pendientes</th>
                <th>Finalizados</th>
                <th>Horas Promedio</th>
              </tr>
            </thead>
            <tbody>
              ${techStats.map(stat => `
                <tr>
                  <td>
                    <strong>${escapeHtml(stat.tech.name)}</strong>
                    ${!stat.tech.active ? '<span class="badge red">Inactivo</span>' : ''}
                  </td>
                  <td>${stat.total}</td>
                  <td><span class="badge amber">${stat.pending}</span></td>
                  <td><span class="badge green">${stat.finished}</span></td>
                  <td>${stat.avg} hrs</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
    `;
  };

  // =========================================================================
  // VIEW: USERS / USUARIOS
  // =========================================================================
  views.users = function () {
    const user = store.getCurrentUser();
    const users = store.getUsers();
    const employees = store.getEmployees();

    return `
      <section class="toolbar">
        <input class="search" data-table-search="users-table" placeholder="Buscar por nombre de usuario o rol">
        ${user.role === 'admin' ? `
          <button class="btn primary" onclick="abrirModal('modalUser')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nuevo usuario
          </button>
        ` : ''}
      </section>

      <section class="panel">
        <div class="table-scroll">
          <table id="users-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Colaborador vinculado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(acc => {
                const linked = employees.find(e => Number(e.id) === Number(acc.employee_id));
                const isCurrent = acc.username === user.username;
                return `
                  <tr>
                    <td>
                      <strong>${escapeHtml(acc.username)}</strong>
                      ${isCurrent ? '<span class="badge green" style="margin-left:6px">Tú (Sesión actual)</span>' : ''}
                    </td>
                    <td>
                      <span class="badge ${acc.role === 'admin' ? 'green' : 'amber'}">
                        ${acc.role === 'admin' ? 'Administrador' : 'Visitante'}
                      </span>
                    </td>
                    <td>
                      ${linked ? `
                        <a class="link" href="#/employees/${linked.id}">${escapeHtml(linked.nombre)}</a>
                        <small style="color:var(--muted)"> (${escapeHtml(linked.cedula)})</small>
                      ` : '<span style="color:var(--muted)">— Sin vincular</span>'}
                    </td>
                    <td class="row-actions">
                      <button class="icon-btn" type="button" title="Editar usuario" onclick="editarUsuario(${acc.id})">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      ${!isCurrent ? `
                        <button class="icon-btn danger" type="button" title="Eliminar usuario" onclick="eliminarUsuario(${acc.id}, '${escapeHtml(acc.username)}')">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      ` : ''}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
        <div class="pagination" data-pagination="users-table"></div>
      </section>
    `;
  };

  // =========================================================================
  // VIEW: AUDIT / AUDITORÍA
  // =========================================================================
  views.audit = function () {
    const logs = store.getAuditLogs();
    const modules = [...new Set(logs.map(l => l.modulo))];
    const actions = [...new Set(logs.map(l => l.accion))];

    return `
      <section class="panel">
        <div class="filters" style="display:flex;flex-wrap:wrap;gap:10px;align-items:center">
          <input type="date" id="audit-filter-date" title="Filtrar por fecha" style="width:auto" onchange="filtrarAuditoria()">
          <select id="audit-filter-module" style="width:auto" onchange="filtrarAuditoria()">
            <option value="">Todos los módulos</option>
            ${modules.map(m => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join('')}
          </select>
          <select id="audit-filter-action" style="width:auto" onchange="filtrarAuditoria()">
            <option value="">Todas las acciones</option>
            ${actions.map(a => `<option value="${escapeHtml(a)}">${escapeHtml(a)}</option>`).join('')}
          </select>
          <input class="search" id="audit-filter-q" placeholder="Buscar por palabra clave, usuario o ID..." style="flex:1;min-width:200px" oninput="filtrarAuditoria()">
          <button class="btn secondary" type="button" onclick="limpiarFiltrosAuditoria()">Limpiar</button>
        </div>
      </section>

      <section class="panel">
        <div class="table-scroll">
          <table id="audit-table">
            <thead>
              <tr>
                <th>Fecha y hora</th>
                <th>Usuario</th>
                <th>Módulo</th>
                <th>Acción</th>
                <th>Tabla / ID</th>
                <th>Valores anteriores</th>
                <th>Valores nuevos</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody id="audit-table-body">
              ${views.renderAuditRows(logs)}
            </tbody>
          </table>
        </div>
      </section>
    `;
  };

  views.renderAuditRows = function (logs) {
    if (!logs.length) {
      return `<tr><td colspan="8" class="empty">No hay registros de auditoría que coincidan con los filtros aplicados.</td></tr>`;
    }
    return logs.map(log => `
      <tr>
        <td style="white-space:nowrap">${escapeHtml(log.fecha_hora)}</td>
        <td><strong>${escapeHtml(log.usuario)}</strong></td>
        <td><span class="badge blue">${escapeHtml(log.modulo)}</span></td>
        <td><span class="badge amber">${escapeHtml(log.accion)}</span></td>
        <td><code>${escapeHtml(log.tabla_afectada)} #${log.registro_id || '—'}</code></td>
        <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis"><small style="color:var(--muted);font-family:monospace">${escapeHtml(log.valores_anteriores || '—')}</small></td>
        <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis"><small style="color:var(--text-secondary);font-family:monospace">${escapeHtml(log.valores_nuevos || '—')}</small></td>
        <td><code>${escapeHtml(log.direccion_ip || '—')}</code></td>
      </tr>
    `).join('');
  };

  // =========================================================================
  // VIEW: DIAGNOSTICS / DIAGNÓSTICO N8N
  // =========================================================================
  views.diagnostics = function () {
    const stats = store.getStats();

    return `
      <section class="metrics">
        <article>
          <span>Webhooks simulados</span>
          <strong>14</strong>
          <small style="color:var(--muted)">Historial reciente</small>
        </article>
        <article>
          <span>Entregas procesadas</span>
          <strong>${stats.loaned}</strong>
          <small style="color:var(--muted)">Altas y préstamos</small>
        </article>
        <article>
          <span>Devoluciones</span>
          <strong>${store.getLoans().filter(l => l.estado === 'Devuelto').length}</strong>
          <small style="color:var(--muted)">Retornos y recepciones</small>
        </article>
        <article>
          <span>Modo Demo</span>
          <strong style="font-size:16px;line-height:1.4;margin:auto 0;color:var(--success)">Activo (Offline)</strong>
          <small style="color:var(--muted)">Sin dependencia de servidor</small>
        </article>
      </section>

      <section class="chart-grid" style="margin-bottom:24px">
        <!-- Conexión Saliente -->
        <article class="panel" style="display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <div class="panel-title" style="margin-bottom:14px">
              <div>
                <h2>Conexión Saliente (IA Specs)</h2>
                <p>Consulta especificaciones técnicas de hardware hacia n8n.</p>
              </div>
              <span class="badge green">Simulador Activo</span>
            </div>

            <dl style="margin-top:14px;gap:10px">
              <dt>Servicio de IA</dt>
              <dd><code>Motor Gemini AI Local (Emulado)</code></dd>

              <dt>Base de conocimiento</dt>
              <dd><span class="badge green">Pre-hecha + Generador Heurístico</span></dd>

              <dt>Latencia promedio</dt>
              <dd>~420 ms (Respuesta ultrarrápida)</dd>
            </dl>
          </div>

          <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border)">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
              <button id="btnPingN8n" class="btn primary" type="button" onclick="probarConexionN8N()">
                <span>Probar Conexión (Ping)</span>
              </button>
              <div id="pingResult" style="display:none;align-items:center;gap:8px">
                <span id="pingBadge" class="badge green">HTTP 200 OK</span>
                <small id="pingMsg" style="color:var(--muted);font-weight:600">Latencia: 38ms (Simulado)</small>
              </div>
            </div>
          </div>
        </article>

        <!-- Conexión Entrante -->
        <article class="panel" style="display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <div class="panel-title" style="margin-bottom:14px">
              <div>
                <h2>Webhook Entrante (Outlook / n8n Sync)</h2>
                <p>Recepción de entregas y devoluciones desde formularios externos.</p>
              </div>
              <span class="badge green">Activo</span>
            </div>

            <dl style="margin-top:14px;gap:10px">
              <dt>Endpoint Local</dt>
              <dd><code>/api/integrations/webhook/outlook</code></dd>

              <dt>Modo</dt>
              <dd><span class="badge blue">In-Browser Demo (LocalStorage)</span></dd>

              <dt>Header de Seguridad</dt>
              <dd><code>X-Webhook-Secret: **********</code></dd>
            </dl>
          </div>

          <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border)">
            <button class="btn secondary" type="button" onclick="toast('Endpoint webhook emulado para el entorno de demostración.')">
              Ver especificación de Payload
            </button>
          </div>
        </article>
      </section>
    `;
  };

  // =========================================================================
  // VIEW: ABOUT / ACERCA DEL SISTEMA
  // =========================================================================
  views.about = function () {
    const stats = store.getStats().aboutStats;

    const systemInfo = [
      ['Versión del Sistema', 'V3.1 Demo (GitHub Edition)'],
      ['Arquitectura', 'Single Page Application (SPA)'],
      ['Almacenamiento', 'LocalStorage + Persistencia en Navegador'],
      ['Motor de IA', 'Gemini AI Emulado (Base de conocimiento local)'],
      ['Compatibilidad', 'GitHub Pages, Servidores Estáticos, Offline'],
      ['Licencia', 'MIT Open Source']
    ];

    return `
      <section class="about-hero panel">
        <div class="about-logo">◆</div>
        <div>
          <p class="eyebrow">IT ASSET MANAGEMENT</p>
          <h2>Sistema de Gestión de Activos Tecnológicos</h2>
          <p>Una plataforma moderna para administrar el ciclo de vida de tus equipos, asignaciones, mantenimientos e incidencias.</p>
        </div>
        <span class="about-status"><i></i> Versión Demo GitHub</span>
      </section>

      <section class="about-grid">
        <article class="panel about-section">
          <div class="about-section-title">
            <span>◈</span>
            <div><p class="eyebrow">PLATAFORMA</p><h2>Información del sistema</h2></div>
          </div>
          <dl class="about-info">
            ${systemInfo.map(([label, val]) => `
              <div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(val)}</dd></div>
            `).join('')}
          </dl>
        </article>

        <article class="panel about-section developer-card">
          <div class="about-section-title">
            <span>◉</span>
            <div><p class="eyebrow">DESARROLLO</p><h2>Joel Domínguez</h2></div>
          </div>
          <p class="developer-role">Desarrollador Full Stack & Especialista TI</p>
          <p class="developer-copy">Especializado en soluciones tecnológicas empresariales, automatización, gestión de activos IT e integración de Inteligencia Artificial.</p>
          <div class="skill-badges">
            <span>IT Support</span>
            <span>IT Asset Management</span>
            <span>FastAPI</span>
            <span>MySQL</span>
            <span>Automatización n8n</span>
            <span>Google Gemini AI</span>
          </div>
        </article>
      </section>

      <section class="panel about-section">
        <div class="about-section-title">
          <span>⌁</span>
          <div><p class="eyebrow">ECOSISTEMA</p><h2>Tecnologías utilizadas</h2></div>
        </div>
        <div class="technology-grid">
          <span><b>⚡</b>FastAPI</span>
          <span><b>SA</b>SQLAlchemy</span>
          <span><b>◫</b>MySQL</span>
          <span><b>5</b>HTML5</span>
          <span><b>3</b>CSS3 Moderno</span>
          <span><b>JS</b>JavaScript Puro</span>
          <span><b>∞</b>n8n Workflows</span>
          <span><b>✦</b>Google Gemini AI</span>
          <span><b>⎔</b>GitHub Pages</span>
        </div>
      </section>

      <section class="panel about-section">
        <div class="about-section-title">
          <span>▦</span>
          <div><p class="eyebrow">EN TIEMPO REAL</p><h2>Estadísticas del sistema</h2></div>
        </div>
        <div class="about-stats">
          <article><strong>${stats.assets}</strong><span>Total de activos</span></article>
          <article><strong>${stats.users}</strong><span>Usuarios</span></article>
          <article><strong>${stats.maintenance}</strong><span>En mantenimiento</span></article>
          <article><strong>${stats.available}</strong><span>Disponibles</span></article>
          <article><strong>${stats.assigned}</strong><span>Asignados</span></article>
          <article><strong>${stats.technicians}</strong><span>Técnicos</span></article>
          <article><strong>${stats.incidents}</strong><span>Incidencias</span></article>
          <article><strong>${stats.audit_logs}</strong><span>Auditorías</span></article>
        </div>
      </section>

      <footer class="about-footer">
        © 2026 Joel Domínguez <span>•</span> Sistema de Gestión de Préstamos IT V3 (Edición Demo GitHub).
      </footer>
    `;
  };

  // =========================================================================
  // VIEW: LOGIN / ACCESO AL SISTEMA
  // =========================================================================
  views.login = function () {
    return `
      <div class="login-page" style="margin:-24px;min-height:calc(100vh - 60px);display:flex;align-items:center;justify-content:center">
        <main class="login-shell" style="max-width:920px;width:100%">
          <section class="login-showcase" aria-hidden="true">
            <div class="login-orb orb-one"></div>
            <div class="login-orb orb-two"></div>
            <div class="login-brand"><span class="login-mark">◆</span><span>IT ASSET MANAGER</span></div>
            <div class="login-copy">
              <p class="login-kicker">GESTIÓN TECNOLÓGICA</p>
              <h1>Tu inventario,<br>siempre bajo control.</h1>
              <p>Administra equipos, préstamos, mantenimiento e incidencias desde un solo lugar.</p>
            </div>
            <div class="login-benefits">
              <span>Inventario centralizado</span>
              <span>Control de préstamos</span>
              <span>Historial auditable</span>
            </div>
          </section>

          <section class="login-card" aria-labelledby="login-title">
            <div class="login-card-header">
              <div class="login-mark mobile-mark">◆</div>
              <p class="login-kicker">DEMO GITHUB</p>
              <h2 id="login-title">Inicia sesión</h2>
              <p>Accede con credenciales o prueba en modo visitante.</p>
            </div>

            <form onsubmit="handleLoginSubmit(event)">
              <div class="form-group">
                <label for="login-username">Usuario</label>
                <div class="login-input">
                  <span aria-hidden="true">◉</span>
                  <input id="login-username" name="username" autocomplete="username" value="admin" placeholder="Tu usuario" required autofocus>
                </div>
              </div>
              <div class="form-group">
                <label for="login-password">Contraseña</label>
                <div class="login-input">
                  <span aria-hidden="true">⌁</span>
                  <input id="login-password" type="password" name="password" value="admin123" autocomplete="current-password" placeholder="Tu contraseña" required>
                </div>
              </div>
              <button class="btn btn-primary login-button" type="submit" style="width:100%">
                <span>Entrar al sistema</span>
                <span aria-hidden="true">→</span>
              </button>
            </form>

            <button class="visitor-login-button" type="button" onclick="handleVisitorLogin()" style="width:100%;margin-top:10px">
              <span aria-hidden="true">◉</span> Entrar como visitante
            </button>

            <p class="login-help">Acceso seguro para administradores (admin / admin123) y visitantes.</p>
          </section>
        </main>
      </div>
    `;
  };

  window.views = views;
})();

