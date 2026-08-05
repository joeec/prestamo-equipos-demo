const PAGE_SIZE = 8;

const create = (tag, options = {}) => Object.assign(document.createElement(tag), options);
const escapeHtml = value => String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);

function toast(message, type = 'success') {
  let stack = document.querySelector('.toast-stack');
  if (!stack) { stack = create('div', { className: 'toast-stack' }); document.body.append(stack); }
  const item = create('div', { className: `toast ${type}` });
  item.append(create('strong', { textContent: type === 'success' ? '✓' : '!' }), document.createTextNode(` ${message}`));
  stack.append(item);
  window.setTimeout(() => item.remove(), 3300);
}

function setButtonLoading(button, loading, label = 'Guardando…') {
  if (!button) return;
  if (loading) {
    button.dataset.originalLabel ??= button.textContent.trim();
    button.disabled = true;
    button.classList.add('is-loading');
    button.setAttribute('aria-busy', 'true');
    button.replaceChildren(create('span', { className: 'button-spinner', 'aria-hidden': 'true' }), document.createTextNode(` ${label}`));
    return;
  }
  button.disabled = false;
  button.classList.remove('is-loading');
  button.removeAttribute('aria-busy');
  if (button.dataset.originalLabel) button.textContent = button.dataset.originalLabel;
}

function showPageLoader(label = 'Cargando…') {
  let loader = document.getElementById('page-loader');
  if (!loader) {
    loader = create('div', { id: 'page-loader', className: 'page-loader', role: 'status' });
    loader.append(create('span', { className: 'page-loader-spinner', 'aria-hidden': 'true' }), create('span', { className: 'page-loader-label' }));
    document.body.append(loader);
  }
  loader.querySelector('.page-loader-label').textContent = label;
  loader.classList.add('active');
}

function syncModalState() {
  document.body.classList.toggle('modal-open', Boolean(document.querySelector('.modal.active')));
}

function abrirModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  if (modal.parentElement !== document.body) document.body.append(modal);
  modal.classList.add('active');
  syncModalState();
  modal.querySelectorAll('.signature-canvas').forEach(canvas => canvas.dispatchEvent(new Event('signature:visible')));
}

function cerrarModal(id) {
  document.getElementById(id)?.classList.remove('active');
  syncModalState();
}

function abrirQR(url, label) {
  const [name, details = ''] = label.split(' · ST: ');
  const [tag, serial = ''] = details.split(' · SN: ');
  const modal = create('div', { className: 'modal active qr-popup' });
  const content = create('div', { className: 'modal-content' });
  const header = create('div', { className: 'modal-header' });
  const heading = create('div');
  heading.append(create('h2', { textContent: name }), create('p'));
  const metadata = heading.querySelector('p');
  metadata.append(create('span', { className: 'qr-service-tag', textContent: `Service Tag: ${tag}` }));
  if (serial) metadata.append(document.createTextNode(' '), create('span', { className: 'qr-serial', textContent: `Serial: ${serial}` }));
  const closeButton = create('button', { className: 'close', type: 'button', textContent: '×' });
  header.append(heading, closeButton);
  const imageBox = create('div', { className: 'qr-popup-image' });
  imageBox.append(create('img', { src: url, alt: `Código QR de ${label}` }));
  const actions = create('div', { className: 'modal-actions' });
  const copyButton = create('button', { className: 'btn secondary', type: 'button', textContent: 'Copiar enlace' });
  const printButton = create('button', { className: 'btn primary', type: 'button', textContent: 'Imprimir' });
  actions.append(copyButton, printButton); content.append(header, imageBox, actions); modal.append(content); document.body.append(modal); syncModalState();
  const close = () => { modal.remove(); syncModalState(); };
  closeButton.onclick = close; modal.addEventListener('click', event => { if (event.target === modal) close(); });
  copyButton.onclick = async () => {
    const detailUrl = new URL(url.replace(/\/qr(?:\?.*)?$/, ''), location.origin).href;
    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) await navigator.clipboard.writeText(detailUrl);
      else {
        const helper = create('textarea', { value: detailUrl });
        helper.setAttribute('readonly', '');
        helper.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
        document.body.append(helper); helper.select();
        const copied = document.execCommand('copy'); helper.remove();
        if (!copied) throw new Error('copy unavailable');
      }
      toast('Enlace del equipo copiado al portapapeles');
    } catch { toast('No se pudo copiar el enlace. Selecciónalo desde el QR.', 'error'); }
  };
  printButton.onclick = () => {
    const popup = window.open('', '_blank', 'width=500,height=650');
    if (!popup) { toast('El navegador bloqueó la ventana de impresión.', 'error'); return; }
    const imageUrl = new URL(url, location.origin).href;
    popup.document.write(`<title>QR ${escapeHtml(label)}</title><style>body{font-family:Arial;text-align:center;padding:30px}img{width:320px;height:320px}</style><h2>${escapeHtml(label)}</h2><img src="${escapeHtml(imageUrl)}" onload="window.print()">`);
    popup.document.close();
  };
}

