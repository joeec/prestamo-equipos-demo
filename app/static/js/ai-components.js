/* Propuesta de IA: se revisa en el modal existente y nunca se guarda sola. */
(() => {
  const pendingKey = 'it-loans.pending-ai-components';
  let aiResult = null;
  const byId = id => document.getElementById(id);
  const setIfEmpty = (input, value) => {
    if (!input || value === null || value === undefined || value === '') return;
    if (!input.value.trim()) input.value = String(value);
  };
  const componentSuggestion = data => data.components_suggestion || {};
  const selectedValue = key => document.querySelector(`[data-ai-choice="${key}"]`)?.value || '';

  function renderPreview(data) {
    const preview = byId('aiPreview');
    const apply = byId('aiApplyButton');
    if (!preview || !apply) return;
    preview.replaceChildren();
    const suggestion = componentSuggestion(data);
    const row = (label, value) => { if (value) { const element = document.createElement('div'); element.className = 'ai-preview-row'; element.textContent = `${label}: ${value}`; preview.append(element); } };
    row('Marca', data.marca); row('Modelo', [data.familia, data.modelo].filter(Boolean).join(' '));
    const chooser = (label, values, key) => {
      if (!Array.isArray(values) || !values.length) return;
      const labelElement = document.createElement('label'); labelElement.className = 'ai-preview-row'; labelElement.textContent = label;
      const select = document.createElement('select'); select.dataset.aiChoice = key;
      values.forEach(value => { const option = document.createElement('option'); option.value = String(value); option.textContent = String(value); select.append(option); });
      labelElement.append(select); preview.append(labelElement);
    };
    chooser('Procesador sugerido', suggestion.processor_options, 'processor');
    row('RAM sugerida', suggestion.ram); row('Almacenamiento', suggestion.storage_type); row('Pantalla', suggestion.display);
    chooser('Resolución sugerida', suggestion.resolution_options, 'resolution'); row('Gráfica', suggestion.graphics); row('Batería', suggestion.battery); row('Windows', suggestion.windows);
    if (suggestion.notes) row('Nota', suggestion.notes);
    preview.hidden = false; apply.hidden = !data.encontrado;
  }

  window.buscarEspecificacionesIA = async function () {
    const input = byId('aiSearchQuery'); const button = byId('aiSearchButton'); const loading = byId('aiLoading'); const error = byId('aiError');
    const query = input?.value.trim() || '';
    if (query.length < 3) { error.textContent = 'Escribe al menos 3 caracteres para buscar el modelo.'; error.hidden = false; return; }
    error.hidden = true; loading.hidden = false; setButtonLoading(button, true, 'Consultando IA…');
    try {
      await new Promise(resolve => window.setTimeout(resolve, 650 + Math.random() * 450));
      const catalog = {
        'dell latitude 5440': { marca:'Dell', modelo:'5440', familia:'Latitude', encontrado:true, components_suggestion:{ processor_options:['Intel Core i5-1345U','Intel Core i7-1365U'], ram:'16 GB DDR5', storage_type:'512 GB NVMe', display:'14 pulgadas', resolution_options:['1920×1080'], graphics:'Intel Iris Xe', battery:'54 Wh', windows:'Windows 11 Pro' } },
        'hp elitebook 840 g8': { marca:'HP', modelo:'840 G8', familia:'EliteBook', encontrado:true, components_suggestion:{ processor_options:['Intel Core i5-1145G7'], ram:'16 GB DDR4', storage_type:'512 GB NVMe', display:'14 pulgadas', resolution_options:['1920×1080'], graphics:'Intel Iris Xe', windows:'Windows 11 Pro' } },
        'lenovo thinkpad t14 gen 3': { marca:'Lenovo', modelo:'T14 Gen 3', familia:'ThinkPad', encontrado:true, components_suggestion:{ processor_options:['AMD Ryzen 7 PRO 6850U'], ram:'16 GB DDR5', storage_type:'1 TB NVMe', display:'14 pulgadas', resolution_options:['1920×1200'], graphics:'AMD Radeon 680M', windows:'Windows 11 Pro' } }
      };
      const normalized = query.toLowerCase().trim();
      const data = Object.entries(catalog).find(([model]) => normalized.includes(model) || model.includes(normalized))?.[1];
      if (!data) throw new Error('No hay especificaciones de demostración para ese modelo.');
      aiResult = data; renderPreview(data);
    } catch (exception) { error.textContent = exception.message || 'No se pudo consultar el servicio.'; error.hidden = false; }
    finally { setButtonLoading(button, false); loading.hidden = true; }
  };

  window.applyAiSpecificationsToComponents = function (suggestion) {
    const modal = byId('components');
    if (!modal) return false;
    const names = ['processor', 'generation', 'ram', 'ram_slots', 'ram_type', 'primary_disk', 'secondary_disk', 'storage_capacity', 'storage_type', 'graphics', 'display', 'resolution', 'battery', 'battery_cycles', 'battery_health', 'mac_address', 'ip_address', 'bios', 'tpm', 'windows', 'office', 'antivirus', 'notes'];
    names.forEach(name => setIfEmpty(modal.querySelector(`[name="${name}"]`), suggestion[name] || ''));
    abrirModal('components');
    return true;
  };

  window.aplicarEspecificacionesIA = function () {
    if (!aiResult?.encontrado) return;
    const form = byId('laptopCreateForm'); if (!form) return;
    const suggestion = { ...componentSuggestion(aiResult), processor: selectedValue('processor') || componentSuggestion(aiResult).processor, resolution: selectedValue('resolution') || componentSuggestion(aiResult).resolution };
    setIfEmpty(form.querySelector('[name="marca"]'), aiResult.marca || '');
    setIfEmpty(form.querySelector('[name="modelo"]'), [aiResult.familia, aiResult.modelo].filter(Boolean).join(' '));
    sessionStorage.setItem(pendingKey, JSON.stringify({ assetId: null, data: suggestion }));
    let marker = form.querySelector('[name="ai_components_pending"]');
    if (!marker) { marker = document.createElement('input'); marker.type = 'hidden'; marker.name = 'ai_components_pending'; form.append(marker); }
    marker.value = '1'; cerrarModal('modalLaptopAI'); abrirModal('modalLaptop');
  };

  const match = location.pathname.match(/^\/laptops\/(\d+)$/);
  if (match && new URLSearchParams(location.search).get('ai_components') === '1') {
    let pending = null; try { pending = JSON.parse(sessionStorage.getItem(pendingKey) || 'null'); } catch (_) {}
    const assetId = Number(match[1]);
    if (pending && (!pending.assetId || Number(pending.assetId) === assetId) && window.applyAiSpecificationsToComponents(pending.data)) {
      pending.assetId = assetId;
      sessionStorage.setItem(pendingKey, JSON.stringify(pending));
      sessionStorage.removeItem(pendingKey); history.replaceState({}, document.title, location.pathname);
      toast('Revisa los componentes sugeridos y pulsa Guardar para conservarlos.');
    }
  }
})();
