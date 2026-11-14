(() => {
  "use strict";

  const STORAGE_KEY = "actas-vvff-acta2-v1";
  // Oficio chileno (8,5 x 13 pulgadas), igual al formulario impreso.
  const PAGE_WIDTH = 1275;
  const PAGE_HEIGHT = 1950;
  const PDF_WIDTH = 612;
  const PDF_HEIGHT = 936;

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
      canvas.draggable = false;
      canvas.addEventListener("selectstart", (event) => event.preventDefault());
      canvas.addEventListener("dragstart", (event) => event.preventDefault());
      canvas.addEventListener("pointerdown", (event) => beginStroke(event, pad), { passive: false });
      canvas.addEventListener("pointermove", (event) => continueStroke(event, pad), { passive: false });
      canvas.addEventListener("pointerup", () => endStroke(pad));
      canvas.addEventListener("pointercancel", () => endStroke(pad));
      canvas.addEventListener("pointerleave", () => { if (pad.activeStroke) endStroke(pad); });

      const signatureTitle = canvas.getAttribute("aria-label")?.replace(/^Área de firma:\s*/, "") || "Firma";
      window.ActaSecurity.installFullscreenSignature(pad, {
        title: signatureTitle,
        onResize: () => resizeSignaturePad(pad),
        onClear: () => {
          pad.strokes = [];
          redrawSignaturePad(pad);
          scheduleSave();
          updateProgress();
        },
        onClose: () => {
          scheduleSave();
          updateProgress();
        },
      });
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
    if (rect.width < 2 || rect.height < 2) return;
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
    nextButton.innerHTML = state.currentStep === stepSections.length - 1 ? `${window.ActaSecurity.pdfActionLabel} <svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>` : `Continuar <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>`;
    document.querySelector("#stepCounter").textContent = state.currentStep + 1;
    if (state.currentStep === 3) window.requestAnimationFrame(() => Object.values(state.signaturePads).forEach(resizeSignaturePad));
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

  function setFont(ctx, size = 12, weight = 400, style = "normal") { ctx.font = `${style} ${weight} ${size}px Arial, sans-serif`; }

  function wrapLines(ctx, text, maxWidth) {
    const words = String(text || "").split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";
    words.forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(candidate).width > maxWidth) { lines.push(line); line = word; } else line = candidate;
    });
    if (line) lines.push(line);
    return lines.length ? lines : [""];
  }

  function drawCell(ctx, x, y, width, height, text = "", options = {}) {
    const { fill = "#fff", stroke = "#111", size = 11, weight = 400, align = "left", padding = 5, color = "#111", maxLines = 3, lineWidth = 1.2 } = options;
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(x, y, width, height);
    setFont(ctx, size, weight);
    ctx.fillStyle = color;
    ctx.textAlign = align;
    const lines = wrapLines(ctx, text, Math.max(1, width - padding * 2)).slice(0, maxLines);
    const lineHeight = size * 1.14;
    const startY = y + height / 2 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, index) => {
      const textX = align === "center" ? x + width / 2 : align === "right" ? x + width - padding : x + padding;
      ctx.fillText(line, textX, startY + index * lineHeight);
    });
  }

  function formatDate(value) {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return `${day || ""}-${month || ""}-${year || ""}`;
  }

  function dateParts(value) {
    if (!value) return { day: "", month: "", year: "" };
    const [year, month, day] = value.split("-");
    const monthName = ["", "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"][Number(month)] || month;
    return { day, month: monthName, year };
  }

  function drawOrganization(ctx) {
    setFont(ctx, 15, 400); ctx.fillStyle = "#111"; ctx.textAlign = "left";
    ctx.fillText("FUERZA AÉREA DE CHILE", 82, 70);
    ctx.fillText("COMANDO DE PERSONAL", 82, 96);
    setFont(ctx, 15, 400); ctx.fillText("DIVISIÓN DE BIENESTAR SOCIAL", 82, 122);
    ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(82, 134); ctx.lineTo(306, 134); ctx.stroke();
  }

  function drawPersonnelBox(ctx, data) {
    const x = 720, y = 48, w = 478;
    drawCell(ctx, x, y, w, 54, "", { lineWidth: 2 });
    setFont(ctx, 12, 700); ctx.textAlign = "left";
    ctx.fillText(`GRADO  ${data.grado || ""}`, x + 8, y + 18);
    ctx.fillText(`RUT  ${data.rut || ""}`, x + 172, y + 18);
    ctx.fillText(`NRO. EMPL.  ${data.empleado || ""}`, x + 322, y + 18);
    drawCell(ctx, x, y + 54, w, 54, `NOMBRE  ${data.nombre || ""}`, { weight: 700, size: 12, lineWidth: 2 });
    drawCell(ctx, x, y + 108, w, 54, "", { lineWidth: 2 });
    setFont(ctx, 12, 700); ctx.fillText(`UNIDAD  ${data.unidad || ""}`, x + 8, y + 126);
    ctx.fillText(`RUT CÓNYUGE FACH  ${data.rutConyuge || ""}`, x + 204, y + 126);
  }

  function drawActa2Heading(ctx, data) {
    drawOrganization(ctx);
    drawPersonnelBox(ctx, data);
    setFont(ctx, 17, 700); ctx.textAlign = "left"; ctx.fillStyle = "#111";
    const selected = (label) => data.tipoOperacion === label ? "X" : "";
    ctx.fillText(`ACTA DE ENTREGA / DEVOLUCIÓN DE VIVIENDA FISCAL   (1° Vez ${selected("1ª vez")}   Definitiva ${selected("Definitiva")}   Cambio ${selected("Cambio")})`, 54, 232);
    ctx.beginPath(); ctx.moveTo(54, 246); ctx.lineTo(678, 246); ctx.stroke();
    const parts = dateParts(data.fecha);
    const address = `Villa ${data.villa || ""}   Calle ${data.calle || ""}   Block ${data.block || ""}   Depto. o Casa ${data.deptoCasa || ""}`;
    drawCell(ctx, 54, 270, 1167, 132, "", { lineWidth: 2 });
    setFont(ctx, 14, 400); ctx.textAlign = "left";
    ctx.fillText(`En Santiago, a ${parts.day} días del mes de ${parts.month} de ${parts.year}, el jefe del Departamento Habitacional, procedió a entregar la`, 62, 296);
    ctx.fillText("vivienda fiscal ubicada en:", 62, 322);
    ctx.fillText(address, 62, 362);
    ctx.fillText(`N° ${data.numero || ""}, con las observaciones que a continuación se detallan:`, 62, 388);
  }

  function drawMatrix(ctx, locationSlice, selectedGroups, x, y, width, rowHeight) {
    const groupWidth = 118;
    const detailWidth = 190;
    const roomWidth = (width - groupWidth - detailWidth) / locationSlice.length;
    const headerHeight = 54;
    drawCell(ctx, x, y, groupWidth, headerHeight, "ÍTEM", { align: "center", weight: 700, size: 10, lineWidth: 2 });
    drawCell(ctx, x + groupWidth, y, detailWidth, headerHeight, "DETALLE", { align: "center", weight: 700, size: 10, lineWidth: 2 });
    locationSlice.forEach(([, name], index) => drawCell(ctx, x + groupWidth + detailWidth + roomWidth * index, y, roomWidth, headerHeight, name.toUpperCase().replace("DORMITORIO", "DORM."), { align: "center", weight: 700, size: 8.2, padding: 2, maxLines: 2, lineWidth: 2 }));
    y += headerHeight;
    selectedGroups.forEach((group) => {
      drawCell(ctx, x, y, groupWidth, group.items.length * rowHeight, group.name.toUpperCase(), { align: "center", weight: 700, size: 8.2, padding: 4, maxLines: 5, lineWidth: 1.6 });
      group.items.forEach(([itemId, itemName]) => {
        drawCell(ctx, x + groupWidth, y, detailWidth, rowHeight, itemName.toUpperCase(), { size: 8.2, padding: 4 });
        locationSlice.forEach(([locationId], index) => drawCell(ctx, x + groupWidth + detailWidth + roomWidth * index, y, roomWidth, rowHeight, state.matrix[locationId]?.[itemId] || "", { align: "center", weight: 700, size: 10 }));
        y += rowHeight;
      });
    });
    return y;
  }

  function drawExterior(ctx, x, y, width) {
    const labelWidth = 250;
    const valueWidth = 92;
    drawCell(ctx, x, y, labelWidth, 28, "EXTERIOR VIVIENDA", { weight: 700, size: 9, lineWidth: 2 });
    drawCell(ctx, x + labelWidth, y, valueWidth * 3, 28, "CONDICIÓN", { align: "center", weight: 700, size: 9, lineWidth: 2 });
    setFont(ctx, 10, 700); ctx.textAlign = "left";
    ctx.fillText("B: BUENO", x + labelWidth + valueWidth * 3 + 65, y + 45);
    ctx.fillText("R: REGULAR", x + labelWidth + valueWidth * 3 + 65, y + 91);
    ctx.fillText("M: MALO", x + labelWidth + valueWidth * 3 + 65, y + 137);
    exteriorItems.forEach(([id, name], index) => {
      const rowY = y + 28 + index * 22;
      const item = state.exterior[id] || { value: "", detail: "" };
      drawCell(ctx, x, rowY, labelWidth, 22, name.toUpperCase(), { size: 7.8 });
      drawCell(ctx, x + labelWidth, rowY, valueWidth, 22, item.value === "Sí" ? "SÍ" : "", { align: "center", size: 8.4 });
      drawCell(ctx, x + labelWidth + valueWidth, rowY, valueWidth, 22, item.value === "No" ? "NO" : "", { align: "center", size: 8.4 });
      drawCell(ctx, x + labelWidth + valueWidth * 2, rowY, valueWidth, 22, item.detail || "", { align: "center", size: 7.4 });
    });
    return y + 28 + exteriorItems.length * 22;
  }

  function drawFirstPage(data) {
    const { canvas, ctx } = createPage();
    drawActa2Heading(ctx, data);
    const pageGroups = groups.filter((group) => ["pintura", "ventanas", "puertas", "closet", "electrica", "pisos", "varios"].includes(group.id));
    const endY = drawMatrix(ctx, locations.slice(0, 12), pageGroups, 54, 428, 1167, 22.5);
    drawExterior(ctx, 54, endY, 1167);
    return canvas;
  }

  function drawNoveltiesPage() {
    const { canvas, ctx } = createPage();
    setFont(ctx, 18, 700); ctx.fillStyle = "#111"; ctx.textAlign = "center";
    ctx.fillText("DETALLE DE NOVEDADES", PAGE_WIDTH / 2, 62);
    const noveltyRows = [
      ["hall", "Hall"], ["living", "Living"], ["comedor", "Comedor"], ["dorm1", "Dormitorio 1"], ["dorm2", "Dormitorio 2"], ["dorm3", "Dormitorio 3"],
      ["dorm4", "Dormitorio 4"], ["sala-estar", "Sala de estar"], ["dorm-servicio", "Dorm. servicio"], ["cocina", "Cocina"], ["bano1", "Baño 1"],
      ["bano2", "Baño 2"], ["bano3", "Baño 3"], ["bano4", "Baño 4"], ["loggia", "Loggia"], ["otros", "Otros"],
    ];
    const others = ["terraza", "pasillo", "bodega"].map((id) => state.novelties[id]).filter(Boolean).join(" | ");
    let y = 88;
    noveltyRows.forEach(([id, name]) => {
      drawCell(ctx, 54, y, 165, 105, name.toUpperCase(), { size: 10, weight: 700 });
      drawCell(ctx, 219, y, 1002, 105, id === "otros" ? others : state.novelties[id] || "", { size: 10, padding: 9, maxLines: 7 });
      y += 105;
    });
    return canvas;
  }

  function drawFinancePanel(ctx, data, x, y, width) {
    drawCell(ctx, x, y, width, 34, "USO SECCIÓN GESTIÓN FINANCIERA", { align: "center", weight: 700, size: 10, lineWidth: 2 });
    drawCell(ctx, x, y + 34, 90, 56, "ÍTEM", { align: "center", weight: 700, size: 8, lineWidth: 2 });
    drawCell(ctx, x + 90, y + 34, (width - 90) / 2, 28, "DEVOLUCIÓN", { align: "center", weight: 700, size: 8, lineWidth: 2 });
    drawCell(ctx, x + 90, y + 62, (width - 90) / 2, 28, "CESE DESCUENTO", { align: "center", weight: 700, size: 7, lineWidth: 2 });
    drawCell(ctx, x + 90 + (width - 90) / 2, y + 34, (width - 90) / 2, 28, "ENTREGA", { align: "center", weight: 700, size: 8, lineWidth: 2 });
    drawCell(ctx, x + 90 + (width - 90) / 2, y + 62, (width - 90) / 2, 28, "INICIO DESCUENTO", { align: "center", weight: 700, size: 7, lineWidth: 2 });
    const rows = [["DRAA 5,5%", formatDate(data.draaCese), formatDate(data.draaInicio)], ["GASTO COMÚN", formatDate(data.gastoCese), formatDate(data.gastoInicio)], ["FECHA", formatDate(data.fechaGestion), data.responsableFinanzas || ""]];
    rows.forEach((row, index) => {
      const rowY = y + 90 + index * 48;
      drawCell(ctx, x, rowY, 90, 48, row[0], { weight: 700, size: 7.5 });
      drawCell(ctx, x + 90, rowY, (width - 90) / 2, 48, row[1], { align: "center", size: 8 });
      drawCell(ctx, x + 90 + (width - 90) / 2, rowY, (width - 90) / 2, 48, row[2], { align: "center", size: 8 });
    });
    drawCell(ctx, x, y + 234, width, 44, "FIRMA RESPONSABLE", { align: "center", weight: 700, size: 8, lineWidth: 2 });
    drawCell(ctx, x, y + 278, width, 92, data.responsableFinanzas || "NOMBRE RESPONSABLE", { align: "center", weight: 700, size: 8, lineWidth: 2 });
    return y + 370;
  }

  function drawAdministrativePanel(ctx, data, x, y, width) {
    drawCell(ctx, x, y, 165, 45, "ROL PROPIEDAD", { align: "center", weight: 700, size: 8, lineWidth: 2 });
    drawCell(ctx, x + 165, y, width - 165, 45, data.rolPropiedad || "", { align: "center", size: 8, lineWidth: 2 });
    drawCell(ctx, x, y + 54, width, 30, "N° CLIENTE CONSUMOS BÁSICOS", { align: "center", weight: 700, size: 8, lineWidth: 2 });
    [["AGUA", data.clienteAgua], ["ELECT.", data.clienteElectricidad], ["GAS", data.clienteGas]].forEach((row, index) => {
      drawCell(ctx, x, y + 84 + index * 46, 82, 46, row[0], { align: "center", weight: 700, size: 8 });
      drawCell(ctx, x + 82, y + 84 + index * 46, width - 82, 46, row[1] || "", { size: 8 });
    });
    let rowY = y + 230;
    drawCell(ctx, x, rowY, width, 28, "ENTREGA BOLETAS Y BOUCHER DE PAGOS", { weight: 700, size: 7.5, lineWidth: 2 });
    rowY += 28;
    drawCell(ctx, x, rowY, 82, 28, "", { lineWidth: 2 }); drawCell(ctx, x + 82, rowY, (width - 82) / 2, 28, "BOLETA", { align: "center", weight: 700, size: 7, lineWidth: 2 }); drawCell(ctx, x + 82 + (width - 82) / 2, rowY, (width - 82) / 2, 28, "BOUCHER", { align: "center", weight: 700, size: 7, lineWidth: 2 });
    rowY += 28;
    const docs = [["AGUA", "boleta-agua", "pago-agua"], ["ELECT.", "boleta-electricidad", "pago-electricidad"], ["GAS", "boleta-gas", "pago-gas"], ["ASEO DOM.", "boleta-aseo", "pago-aseo"]];
    docs.forEach(([label, bill, receipt]) => {
      drawCell(ctx, x, rowY, 82, 28, label, { weight: 700, size: 7 });
      drawCell(ctx, x + 82, rowY, (width - 82) / 2, 28, data[`doc_${bill}`] ? "X" : "", { align: "center", weight: 700, size: 9 });
      drawCell(ctx, x + 82 + (width - 82) / 2, rowY, (width - 82) / 2, 28, data[`doc_${receipt}`] ? "X" : "", { align: "center", weight: 700, size: 9 });
      rowY += 28;
    });
    rowY += 12;
    [["ENTREGA CERTIFICADOS", ""], ["JJ.AA.", data["doc_cert-junta"] ? "X" : ""], ["NOTARIO", data["doc_cert-notario"] ? "X" : ""], ["CALEF-CALD-ENC", data["doc_cert-calefon"] ? "X" : ""]].forEach((row) => {
      drawCell(ctx, x, rowY, 165, 28, row[0], { weight: 700, size: 7.2 }); drawCell(ctx, x + 165, rowY, width - 165, 28, row[1], { align: "center", weight: 700, size: 8 }); rowY += 28;
    });
    drawCell(ctx, x, rowY, width, 28, "ESTADO DE CONSUMOS", { align: "center", weight: 700, size: 8, lineWidth: 2 }); rowY += 28;
    [["LUZ", data.estadoLuz], ["AGUA", data.estadoAgua], ["GAS", data.estadoGas], ["ASEO DOM.", data.aseoDomiciliario], ["G. COMUNES", data.gastosComunes], ["N° DE LLAVES", data.numeroLlaves], ["CTRL REMOTO", data.controlesRemotos]].forEach((row) => {
      drawCell(ctx, x, rowY, 165, 27, row[0], { weight: 700, size: 7 }); drawCell(ctx, x + 165, rowY, width - 165, 27, row[1] || "", { size: 7.5 }); rowY += 27;
    });
    return rowY;
  }

  function drawSignatureLine(ctx, key, title, name, x, y, width, height) {
    const pad = state.signaturePads[key];
    if (pad?.strokes.length) ctx.drawImage(pad.canvas, x + 20, y, width - 40, height - 42);
    ctx.strokeStyle = "#111"; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(x + 18, y + height - 40); ctx.lineTo(x + width - 18, y + height - 40); ctx.stroke();
    setFont(ctx, 9, 700); ctx.fillStyle = "#111"; ctx.textAlign = "center"; ctx.fillText(title.toUpperCase(), x + width / 2, y + height - 24);
    setFont(ctx, 8, 400); ctx.fillText(name || "", x + width / 2, y + height - 10);
  }

  function drawThirdPage(data) {
    const { canvas, ctx } = createPage();
    const pageGroups = groups.filter((group) => ["pintura", "ventanas", "puertas", "electrica", "lavaplatos", "mueble-lavaplatos", "gas", "muebles", "pisos", "accesorios"].includes(group.id));
    drawMatrix(ctx, locations.slice(12), pageGroups, 54, 54, 725, 17.1);
    drawFinancePanel(ctx, data, 820, 54, 401);
    drawAdministrativePanel(ctx, data, 820, 450, 401);
    drawCell(ctx, 54, 1115, 1167, 30, "DETALLE DE NOVEDADES", { weight: 700, size: 12, lineWidth: 0 });
    drawCell(ctx, 54, 1145, 1167, 92, "NOTA: Si al momento de la devolución de la vivienda fiscal el usuario no entrega las boletas, comprobantes de pago de consumos básicos, pago por aseo domiciliario, mantención del calefón o los certificados requeridos, dispondrá de 5 días hábiles para regularizar las observaciones.", { size: 8.8, weight: 700, padding: 8, maxLines: 6 });
    setFont(ctx, 9, 700); ctx.textAlign = "center"; ctx.fillText("Plazo para efectuar observaciones: 30 días a contar de la fecha de la presente Acta (Sólo por escrito)", PAGE_WIDTH / 2, 1262);
    drawSignatureLine(ctx, "recibe", "Recibe", data.firmaNombre_recibe, 55, 1320, 340, 170);
    drawSignatureLine(ctx, "devuelve", "Devuelve", data.firmaNombre_devuelve, 468, 1320, 340, 170);
    drawSignatureLine(ctx, "inspector", "Inspector fiscal", data.firmaNombre_inspector, 881, 1320, 340, 170);
    drawSignatureLine(ctx, "jefe", "Jefe Depto. / Sección Habitacional", data.firmaNombre_jefe, 360, 1550, 555, 175);
    return canvas;
  }

  function renderDocumentPages() {
    const data = collectFormData();
    state.previewCanvases = [drawFirstPage(data), drawNoveltiesPage(), drawThirdPage(data)];
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

  async function downloadPdf() {
    if (!ensureInitialDataIsValid()) return;
    saveDraft();
    renderDocumentPages();
    const button = document.querySelector("#downloadPdf");
    const original = button.innerHTML;
    button.disabled = true;
    button.textContent = "Generando PDF…";
    try {
      const blob = createPdfBlob(state.previewCanvases);
      const data = collectFormData();
      const filename = `acta-2-vivienda-${safeFilename(data.nombre || data.rut)}.pdf`;
      const result = await window.ActaSecurity.deliverPdf(blob, filename, "Acta 2 de vivienda fiscal");
      saveDraft();
      showToast(result === "shared" ? "PDF listo para guardar o compartir. Tu borrador se mantiene." : result === "opened" ? "PDF abierto. Usa Compartir para guardarlo; tu borrador se mantiene." : "PDF descargado. Tu borrador se mantiene.");
    } catch (error) {
      if (error?.name === "AbortError") showToast("Acción cancelada. Tu borrador se mantiene.");
      else { console.error(error); showToast("No fue posible generar el PDF"); }
    } finally {
      button.disabled = false;
      button.innerHTML = original;
    }
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
    document.querySelector("#downloadPdf").textContent = window.ActaSecurity.pdfActionLabel;
    updateProgress();
    showStep(0);
  }

  initialize();
})();