function showConfirm(title, message, onAccept) {
  const overlay = create('div', { className: 'confirm-dialog' });
  const card = create('div', { className: 'confirm-card' });
  const actions = create('div', { className: 'confirm-actions' });
  const cancel = create('button', { className: 'btn secondary', type: 'button', textContent: 'Cancelar' });
  const accept = create('button', { className: 'btn primary', type: 'button', textContent: 'Confirmar' });
  card.append(create('h3', { textContent: title }), create('p', { textContent: message })); actions.append(cancel, accept); card.append(actions); overlay.append(card); document.body.append(overlay);
  cancel.onclick = () => overlay.remove(); accept.onclick = () => { overlay.remove(); onAccept(); };
}

function showAlertDialog(title, message, buttonLabel, onAccept) {
  const overlay = create('div', { className: 'confirm-dialog' });
  const card = create('div', { className: 'confirm-card alert-dialog' });
  const actions = create('div', { className: 'confirm-actions' });
  const accept = create('button', { className: 'btn primary', type: 'button', textContent: buttonLabel });
  card.append(create('h3', { textContent: title }), create('p', { textContent: message }));
  actions.append(accept); card.append(actions); overlay.append(card); document.body.append(overlay);
  accept.onclick = () => { overlay.remove(); onAccept?.(); };
}

function confirmarEliminar(nombre, form = document.activeElement?.form) { showConfirm('Eliminar registro', `¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`, () => { showPageLoader('Eliminando…'); form?.submit(); }); return false; }
function confirmarDevolucion(form = document.activeElement?.form) { showConfirm('Confirmar devolución', '¿Deseas finalizar este préstamo?', () => { showPageLoader('Guardando devolución…'); form?.submit(); }); return false; }

function setupSignature(canvas) {
  const hidden = canvas.parentElement.querySelector('input[type=hidden]');
  if (!hidden) return;
  const context = canvas.getContext('2d'); let drawing = false; let lastPoint; let ready = false;
  const resize = () => { const rect = canvas.getBoundingClientRect(); if (!rect.width) return false; canvas.width = rect.width; canvas.height = rect.height; context.lineWidth = 2; context.lineCap = 'round'; context.strokeStyle = '#172033'; ready = true; return true; };
  const point = event => { const rect = canvas.getBoundingClientRect(); return { x: event.clientX - rect.left, y: event.clientY - rect.top }; };
  canvas.addEventListener('signature:visible', () => { if (!ready) resize(); });
  canvas.onpointerdown = event => { if (!ready && !resize()) return; drawing = true; lastPoint = point(event); canvas.setPointerCapture(event.pointerId); };
  canvas.onpointermove = event => { if (!drawing) return; const nextPoint = point(event); context.beginPath(); context.moveTo(lastPoint.x, lastPoint.y); context.lineTo(nextPoint.x, nextPoint.y); context.stroke(); lastPoint = nextPoint; };
  canvas.onpointerup = () => { drawing = false; hidden.value = canvas.toDataURL('image/png'); };
  canvas.parentElement.querySelector('.clear-signature')?.addEventListener('click', () => { if (!ready) resize(); context.clearRect(0, 0, canvas.width, canvas.height); hidden.value = ''; });
}

