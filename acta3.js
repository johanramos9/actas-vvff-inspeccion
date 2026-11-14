(() => {
  "use strict";

  const STORAGE_KEY = "actas-vvff-acta3-v1";
  // Oficio chileno (8,5 x 13 pulgadas), igual al formulario impreso.
  const PAGE_WIDTH = 1275;
  const PAGE_HEIGHT = 1950;
  const PDF_WIDTH = 612;
  const PDF_HEIGHT = 936;

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
      id: "banos", name: "Baño(s)", locations: [["bano1", "Baño 1", "1"], ["bano2", "Baño 2", "2"], ["bano3", "Baño 3", "3"], ["bano4", "Baño 4", "4"], ["bano5", "Baño 5", "5"]],
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
    nextButton.innerHTML = state.currentStep === 4 ? `${window.ActaSecurity.pdfActionLabel} <svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>` : `Continuar <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>`;
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
    const { fill = "#fff", stroke = "#111", size = 10, weight = 400, align = "left", padding = 5, color = "#111", maxLines = 3, lineWidth = 1.2 } = options;
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
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
    if (page !== 1) return;
    setFont(ctx, 15, 400); ctx.fillStyle = "#111"; ctx.textAlign = "left";
    ctx.fillText("FUERZA AÉREA DE CHILE", 80, 70);
    ctx.fillText("COMANDO DE PERSONAL", 80, 96);
    ctx.fillText("DIVISIÓN DE BIENESTAR SOCIAL", 80, 122);
    setFont(ctx, 24, 700); ctx.textAlign = "center"; ctx.fillText("ACTA ENTREGA Y/O DEVOLUCIÓN VV.FF.", PAGE_WIDTH / 2, 178);
  }

  function formatDate(value) {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return `${day || ""}-${month || ""}-${year || ""}`;
  }

  function drawIdentity(ctx, data, y = 74) {
    const x = 54;
    const width = PAGE_WIDTH - 108;
    const boxY = 220;
    drawCell(ctx, x, boxY, width, 170, "", { lineWidth: 2.2 });
    setFont(ctx, 14, 700); ctx.fillStyle = "#111"; ctx.textAlign = "left";
    ctx.fillText(`GRADO: ${data.grado || ""}`, x + 10, boxY + 25);
    ctx.fillText(`N° EMPL.: ${data.empleado || ""}`, x + 350, boxY + 25);
    ctx.fillText(`RUT: ${data.rut || ""}`, x + 700, boxY + 25);
    ctx.fillText(`NOMBRE: ${data.nombre || ""}`, x + 10, boxY + 58);
    ctx.fillText(`UNIDAD: ${data.unidad || ""}`, x + 10, boxY + 91);
    ctx.fillText(`RUT CÓNYUGE FACH: ${data.rutConyuge || ""}`, x + 700, boxY + 91);
    ctx.fillText(`VILLA FACH: ${data.villa || ""}`, x + 10, boxY + 124);
    ctx.fillText(`DIRECCIÓN: ${data.direccion || ""}`, x + 10, boxY + 157);
    ctx.fillText(`FECHA: ${formatDate(data.fecha)}`, x + 780, boxY + 157);
    const motiveY = 410;
    drawCell(ctx, x, motiveY, width, 92, "", { lineWidth: 2.2 });
    setFont(ctx, 16, 700); ctx.textAlign = "center"; ctx.fillText("MOTIVO ACTA", PAGE_WIDTH / 2, motiveY + 22);
    const mark = (value) => data.motivo === value ? "X" : "";
    setFont(ctx, 12, 700); ctx.textAlign = "left";
    ctx.fillText(`ENTREGA 1° VEZ      [${mark("Entrega 1ª vez")}]`, x + 12, motiveY + 53);
    ctx.fillText(`ENTREGA CAMBIO      [${mark("Entrega cambio")}]`, x + 12, motiveY + 78);
    ctx.fillText(`DEVOLUCIÓN DEFINITIVA      [${mark("Devolución definitiva")}]`, x + 610, motiveY + 53);
    ctx.fillText(`DEVOLUCIÓN CAMBIO          [${mark("Devolución cambio")}]`, x + 610, motiveY + 78);
    return motiveY + 92;
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
    const x = options.x || 54;
    const fullWidth = options.width || PAGE_WIDTH - 108;
    const totalRows = allItems(zone).length;
    const titleHeight = 34;
    const headerHeight = 92;
    const rowHeight = options.rowHeight || Math.min(options.maxRowHeight || 40, Math.max(17, ((options.maxHeight || 1200) - titleHeight - headerHeight) / totalRows));
    const groupWidth = 145;
    const itemWidth = 205;
    const reviewWidth = 300;
    const markWidth = 26;
    const conditionWidth = markWidth * zone.locations.length * 2;
    const causeWidth = 65;
    const usedWidth = groupWidth + itemWidth + reviewWidth + conditionWidth + causeWidth;
    const observationWidth = fullWidth - usedWidth;
    const itemX = x + groupWidth;
    const reviewX = itemX + itemWidth;
    const conditionX = reviewX + reviewWidth;
    const causeX = conditionX + conditionWidth;
    const observationX = causeX + causeWidth;
    drawCell(ctx, x, y, fullWidth, titleHeight, zone.name.toUpperCase(), { fill: "#30363b", color: "#fff", align: "center", weight: 700, size: 15, lineWidth: 1.8 });
    y += titleHeight;
    drawCell(ctx, x, y, groupWidth + itemWidth, headerHeight, "ÍTEM", { align: "center", weight: 700, size: 13 });
    drawCell(ctx, reviewX, y, reviewWidth, headerHeight, "REVISIÓN", { align: "center", weight: 700, size: 13 });
    drawCell(ctx, conditionX, y, conditionWidth, 32, "CONDICIÓN", { align: "center", weight: 700, size: 12 });
    drawCell(ctx, causeX, y, causeWidth, headerHeight, "OBS.", { align: "center", weight: 700, size: 11 });
    drawCell(ctx, observationX, y, observationWidth, headerHeight, "(U: atribuible a usuario)\n(D: atribuible a diseño)\n(T: atribuible a tiempo)", { align: "left", weight: 400, size: 10, padding: 8, maxLines: 3 });
    const conditionHalf = conditionWidth / 2;
    drawCell(ctx, conditionX, y + 32, conditionHalf, 30, "BUENO", { align: "center", weight: 700, size: 10 });
    drawCell(ctx, conditionX + conditionHalf, y + 32, conditionHalf, 30, "MALO", { align: "center", weight: 700, size: 10 });
    zone.locations.forEach(([, , short], index) => {
      drawCell(ctx, conditionX + index * markWidth, y + 62, markWidth, 30, short, { align: "center", weight: 700, size: 10, padding: 1 });
      drawCell(ctx, conditionX + conditionHalf + index * markWidth, y + 62, markWidth, 30, short, { align: "center", weight: 700, size: 10, padding: 1 });
    });
    y += headerHeight;
    const small = rowHeight < 18;
    zone.groups.forEach((group) => {
      drawCell(ctx, x, y, groupWidth, group.items.length * rowHeight, group.name, { align: "center", weight: 400, size: small ? 9 : 11, padding: 4, maxLines: 7 });
      group.items.forEach(([itemId, itemName, review]) => {
        drawCell(ctx, itemX, y, itemWidth, rowHeight, itemName, { size: small ? 8 : 10, padding: 4, maxLines: 2 });
        drawCell(ctx, reviewX, y, reviewWidth, rowHeight, review, { size: small ? 7.8 : 9.5, padding: 4, maxLines: 2 });
        zone.locations.forEach(([locationId], index) => {
          const condition = state.inspection[locationId][itemId].condition;
          drawCell(ctx, conditionX + index * markWidth, y, markWidth, rowHeight, condition === "B" ? "X" : "", { align: "center", weight: 700, size: small ? 8 : 11, padding: 1 });
          drawCell(ctx, conditionX + conditionHalf + index * markWidth, y, markWidth, rowHeight, condition === "M" ? "X" : "", { align: "center", weight: 700, size: small ? 8 : 11, padding: 1 });
        });
        const summary = observationSummary(zone, itemId);
        drawCell(ctx, causeX, y, causeWidth, rowHeight, summary.causes, { align: "center", weight: 700, size: small ? 7 : 8.5, padding: 2, maxLines: 2 });
        drawCell(ctx, observationX, y, observationWidth, rowHeight, summary.observations, { size: small ? 7 : 8.5, padding: 4, maxLines: 2 });
        y += rowHeight;
      });
    });
    return y;
  }

  function drawZonePage(pageNumber, zone, data) {
    const { canvas, ctx } = createPage();
    drawHeader(ctx, pageNumber, zone.name.toUpperCase());
    const start = pageNumber === 1 ? drawIdentity(ctx, data) + 16 : 48;
    const maxRowHeight = pageNumber === 1 ? 31 : pageNumber === 3 ? 51 : 40;
    drawZoneTable(ctx, zone, start, { maxHeight: PAGE_HEIGHT - start - 48, maxRowHeight });
    return canvas;
  }

  function drawSignatureLine(ctx, key, title, name, x, y, width, height) {
    const pad = state.signaturePads[key];
    const inkX = x + 24;
    const inkY = y + 4;
    const inkWidth = width - 48;
    const inkHeight = height - 62;
    if (pad?.strokes.length) {
      ctx.save();
      ctx.strokeStyle = "#111";
      ctx.lineWidth = 2.6;
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
        ctx.stroke();
      });
      ctx.restore();
    }
    ctx.strokeStyle = "#111"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(x + 18, y + height - 43); ctx.lineTo(x + width - 18, y + height - 43); ctx.stroke();
    setFont(ctx, 12, 700); ctx.fillStyle = "#111"; ctx.textAlign = "center"; ctx.fillText(title.toUpperCase(), x + width / 2, y + height - 27);
    setFont(ctx, 10, 400); ctx.fillText(name || "Grado y nombre", x + width / 2, y + height - 11);
  }

  function drawFinanceTable(ctx, data, x, y, width) {
    drawCell(ctx, x, y, width, 32, "USO SUBDEPTO. GESTIÓN FINANCIERA", { fill: "#30363b", color: "#fff", align: "center", weight: 700, size: 13 });
    y += 32;
    const itemWidth = 210;
    const other = (width - itemWidth) / 3;
    drawCell(ctx, x, y, itemWidth, 54, "ÍTEM", { align: "center", weight: 700, size: 11 });
    drawCell(ctx, x + itemWidth, y, other, 27, "DEVOLUCIÓN", { align: "center", weight: 700, size: 10 });
    drawCell(ctx, x + itemWidth, y + 27, other, 27, "CESE DESCUENTO", { align: "center", weight: 700, size: 9 });
    drawCell(ctx, x + itemWidth + other, y, other, 27, "ENTREGA", { align: "center", weight: 700, size: 10 });
    drawCell(ctx, x + itemWidth + other, y + 27, other, 27, "INICIO DESCUENTO", { align: "center", weight: 700, size: 9 });
    drawCell(ctx, x + itemWidth + other * 2, y, other, 54, "NOMBRE RESPONSABLE", { align: "center", weight: 700, size: 10 });
    y += 54;
    const rows = [
      ["DRAA 5,5%", formatDate(data.draaCese), formatDate(data.draaInicio), data.responsableFinanzas || ""],
      ["GASTO COMÚN", formatDate(data.gastoCese), formatDate(data.gastoInicio), ""],
      ["FECHA", formatDate(data.fechaGestion), "", ""],
    ];
    rows.forEach((row) => {
      drawCell(ctx, x, y, itemWidth, 38, row[0], { weight: 700, size: 10 });
      drawCell(ctx, x + itemWidth, y, other, 38, row[1], { align: "center", size: 10 });
      drawCell(ctx, x + itemWidth + other, y, other, 38, row[2], { align: "center", size: 10 });
      drawCell(ctx, x + itemWidth + other * 2, y, other, 38, row[3], { align: "center", size: 9 });
      y += 38;
    });
    return y;
  }

  function drawBodegaVariosPage(data) {
    const { canvas, ctx } = createPage();
    let y = 44;
    const margin = 54;
    const width = PAGE_WIDTH - 108;
    y = drawZoneTable(ctx, zones[4], y, { width, rowHeight: 21 });
    y += 12;
    y = drawZoneTable(ctx, zones[5], y, { width, rowHeight: 21 });
    y += 12;
    drawCell(ctx, margin, y, width, 32, "CONSUMOS BÁSICOS", { fill: "#30363b", color: "#fff", align: "center", weight: 700, size: 13 });
    y += 32;
    const labelWidth = 250;
    const readingWidth = 230;
    drawCell(ctx, margin, y, labelWidth, 42, "ÍTEM", { align: "center", weight: 700, size: 10 });
    drawCell(ctx, margin + labelWidth, y, readingWidth, 42, "DEVOLUCIÓN", { align: "center", weight: 700, size: 10 });
    drawCell(ctx, margin + labelWidth + readingWidth, y, readingWidth, 42, "ENTREGA", { align: "center", weight: 700, size: 10 });
    drawCell(ctx, margin + labelWidth + readingWidth * 2, y, width - labelWidth - readingWidth * 2, 42, "OBSERVACIONES", { align: "center", weight: 700, size: 10 });
    y += 42;
    consumptionItems.forEach(([id, label]) => {
      drawCell(ctx, margin, y, labelWidth, 28, label.toUpperCase(), { weight: 700, size: 9 });
      drawCell(ctx, margin + labelWidth, y, readingWidth, 28, data[`cons_${id}_devolucion`] || "", { size: 9 });
      drawCell(ctx, margin + labelWidth + readingWidth, y, readingWidth, 28, data[`cons_${id}_entrega`] || "", { size: 9 });
      drawCell(ctx, margin + labelWidth + readingWidth * 2, y, width - labelWidth - readingWidth * 2, 28, data[`cons_${id}_observacion`] || "", { size: 8.5 });
      y += 28;
    });
    y += 10;
    drawCell(ctx, margin, y, width, 32, "CONDICIÓN FINAL DE LA VIVIENDA (Tarjar lo que no corresponda)", { fill: "#30363b", color: "#fff", align: "center", weight: 700, size: 12 });
    y += 32;
    const finalWidth = width / 3;
    [["Aceptada", "ACEPTADA"], ["Aceptada con observaciones", "ACEPTADA CON OBSERVACIONES"], ["Rechazada", "RECHAZADA"]].forEach(([value, label], index) => {
      drawCell(ctx, margin + finalWidth * index, y, finalWidth, 38, `${label}${data.condicionFinal === value ? "   X" : ""}`, { align: "center", weight: 700, size: 10 });
    });
    y += 38;
    drawCell(ctx, margin, y, width, 62, `OBSERVACIONES: ${data.observacionesFinales || ""}\nEl usuario que devuelve la vivienda declara no mantener deudas pendientes que perjudiquen al nuevo usuario. Asimismo, garantiza por un período de un mes que los trabajos de pintura y elementos de grifería no presentarán observaciones.`, { size: 8.5, padding: 8, maxLines: 4 });
    y += 76;
    const signatureWidth = 330;
    drawSignatureLine(ctx, "devuelve", "Devuelve", data.firmaNombre_devuelve, margin + 22, y, signatureWidth, 118);
    drawSignatureLine(ctx, "inspector1", "Inspector VV.FF.", data.firmaNombre_inspector1, margin + width - signatureWidth - 22, y, signatureWidth, 118);
    y += 105;
    drawSignatureLine(ctx, "recibe", "Recibe", data.firmaNombre_recibe, margin + 22, y, signatureWidth, 118);
    drawSignatureLine(ctx, "inspector2", "Inspector VV.FF.", data.firmaNombre_inspector2, margin + width - signatureWidth - 22, y, signatureWidth, 118);
    y += 95;
    drawSignatureLine(ctx, "encargado", "Encargado Depto. VV.FF.", data.firmaNombre_encargado, margin + (width - signatureWidth) / 2, y, signatureWidth, 118);
    y += 126;
    drawFinanceTable(ctx, data, margin, y, width);
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
      const filename = `acta-3-vivienda-${safeFilename(data.nombre || data.rut)}.pdf`;
      const result = await window.ActaSecurity.deliverPdf(blob, filename, "Acta 3 de vivienda fiscal");
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
    document.querySelector("#downloadPdf").textContent = window.ActaSecurity.pdfActionLabel;
    updateProgress();
    showStep(0);
  }

  initialize();
})();
