(() => {
  "use strict";

  const STORAGE_KEY = "actas-vvff-acta2-v1";
  const PAGE_WIDTH = 1754;
  const PAGE_HEIGHT = 1240;
  const PDF_WIDTH = 841.89;
  const PDF_HEIGHT = 595.28;

  const locations = [
    ["hall", "Hall"], ["terraza", "Terraza"], ["pasillo", "Pasillo"], ["living", "Living"],
    ["comedor", "Comedor"], ["dorm1", "Dormitorio 1"], ["dorm2", "Dormitorio 2"], ["dorm3", "Dormitorio 3"],
    ["dorm4", "Dormitorio 4"], ["sala-estar", "Sala de estar"], ["dorm-servicio", "Dorm. servicio"],
    ["bodega", "Bodega"], ["cocina", "Cocina"], ["bano1", "Baño 1"], ["bano2", "Baño 2"],
    ["bano3", "Baño 3"], ["bano4", "Baño 4"], ["loggia", "Loggia"],
  ];

  const groups = [
    { id: "pintura", name: "Pintura", items: [["cielo", "Cielo"], ["junquillos", "Junquillos"], ["muros", "Muros"], ["guardapolvos", "Guardapolvos"], ["barandas", "Barandas"], ["puertas-pintura", "Puertas"]] },
    { id: "ventanas", name: "Ventanas", items: [["vidrios", "Vidrios"], ["seguros-ventana", "Seguros"], ["marcos-rieles", "Marcos / rieles"], ["protecciones", "Protecciones"]] },
    { id: "puertas", name: "Puertas", items: [["llaves-puerta", "Llaves"], ["cerradura", "Cerradura"], ["perillon", "Perillón"], ["numero-vivienda", "N° vivienda"], ["bisagras-puerta", "Bisagras"], ["seguro-bloq", "Seguro bloq."], ["topes", "Topes"], ["condicion-puerta", "Condición"]] },
    { id: "closet", name: "Closet", items: [["estado-closet", "Estado"], ["puertas-closet", "Puertas"], ["barra-guias", "Barra - guías"], ["divisiones-closet", "Divisiones"], ["manillas-closet", "Manillas"], ["bisagras-riel-closet", "Bisagras / riel"], ["tapacanto-closet", "Tapacanto"], ["pintura-barniz", "Pintura - barniz"]] },
    { id: "electrica", name: "Instalación eléctrica", items: [["tablero", "Tablero"], ["citofono-timbre", "Citófono / timbre"], ["interruptor", "Interruptor"], ["enchufes", "Enchufes"], ["porta-lampara", "Porta lámpara"], ["ampolletas", "Ampolletas"]] },
    { id: "lavaplatos", name: "Lavaplatos / lavamanos / tina", items: [["llaves-griferia", "Llaves"], ["flexibles", "Flexibles"], ["sifon", "Sifón"], ["desague", "Desagüe"], ["combinacion", "Combinación"]] },
    { id: "mueble-lavaplatos", name: "Mueble lavaplatos / lavamanos", items: [["puertas-manillas-mueble", "Puertas, manillas"], ["tapacantos-mueble", "Tapacantos"], ["bisagras-mueble", "Bisagras"], ["marmol", "Mármol"], ["madera-mueble", "Madera"]] },
    { id: "gas", name: "Instalación gas", items: [["certificacion-gas", "Certif. calefón - cocina"], ["llave-paso", "Llave de paso"]] },
    { id: "muebles", name: "Muebles colgantes y de base", items: [["puertas-manillas-cocina", "Puertas, manillas"], ["bisagras-cocina", "Bisagras"], ["cubierta", "Cubierta"], ["divisiones-cocina", "Divisiones"], ["tapacantos-cocina", "Tapacantos"], ["madera-cocina", "Madera"]] },
    { id: "pisos", name: "Pisos / cerámicos / azulejos", items: [["piso-flotante", "Flotante"], ["piso-ceramico", "Cerámico"], ["piso-madera", "Madera"]] },
    { id: "accesorios", name: "Accesorios", items: [["barra-cortina", "Barra cortina baño"], ["jabonera", "Jabonera loza"], ["toallero", "Toallero"], ["porta-vaso-rollo", "Porta vaso / rollo"], ["percha", "Percha"], ["wc-estanque-taza", "WC estanque y taza"], ["wc-tapa", "WC tapa"], ["espejo", "Espejo"], ["extractor", "Extractor de aire"]] },
    { id: "varios", name: "Varios", items: [["barandas-varios", "Barandas"], ["escalas", "Escalas"], ["pasamanos", "Pasamanos"], ["timbre", "Timbre"], ["inventario", "Inventario"], ["extintor", "Extintor"], ["asadera", "Asadera"], ["cerradura-reja", "Cerradura reja"], ["cerradura-porton", "Cerradura portón"], ["cesped", "Césped"], ["arboles", "Árboles"], ["aseo-interior", "Aseo interior"], ["aseo-patio", "Aseo patio / terraza"], ["luces-exteriores", "Luces exteriores"]] },
  ];

  const exteriorItems = [
    ["porton-chapa", "Portón y chapa"], ["reja", "Reja"], ["ampliacion", "Ampliación"], ["cobertizo", "Cobertizo"],
    ["muro-divisorio", "Muro divisorio"], ["bodega-ext", "Bodega", "N° (opcional)"], ["estacionamiento", "Estacionamiento", "N° (opcional)"],
  ];

  const documentItems = [
    ["boleta-agua", "Boleta de agua"], ["pago-agua", "Comprobante de pago de agua"],
    ["boleta-electricidad", "Boleta de electricidad"], ["pago-electricidad", "Comprobante de pago de electricidad"],
    ["boleta-gas", "Boleta de gas"], ["pago-gas", "Comprobante de pago de gas"],
    ["boleta-aseo", "Boleta de aseo domiciliario"], ["pago-aseo", "Comprobante de pago de aseo"],
    ["cert-junta", "Certificado Junta de Adelanto"], ["cert-notario", "Certificado ante notario"],
    ["cert-calefon", "Certificado calefón / caldera / encimera"],
  ];

  const signatureDefinitions = [
    ["recibe", "Recibe"], ["devuelve", "Devuelve"], ["inspector", "Inspector fiscal"], ["jefe", "Jefe Depto. / Sección Habitacional"],
  ];

  const flatItems = groups.flatMap((group) => group.items.map(([id, name]) => ({ id, name, group: group.name })));
  const state = {
    currentStep: 0,
    currentLocation: locations[0][0],
    noveltyLocation: locations[0][0],
    matrix: {},
    novelties: {},
    exterior: {},
    signatureStrokes: {},
    signaturePads: {},
    openMatrixGroups: new Set(["pintura"]),
    previewPage: 0,
    previewCanvases: [],
  };

  const form = document.querySelector("#acta2Form");
  const stepSections = [...document.querySelectorAll(".form-step")];
  const stepButtons = [...document.querySelectorAll(".step")];
  const previousButton = document.querySelector("#previousStep");
  const nextButton = document.querySelector("#nextStep");
  let saveTimer;
  let toastTimer;
  let initialValidation;

  function emptyMatrix() {
    const matrix = {};
    locations.forEach(([locationId]) => {
      matrix[locationId] = Object.fromEntries(flatItems.map((item) => [item.id, ""]));
    });
    return matrix;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" })[character]);
  }

  function safeParse(value, fallback) {
    try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
  }

  function collectFormData() {
    const data = {};
    form.querySelectorAll("input[name], textarea[name], select[name]").forEach((field) => {
      if (field.type === "radio") { if (field.checked) data[field.name] = field.value; }
      else if (field.type === "checkbox") data[field.name] = field.checked;
      else data[field.name] = field.value;
    });
    return data;
  }

  function restoreFormData(data) {
    Object.entries(data || {}).forEach(([name, value]) => {
      const fields = [...form.querySelectorAll(`[name="${CSS.escape(name)}"]`)];
      if (!fields.length) return;
      if (fields[0].type === "radio") {
        const matching = fields.find((field) => field.value === value);
        if (matching) matching.checked = true;
      } else if (fields[0].type === "checkbox") fields[0].checked = Boolean(value);
      else window.ActaSecurity.restoreFieldValue(fields[0], value);
    });
  }

  function loadDraft() {
    const saved = window.ActaSecurity.loadDraft(STORAGE_KEY);
    state.matrix = emptyMatrix();
    state.novelties = Object.fromEntries(locations.map(([id]) => [id, ""]));
    state.exterior = Object.fromEntries(exteriorItems.map(([id]) => [id, { value: "", detail: "" }]));
    if (!saved) return;
    locations.forEach(([locationId]) => {
      flatItems.forEach((item) => {
        const value = saved.matrix?.[locationId]?.[item.id];
        if (["B", "R", "M"].includes(value)) state.matrix[locationId][item.id] = value;
      });
      state.novelties[locationId] = String(saved.novelties?.[locationId] || "").slice(0, 1200);
    });
    exteriorItems.forEach(([id]) => {
      const incoming = saved.exterior?.[id];
      if (incoming) state.exterior[id] = {
        value: ["Sí", "No"].includes(incoming.value) ? incoming.value : "",
        detail: String(incoming.detail || "").slice(0, 120),
      };
    });
    state.signatureStrokes = window.ActaSecurity.cleanSignatures(saved.signatures, signatureDefinitions.map(([key]) => key));
    restoreFormData(saved.formData || {});
  }

  function saveDraft({ quiet = true } = {}) {
    const signatures = Object.fromEntries(Object.entries(state.signaturePads).map(([key, pad]) => [key, pad.strokes]));
    try {
      window.ActaSecurity.saveDraft(STORAGE_KEY, { formData: collectFormData(), matrix: state.matrix, novelties: state.novelties, exterior: state.exterior, signatures });
      document.querySelector("#draftStatus").textContent = `Guardado hoy, ${new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`;
      if (!quiet) showToast("Borrador guardado en este dispositivo");
    } catch {
      document.querySelector("#draftStatus").textContent = "No fue posible guardar el borrador";
    }
    updateProgress();
  }

  function scheduleSave() {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => saveDraft(), 350);
  }

  function showToast(message) {
    const toast = document.querySelector("#toast");
    toast.querySelector("span").textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2300);
  }

  function renderLocationTabs() {
    const tabs = document.querySelector("#locationTabs");
    tabs.innerHTML = locations.map(([id, name]) => {
      const hasValues = Object.values(state.matrix[id]).some(Boolean);
      return `<button type="button" role="tab" class="location-tab ${id === state.currentLocation ? "is-active" : ""} ${hasValues ? "has-values" : ""}" data-location="${id}" aria-selected="${id === state.currentLocation}">${name}</button>`;
    }).join("");
    const title = locations.find(([id]) => id === state.currentLocation)?.[1] || "Dependencia";
    document.querySelector("#currentLocationTitle").textContent = title;
  }

  function renderMatrixGroups() {
    const container = document.querySelector("#matrixGroups");
    container.innerHTML = groups.map((group, groupIndex) => {
      const isOpen = state.openMatrixGroups.has(group.id);
      return `
      <section class="matrix-group ${isOpen ? "is-open" : ""}" data-matrix-group="${group.id}">
        <button type="button" class="matrix-group-toggle" aria-expanded="${isOpen}">
          <span><b>${String(groupIndex + 1).padStart(2, "0")}</b><span><strong>${group.name}</strong><small>${group.items.length} elementos</small></span></span>
          <svg viewBox="0 0 20 20"><path d="m4 7 6 6 6-6"/></svg>
        </button>
        <div class="matrix-group-content" ${isOpen ? "" : "hidden"}>
          ${group.items.map(([id, name]) => {
            const selected = state.matrix[state.currentLocation][id];
            return `<div class="matrix-row"><strong>${name}</strong><div class="brm-picker" aria-label="Condición de ${name}">${["B", "R", "M"].map((value) => `<button type="button" class="brm-button ${selected === value ? "is-selected" : ""}" data-item="${id}" data-value="${value}" aria-pressed="${selected === value}">${value}</button>`).join("")}</div></div>`;
          }).join("")}
        </div>
      </section>`;
    }).join("");
  }

  function renderNoveltyControls() {
    const select = document.querySelector("#noveltyLocation");
    select.innerHTML = locations.map(([id, name]) => `<option value="${id}">${name}</option>`).join("");
    select.value = state.noveltyLocation;
    updateNoveltyEditor();
  }

  function updateNoveltyEditor() {
    const title = locations.find(([id]) => id === state.noveltyLocation)?.[1] || "Dependencia";
    const text = state.novelties[state.noveltyLocation] || "";
    document.querySelector("#noveltyLocationTitle").textContent = title;
    document.querySelector("#noveltyText").value = text;
    document.querySelector("#noveltyCount").textContent = text.length;
  }

  function renderExteriorRows() {
    document.querySelector("#exteriorRows").innerHTML = exteriorItems.map(([id, name, placeholder = "Detalle (opcional)"]) => {
      const item = state.exterior[id];
      return `<div class="exterior-row" data-exterior="${id}"><strong>${name}</strong><div class="yes-no">${["Sí", "No"].map((value) => `<button type="button" data-exterior-value="${value}" class="${item.value === value ? "is-selected" : ""}">${value}</button>`).join("")}</div><input type="text" data-exterior-detail maxlength="120" value="${escapeHtml(item.detail)}" placeholder="${placeholder}" aria-label="Detalle de ${name}" /></div>`;
    }).join("");
  }

  function renderDocumentChecks() {
    document.querySelector("#documentChecks").innerHTML = documentItems.map(([id, label]) => `<label class="doc-check"><input type="checkbox" name="doc_${id}"/><span>${label}</span></label>`).join("");
  }

  function renderSignatureCards() {
    document.querySelector("#signatureGrid").innerHTML = signatureDefinitions.map(([key, title], index) => `<article class="signature-card"><div class="signature-heading"><div><span class="card-kicker">Firma ${String(index + 1).padStart(2, "0")}</span><h3>${title}</h3></div><button type="button" class="clear-signature" data-clear-signature="${key}">Limpiar</button></div><label class="field"><span>Grado y nombre</span><input name="firmaNombre_${key}" type="text" maxlength="80" autocomplete="off" placeholder="Nombre completo"/></label><div class="signature-pad"><canvas id="signature-${key}" data-signature="${key}" aria-label="Área de firma: ${title}"></canvas><span>Firme dentro del recuadro</span></div></article>`).join("");
  }

  function setupSignaturePads() {
    document.querySelectorAll("canvas[data-signature]").forEach((canvas) => {
      const key = canvas.dataset.signature;
      const pad = { canvas, context: canvas.getContext("2d"), strokes: state.signatureStrokes[key] || [], activeStroke: null };
      state.signaturePads[key] = pad;
      resizeSignaturePad(pad);
      canvas.addEventListener("pointerdown", (event) => beginStroke(event, pad));
      canvas.addEventListener("pointermove", (event) => continueStroke(event, pad));
      canvas.addEventListener("pointerup", () => endStroke(pad));
      canvas.addEventListener("pointercancel", () => endStroke(pad));
      canvas.addEventListener("pointerleave", () => { if (pad.activeStroke) endStroke(pad); });
    });
    document.querySelectorAll("[data-clear-signature]").forEach((button) => button.addEventListener("click", () => {
      const pad = state.signaturePads[button.dataset.clearSignature];
      pad.strokes = [];
      redrawSignaturePad(pad);
      scheduleSave();
    }));
    window.addEventListener("resize", () => Object.values(state.signaturePads).forEach(resizeSignaturePad));
  }

  function resizeSignaturePad(pad) {
    const rect = pad.canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    pad.canvas.width = Math.max(1, Math.round(rect.width * ratio));
    pad.canvas.height = Math.max(1, Math.round(rect.height * ratio));
    pad.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    pad.logicalWidth = rect.width;
    pad.logicalHeight = rect.height;
    redrawSignaturePad(pad);
  }

  function pointerPosition(event, pad) {
    const rect = pad.canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height };
  }

  function beginStroke(event, pad) {
    event.preventDefault();
    if (pad.strokes.length >= window.ActaSecurity.limits.maxSignatureStrokes) return;
    pad.canvas.setPointerCapture(event.pointerId);
    pad.activeStroke = [pointerPosition(event, pad)];
    pad.strokes.push(pad.activeStroke);
    redrawSignaturePad(pad);
  }

  function continueStroke(event, pad) {
    if (!pad.activeStroke) return;
    event.preventDefault();
    if (pad.activeStroke.length >= window.ActaSecurity.limits.maxPointsPerStroke) return;
    pad.activeStroke.push(pointerPosition(event, pad));
    redrawSignaturePad(pad);
  }

  function endStroke(pad) {
    if (!pad.activeStroke) return;
    pad.activeStroke = null;
    scheduleSave();
    updateProgress();
  }

  function redrawSignaturePad(pad) {
    const ctx = pad.context;
    ctx.clearRect(0, 0, pad.logicalWidth || 1, pad.logicalHeight || 1);
    ctx.strokeStyle = "#102f48";
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    pad.strokes.forEach((stroke) => {
      if (!stroke.length) return;
      ctx.beginPath();
      stroke.forEach((point, index) => {
        const x = point.x * pad.logicalWidth;
        const y = point.y * pad.logicalHeight;
        if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      if (stroke.length === 1) ctx.lineTo(stroke[0].x * pad.logicalWidth + 0.2, stroke[0].y * pad.logicalHeight + 0.2);
      ctx.stroke();
    });
  }

  function showStep(index) {
    state.currentStep = Math.max(0, Math.min(index, stepSections.length - 1));
    stepSections.forEach((section, sectionIndex) => {
      const active = sectionIndex === state.currentStep;
      section.hidden = !active;
      section.classList.toggle("is-active", active);
    });
    stepButtons.forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === state.currentStep);
      button.classList.toggle("is-complete", buttonIndex < state.currentStep);
    });
    previousButton.disabled = state.currentStep === 0;
    nextButton.innerHTML = state.currentStep === stepSections.length - 1 ? `Descargar PDF <svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>` : `Continuar <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>`;
    document.querySelector("#stepCounter").textContent = state.currentStep + 1;
    if (state.currentStep === 4) renderDocumentPages();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function requestStep(index) {
    if (state.currentStep === 0 && index > 0 && initialValidation && !initialValidation.validateAll()) {
      showToast("Revisa los campos marcados antes de continuar");
      return;
    }
    showStep(index);
  }

  function ensureInitialDataIsValid() {
    if (!initialValidation || initialValidation.validateAll({ focus: false })) return true;
    showStep(0);
    window.setTimeout(() => initialValidation.validateAll(), 220);
    showToast("Corrige los datos de antecedentes antes de descargar");
    return false;
  }

  function updateProgress() {
    const data = collectFormData();
    const importantFields = ["grado", "rut", "nombre", "unidad", "fecha", "villa", "calle", "operacion"];
    const fieldScore = importantFields.filter((field) => Boolean(data[field])).length / importantFields.length;
    const matrixValues = locations.flatMap(([id]) => Object.values(state.matrix[id]));
    const matrixScore = matrixValues.filter(Boolean).length / matrixValues.length;
    const notesScore = Object.values(state.novelties).some(Boolean) ? 1 : 0;
    const signatureScore = signatureDefinitions.filter(([key]) => state.signaturePads[key]?.strokes.length).length / signatureDefinitions.length;
    const percentage = Math.round((fieldScore * 0.3 + matrixScore * 0.42 + notesScore * 0.08 + signatureScore * 0.2) * 100);
    document.querySelector("#progressValue").textContent = `${percentage}%`;
    document.querySelector("#progressBar").value = percentage;
  }

  function setupEvents() {
    form.addEventListener("input", scheduleSave);
    form.addEventListener("change", scheduleSave);
    stepButtons.forEach((button) => button.addEventListener("click", () => requestStep(Number(button.dataset.stepTarget))));
    previousButton.addEventListener("click", () => showStep(state.currentStep - 1));
    nextButton.addEventListener("click", () => state.currentStep === 4 ? downloadPdf() : requestStep(state.currentStep + 1));

    document.querySelector("#locationTabs").addEventListener("click", (event) => {
      const button = event.target.closest("[data-location]");
      if (!button) return;
      state.currentLocation = button.dataset.location;
      renderLocationTabs();
      renderMatrixGroups();
    });

    document.querySelector("#matrixGroups").addEventListener("click", (event) => {
      const toggle = event.target.closest(".matrix-group-toggle");
      if (toggle) {
        const group = toggle.closest(".matrix-group");
        const content = group.querySelector(".matrix-group-content");
        const open = !group.classList.contains("is-open");
        if (open) state.openMatrixGroups.add(group.dataset.matrixGroup);
        else state.openMatrixGroups.delete(group.dataset.matrixGroup);
        group.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        content.hidden = !open;
        return;
      }
      const button = event.target.closest(".brm-button");
      if (!button) return;
      const previous = state.matrix[state.currentLocation][button.dataset.item];
      state.matrix[state.currentLocation][button.dataset.item] = previous === button.dataset.value ? "" : button.dataset.value;
      renderMatrixGroups();
      renderLocationTabs();
      scheduleSave();
    });

    document.querySelector("#markAllGood").addEventListener("click", () => {
      flatItems.forEach((item) => {
        if (!state.matrix[state.currentLocation][item.id]) state.matrix[state.currentLocation][item.id] = "B";
      });
      renderMatrixGroups();
      renderLocationTabs();
      scheduleSave();
      showToast("Casillas pendientes completadas con B");
    });

    document.querySelector("#noveltyLocation").addEventListener("change", (event) => {
      state.noveltyLocation = event.target.value;
      updateNoveltyEditor();
    });
    document.querySelector("#noveltyText").addEventListener("input", (event) => {
      const text = event.target.value.slice(0, 1200);
      event.target.value = text;
      state.novelties[state.noveltyLocation] = text;
      document.querySelector("#noveltyCount").textContent = text.length;
      scheduleSave();
    });

    document.querySelector("#exteriorRows").addEventListener("click", (event) => {
      const button = event.target.closest("[data-exterior-value]");
      if (!button) return;
      const row = button.closest("[data-exterior]");
      const item = state.exterior[row.dataset.exterior];
      item.value = item.value === button.dataset.exteriorValue ? "" : button.dataset.exteriorValue;
      renderExteriorRows();
      scheduleSave();
    });
    document.querySelector("#exteriorRows").addEventListener("input", (event) => {
      if (!event.target.matches("[data-exterior-detail]")) return;
      const row = event.target.closest("[data-exterior]");
      state.exterior[row.dataset.exterior].detail = event.target.value;
      scheduleSave();
    });

    document.querySelector("#refreshPreview").addEventListener("click", () => { renderDocumentPages(); showToast("Vista previa actualizada"); });
    document.querySelector("#downloadPdf").addEventListener("click", downloadPdf);
    document.querySelector("#startNewActa").addEventListener("click", () => openFinishModal(false));
    document.querySelector("#keepDraft").addEventListener("click", closeFinishModal);
    document.querySelector("#cancelModal").addEventListener("click", closeFinishModal);
    document.querySelector("#confirmNewActa").addEventListener("click", () => { window.ActaSecurity.clearDraft(STORAGE_KEY); window.location.reload(); });
    document.querySelector("#finishModal").addEventListener("click", (event) => { if (event.target.id === "finishModal") closeFinishModal(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeFinishModal(); });
  }

  function openFinishModal(downloaded) {
    document.querySelector("#finishKicker").textContent = downloaded ? "Descarga completada" : "Nuevo formulario";
    document.querySelector("#finishTitle").textContent = downloaded ? "PDF descargado correctamente" : "¿Iniciar una nueva Acta 2?";
    document.querySelector("#finishDescription").textContent = downloaded ? "Puedes mantener este borrador o limpiar todo y comenzar otra Acta 2." : "Esta acción limpiará los campos, la revisión, las novedades y las firmas de esta Acta 2.";
    document.querySelector("#finishModal").hidden = false;
    document.body.classList.add("modal-open");
  }

  function closeFinishModal() {
    document.querySelector("#finishModal").hidden = true;
    document.body.classList.remove("modal-open");
  }

  function createPage() {
    const canvas = document.createElement("canvas");
    canvas.width = PAGE_WIDTH;
    canvas.height = PAGE_HEIGHT;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
    ctx.textBaseline = "middle";
    return { canvas, ctx };
  }

  function setFont(ctx, size = 12, weight = 400, style = "normal") {
    ctx.font = `${style} ${weight} ${size}px Arial, sans-serif`;
  }

  function wrapLines(ctx, text, maxWidth) {
    const words = String(text || "").split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";
    words.forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(candidate).width > maxWidth) { lines.push(line); line = word; }
      else line = candidate;
    });
    if (line) lines.push(line);
    return lines.length ? lines : [""];
  }

  function drawCell(ctx, x, y, width, height, text = "", options = {}) {
    const { fill = "#fff", stroke = "#56616a", size = 10, weight = 400, align = "left", padding = 5, color = "#182431", maxLines = 3 } = options;
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
    setFont(ctx, size, weight);
    ctx.fillStyle = color;
    ctx.textAlign = align;
    const lines = wrapLines(ctx, text, width - padding * 2).slice(0, maxLines);
    const lineHeight = size * 1.18;
    const startY = y + height / 2 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, index) => {
      const textX = align === "center" ? x + width / 2 : align === "right" ? x + width - padding : x + padding;
      ctx.fillText(line, textX, startY + index * lineHeight);
    });
  }

  function drawHeader(ctx, page, title = "ACTA DE ENTREGA Y/O DEVOLUCIÓN DE VIVIENDA FISCAL") {
    setFont(ctx, 10.5, 700);
    ctx.fillStyle = "#26323b";
    ctx.textAlign = "left";
    ctx.fillText("FUERZA AÉREA DE CHILE", 44, 22);
    ctx.fillText("COMANDO DE PERSONAL", 44, 38);
    ctx.fillText("DIVISIÓN DE BIENESTAR SOCIAL", 44, 54);
    setFont(ctx, 19, 700);
    ctx.textAlign = "center";
    ctx.fillText(title, PAGE_WIDTH / 2, 38);
    setFont(ctx, 10, 700);
    ctx.textAlign = "right";
    ctx.fillText(`PÁGINA ${page} DE 4`, PAGE_WIDTH - 44, 38);
    ctx.strokeStyle = "#172e42";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(44, 64); ctx.lineTo(PAGE_WIDTH - 44, 64); ctx.stroke();
  }

  function formatDate(value) {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return `${day || ""}-${month || ""}-${year || ""}`;
  }

  function drawIdentity(ctx, data, y = 76) {
    const x = 44;
    const width = PAGE_WIDTH - 88;
    const third = width / 3;
    drawCell(ctx, x, y, third, 27, `GRADO: ${data.grado || ""}`, { size: 10, weight: 700, fill: "#f3f5f6" });
    drawCell(ctx, x + third, y, third, 27, `RUT: ${data.rut || ""}`, { size: 10, weight: 700, fill: "#f3f5f6" });
    drawCell(ctx, x + third * 2, y, third, 27, `N° EMPLEADO: ${data.empleado || ""}`, { size: 10, weight: 700, fill: "#f3f5f6" });
    drawCell(ctx, x, y + 27, width * 0.53, 27, `NOMBRE: ${data.nombre || ""}`, { size: 10 });
    drawCell(ctx, x + width * 0.53, y + 27, width * 0.25, 27, `UNIDAD: ${data.unidad || ""}`, { size: 9.5 });
    drawCell(ctx, x + width * 0.78, y + 27, width * 0.22, 27, `RUT CÓNYUGE FACH: ${data.rutConyuge || ""}`, { size: 8.5 });
    const address = [data.villa && `Villa ${data.villa}`, data.calle, data.block && `Block ${data.block}`, data.deptoCasa, data.numero && `N° ${data.numero}`].filter(Boolean).join(" · ");
    drawCell(ctx, x, y + 54, width * 0.64, 27, `VIVIENDA: ${address}`, { size: 9.5 });
    drawCell(ctx, x + width * 0.64, y + 54, width * 0.2, 27, `OPERACIÓN: ${[data.operacion, data.tipoOperacion].filter(Boolean).join(" · ")}`, { size: 8.5 });
    drawCell(ctx, x + width * 0.84, y + 54, width * 0.16, 27, `FECHA: ${formatDate(data.fecha)}`, { size: 9 });
    return y + 81;
  }

  function drawMatrixPage(pageNumber, locationSlice, data) {
    const { canvas, ctx } = createPage();
    drawHeader(ctx, pageNumber);
    let y = drawIdentity(ctx, data, 76) + 10;
    const x = 44;
    const fullWidth = PAGE_WIDTH - 88;
    const categoryWidth = 118;
    const detailWidth = 242;
    const roomWidth = (fullWidth - categoryWidth - detailWidth) / locationSlice.length;
    drawCell(ctx, x, y, categoryWidth, 46, "ÍTEM", { fill: "#273746", color: "#fff", align: "center", weight: 700, size: 10 });
    drawCell(ctx, x + categoryWidth, y, detailWidth, 46, "DETALLE", { fill: "#273746", color: "#fff", align: "center", weight: 700, size: 10 });
    locationSlice.forEach(([id, name], index) => drawCell(ctx, x + categoryWidth + detailWidth + roomWidth * index, y, roomWidth, 46, name.toUpperCase(), { fill: "#273746", color: "#fff", align: "center", weight: 700, size: 8, padding: 3 }));
    y += 46;
    const rowHeight = 13.2;
    groups.forEach((group) => {
      const groupHeight = group.items.length * rowHeight;
      drawCell(ctx, x, y, categoryWidth, groupHeight, group.name.toUpperCase(), { fill: "#edf1f3", align: "center", weight: 700, size: 8, padding: 4, maxLines: 5 });
      group.items.forEach(([itemId, itemName]) => {
        drawCell(ctx, x + categoryWidth, y, detailWidth, rowHeight, itemName, { size: 8, padding: 4 });
        locationSlice.forEach(([locationId], index) => {
          const value = state.matrix[locationId][itemId] || "";
          const fill = value === "B" ? "#e6f5ec" : value === "R" ? "#fff3da" : value === "M" ? "#fdeaea" : "#fff";
          const color = value === "B" ? "#25865a" : value === "R" ? "#9b5c12" : value === "M" ? "#ba3a3a" : "#182431";
          drawCell(ctx, x + categoryWidth + detailWidth + roomWidth * index, y, roomWidth, rowHeight, value, { fill, color, align: "center", weight: 700, size: 8 });
        });
        y += rowHeight;
      });
    });
    setFont(ctx, 9, 700);
    ctx.fillStyle = "#465664";
    ctx.textAlign = "left";
    ctx.fillText("B: BUENO   ·   R: REGULAR   ·   M: MALO", x, PAGE_HEIGHT - 24);
    return canvas;
  }

  function drawNoveltiesPage(data) {
    const { canvas, ctx } = createPage();
    drawHeader(ctx, 3, "DETALLE DE NOVEDADES");
    let y = drawIdentity(ctx, data, 76) + 12;
    const margin = 44;
    const gap = 18;
    const columnWidth = (PAGE_WIDTH - margin * 2 - gap) / 2;
    const halves = [locations.slice(0, 9), locations.slice(9)];
    halves.forEach((half, column) => {
      let rowY = y;
      half.forEach(([id, name]) => {
        drawCell(ctx, margin + column * (columnWidth + gap), rowY, 150, 64, name.toUpperCase(), { fill: "#edf1f3", weight: 700, size: 9, align: "center" });
        drawCell(ctx, margin + column * (columnWidth + gap) + 150, rowY, columnWidth - 150, 64, state.novelties[id] || "", { size: 8.5, padding: 7, maxLines: 5 });
        rowY += 64;
      });
    });
    y += 9 * 64 + 18;
    drawCell(ctx, margin, y, PAGE_WIDTH - margin * 2, 30, "EXTERIOR VIVIENDA / CONDICIÓN", { fill: "#273746", color: "#fff", weight: 700, size: 10, align: "center" });
    y += 30;
    const exteriorWidth = (PAGE_WIDTH - margin * 2) / exteriorItems.length;
    exteriorItems.forEach(([id, name], index) => {
      const item = state.exterior[id];
      drawCell(ctx, margin + index * exteriorWidth, y, exteriorWidth, 42, name.toUpperCase(), { fill: "#edf1f3", weight: 700, size: 8, align: "center" });
      drawCell(ctx, margin + index * exteriorWidth, y + 42, exteriorWidth, 40, [item.value, item.detail].filter(Boolean).join(" · "), { size: 9, align: "center" });
    });
    return canvas;
  }

  function drawSignature(ctx, key, title, name, x, y, width, height) {
    ctx.strokeStyle = "#56616a";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
    const pad = state.signaturePads[key];
    if (pad?.strokes.length) ctx.drawImage(pad.canvas, x + 28, y + 8, width - 56, height - 52);
    ctx.beginPath(); ctx.moveTo(x + 28, y + height - 38); ctx.lineTo(x + width - 28, y + height - 38); ctx.stroke();
    setFont(ctx, 9, 700); ctx.fillStyle = "#26323b"; ctx.textAlign = "center"; ctx.fillText(title.toUpperCase(), x + width / 2, y + height - 25);
    setFont(ctx, 8, 400); ctx.fillStyle = "#56616a"; ctx.fillText(name || "Grado y nombre", x + width / 2, y + height - 11);
  }

  function drawClosingPage(data) {
    const { canvas, ctx } = createPage();
    drawHeader(ctx, 4, "CIERRE ADMINISTRATIVO Y FIRMAS");
    const margin = 44;
    const fullWidth = PAGE_WIDTH - margin * 2;
    let y = drawIdentity(ctx, data, 76) + 12;
    const leftW = fullWidth * 0.54;
    const rightX = margin + leftW + 16;
    const rightW = fullWidth - leftW - 16;
    const sectionY = y;
    drawCell(ctx, margin, y, leftW, 30, "CONSUMOS BÁSICOS Y PROPIEDAD", { fill: "#273746", color: "#fff", align: "center", weight: 700, size: 10 });
    y += 30;
    const controlRows = [
      ["Rol propiedad", data.rolPropiedad], ["N° cliente agua", data.clienteAgua], ["N° cliente electricidad", data.clienteElectricidad], ["N° cliente gas", data.clienteGas],
      ["Estado luz", data.estadoLuz], ["Estado agua", data.estadoAgua], ["Estado gas", data.estadoGas], ["Aseo domiciliario", data.aseoDomiciliario],
      ["Gastos comunes", data.gastosComunes], ["N° de llaves", data.numeroLlaves], ["Controles remotos", data.controlesRemotos],
    ];
    controlRows.forEach(([label, value]) => {
      drawCell(ctx, margin, y, 200, 27, label.toUpperCase(), { fill: "#edf1f3", weight: 700, size: 8.5 });
      drawCell(ctx, margin + 200, y, leftW - 200, 27, value || "", { size: 9 });
      y += 27;
    });
    const financeY = y + 14;
    drawCell(ctx, margin, financeY, leftW, 30, "USO SECCIÓN GESTIÓN FINANCIERA", { fill: "#273746", color: "#fff", align: "center", weight: 700, size: 10 });
    const financeRows = [
      ["DRAA 5,5%", formatDate(data.draaCese), formatDate(data.draaInicio)],
      ["Gasto común", formatDate(data.gastoCese), formatDate(data.gastoInicio)],
      ["Fecha", formatDate(data.fechaGestion), data.responsableFinanzas || ""],
    ];
    drawCell(ctx, margin, financeY + 30, 170, 28, "ÍTEM", { fill: "#edf1f3", align: "center", weight: 700, size: 8 });
    drawCell(ctx, margin + 170, financeY + 30, (leftW - 170) / 2, 28, "CESE DESCUENTO", { fill: "#edf1f3", align: "center", weight: 700, size: 8 });
    drawCell(ctx, margin + 170 + (leftW - 170) / 2, financeY + 30, (leftW - 170) / 2, 28, "INICIO / RESPONSABLE", { fill: "#edf1f3", align: "center", weight: 700, size: 8 });
    financeRows.forEach((row, index) => {
      const rowY = financeY + 58 + index * 31;
      drawCell(ctx, margin, rowY, 170, 31, row[0], { weight: 700, size: 8.5 });
      drawCell(ctx, margin + 170, rowY, (leftW - 170) / 2, 31, row[1], { align: "center", size: 8.5 });
      drawCell(ctx, margin + 170 + (leftW - 170) / 2, rowY, (leftW - 170) / 2, 31, row[2], { align: "center", size: 8.5 });
    });

    const rightY = drawDocuments(ctx, data, rightX, sectionY, rightW);

    const noteY = Math.max(financeY + 166, rightY + 14, 620);
    drawCell(ctx, margin, noteY, fullWidth, 66, "NOTA: Si al momento de la devolución no se entregan boletas, comprobantes de pago o certificados exigidos, el usuario dispondrá de 5 días hábiles para regularizar las observaciones. Plazo para efectuar observaciones: 30 días desde la fecha de la presente acta.", { fill: "#f7f8f8", size: 9, padding: 10, maxLines: 4 });
    const signY = noteY + 82;
    const signGap = 14;
    const signW = (fullWidth - signGap) / 2;
    const signH = 190;
    drawSignature(ctx, "recibe", "Recibe", data.firmaNombre_recibe, margin, signY, signW, signH);
    drawSignature(ctx, "devuelve", "Devuelve", data.firmaNombre_devuelve, margin + signW + signGap, signY, signW, signH);
    drawSignature(ctx, "inspector", "Inspector fiscal", data.firmaNombre_inspector, margin, signY + signH + 14, signW, signH);
    drawSignature(ctx, "jefe", "Jefe Depto. / Sección Habitacional", data.firmaNombre_jefe, margin + signW + signGap, signY + signH + 14, signW, signH);
    return canvas;
  }

  function drawDocuments(ctx, data, x, y, width) {
    drawCell(ctx, x, y, width, 30, "DOCUMENTOS ENTREGADOS", { fill: "#273746", color: "#fff", align: "center", weight: 700, size: 10 });
    let rowY = y + 30;
    documentItems.forEach(([id, label]) => {
      drawCell(ctx, x, rowY, width - 60, 26, label, { size: 8.5 });
      drawCell(ctx, x + width - 60, rowY, 60, 26, data[`doc_${id}`] ? "SÍ" : "", { fill: data[`doc_${id}`] ? "#e6f5ec" : "#fff", color: "#25865a", align: "center", weight: 700, size: 8.5 });
      rowY += 26;
    });
    return rowY;
  }

  function renderDocumentPages() {
    const data = collectFormData();
    state.previewCanvases = [
      drawMatrixPage(1, locations.slice(0, 9), data),
      drawMatrixPage(2, locations.slice(9), data),
      drawNoveltiesPage(data),
      drawClosingPage(data),
    ];
    renderPreviewTabs();
    showPreviewPage(state.previewPage);
  }

  function renderPreviewTabs() {
    document.querySelector("#previewTabs").innerHTML = state.previewCanvases.map((_, index) => `<button type="button" class="${index === state.previewPage ? "is-active" : ""}" data-preview-page="${index}">Página ${index + 1}</button>`).join("");
    document.querySelectorAll("[data-preview-page]").forEach((button) => button.addEventListener("click", () => showPreviewPage(Number(button.dataset.previewPage))));
  }

  function showPreviewPage(index) {
    state.previewPage = Math.max(0, Math.min(index, state.previewCanvases.length - 1));
    const source = state.previewCanvases[state.previewPage];
    const target = document.querySelector("#previewCanvas");
    target.width = source.width;
    target.height = source.height;
    target.getContext("2d").drawImage(source, 0, 0);
    document.querySelectorAll("[data-preview-page]").forEach((button) => button.classList.toggle("is-active", Number(button.dataset.previewPage) === state.previewPage));
  }

  function dataUrlToBytes(dataUrl) {
    const binary = atob(dataUrl.split(",")[1]);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return bytes;
  }

  function ascii(value) { return new TextEncoder().encode(value); }

  function createPdfBlob(canvases) {
    const images = canvases.map((canvas) => dataUrlToBytes(canvas.toDataURL("image/jpeg", 0.93)));
    const objectCount = 2 + canvases.length * 3;
    const chunks = [];
    const offsets = new Array(objectCount + 1).fill(0);
    let byteLength = 0;
    const add = (chunk) => { const bytes = typeof chunk === "string" ? ascii(chunk) : chunk; chunks.push(bytes); byteLength += bytes.length; };
    const addObject = (id, parts) => { offsets[id] = byteLength; add(`${id} 0 obj\n`); parts.forEach(add); add("\nendobj\n"); };
    add(new Uint8Array([37, 80, 68, 70, 45, 49, 46, 52, 10, 37, 255, 255, 255, 255, 10]));
    addObject(1, ["<< /Type /Catalog /Pages 2 0 R >>"]);
    const pageIds = canvases.map((_, index) => 3 + index * 3);
    addObject(2, [`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${canvases.length} >>`]);
    canvases.forEach((canvas, index) => {
      const pageId = 3 + index * 3;
      const imageId = pageId + 1;
      const contentId = pageId + 2;
      addObject(pageId, [`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PDF_WIDTH} ${PDF_HEIGHT}] /Resources << /XObject << /Im${index + 1} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`]);
      addObject(imageId, [`<< /Type /XObject /Subtype /Image /Width ${PAGE_WIDTH} /Height ${PAGE_HEIGHT} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${images[index].length} >>\nstream\n`, images[index], "\nendstream"]);
      const content = `q\n${PDF_WIDTH} 0 0 ${PDF_HEIGHT} 0 0 cm\n/Im${index + 1} Do\nQ`;
      addObject(contentId, [`<< /Length ${content.length} >>\nstream\n${content}\nendstream`]);
    });
    const xrefOffset = byteLength;
    let xref = `xref\n0 ${objectCount + 1}\n0000000000 65535 f \n`;
    for (let id = 1; id <= objectCount; id += 1) xref += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
    xref += `trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    add(xref);
    return new Blob(chunks, { type: "application/pdf" });
  }

  function safeFilename(value) {
    return String(value || "sin-nombre").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 55);
  }

  function downloadPdf() {
    if (!ensureInitialDataIsValid()) return;
    saveDraft();
    renderDocumentPages();
    const button = document.querySelector("#downloadPdf");
    const original = button.innerHTML;
    button.disabled = true;
    button.textContent = "Generando PDF…";
    window.setTimeout(() => {
      try {
        const blob = createPdfBlob(state.previewCanvases);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const data = collectFormData();
        link.href = url;
        link.download = `acta-2-vivienda-${safeFilename(data.nombre || data.rut)}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 3000);
        showToast("PDF descargado correctamente");
        window.setTimeout(() => openFinishModal(true), 350);
      } catch (error) {
        console.error(error);
        showToast("No fue posible generar el PDF");
      } finally {
        button.disabled = false;
        button.innerHTML = original;
      }
    }, 60);
  }

  function initializeDefaults() {
    const date = form.querySelector('[name="fecha"]');
    if (date && !date.value) date.value = window.ActaValidation.localDateValue();
  }

  function initialize() {
    state.matrix = emptyMatrix();
    state.novelties = Object.fromEntries(locations.map(([id]) => [id, ""]));
    state.exterior = Object.fromEntries(exteriorItems.map(([id]) => [id, { value: "", detail: "" }]));
    renderDocumentChecks();
    renderSignatureCards();
    loadDraft();
    initializeDefaults();
    initialValidation = window.ActaValidation.setup(form, {
      fieldNames: ["grado", "rut", "empleado", "nombre", "unidad", "rutConyuge", "fecha", "villa", "calle", "block", "deptoCasa", "numero"],
    });
    renderLocationTabs();
    renderMatrixGroups();
    renderNoveltyControls();
    renderExteriorRows();
    setupSignaturePads();
    setupEvents();
    updateProgress();
    showStep(0);
  }

  initialize();
})();
