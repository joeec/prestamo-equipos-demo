/**
 * IT Asset Manager V3 - SPA Hash Router
 * Bulletproof client-side routing for GitHub Pages & static hosting.
 */

(() => {
  'use strict';

  function parseHash() {
    const raw = location.hash.replace(/^#\/?/, '') || '';
    const [pathPart, queryPart] = raw.split('?');
    const segments = pathPart.split('/').filter(Boolean);
    const query = {};

    if (queryPart) {
      new URLSearchParams(queryPart).forEach((val, key) => {
        query[key] = val;
      });
    }

    return {
      raw,
      path: segments[0] || 'dashboard',
      param: segments[1] || null,
      query
    };
  }

  function updateSidebarState(path) {
    const user = store.getCurrentUser();

    // Actualizar enlaces activos
    document.querySelectorAll('.menu a').forEach(link => {
      const href = link.getAttribute('href') || '';
      const linkPath = href.replace(/^#\/?/, '').split('?')[0].split('/')[0] || 'dashboard';
      const isActive = linkPath === path || (path === 'dashboard' && linkPath === '');
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    // Mostrar/ocultar secciones exclusivas de admin
    const adminSections = document.querySelectorAll('.nav-section-admin');
    adminSections.forEach(sec => {
      sec.style.display = user.role === 'admin' ? '' : 'none';
    });

    // Actualizar pie de sidebar
    const userAvatar = document.querySelector('.sidebar-foot .user-avatar');
    const userCopy = document.querySelector('.sidebar-foot .user-copy');
    if (userAvatar) userAvatar.textContent = (user.username || 'A').charAt(0).toUpperCase();
    if (userCopy) {
      userCopy.innerHTML = `<strong>${user.username}</strong><small><i></i>${user.role === 'admin' ? 'Administrador' : 'Visitante'}</small>`;
    }

    // Actualizar botón de alternar rol en topbar
    const roleToggleBtn = document.getElementById('btnRoleToggle');
    if (roleToggleBtn) {
      roleToggleBtn.textContent = user.role === 'admin' ? '👤 Modo Admin' : '👀 Modo Visitante';
      roleToggleBtn.className = user.role === 'admin' ? 'btn-role-admin' : 'btn-role-visitor';
    }
  }

  function handleRoute() {
    const { path, param, query } = parseHash();
    const appContent = document.getElementById('app-content');
    const headingEl = document.getElementById('page-heading');
    const eyebrowEl = document.getElementById('page-eyebrow');
    const user = store.getCurrentUser();
    const sidebar = document.getElementById('sidebar');

    if (sidebar) sidebar.classList.remove('open');

    // Manejo de vista Login especial
    if (path === 'login') {
      document.body.classList.add('is-login-screen');
      appContent.innerHTML = window.views.login();
      if (headingEl) headingEl.textContent = 'Iniciar Sesión';
      if (eyebrowEl) eyebrowEl.textContent = 'ACCESO';
      window.scrollTo(0, 0);
      return;
    }

    document.body.classList.remove('is-login-screen');

    // Restricción de permisos para visitante
    const adminOnlyRoutes = ['users', 'audit', 'diagnostics'];
    if (user.role === 'visitor' && adminOnlyRoutes.includes(path)) {
      location.hash = '#/dashboard';
      if (window.toast) window.toast('Acceso restringido para el rol de visitante.', 'error');
      return;
    }

    updateSidebarState(path);

    // Mapeo de vistas
    let html = '';
    let title = 'Resumen';
    let eyebrow = user.role === 'admin' ? 'PANEL DE ADMINISTRACIÓN' : 'MI PORTAL';

    switch (path) {
      case 'dashboard':
        title = 'Resumen';
        html = window.views.dashboard();
        break;

      case 'loans':
        title = 'Entrega de laptops';
        html = window.views.loans();
        break;

      case 'laptops':
        if (param) {
          title = 'Ficha Técnica del Equipo';
          eyebrow = 'INVENTARIO DE HARDWARE';
          html = window.views.laptop_detail(param);
        } else {
          title = 'Equipos e Inventario';
          html = window.views.laptops();
        }
        break;

      case 'employees':
        if (param) {
          title = 'Perfil de colaborador';
          eyebrow = 'RECURSOS HUMANOS';
          html = window.views.employee_detail(param);
        } else {
          title = 'Colaboradores y Personas';
          html = window.views.employees();
        }
        break;

      case 'accessories':
        title = 'Accesorios y Periféricos';
        html = window.views.accessories();
        break;

      case 'incidents':
        title = 'Incidencias y Reportes';
        html = window.views.incidents();
        break;

      case 'maintenance':
        title = 'Mantenimiento y Soporte Técnico';
        html = window.views.maintenance();
        break;

      case 'users':
        title = 'Usuarios y Accesos';
        html = window.views.users();
        break;

      case 'audit':
        title = 'Bitácora de Auditoría';
        html = window.views.audit();
        break;

      case 'diagnostics':
        title = 'Diagnóstico n8n y Webhooks';
        html = window.views.diagnostics();
        break;

      case 'about':
        title = 'Acerca del sistema';
        eyebrow = 'INFORMACIÓN Y DESARROLLO';
        html = window.views.about();
        break;

      default:
        title = 'Resumen';
        html = window.views.dashboard();
        break;
    }

    if (headingEl) headingEl.textContent = title;
    if (eyebrowEl) eyebrowEl.textContent = eyebrow;
    document.title = `${title} · IT Asset Manager V3`;

    appContent.innerHTML = html;
    window.scrollTo(0, 0);

    // Inicializar módulos interactivos en la vista renderizada
    document.querySelectorAll('table[id]').forEach(t => {
      if (window.setupTable) window.setupTable(t);
    });

    // Contador numérico animado en tarjetas
    document.querySelectorAll('.metrics strong').forEach(element => {
      const target = Number(element.textContent.trim().split(' ')[0]);
      if (!Number.isFinite(target)) return;
      let start;
      const tick = time => {
        start ??= time;
        const progress = Math.min((time - start) / 400, 1);
        element.childNodes[0].nodeValue = Math.round(target * (1 - (1 - progress) ** 3));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });

    // Renderizar QR en la vista de detalle de laptop
    if (path === 'laptops' && param) {
      const qrContainer = document.getElementById('laptop-detail-qr');
      if (qrContainer && window.QRCode) {
        qrContainer.replaceChildren();
        const detailUrl = location.href;
        new window.QRCode(qrContainer, {
          text: detailUrl,
          width: 124,
          height: 124,
          colorDark: '#0f172a',
          colorLight: '#ffffff',
          correctLevel: window.QRCode.CorrectLevel.M
        });
      }
    }

    // Parámetros de consulta para abrir modales automáticamente
    if (path === 'loans') {
      if (query.new === '1') {
        window.setTimeout(() => abrirNuevoPrestamo(query.laptop_id), 100);
      } else if (query.laptop_id) {
        window.setTimeout(() => abrirNuevoPrestamo(query.laptop_id), 100);
      }
    }
  }

  window.addEventListener('hashchange', handleRoute);
  document.addEventListener('DOMContentLoaded', () => {
    if (!location.hash) {
      location.hash = '#/dashboard';
    } else {
      handleRoute();
    }
  });

  window.navigate = function (path) {
    location.hash = `#/${path.replace(/^#\/?/, '')}`;
  };

  window.router = {
    handleRoute,
    parseHash
  };
})();