function setupTable(table) {
  const body = table.tBodies[0]; if (!body) return;
  const rows = [...body.rows].filter(row => !row.querySelector('.empty')); let currentPage = 1;
  const pager = document.querySelector(`[data-pagination="${table.id}"]`);
  const render = () => {
    const visible = rows.filter(row => row.dataset.match !== 'false' && row.dataset.filter !== 'false');
    const pages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE)); currentPage = Math.min(currentPage, pages);
    rows.forEach(row => { row.style.display = 'none'; }); visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).forEach(row => { row.style.display = ''; });
    if (!pager) return; pager.replaceChildren();
    for (let page = 1; page <= pages; page += 1) { const button = create('button', { textContent: page, className: page === currentPage ? 'active' : '' }); button.onclick = () => { currentPage = page; render(); }; pager.append(button); }
  };
  document.querySelectorAll(`[data-table-search="${table.id}"]`).forEach(input => input.addEventListener('input', () => { const query = input.value.toLowerCase(); rows.forEach(row => { row.dataset.match = String(row.innerText).toLowerCase().includes(query); }); currentPage = 1; render(); }));
  document.querySelectorAll(`[data-table-filter="${table.id}"]`).forEach(input => input.addEventListener('change', () => { const column = Number(input.dataset.column); const query = input.value.trim().toLowerCase(); rows.forEach(row => { row.dataset.filter = !query || (row.cells[column]?.textContent || '').trim().toLowerCase() === query; }); currentPage = 1; render(); }));
  render();
}

document.querySelectorAll('.panel,.metrics article').forEach(element => { element.classList.add('skeleton'); window.setTimeout(() => element.classList.remove('skeleton'), 180); });
document.querySelectorAll('.metrics strong').forEach(element => { const target = Number(element.textContent.trim()); if (!Number.isFinite(target)) return; let start; const tick = time => { start ??= time; const progress = Math.min((time - start) / 420, 1); element.textContent = Math.round(target * (1 - (1 - progress) ** 3)); if (progress < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
document.querySelectorAll('.modal').forEach(modal => modal.addEventListener('click', event => { if (event.target === modal) { modal.classList.remove('active'); syncModalState(); } }));
document.addEventListener('keydown', event => { if (event.key === 'Escape') { document.querySelectorAll('.modal.active').forEach(modal => modal.classList.remove('active')); syncModalState(); } });
document.querySelector('.menu-toggle')?.addEventListener('click', () => document.getElementById('sidebar')?.classList.toggle('open'));
document.querySelector('.theme-toggle')?.addEventListener('click', () => { document.body.classList.toggle('dark'); localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light'); });
if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
document.querySelectorAll('.menu a').forEach(link => {
  const matches = link.pathname === '/' ? location.pathname === '/' : location.pathname === link.pathname || location.pathname.startsWith(`${link.pathname}/`);
  if (matches) { link.classList.add('active'); link.setAttribute('aria-current', 'page'); }
});
document.querySelectorAll('form').forEach(form => form.addEventListener('submit', event => {
  if (form.hasAttribute('onsubmit') || !form.checkValidity()) return;
  if (!form.dataset.confirmed) sessionStorage.setItem('flash', 'Cambios guardados correctamente');
  const submitter = event.submitter || form.querySelector('button[type="submit"], button:not([type])');
  setButtonLoading(submitter, true, 'Guardando…');
  showPageLoader('Guardando cambios…');
}));
const savedLaptopForm = document.getElementById('laptop-form-error');
if (savedLaptopForm || document.getElementById('laptopDeleteError')) sessionStorage.removeItem('flash');
if (sessionStorage.getItem('flash')) { toast(sessionStorage.getItem('flash')); sessionStorage.removeItem('flash'); }
if (savedLaptopForm) {
  showAlertDialog('Service Tag ya registrado', 'Ya existe un equipo con ese Service Tag. Revisa los datos y utiliza uno diferente.', 'Revisar datos', () => abrirModal('modalLaptop'));
}
document.querySelectorAll('.signature-canvas').forEach(setupSignature);
document.querySelectorAll('table[id]').forEach(setupTable);
