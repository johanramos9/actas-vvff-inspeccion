(() => {
  "use strict";

  const STORAGE_KEY = "actas-vvff-acta3-v1";
  const PAGE_WIDTH = 1754;
  const PAGE_HEIGHT = 1240;
  const PDF_WIDTH = 841.89;
  const PDF_HEIGHT = 595.28;

  const zones = [
    {
      id: "cocina-logia", name: "Cocina y logia", locations: [["cocina", "Cocina", "C"], ["logia", "Logia", "L"]],
      groups: [
        { id: "lavaplatos", name: "Conjunto lavaplatos", items: [
          ["mueble-puertas", "Mueble · Puertas, manillas y bisagras", "Sin óxido y limpieza general."],
          ["mueble-tapacantos", "Mueble · Tapacantos", "Pegados y sin cortes."],
          ["mueble-madera", "Mueble · Madera", "Buen estado."],
          ["lavaplatos", "Lavaplatos", "Sin óxido, limpio y con sello de silicona."],
          ["llaves", "Llaves", "Sin goteras y limpieza general."],
          ["flexibles", "Flexibles", "Sin óxido y sin goteras."],
          ["sifon", "Sifón", "Destapado y sin filtración."],
        ] },
        { id: "campana", name: "Campana", items: [
          ["campana", "Campana", "Funcionamiento y limpieza general."], ["ampolletas", "Ampolletas", "Funcionamiento general."],
          ["filtro", "Filtro", "Nuevo y limpio."], ["vidrio-campana", "Vidrio", "Sin trizaduras y limpio."],
        ] },
        { id: "muebles-cocina", name: "Muebles colgantes y de base", items: [
          ["muebles-puertas", "Puertas, manillas y bisagras", "Afianzadas, limpias y sin óxido."], ["cubierta", "Cubierta", "Limpieza general."],
          ["divisiones", "Divisiones", "Afianzadas y limpias."], ["tapacantos", "Tapacantos", "Pegados y sin cortes."], ["madera", "Madera", "Buen estado."],
        ] },
        { id: "electrica", name: "Instalación eléctrica", items: [
          ["enchufes", "Enchufe(s)", "Afianzado(s), con energía y limpios."], ["interruptores", "Interruptor(es)", "Afianzado(s), con energía y limpios."],
          ["soquetes", "Soquete(s)", "Con ampolletas y funcionando."], ["termo", "Termo", "Certificado y funcionamiento."],
        ] },
        { id: "gas", name: "Instalación de gas", items: [
          ["llave-paso", "Llave de paso", "Funcionamiento y sin filtraciones."], ["calefont", "Calefont", "Certificado y funcionamiento."],
        ] },
        { id: "pintura", name: "Pintura", items: [
          ["cielo", "Cielo", "Continuidad en la aplicación."], ["junquillos", "Junquillos", "Buena terminación."], ["muros", "Muros", "Continuidad en la aplicación."],
          ["guardapolvos", "Guardapolvos", "Buena terminación."], ["puertas-pintura", "Puerta(s)", "Sin perforaciones."],
        ] },
        { id: "ceramicos", name: "Cerámicos", items: [
          ["ceramico-piso", "Cerámico piso", "Sin trizaduras ni perforaciones."], ["ceramico-muro", "Cerámico muro", "Limpieza general."],
        ] },
        { id: "puerta", name: "Puerta", items: [
          ["puerta-llaves", "Llaves", "Funcionamiento."], ["cerradura", "Cerradura", "Funcionamiento."], ["bisagras", "Bisagras", "Afianzadas, limpias y sin óxido."],
          ["seguros", "Seguros bloq.", "Funcionamiento."], ["tope", "Tope de puerta", "Afianzado."], ["ventana-puerta", "Ventana", "Vidrio limpio y sin trizaduras."],
          ["puerta-madera", "Madera", "Buen estado y cuadratura."],
        ] },
        { id: "ventanas", name: "Conjunto ventanas", items: [
          ["vidrios", "Vidrios", "Sin trizaduras y limpios."], ["marcos", "Marcos / rieles", "Afianzados, funcionando y limpios."], ["seguros-ventana", "Seguros", "Funcionamiento."],
        ] },
        { id: "lavadero", name: "Conjunto lavadero", items: [
          ["lavadero", "Lavadero", "Limpieza general y sin filtraciones."], ["lavadero-llaves", "Llaves", "Sin goteras y limpias."],
          ["lavadero-flexibles", "Flexibles", "Sin óxido y sin goteras."], ["lavadero-sifon", "Sifón", "Destapado y sin filtración."],
        ] },
      ],
    },
    {
      id: "living", name: "Living, pasillo y terraza", locations: [["living", "Living", "L"], ["pasillo", "Pasillo", "P"], ["terraza", "Terraza", "T"]],
      groups: [
        { id: "closets", name: "Closets", items: [
          ["closet-puertas", "Puertas", "Estado y limpieza."], ["barra", "Barra", "Afianzada y limpia."], ["divisiones", "Divisiones", "Afianzadas y limpias."],
          ["manillas", "Manillas", "Funcionamiento y limpieza."], ["bisagras-riel", "Bisagras o riel", "Afianzadas, limpias y sin óxido."],
          ["guias", "Guías", "Afianzadas."], ["tapacanto", "Tapacanto", "Pegado y sin cortes."], ["madera", "Madera", "Buen estado."],
        ] },
        { id: "electrica", name: "Instalación eléctrica", items: [
          ["tablero", "Tablero", "Funcionamiento y rotulación."], ["citofono", "Citófono / timbre", "Funcionamiento."],
          ["interruptores", "Interruptor(es)", "Afianzado(s), con energía y limpios."], ["enchufes", "Enchufe(s)", "Afianzado(s), con energía y limpios."],
          ["soquetes", "Soquete(s)", "Con ampolletas y funcionando."],
        ] },
        { id: "pintura", name: "Pintura y barniz", items: [
          ["cielo", "Cielo", "Continuidad en la aplicación."], ["junquillos", "Junquillos", "Buena terminación."], ["muros", "Muros", "Continuidad en la aplicación."],
          ["guardapolvos", "Guardapolvos", "Buena terminación."], ["closet-interior", "Closets interior", "Sin perforaciones."],
          ["baranda", "Baranda metálica", "Estado y terminación."], ["puertas-pintura", "Puerta(s)", "Sin perforaciones."],
        ] },
        { id: "piso", name: "Piso / cerámicos", items: [
          ["piso-estado", "Estado", "Sin trizaduras ni perforaciones."], ["piso-limpieza", "Limpieza", "Limpieza general."],
        ] },
        { id: "puerta", name: "Puerta", items: [
          ["llaves", "Llaves (s/c)", "Funcionamiento."], ["cerradura", "Cerradura", "Funcionamiento."], ["perillon", "Perillón", "Funcionamiento."],
          ["numero", "N° de vivienda", "Visible y afianzado."], ["bisagras", "Bisagras", "Afianzadas, limpias y sin óxido."], ["seguros", "Seguros bloq.", "Funcionamiento."],
          ["tope", "Tope de puerta", "Afianzado."], ["madera", "Madera", "Buen estado y cuadratura."],
        ] },
        { id: "ventanas", name: "Conjunto ventanas", items: [
          ["vidrios", "Vidrios", "Sin trizaduras y limpios."], ["marcos", "Marcos / rieles", "Afianzados, funcionando y limpios."], ["seguros-ventana", "Seguros (s/c)", "Funcionamiento."],
        ] },
        { id: "cortinas", name: "Conjunto cortinas", items: [
          ["tela", "Tela", "Limpieza y sin orificios."], ["rieles", "Rieles", "Afianzados."], ["correderas", "Correderas", "Funcionamiento."],
        ] },
        { id: "home-office", name: "Home office", items: [
          ["home-madera", "Madera", "Estado y limpieza."], ["mueble-colgante", "Mueble colgante", "Afianzado y limpio."], ["home-manillas", "Manillas", "Funcionamiento."],
          ["home-bisagras", "Bisagras o riel", "Afianzadas y limpias."], ["escritorio", "Escritorio con bandeja", "Estado y funcionamiento."],
        ] },
      ],
    },
    {
      id: "dormitorios", name: "Dormitorios", locations: [["dorm1", "Dormitorio 1", "1"], ["dorm2", "Dormitorio 2", "2"], ["dorm3", "Dormitorio 3", "3"], ["dorm4", "Dormitorio 4", "4"], ["dorm5", "Dormitorio 5", "5"]],
      groups: [
        { id: "closets", name: "Closets", items: [
          ["puertas", "Puertas", "Estado y limpieza."], ["barra", "Barra", "Afianzada y limpia."], ["divisiones", "Divisiones", "Afianzadas y limpias."], ["manillas", "Manillas", "Funcionamiento."],
          ["bisagras-riel", "Bisagras o riel", "Afianzadas, limpias y sin óxido."], ["guias", "Guías", "Afianzadas."], ["tapacantos", "Tapacantos", "Pegados y sin cortes."], ["madera", "Madera", "Buen estado."],
        ] },
        { id: "electrica", name: "Instalación eléctrica", items: [
          ["enchufes", "Enchufe(s)", "Afianzado(s), con energía y limpios."], ["interruptores", "Interruptor(es)", "Afianzado(s), con energía y limpios."], ["soquetes", "Soquete(s)", "Con ampolletas."],
        ] },
        { id: "pintura", name: "Pintura", items: [
          ["cielo", "Cielo", "Continuidad en la aplicación."], ["junquillos", "Junquillos", "Buena terminación."], ["muros", "Muros", "Continuidad en la aplicación."],
          ["guardapolvos", "Guardapolvos", "Buena terminación."], ["closet-interior", "Closets interiores", "Sin perforaciones."], ["puertas-pintura", "Puerta(s)", "Sin perforaciones."],
        ] },
        { id: "piso", name: "Piso flotante / cerámicos", items: [
          ["piso-estado", "Estado", "Sin trizaduras ni perforaciones."], ["piso-limpieza", "Limpieza", "Limpieza general."],
        ] },
        { id: "puerta", name: "Puerta", items: [
          ["llaves", "Llaves", "Funcionamiento."], ["cerradura", "Cerradura", "Funcionamiento."], ["bisagras", "Bisagras", "Afianzadas, limpias y sin óxido."],
          ["seguros", "Seguros bloq.", "Funcionamiento."], ["tope", "Tope de puerta", "Afianzado."], ["ventana", "Ventana", "Vidrio limpio y sin trizaduras."], ["madera-puerta", "Madera", "Buen estado y cuadratura."],
        ] },
        { id: "ventanas", name: "Conjunto ventanas", items: [
          ["vidrios", "Vidrios", "Sin trizaduras y limpios."], ["marcos", "Marcos / rieles", "Afianzados, funcionando y limpios."], ["seguros-ventana", "Seguros", "Funcionamiento."],
        ] },
        { id: "cortinas", name: "Conjunto cortinas", items: [
          ["tela", "Tela", "Limpieza y sin orificios."], ["rieles", "Rieles", "Afianzados."], ["correderas", "Correderas", "Funcionamiento."],
        ] },
      ],
    },
    {
      id: "banos", name: "Baños", locations: [["bano1", "Baño 1", "1"], ["bano2", "Baño 2", "2"], ["bano3", "Baño 3", "3"], ["bano4", "Baño 4", "4"], ["bano5", "Baño 5", "5"]],
      groups: [
        { id: "lavamanos", name: "Conjunto lavamanos", items: [
          ["vanitorio-puertas", "Vanitorio · Puertas, manillas y bisagras", "Sin óxido y aseo general."], ["vanitorio-tapacanto", "Vanitorio · Tapacanto", "Sin cortes y pegado."],
          ["marmol", "Mármol", "Buen estado."], ["vanitorio-madera", "Madera", "Estado y sello de silicona."], ["lavamanos", "Lavamanos", "Limpieza general."],
          ["llaves", "Llaves", "Sin goteras y limpieza general."], ["flexibles", "Flexibles", "Sin óxido y sin goteras."], ["sifon", "Sifón", "Destapado y sin filtración."],
        ] },
        { id: "tina", name: "Conjunto tina", items: [
          ["barra", "Barra", "Nueva."], ["desague", "Desagüe", "Sin filtración."], ["combinacion", "Combinación", "Afianzada, funcionando y sin filtración."],
          ["jabonera", "Jabonera loza", "Afianzada y limpia."], ["celosia", "Celosía(s)", "Afianzada y limpia."], ["aseo", "Aseo", "Limpieza general y sellos de silicona."],
        ] },
        { id: "wc", name: "Conjunto W.C.", items: [
          ["estanque-taza", "Estanque y taza", "Sin trizaduras, afianzados y limpios."], ["tapa-wc", "Tapa W.C.", "Nueva."], ["fitting", "Fitting", "Funcionamiento."],
        ] },
        { id: "accesorios", name: "Accesorios", items: [
          ["toallero", "Toallero", "Afianzado, sin trizaduras y limpio."], ["porta-rollo", "Porta rollo", "Afianzado, sin trizaduras y limpio."],
          ["percha", "Percha loza", "Afianzada, sin trizaduras y limpia."], ["espejo", "Espejo", "Afianzado, sin trizaduras y limpio."],
        ] },
        { id: "electrica", name: "Instalaciones eléctricas", items: [
          ["enchufes", "Enchufe(s)", "Afianzado(s), con energía y limpios."], ["interruptores", "Interruptor(es)", "Afianzado(s), con energía y limpios."],
          ["soquetes", "Soquete(s)", "Con ampolletas."], ["extractor", "Extractor de aire", "Funcionamiento y limpieza."],
        ] },
        { id: "pintura", name: "Pintura", items: [
          ["cielo", "Cielo", "Continuidad en la aplicación."], ["junquillos", "Junquillos", "Buena terminación."], ["muros", "Muros", "Continuidad en la aplicación."],
          ["guardapolvos", "Guardapolvos", "Buena terminación."], ["puertas-pintura", "Puerta(s)", "Sin perforaciones."],
        ] },
        { id: "ceramicos", name: "Cerámicos", items: [
          ["ceramico-piso", "Cerámico piso", "Sin trizaduras ni perforaciones."], ["ceramico-muro", "Cerámico muro", "Limpieza general."],
        ] },
        { id: "puerta", name: "Puerta(s)", items: [
          ["llaves", "Llaves", "Funcionamiento."], ["cerradura", "Cerradura", "Funcionamiento."], ["seguros", "Seguros bloq.", "Funcionamiento."],
          ["bisagras", "Bisagras", "Condición y limpieza general."], ["tope", "Tope de puerta", "Afianzado."], ["ventana", "Ventana", "Vidrio limpio y sin trizaduras."], ["madera-puerta", "Madera", "Buen estado y cuadratura."],
        ] },
        { id: "ventanas", name: "Conjunto ventanas", items: [
          ["vidrios", "Vidrios", "Sin trizaduras y limpios."], ["marcos", "Marcos / rieles", "Afianzados, funcionando y limpios."], ["seguros-ventana", "Seguros", "Funcionamiento."],
        ] },
      ],
    },
    {
      id: "bodega", name: "Bodega", locations: [["bodega", "Bodega", "B"]],
      groups: [
        { id: "electrica", name: "Instalación eléctrica", items: [["enchufe-soquete", "Enchufe / soquete", "Afianzado(s), con energía y limpios; soquete con ampolleta."], ["interruptor", "Interruptor", "Funcionamiento."]] },
        { id: "puerta", name: "Puerta", items: [["llaves-cerradura", "Llaves / cerradura", "Funcionamiento."], ["bisagras", "Bisagras", "Afianzadas, limpias y sin óxido."], ["tope", "Tope de puerta", "Afianzado."], ["madera", "Madera", "Buen estado y cuadratura."]] },
        { id: "piso", name: "Piso", items: [["piso", "Piso", "Limpieza general."]] },
        { id: "pintura", name: "Pintura", items: [["cielo-muros", "Cielo y muros", "Continuidad en la aplicación."], ["puerta-pintura", "Puerta", "Continuidad en la aplicación."]] },
      ],
    },
    {
      id: "varios", name: "Varios", locations: [["varios", "Varios", "V"]],
      groups: [
        { id: "jardin", name: "Jardín(es)", items: [["cesped", "Césped", "Corto y de color verde."], ["arboles", "Árboles", "Podados."], ["patio", "Patio", "Limpieza general."], ["techo-terraza", "Techo terraza", "Limpieza general."]] },
        { id: "otros", name: "Otros", items: [["asadera", "Asadera", "Estado y limpieza general."], ["timbre", "Timbre", "Estado y funcionamiento."], ["luces", "Luces exteriores", "Afianzadas, limpias, sin óxido y con ampolletas."], ["reja-llaves", "Cerradura reja / portón · Llaves", "Funcionamiento."], ["reja-cerradura", "Cerradura reja / portón · Cerradura", "Funcionamiento."], ["extintor", "Extintor", "Certificado y sin observaciones."], ["inventario", "Inventario", "Registrar observaciones cuando corresponda."]] },
      ],
    },
  ];

  const consumptionItems = [
    ["luz", "Luz"], ["agua", "Agua"], ["gas", "Gas"], ["aseo", "Certif. aseo domicilio"],
    ["gastos", "Certificado gastos comunes"], ["calefont", "Certificado mantto. calefont"],
  ];

  const signatureDefinitions = [
    ["devuelve", "Devuelve"], ["recibe", "Recibe"], ["inspector1", "Inspector VV.FF."],
    ["inspector2", "Inspector VV.FF."], ["encargado", "Encargado Depto. VV.FF."],
  ];

  const state = {
    currentStep: 0,
    currentZone: zones[0].id,
    currentLocation: zones[0].locations[0][0],
    inspection: {},
    signatureStrokes: {},
    signaturePads: {},
    openGroups: new Set(zones.map((zone) => `${zone.id}:${zone.groups[0].id}`)),
    previewPage: 0,
    previewCanvases: [],
  };

  const form = document.querySelector("#acta3Form");
  const stepSections = [...document.querySelectorAll(".form-step")];
  const stepButtons = [...document.querySelectorAll(".step")];
  const previousButton = document.querySelector("#previousStep");
  const nextButton = document.querySelector("#nextStep");
  let saveTimer;
  let toastTimer;
  let initialValidation;

  function currentZone() { return zones.find((zone) => zone.id === state.currentZone) || zones[0]; }
  function currentZoneForLocation(locationId) { return zones.find((zone) => zone.locations.some(([id]) => id === locationId)); }
  function allItems(zone) { return zone.groups.flatMap((group) => group.items.map((item) => ({ id: item[0], name: item[1], review: item[2], group: group.name }))); }

  function emptyInspection() {
    const result = {};
    zones.forEach((zone) => zone.locations.forEach(([locationId]) => {
      result[locationId] = Object.fromEntries(allItems(zone).map((item) => [item.id, { condition: "", cause: "", observation: "" }]));
    }));
    return result;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" })[character]);
  }

  function safeParse(value, fallback) { try { return value ? JSON.parse(value) : fallback; } catch { return fallback; } }

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
    state.inspection = emptyInspection();
    if (!saved) return;
    zones.forEach((zone) => zone.locations.forEach(([locationId]) => allItems(zone).forEach((item) => {
      const incoming = saved.inspection?.[locationId]?.[item.id];
      if (!incoming) return;
      if (["B", "M"].includes(incoming.condition)) state.inspection[locationId][item.id].condition = incoming.condition;
      if (["U", "D", "T"].includes(incoming.cause)) state.inspection[locationId][item.id].cause = incoming.cause;
      state.inspection[locationId][item.id].observation = String(incoming.observation || "").slice(0, 260);
    })));
    state.signatureStrokes = window.ActaSecurity.cleanSignatures(saved.signatures, signatureDefinitions.map(([key]) => key));
    restoreFormData(saved.formData || {});
  }

  function saveDraft({ quiet = true } = {}) {
    const signatures = Object.fromEntries(Object.entries(state.signaturePads).map(([key, pad]) => [key, pad.strokes]));
    try {
      window.ActaSecurity.saveDraft(STORAGE_KEY, { formData: collectFormData(), inspection: state.inspection, signatures });
      document.querySelector("#draftStatus").textContent = `Guardado hoy, ${new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`;
      if (!quiet) showToast("Borrador guardado en este dispositivo");
    } catch {
      document.querySelector("#draftStatus").textContent = "No fue posible guardar el borrador";
    }
    updateProgress();
  }

  function scheduleSave() { window.clearTimeout(saveTimer); saveTimer = window.setTimeout(() => saveDraft(), 350); }

  function showToast(message) {
    const toast = document.querySelector("#toast");
    toast.querySelector("span").textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2300);
  }

  function zoneHasValues(zone) {
    return zone.locations.some(([locationId]) => Object.values(state.inspection[locationId]).some((item) => item.condition));
  }

  function renderZoneTabs() {
    document.querySelector("#zoneTabs").innerHTML = zones.map((zone) => `<button type="button" role="tab" class="zone-tab ${zone.id === state.currentZone ? "is-active" : ""} ${zoneHasValues(zone) ? "has-values" : ""}" data-zone="${zone.id}" aria-selected="${zone.id === state.currentZone}">${zone.name}</button>`).join("");
  }

  function renderLocationTabs() {
    const zone = currentZone();
    document.querySelector("#locationTabs").innerHTML = zone.locations.map(([id, name]) => {
      const hasValues = Object.values(state.inspection[id]).some((item) => item.condition);
      return `<button type="button" role="tab" class="location-tab ${id === state.currentLocation ? "is-active" : ""} ${hasValues ? "has-values" : ""}" data-location="${id}" aria-selected="${id === state.currentLocation}">${name}</button>`;
    }).join("");
    document.querySelector("#currentLocationTitle").textContent = zone.locations.find(([id]) => id === state.currentLocation)?.[1] || zone.name;
  }

  function renderInspectionGroups() {
    const zone = currentZone();
    document.querySelector("#inspectionGroups").innerHTML = zone.groups.map((group, groupIndex) => {
      const groupKey = `${zone.id}:${group.id}`;
      const isOpen = state.openGroups.has(groupKey);
      return `<section class="matrix-group ${isOpen ? "is-open" : ""}" data-group-key="${groupKey}">
        <button type="button" class="matrix-group-toggle" aria-expanded="${isOpen}">
          <span><b>${String(groupIndex + 1).padStart(2, "0")}</b><span><strong>${group.name}</strong><small>${group.items.length} elementos</small></span></span>
          <svg viewBox="0 0 20 20"><path d="m4 7 6 6 6-6"/></svg>
        </button>
        <div class="matrix-group-content" ${isOpen ? "" : "hidden"}>
          ${group.items.map(([id, name, review]) => {
            const item = state.inspection[state.currentLocation][id];
            return `<div class="inspection-row" data-item="${id}">
              <div class="inspection-copy"><strong>${name}</strong><small>${review}</small></div>
              <div class="condition-picker" aria-label="Condición de ${escapeHtml(name)}">
                ${["B", "M"].map((value) => `<button type="button" class="condition-button ${item.condition === value ? "is-selected" : ""}" data-condition="${value}" aria-pressed="${item.condition === value}">${value}</button>`).join("")}
              </div>
              ${item.condition === "M" ? `<div class="inspection-detail">
                <div class="cause-field"><span>Causa</span><div class="cause-picker" aria-label="Causa de la observación">${["U", "D", "T"].map((cause) => `<button type="button" class="cause-button ${item.cause === cause ? "is-selected" : ""}" data-cause="${cause}" title="${cause === "U" ? "Atribuible al usuario" : cause === "D" ? "Atribuible al diseño" : "Atribuible al tiempo"}">${cause}</button>`).join("")}</div></div>
                <label class="observation-field"><span>Observación</span><input type="text" data-observation maxlength="260" value="${escapeHtml(item.observation)}" placeholder="Describe el daño o trabajo pendiente" /></label>
              </div>` : ""}
            </div>`;
          }).join("")}
        </div>
      </section>`;
    }).join("");
  }

  function renderConsumptionRows() {
    document.querySelector("#consumptionRows").innerHTML = consumptionItems.map(([id, label]) => `<div class="consumption-row">
      <strong>${label}</strong>
      <label><span>Devolución</span><input name="cons_${id}_devolucion" type="text" maxlength="50" /></label>
      <label><span>Entrega</span><input name="cons_${id}_entrega" type="text" maxlength="50" /></label>
      <label><span>Observaciones</span><input name="cons_${id}_observacion" type="text" maxlength="120" /></label>
    </div>`).join("");
  }

  function renderSignatureCards() {
    document.querySelector("#signatureGrid").innerHTML = signatureDefinitions.map(([key, title], index) => `<article class="signature-card"><div class="signature-heading"><div><span class="card-kicker">Firma ${String(index + 1).padStart(2, "0")}</span><h3>${title}</h3></div><button type="button" class="clear-signature" data-clear-signature="${key}">Limpiar</button></div><label class="field"><span>Grado y nombre</span><input name="firmaNombre_${key}" type="text" maxlength="80" autocomplete="off" placeholder="Grado y nombre"/></label><div class="signature-pad"><canvas id="signature-${key}" data-signature="${key}" aria-label="Área de firma: ${title}"></canvas><span>Firme dentro del recuadro</span></div></article>`).join("");
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
    nextButton.innerHTML = state.currentStep === 4 ? `Descargar PDF <svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>` : `Continuar <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>`;
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
    const fields = ["grado", "rut", "nombre", "unidad", "fecha", "villa", "direccion", "motivo"];
    const fieldScore = fields.filter((name) => Boolean(data[name])).length / fields.length;
    const inspectionItems = zones.flatMap((zone) => zone.locations.flatMap(([locationId]) => Object.values(state.inspection[locationId])));
    const inspectionScore = inspectionItems.filter((item) => item.condition).length / inspectionItems.length;
    const closeScore = [data.condicionFinal, ...consumptionItems.map(([id]) => data[`cons_${id}_entrega`] || data[`cons_${id}_devolucion`])].filter(Boolean).length / (consumptionItems.length + 1);
    const signatureScore = signatureDefinitions.filter(([key]) => state.signaturePads[key]?.strokes.length).length / signatureDefinitions.length;
    const percentage = Math.round((fieldScore * 0.28 + inspectionScore * 0.42 + closeScore * 0.1 + signatureScore * 0.2) * 100);
    document.querySelector("#progressValue").textContent = `${percentage}%`;
    document.querySelector("#progressBar").value = percentage;
  }

  function setupEvents() {
    form.addEventListener("input", scheduleSave);
    form.addEventListener("change", scheduleSave);
    stepButtons.forEach((button) => button.addEventListener("click", () => requestStep(Number(button.dataset.stepTarget))));
    previousButton.addEventListener("click", () => showStep(state.currentStep - 1));
    nextButton.addEventListener("click", () => state.currentStep === 4 ? downloadPdf() : requestStep(state.currentStep + 1));

    document.querySelector("#zoneTabs").addEventListener("click", (event) => {
      const button = event.target.closest("[data-zone]");
      if (!button) return;
      state.currentZone = button.dataset.zone;
      state.currentLocation = currentZone().locations[0][0];
      renderZoneTabs();
      renderLocationTabs();
      renderInspectionGroups();
    });

    document.querySelector("#locationTabs").addEventListener("click", (event) => {
      const button = event.target.closest("[data-location]");
      if (!button) return;
      state.currentLocation = button.dataset.location;
      renderLocationTabs();
      renderInspectionGroups();
    });

    document.querySelector("#inspectionGroups").addEventListener("click", (event) => {
      const toggle = event.target.closest(".matrix-group-toggle");
      if (toggle) {
        const group = toggle.closest(".matrix-group");
        const content = group.querySelector(".matrix-group-content");
        const open = !group.classList.contains("is-open");
        if (open) state.openGroups.add(group.dataset.groupKey); else state.openGroups.delete(group.dataset.groupKey);
        group.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        content.hidden = !open;
        return;
      }
      const row = event.target.closest("[data-item]");
      if (!row) return;
      const item = state.inspection[state.currentLocation][row.dataset.item];
      const conditionButton = event.target.closest("[data-condition]");
      if (conditionButton) {
        item.condition = item.condition === conditionButton.dataset.condition ? "" : conditionButton.dataset.condition;
        if (item.condition !== "M") { item.cause = ""; item.observation = ""; }
        renderInspectionGroups();
        renderLocationTabs();
        renderZoneTabs();
        scheduleSave();
        return;
      }
      const causeButton = event.target.closest("[data-cause]");
      if (causeButton) {
        item.cause = item.cause === causeButton.dataset.cause ? "" : causeButton.dataset.cause;
        renderInspectionGroups();
        scheduleSave();
      }
    });

    document.querySelector("#inspectionGroups").addEventListener("input", (event) => {
      if (!event.target.matches("[data-observation]")) return;
      const row = event.target.closest("[data-item]");
      state.inspection[state.currentLocation][row.dataset.item].observation = event.target.value.slice(0, 260);
      scheduleSave();
    });

    document.querySelector("#markAllGood").addEventListener("click", () => {
      Object.values(state.inspection[state.currentLocation]).forEach((item) => { if (!item.condition) item.condition = "B"; });
      renderInspectionGroups();
      renderLocationTabs();
      renderZoneTabs();
      scheduleSave();
      showToast("Casillas pendientes completadas con B");
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
    document.querySelector("#finishTitle").textContent = downloaded ? "PDF descargado correctamente" : "¿Iniciar una nueva Acta 3?";
    document.querySelector("#finishDescription").textContent = downloaded ? "Puedes mantener este borrador o limpiar todo y comenzar otra Acta 3." : "Esta acción limpiará los campos, la inspección y las firmas de esta Acta 3.";
    document.querySelector("#finishModal").hidden = false;
    document.body.classList.add("modal-open");
  }

  function closeFinishModal() { document.querySelector("#finishModal").hidden = true; document.body.classList.remove("modal-open"); }

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
    const { fill = "#fff", stroke = "#56616a", size = 10, weight = 400, align = "left", padding = 5, color = "#182431", maxLines = 3 } = options;
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
    setFont(ctx, size, weight);
    ctx.fillStyle = color;
    ctx.textAlign = align;
    const lines = wrapLines(ctx, text, Math.max(1, width - padding * 2)).slice(0, maxLines);
    const lineHeight = size * 1.15;
    const startY = y + height / 2 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, index) => {
      const textX = align === "center" ? x + width / 2 : align === "right" ? x + width - padding : x + padding;
      ctx.fillText(line, textX, startY + index * lineHeight);
    });
  }

  function drawHeader(ctx, page, title) {
    setFont(ctx, 10.5, 700); ctx.fillStyle = "#26323b"; ctx.textAlign = "left";
    ctx.fillText("FUERZA AÉREA DE CHILE", 44, 22);
    ctx.fillText("COMANDO DE PERSONAL", 44, 38);
    ctx.fillText("DIVISIÓN DE BIENESTAR SOCIAL", 44, 54);
    setFont(ctx, 18, 700); ctx.textAlign = "center"; ctx.fillText(title, PAGE_WIDTH / 2, 36);
    setFont(ctx, 10, 700); ctx.textAlign = "right"; ctx.fillText(`PÁGINA ${page} DE 6`, PAGE_WIDTH - 44, 36);
    ctx.strokeStyle = "#172e42"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(44, 62); ctx.lineTo(PAGE_WIDTH - 44, 62); ctx.stroke();
  }

  function formatDate(value) {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return `${day || ""}-${month || ""}-${year || ""}`;
  }

  function drawIdentity(ctx, data, y = 74) {
    const x = 44;
    const width = PAGE_WIDTH - 88;
    drawCell(ctx, x, y, width * 0.28, 26, `GRADO: ${data.grado || ""}`, { size: 9, weight: 700, fill: "#f3f5f6" });
    drawCell(ctx, x + width * 0.28, y, width * 0.24, 26, `N° EMPL.: ${data.empleado || ""}`, { size: 9, weight: 700, fill: "#f3f5f6" });
    drawCell(ctx, x + width * 0.52, y, width * 0.25, 26, `RUT: ${data.rut || ""}`, { size: 9, weight: 700, fill: "#f3f5f6" });
    drawCell(ctx, x + width * 0.77, y, width * 0.23, 26, `FECHA: ${formatDate(data.fecha)}`, { size: 9, weight: 700, fill: "#f3f5f6" });
    drawCell(ctx, x, y + 26, width * 0.52, 26, `NOMBRE: ${data.nombre || ""}`, { size: 9 });
    drawCell(ctx, x + width * 0.52, y + 26, width * 0.25, 26, `UNIDAD: ${data.unidad || ""}`, { size: 9 });
    drawCell(ctx, x + width * 0.77, y + 26, width * 0.23, 26, `RUT CÓNYUGE: ${data.rutConyuge || ""}`, { size: 8 });
    drawCell(ctx, x, y + 52, width * 0.31, 26, `VILLA FACH: ${data.villa || ""}`, { size: 9 });
    drawCell(ctx, x + width * 0.31, y + 52, width * 0.45, 26, `DIRECCIÓN: ${data.direccion || ""}`, { size: 9 });
    drawCell(ctx, x + width * 0.76, y + 52, width * 0.24, 26, `MOTIVO: ${data.motivo || ""}`, { size: 8.2 });
    return y + 78;
  }

  function observationSummary(zone, itemId) {
    const causes = [];
    const observations = [];
    zone.locations.forEach(([locationId, , short]) => {
      const item = state.inspection[locationId][itemId];
      if (item.cause) causes.push(`${short}:${item.cause}`);
      if (item.observation) observations.push(`${short}: ${item.observation}`);
    });
    return { causes: causes.join(" · "), observations: observations.join(" | ") };
  }

  function drawZoneTable(ctx, zone, y, options = {}) {
    const x = options.x || 44;
    const fullWidth = options.width || PAGE_WIDTH - 88;
    const totalRows = allItems(zone).length;
    const rowHeight = options.rowHeight || Math.min(23, Math.max(14.5, (options.maxHeight || 920) / totalRows));
    const groupWidth = 132;
    const itemWidth = 205;
    const reviewWidth = 350;
    const locationWidth = Math.min(70, 260 / zone.locations.length);
    const causeWidth = 105;
    const usedWidth = groupWidth + itemWidth + reviewWidth + locationWidth * zone.locations.length + causeWidth;
    const observationWidth = fullWidth - usedWidth;
    const headerHeight = 43;
    drawCell(ctx, x, y, groupWidth, headerHeight, "ÍTEM", { fill: "#273746", color: "#fff", align: "center", weight: 700, size: 9 });
    drawCell(ctx, x + groupWidth, y, itemWidth, headerHeight, "ELEMENTO", { fill: "#273746", color: "#fff", align: "center", weight: 700, size: 9 });
    drawCell(ctx, x + groupWidth + itemWidth, y, reviewWidth, headerHeight, "REVISIÓN", { fill: "#273746", color: "#fff", align: "center", weight: 700, size: 9 });
    let cursorX = x + groupWidth + itemWidth + reviewWidth;
    zone.locations.forEach(([, name]) => { drawCell(ctx, cursorX, y, locationWidth, headerHeight, name.toUpperCase(), { fill: "#273746", color: "#fff", align: "center", weight: 700, size: 7, padding: 2 }); cursorX += locationWidth; });
    drawCell(ctx, cursorX, y, causeWidth, headerHeight, "CAUSA U/D/T", { fill: "#273746", color: "#fff", align: "center", weight: 700, size: 8 });
    drawCell(ctx, cursorX + causeWidth, y, observationWidth, headerHeight, "OBSERVACIONES", { fill: "#273746", color: "#fff", align: "center", weight: 700, size: 8 });
    y += headerHeight;
    const small = rowHeight < 18;
    zone.groups.forEach((group) => {
      drawCell(ctx, x, y, groupWidth, group.items.length * rowHeight, group.name.toUpperCase(), { fill: "#edf1f3", align: "center", weight: 700, size: small ? 6.5 : 7.5, padding: 3, maxLines: 6 });
      group.items.forEach(([itemId, itemName, review]) => {
        drawCell(ctx, x + groupWidth, y, itemWidth, rowHeight, itemName, { size: small ? 6.2 : 7.4, padding: 3, maxLines: 2 });
        drawCell(ctx, x + groupWidth + itemWidth, y, reviewWidth, rowHeight, review, { size: small ? 6.1 : 7.1, padding: 3, maxLines: 2 });
        let cellX = x + groupWidth + itemWidth + reviewWidth;
        zone.locations.forEach(([locationId]) => {
          const condition = state.inspection[locationId][itemId].condition;
          const fill = condition === "B" ? "#e6f5ec" : condition === "M" ? "#fdeaea" : "#fff";
          const color = condition === "B" ? "#25865a" : condition === "M" ? "#ba3a3a" : "#182431";
          drawCell(ctx, cellX, y, locationWidth, rowHeight, condition, { fill, color, align: "center", weight: 700, size: small ? 7 : 8 });
          cellX += locationWidth;
        });
        const summary = observationSummary(zone, itemId);
        drawCell(ctx, cellX, y, causeWidth, rowHeight, summary.causes, { align: "center", weight: 700, size: small ? 6.2 : 7 });
        drawCell(ctx, cellX + causeWidth, y, observationWidth, rowHeight, summary.observations, { size: small ? 5.8 : 6.8, padding: 3, maxLines: 2 });
        y += rowHeight;
      });
    });
    return y;
  }

  function drawZonePage(pageNumber, zone, data) {
    const { canvas, ctx } = createPage();
    drawHeader(ctx, pageNumber, zone.name.toUpperCase());
    const start = drawIdentity(ctx, data, 74) + 10;
    drawZoneTable(ctx, zone, start, { maxHeight: PAGE_HEIGHT - start - 34 });
    setFont(ctx, 8, 700); ctx.fillStyle = "#465664"; ctx.textAlign = "left"; ctx.fillText("B: BUENO · M: MALO · U: ATRIBUIBLE AL USUARIO · D: ATRIBUIBLE AL DISEÑO · T: ATRIBUIBLE AL TIEMPO", 44, PAGE_HEIGHT - 20);
    return canvas;
  }

  function drawBodegaVariosPage(data) {
    const { canvas, ctx } = createPage();
    drawHeader(ctx, 5, "BODEGA, VARIOS Y CONSUMOS BÁSICOS");
    let y = drawIdentity(ctx, data, 74) + 9;
    y = drawZoneTable(ctx, zones[4], y, { maxHeight: 230, rowHeight: 21 });
    y += 13;
    y = drawZoneTable(ctx, zones[5], y, { maxHeight: 290, rowHeight: 21 });
    y += 14;
    const margin = 44;
    const width = PAGE_WIDTH - 88;
    drawCell(ctx, margin, y, width, 29, "CONSUMOS BÁSICOS", { fill: "#273746", color: "#fff", align: "center", weight: 700, size: 9 });
    y += 29;
    const labelWidth = 270;
    const readingWidth = 250;
    drawCell(ctx, margin, y, labelWidth, 26, "ÍTEM", { fill: "#edf1f3", align: "center", weight: 700, size: 8 });
    drawCell(ctx, margin + labelWidth, y, readingWidth, 26, "DEVOLUCIÓN", { fill: "#edf1f3", align: "center", weight: 700, size: 8 });
    drawCell(ctx, margin + labelWidth + readingWidth, y, readingWidth, 26, "ENTREGA", { fill: "#edf1f3", align: "center", weight: 700, size: 8 });
    drawCell(ctx, margin + labelWidth + readingWidth * 2, y, width - labelWidth - readingWidth * 2, 26, "OBSERVACIONES", { fill: "#edf1f3", align: "center", weight: 700, size: 8 });
    y += 26;
    consumptionItems.forEach(([id, label]) => {
      drawCell(ctx, margin, y, labelWidth, 25, label.toUpperCase(), { weight: 700, size: 7.6 });
      drawCell(ctx, margin + labelWidth, y, readingWidth, 25, data[`cons_${id}_devolucion`] || "", { size: 8 });
      drawCell(ctx, margin + labelWidth + readingWidth, y, readingWidth, 25, data[`cons_${id}_entrega`] || "", { size: 8 });
      drawCell(ctx, margin + labelWidth + readingWidth * 2, y, width - labelWidth - readingWidth * 2, 25, data[`cons_${id}_observacion`] || "", { size: 7.5 });
      y += 25;
    });
    y += 12;
    drawCell(ctx, margin, y, width, 29, "CONDICIÓN FINAL DE LA VIVIENDA", { fill: "#273746", color: "#fff", align: "center", weight: 700, size: 9 });
    y += 29;
    drawCell(ctx, margin, y, width * 0.28, 34, `RESULTADO: ${data.condicionFinal || ""}`, { fill: "#edf1f3", weight: 700, size: 8 });
    drawCell(ctx, margin + width * 0.28, y, width * 0.72, 34, `OBSERVACIONES: ${data.observacionesFinales || ""}`, { size: 7.5, maxLines: 2 });
    y += 42;
    drawCell(ctx, margin, y, width, 48, "El usuario que devuelve la vivienda declara no mantener deudas pendientes que perjudiquen al nuevo usuario. Asimismo, garantiza por un período de un mes que los trabajos de pintura y elementos de grifería no presentarán observaciones.", { fill: "#f7f8f8", size: 8, padding: 9, maxLines: 3 });
    return canvas;
  }

  function drawSignature(ctx, key, title, name, x, y, width, height) {
    ctx.strokeStyle = "#56616a"; ctx.lineWidth = 1; ctx.strokeRect(x, y, width, height);
    const pad = state.signaturePads[key];
    if (pad?.strokes.length) {
      const inkX = x + 24;
      const inkY = y + 9;
      const inkWidth = width - 48;
      const inkHeight = height - 56;
      ctx.save();
      ctx.strokeStyle = "#102f48";
      ctx.lineWidth = 2.4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      pad.strokes.forEach((stroke) => {
        if (!stroke.length) return;
        ctx.beginPath();
        stroke.forEach((point, index) => {
          const pointX = inkX + point.x * inkWidth;
          const pointY = inkY + point.y * inkHeight;
          if (index === 0) ctx.moveTo(pointX, pointY); else ctx.lineTo(pointX, pointY);
        });
        if (stroke.length === 1) ctx.lineTo(inkX + stroke[0].x * inkWidth + 0.4, inkY + stroke[0].y * inkHeight + 0.4);
        ctx.stroke();
      });
      ctx.restore();
    }
    ctx.beginPath(); ctx.moveTo(x + 24, y + height - 42); ctx.lineTo(x + width - 24, y + height - 42); ctx.stroke();
    setFont(ctx, 8.5, 700); ctx.fillStyle = "#26323b"; ctx.textAlign = "center"; ctx.fillText(title.toUpperCase(), x + width / 2, y + height - 27);
    setFont(ctx, 7.5, 400); ctx.fillStyle = "#56616a"; ctx.fillText(name || "Grado y nombre", x + width / 2, y + height - 13);
  }

  function drawSignaturesPage(data) {
    const { canvas, ctx } = createPage();
    drawHeader(ctx, 6, "FIRMAS Y USO SUBDEPTO. GESTIÓN FINANCIERA");
    let y = drawIdentity(ctx, data, 74) + 12;
    const margin = 44;
    const fullWidth = PAGE_WIDTH - 88;
    const gap = 14;
    const cardWidth = (fullWidth - gap * 2) / 3;
    const cardHeight = 230;
    signatureDefinitions.forEach(([key, title], index) => {
      const row = Math.floor(index / 3);
      const column = index % 3;
      drawSignature(ctx, key, title, data[`firmaNombre_${key}`], margin + column * (cardWidth + gap), y + row * (cardHeight + gap), cardWidth, cardHeight);
    });
    y += cardHeight * 2 + gap + 18;
    drawCell(ctx, margin, y, fullWidth, 30, "USO SUBDEPTO. GESTIÓN FINANCIERA", { fill: "#273746", color: "#fff", align: "center", weight: 700, size: 10 });
    y += 30;
    const first = 260;
    const other = (fullWidth - first) / 3;
    drawCell(ctx, margin, y, first, 30, "ÍTEM", { fill: "#edf1f3", align: "center", weight: 700, size: 8 });
    drawCell(ctx, margin + first, y, other, 30, "DEVOLUCIÓN · CESE DESCUENTO", { fill: "#edf1f3", align: "center", weight: 700, size: 8 });
    drawCell(ctx, margin + first + other, y, other, 30, "ENTREGA · INICIO DESCUENTO", { fill: "#edf1f3", align: "center", weight: 700, size: 8 });
    drawCell(ctx, margin + first + other * 2, y, other, 30, "NOMBRE RESPONSABLE", { fill: "#edf1f3", align: "center", weight: 700, size: 8 });
    y += 30;
    const financeRows = [
      ["DRAA 5,5%", formatDate(data.draaCese), formatDate(data.draaInicio), data.responsableFinanzas || ""],
      ["Gasto común", formatDate(data.gastoCese), formatDate(data.gastoInicio), ""],
      ["Fecha", formatDate(data.fechaGestion), "", ""],
    ];
    financeRows.forEach((row) => {
      drawCell(ctx, margin, y, first, 38, row[0], { weight: 700, size: 8.5 });
      drawCell(ctx, margin + first, y, other, 38, row[1], { align: "center", size: 8.5 });
      drawCell(ctx, margin + first + other, y, other, 38, row[2], { align: "center", size: 8.5 });
      drawCell(ctx, margin + first + other * 2, y, other, 38, row[3], { align: "center", size: 8.5 });
      y += 38;
    });
    return canvas;
  }

  function renderDocumentPages() {
    const data = collectFormData();
    state.previewCanvases = [
      drawZonePage(1, zones[0], data),
      drawZonePage(2, zones[1], data),
      drawZonePage(3, zones[2], data),
      drawZonePage(4, zones[3], data),
      drawBodegaVariosPage(data),
      drawSignaturesPage(data),
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
        link.download = `acta-3-vivienda-${safeFilename(data.nombre || data.rut)}.pdf`;
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
    state.inspection = emptyInspection();
    renderConsumptionRows();
    renderSignatureCards();
    loadDraft();
    initializeDefaults();
    initialValidation = window.ActaValidation.setup(form, { fieldNames: ["grado", "rut", "empleado", "nombre", "unidad", "rutConyuge", "fecha", "villa", "direccion"] });
    renderZoneTabs();
    renderLocationTabs();
    renderInspectionGroups();
    setupSignaturePads();
    setupEvents();
    updateProgress();
    showStep(0);
  }

  initialize();
})();
