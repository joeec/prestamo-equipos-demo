/**
 * IT Asset Manager V3 - Propuesta de IA para Especificaciones de Hardware
 * Interfaz de búsqueda y autocompletado inteligente sin dependencias externas.
 */

(() => {
  'use strict';

  const pendingKey = 'it-loans.pending-ai-components';
  let aiResult = null;
  const byId = id => document.getElementById(id);
  const componentSuggestion = data => data.components_suggestion || {};
  const selectedValue = key => document.querySelector(`[data-ai-choice="${key}"]`)?.value || '';

  function renderPreview(data) {
    const preview = byId('aiPreview');
    const apply = byId('aiApplyButton');
    if (!preview || !apply) return;
    preview.replaceChildren();

    if (!data.encontrado) {
      const warn = document.createElement('div');
      warn.className = 'ai-warning';
      warn.textContent = data.advertencia || 'No se encontraron especificaciones automáticas para este modelo. Puedes registrar el equipo manualmente.';
      preview.append(warn);
      preview.hidden = false;
      apply.hidden = true;
      return;
    }

    if (data.advertencia) {
      const warn = document.createElement('div');
      warn.className = 'ai-warning';
      warn.textContent = data.advertencia;
      preview.append(warn);
    }

    const suggestion = componentSuggestion(data);
    const row = (label, value) => {
      if (value) {
        const element = document.createElement('div');
        element.className = 'ai-preview-row';
        const span = document.createElement('span');
        span.textContent = label;
        const strong = document.createElement('strong');
        strong.textContent = value;
        element.append(span, strong);
        preview.append(element);
      }
    };

    row('Marca', data.marca);
    row('Modelo', [data.familia, data.modelo].filter(Boolean).join(' '));

    const chooser = (label, values, key) => {
      if (!Array.isArray(values) || !values.length) return;
      const labelElement = document.createElement('label');
      labelElement.className = 'ai-preview-row';
      const span = document.createElement('span');
      span.textContent = label;
      labelElement.append(span);
      const select = document.createElement('select');
      select.dataset.aiChoice = key;
      values.forEach(value => {
        const option = document.createElement('option');
        option.value = String(value);
        option.textContent = String(value);
        select.append(option);
      });
      labelElement.append(select);
      preview.append(labelElement);
    };

    chooser('Procesador sugerido', suggestion.processor_options, 'processor');
    row('RAM sugerida', suggestion.ram);
    row('Almacenamiento', suggestion.storage_type);
    row('Pantalla', suggestion.display);
    chooser('Resolución sugerida', suggestion.resolution_options, 'resolution');
    row('Gráfica', suggestion.graphics);
    row('Batería', suggestion.battery);
    row('Sistema Operativo', suggestion.windows);
    if (suggestion.notes) row('Nota técnica', suggestion.notes);

    preview.hidden = false;
    apply.hidden = false;
  }

  window.buscarEspecificacionesIA = async function () {
    const input = byId('aiSearchQuery');
    const button = byId('aiSearchButton');
    const loading = byId('aiLoading');
    const error = byId('aiError');
    const query = input?.value.trim() || '';

    if (query.length < 3) {
      if (error) {
        error.textContent = 'Escribe al menos 3 caracteres para buscar el modelo.';
        error.hidden = false;
      }
      return;
    }

    if (error) error.hidden = true;
    if (loading) loading.hidden = false;
    if (window.setButtonLoading) setButtonLoading(button, true, 'Consultando IA…');

    try {
      const response = await fetch('/api/assets/ai-specifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ search_query: query })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || 'No se pudieron consultar las especificaciones.');
      aiResult = data;
      renderPreview(data);
    } catch (exception) {
      if (error) {
        error.textContent = exception.message || 'No se pudo consultar el servicio de IA.';
        error.hidden = false;
      }
    } finally {
      if (window.setButtonLoading) setButtonLoading(button, false);
      if (loading) loading.hidden = true;
    }
  };

  window.applyAiSpecificationsToComponents = function (suggestion, overwrite = true) {
    const modal = byId('modalComponents');
    if (!modal) return false;
    const names = ['processor', 'generation', 'ram', 'ram_slots', 'ram_type', 'primary_disk', 'secondary_disk', 'storage_capacity', 'storage_type', 'graphics', 'display', 'resolution', 'battery', 'battery_cycles', 'battery_health', 'mac_address', 'ip_address', 'bios', 'tpm', 'windows', 'office', 'antivirus', 'notes'];

    const enhanced = { ...suggestion };
    if (enhanced.resolution && enhanced.display && !enhanced.display.toLowerCase().includes(enhanced.resolution.toLowerCase())) {
      enhanced.display = `${enhanced.display} (${enhanced.resolution})`;
    }

    names.forEach(name => {
      const input = modal.querySelector(`[name="${name}"]`);
      if (!input || enhanced[name] === null || enhanced[name] === undefined || enhanced[name] === '') return;
      if (overwrite || !input.value.trim()) {
        input.value = String(enhanced[name]);
      }
    });

    abrirModal('modalComponents');
    return true;
  };

  window.aplicarEspecificacionesIA = function () {
    if (!aiResult?.encontrado) return;
    const form = byId('laptopCreateForm');
    const suggestion = {
      ...componentSuggestion(aiResult),
      processor: selectedValue('processor') || componentSuggestion(aiResult).processor,
      resolution: selectedValue('resolution') || componentSuggestion(aiResult).resolution
    };

    // Caso 1: Si venimos desde la ficha técnica de un equipo existente (URL contiene #/laptops/ID)
    const hash = location.hash;
    const match = hash.match(/#\/laptops\/(\d+)/);
    if (match && document.getElementById('comp-laptop-id')) {
      cerrarModal('modalLaptopAI');
      window.applyAiSpecificationsToComponents(suggestion, true);
      if (window.toast) {
        toast('Especificaciones sugeridas por IA aplicadas. Pulsa "Guardar especificaciones" para conservarlas.');
      }
      return;
    }

    // Caso 2: Formulario de creación de equipo nuevo (/laptops)
    if (form) {
      if (aiResult.marca) {
        const marcaInput = form.querySelector('[name="marca"]');
        if (marcaInput) marcaInput.value = aiResult.marca;
      }
      const fullModel = [aiResult.familia, aiResult.modelo].filter(Boolean).join(' ');
      if (fullModel) {
        const modeloInput = form.querySelector('[name="modelo"]');
        if (modeloInput) modeloInput.value = fullModel;
      }

      sessionStorage.setItem(pendingKey, JSON.stringify({ assetId: null, data: suggestion }));

      cerrarModal('modalLaptopAI');
      abrirModal('modalLaptop');
      if (window.toast) toast('Especificaciones aplicadas al formulario. Ingresa Service Tag y Serial para guardar.');
    }
  };

  window.abrirModalAIConModelo = function (defaultQuery) {
    cerrarModal('modalComponents');
    const input = byId('aiSearchQuery');
    if (input && defaultQuery) {
      input.value = defaultQuery.trim();
    }
    abrirModal('modalLaptopAI');
    if (input) {
      window.setTimeout(() => {
        input.focus();
        input.select();
      }, 100);
    }
  };
})();
