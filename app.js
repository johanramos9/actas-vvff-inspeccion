(() => {
  "use strict";

  const STORAGE_KEY = "actas-vvff-demo-v1";
  const PAGE_WIDTH = 1240;
  const PAGE_HEIGHT = 1754;
  const PDF_WIDTH = 595.28;
  const PDF_HEIGHT = 841.89;

  const inspectionGroups = [
    {
      id: "closets",
      title: "Closets",
      short: "CL",
      items: [
        ["puertas", "Puertas", "Estado y limpieza."],
        ["barra", "Barra", "Afianzada y limpia."],
        ["divisiones", "Divisiones", "Afianzadas y limpias."],
        ["manillas", "Manillas", "Afianzadas y limpias."],
        ["bisagras-riel", "Bisagras o riel", "Afianzadas, limpias y sin óxido."],
        ["guias", "Guías", "Afianzadas."],
        ["tapacantos", "Tapacantos", "Pegados y sin cortes."],
        ["madera-closet", "Madera", "Estado general."],
      ],
    },
    {
      id: "electricidad",
      title: "Instalación eléctrica",
      short: "IE",
      items: [
        ["enchufes", "Enchufe(s)", "Afianzado(s), con energía y limpios."],
        ["interruptores", "Interruptor(es)", "Afianzado(s), con energía y limpios."],
        ["soquetes", "Soquete(s)", "Soquetes con ampolletas."],
      ],
    },
    {
      id: "pintura",
      title: "Pintura",
      short: "PI",
      items: [
        ["cielo", "Cielo", "Continuidad en la aplicación."],
        ["junquillos", "Junquillos", "Buena terminación en junquillos y guardapolvos."],
        ["muros", "Muros", "Buena terminación en junquillos y guardapolvos."],
        ["guardapolvos", "Guardapolvos", "Martelina sin detalles."],
        ["closets-interiores", "Closets interiores", "Sin perforaciones."],
        ["puertas-pintura", "Puerta(s)", "Continuidad y terminación de la pintura."],
      ],
    },
    {
      id: "piso",
      title: "Piso flotante / Cerámicos",
      short: "PF",
      items: [["piso", "Piso flotante / Cerámicos", "Sin trizaduras ni perforaciones. Limpieza general."]],
    },
    {
      id: "puerta",
      title: "Puerta",
      short: "PU",
      items: [
        ["llaves", "Llaves", "Funcionamiento."],
        ["cerradura", "Cerradura", "Funcionamiento."],
        ["bisagras-puerta", "Bisagras", "Afianzadas, limpias y sin óxido."],
        ["seguros-bloq", "Seguros bloq.", "Funcionamiento."],
        ["tope-puerta", "Tope de puerta", "Afianzado."],
        ["ventana-puerta", "Ventana", "Vidrio limpio y sin trizaduras."],
        ["madera-puerta", "Madera", "Buen estado, cuadratura."],
      ],
    },
    {
      id: "ventanas",
      title: "Conjunto ventanas",
      short: "CV",
      items: [
        ["vidrios", "Vidrios", "Sin trizaduras y limpios."],
        ["marcos-rieles", "Marcos / Rieles", "Afianzados, función y limpios."],
        ["seguros-ventana", "Seguros", "Funcionamiento."],
      ],
    },
    {
      id: "cortinas",
      title: "Conjunto cortinas",
      short: "CC",
      items: [
        ["tela", "Tela", "Limpieza y sin orificios."],
        ["rieles-cortina", "Rieles", "Afianzados."],
        ["correderas", "Correderas", "Funcionamiento."],
      ],
    },
  ];

  const flatItems = inspectionGroups.flatMap((group) =>
    group.items.map(([id, name, review]) => ({ id, name, review, groupId: group.id, groupTitle: group.title })),
  );

  const state = {
    currentStep: 0,
    inspection: {},
    signatures: {},
    signaturePads: {},
  };

  let saveTimer;
  let toastTimer;
  let initialValidation;

  const form = document.querySelector("#actaForm");
  const stepSections = [...document.querySelectorAll(".form-step")];
  const stepButtons = [...document.querySelectorAll(".step")];
  const nextButton = document.querySelector("#nextStep");
  const previousButton = document.querySelector("#previousStep");
  const stepCounter = document.querySelector("#stepCounter");

  function emptyInspection() {
    return Object.fromEntries(
      flatItems.map((item) => [
        item.id,
        {
          rooms: ["", "", "", "", ""],
          code: "",
          observation: "",
        },
      ]),
    );
  }

  function safeParse(value, fallback) {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function loadDraft() {
    const saved = window.ActaSecurity.loadDraft(STORAGE_KEY);
    state.inspection = emptyInspection();
    if (!saved) return;

    if (saved.inspection) {
      flatItems.forEach((item) => {
        if (saved.inspection[item.id]) {
          const incoming = saved.inspection[item.id];
          state.inspection[item.id] = {
            rooms: Array.isArray(incoming.rooms)
              ? incoming.rooms.slice(0, 5).map((status) => ["good", "bad"].includes(status) ? status : "")
              : ["", "", "", "", ""],
            code: ["U", "D", "T"].includes(incoming.code) ? incoming.code : "",
            observation: String(incoming.observation || "").slice(0, 500),
          };
        }
      });
    }

    state.signatures = window.ActaSecurity.cleanSignatures(saved.signatures, ["devuelve", "recibe", "inspector", "encargado"], { normalized: false });
    restoreFormData(saved.formData || {});
  }

  function restoreFormData(data) {
    Object.entries(data).forEach(([name, value]) => {
      const fields = [...form.querySelectorAll(`[name="${CSS.escape(name)}"]`)];
      if (!fields.length) return;
      if (fields[0].type === "radio") {
        const matching = fields.find((field) => field.value === value);
        if (matching) matching.checked = true;
      } else if (fields[0].type === "checkbox") {
        fields[0].checked = Boolean(value);
      } else {
        window.ActaSecurity.restoreFieldValue(fields[0], value);
      }
    });
  }

  function collectFormData() {
    const data = {};
    form.querySelectorAll("input[name], textarea[name], select[name]").forEach((field) => {
      if (field.type === "radio") {
        if (field.checked) data[field.name] = field.value;
      } else if (field.type === "checkbox") {
        data[field.name] = field.checked;
      } else {
        data[field.name] = field.value;
      }
    });
    return data;
  }

  function saveDraft({ quiet = true } = {}) {
    const payload = {
      formData: collectFormData(),
      inspection: state.inspection,
      signatures: Object.fromEntries(
        Object.entries(state.signaturePads).map(([key, pad]) => [key, pad.strokes]),
      ),
    };
    try {
      window.ActaSecurity.saveDraft(STORAGE_KEY, payload);
      const now = new Date();
      document.querySelector("#draftStatus").textContent = `Guardado hoy, ${now.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`;
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

  function renderInspectionGroups() {
    const container = document.querySelector("#inspectionGroups");
    container.innerHTML = inspectionGroups
      .map((group, groupIndex) => {
        const items = group.items
          .map(([id, name, review]) => {
            const itemState = state.inspection[id];
            return `
              <div class="inspection-item" data-inspection-item="${id}">
                <div class="item-title">
                  <strong>${name}</strong>
                  <span>${review}</span>
                </div>
                <div class="condition-paper" aria-label="Condición de ${name} por dormitorio">
                  ${["good", "bad"]
                    .map(
                      (condition) => `
                        <div class="condition-row ${condition}">
                          <span class="condition-label">${condition === "good" ? "BUENO" : "MALO"}</span>
                          <div class="paper-checks">
                            ${itemState.rooms
                              .map(
                                (status, index) => `
                                  <button
                                    type="button"
                                    class="paper-check ${status === condition ? "is-checked" : ""}"
                                    data-item="${id}"
                                    data-room="${index}"
                                    data-status="${condition}"
                                    aria-label="${condition === "good" ? "Bueno" : "Malo"}, dormitorio ${index + 1}${status === condition ? ", marcado" : ""}"
                                    aria-pressed="${status === condition ? "true" : "false"}"
                                  ><span>${index + 1}</span><i>${status === condition ? "✓" : ""}</i></button>
                                `,
                              )
                              .join("")}
                          </div>
                        </div>
                      `,
                    )
                    .join("")}
                </div>
                <div class="item-observation">
                  <label><span>Observación <small>(opcional)</small></span><input data-observation="${id}" maxlength="500" value="${escapeHtml(itemState.observation)}" placeholder="Escribe aquí si encontraste un problema" aria-label="Observación de ${name}" /></label>
                  <div class="attribution-picker" aria-label="Causa de la observación de ${name}">
                    <span>Causa:</span>
                    ${[
                      ["U", "Usuario"],
                      ["D", "Diseño"],
                      ["T", "Tiempo"],
                    ]
                      .map(
                        ([code, label]) => `<button type="button" class="attribution-option ${itemState.code === code ? "is-selected" : ""}" data-attribution-item="${id}" data-code="${code}" aria-pressed="${itemState.code === code ? "true" : "false"}"><b>${code}</b><span>${label}</span></button>`,
                      )
                      .join("")}
                  </div>
                </div>
              </div>
            `;
          })
          .join("");

        return `
          <article class="inspection-group ${groupIndex === 0 ? "is-open" : ""}">
            <button type="button" class="group-toggle" aria-expanded="${groupIndex === 0 ? "true" : "false"}">
              <span><span class="group-icon">${group.short}</span><span><strong>${group.title}</strong><small>${group.items.length} ${group.items.length === 1 ? "elemento" : "elementos"}</small></span></span>
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 7 5 5 5-5" /></svg>
            </button>
            <div class="group-content" ${groupIndex === 0 ? "" : "hidden"}>${items}</div>
          </article>
        `;
      })
      .join("");

    container.addEventListener("click", handleInspectionClick);
    container.addEventListener("input", handleInspectionInput);
  }

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function statusLabel(status) {
    return status === "good" ? "Bueno" : status === "bad" ? "Malo" : "Sin revisar";
  }

  function handleInspectionClick(event) {
    const groupToggle = event.target.closest(".group-toggle");
    if (groupToggle) {
      const group = groupToggle.closest(".inspection-group");
      const content = group.querySelector(".group-content");
      const willOpen = !group.classList.contains("is-open");
      group.classList.toggle("is-open", willOpen);
      groupToggle.setAttribute("aria-expanded", String(willOpen));
      content.hidden = !willOpen;
      return;
    }

    const checkButton = event.target.closest(".paper-check");
    if (checkButton) {
      const itemId = checkButton.dataset.item;
      const roomIndex = Number(checkButton.dataset.room);
      const selectedStatus = checkButton.dataset.status;
      const current = state.inspection[itemId].rooms[roomIndex];
      const next = current === selectedStatus ? "" : selectedStatus;
      state.inspection[itemId].rooms[roomIndex] = next;

      const item = checkButton.closest(".inspection-item");
      item.querySelectorAll(`.paper-check[data-room="${roomIndex}"]`).forEach((button) => {
        const checked = button.dataset.status === next;
        button.classList.toggle("is-checked", checked);
        button.setAttribute("aria-pressed", String(checked));
        button.querySelector("i").textContent = checked ? "✓" : "";
        button.setAttribute("aria-label", `${button.dataset.status === "good" ? "Bueno" : "Malo"}, dormitorio ${roomIndex + 1}${checked ? ", marcado" : ""}`);
      });
      scheduleSave();
      return;
    }

    const attributionButton = event.target.closest(".attribution-option");
    if (attributionButton) {
      const itemId = attributionButton.dataset.attributionItem;
      const selectedCode = attributionButton.dataset.code;
      const nextCode = state.inspection[itemId].code === selectedCode ? "" : selectedCode;
      state.inspection[itemId].code = nextCode;
      attributionButton.closest(".attribution-picker").querySelectorAll(".attribution-option").forEach((button) => {
        const selected = button.dataset.code === nextCode;
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      scheduleSave();
    }
  }

  function handleInspectionInput(event) {
    const observationId = event.target.dataset.observation;
    if (observationId) state.inspection[observationId].observation = event.target.value;
    if (observationId) scheduleSave();
  }

  function setupSignaturePads() {
    document.querySelectorAll("canvas[data-signature]").forEach((canvas) => {
      const key = canvas.dataset.signature;
      const pad = {
        canvas,
        context: canvas.getContext("2d"),
        strokes: Array.isArray(state.signatures[key]) ? state.signatures[key] : [],
        drawing: false,
        activeStroke: null,
      };
      canvas.width = 900;
      canvas.height = 300;
      state.signaturePads[key] = pad;
      redrawSignature(pad);

      canvas.addEventListener("pointerdown", (event) => beginStroke(event, pad));
      canvas.addEventListener("pointermove", (event) => continueStroke(event, pad));
      canvas.addEventListener("pointerup", () => endStroke(pad));
      canvas.addEventListener("pointercancel", () => endStroke(pad));
      canvas.addEventListener("pointerleave", () => {
        if (pad.drawing) endStroke(pad);
      });
    });

    document.querySelectorAll("[data-clear-signature]").forEach((button) => {
      button.addEventListener("click", () => {
        const pad = state.signaturePads[button.dataset.clearSignature];
        pad.strokes = [];
        redrawSignature(pad);
        saveDraft();
        showToast("Firma eliminada");
      });
    });
  }

  function pointerPosition(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function beginStroke(event, pad) {
    event.preventDefault();
    if (pad.strokes.length >= window.ActaSecurity.limits.maxSignatureStrokes) return;
    pad.canvas.setPointerCapture?.(event.pointerId);
    pad.drawing = true;
    pad.activeStroke = [pointerPosition(event, pad.canvas)];
    pad.strokes.push(pad.activeStroke);
    redrawSignature(pad);
  }

  function continueStroke(event, pad) {
    if (!pad.drawing || !pad.activeStroke) return;
    event.preventDefault();
    if (pad.activeStroke.length >= window.ActaSecurity.limits.maxPointsPerStroke) return;
    pad.activeStroke.push(pointerPosition(event, pad.canvas));
    redrawSignature(pad);
  }

  function endStroke(pad) {
    if (!pad.drawing) return;
    pad.drawing = false;
    pad.activeStroke = null;
    saveDraft();
    updateProgress();
  }

  function redrawSignature(pad) {
    const ctx = pad.context;
    ctx.clearRect(0, 0, pad.canvas.width, pad.canvas.height);
    ctx.strokeStyle = "#102b42";
    ctx.fillStyle = "#102b42";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    pad.strokes.forEach((stroke) => {
      if (!stroke.length) return;
      if (stroke.length === 1) {
        ctx.beginPath();
        ctx.arc(stroke[0].x, stroke[0].y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        return;
      }
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      stroke.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
      ctx.stroke();
    });
  }

  function showStep(index) {
    const safeIndex = Math.max(0, Math.min(stepSections.length - 1, index));
    state.currentStep = safeIndex;
    stepSections.forEach((section, sectionIndex) => {
      const active = sectionIndex === safeIndex;
      section.classList.toggle("is-active", active);
      section.hidden = !active;
    });
    stepButtons.forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === safeIndex);
      button.classList.toggle("is-complete", buttonIndex < safeIndex);
      if (buttonIndex === safeIndex) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    previousButton.disabled = safeIndex === 0;
    stepCounter.textContent = String(safeIndex + 1);

    if (safeIndex === stepSections.length - 1) {
      nextButton.innerHTML = `Descargar PDF <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></svg>`;
      renderDocumentPages();
      updateExportSummary();
    } else {
      nextButton.innerHTML = `${safeIndex === stepSections.length - 2 ? "Ver documento" : "Continuar"}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>`;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    saveDraft();
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
    const essentialFields = ["grado", "nombre", "rut", "villa", "direccion", "fecha", "motivo", "condicionFinal"];
    const completedEssentials = essentialFields.filter((key) => String(data[key] || "").trim()).length;
    const inspectedRooms = Object.values(state.inspection).reduce(
      (sum, item) => sum + item.rooms.filter(Boolean).length,
      0,
    );
    const inspectionScore = Math.min(3, Math.ceil(inspectedRooms / 12));
    const signed = Object.values(state.signaturePads).filter((pad) => pad.strokes.length > 0).length;
    const total = essentialFields.length + 3 + 4;
    const percent = Math.round(((completedEssentials + inspectionScore + signed) / total) * 100);
    document.querySelector("#progressValue").textContent = `${percent}%`;
    document.querySelector("#progressBar").value = percent;
  }

  function updateExportSummary() {
    const data = collectFormData();
    const missing = ["nombre", "rut", "direccion", "fecha", "motivo", "condicionFinal"].filter(
      (key) => !String(data[key] || "").trim(),
    );
    const summary = document.querySelector("#exportSummary");
    summary.textContent = missing.length
      ? `Puedes exportar ahora. Quedan ${missing.length} datos principales sin completar.`
      : "Los datos principales están completos. El PDF se creará en este dispositivo.";
  }

  function setupFormEvents() {
    form.addEventListener("input", (event) => {
      if (event.target.name === "observacionesGenerales") {
        event.target.value = event.target.value.slice(0, 600);
        document.querySelector("#observationsCount").textContent = String(event.target.value.length);
      }
      scheduleSave();
    });

    form.addEventListener("change", scheduleSave);

    stepButtons.forEach((button) => {
      button.addEventListener("click", () => requestStep(Number(button.dataset.stepTarget)));
    });

    nextButton.addEventListener("click", () => {
      if (state.currentStep === stepSections.length - 1) downloadPdf();
      else requestStep(state.currentStep + 1);
    });
    previousButton.addEventListener("click", () => showStep(state.currentStep - 1));

    document.querySelector("#refreshPreview").addEventListener("click", () => {
      renderDocumentPages();
      updateExportSummary();
      showToast("Vista previa actualizada");
    });
    document.querySelector("#downloadPdf").addEventListener("click", downloadPdf);
    document.querySelector("#startNewActa").addEventListener("click", () => openFinishModal(false));
    document.querySelector("#keepDraft").addEventListener("click", closeFinishModal);
    document.querySelector("#cancelFinishModal").addEventListener("click", closeFinishModal);
    document.querySelector("#confirmNewActa").addEventListener("click", clearDraftAndRestart);
    document.querySelector("#finishModal").addEventListener("click", (event) => {
      if (event.target.id === "finishModal") closeFinishModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !document.querySelector("#finishModal").hidden) closeFinishModal();
    });

    document.querySelectorAll("[data-preview-page]").forEach((button) => {
      button.addEventListener("click", () => {
        const page = button.dataset.previewPage;
        document.querySelectorAll("[data-preview-page]").forEach((tab) => tab.classList.toggle("is-active", tab === button));
        document.querySelectorAll("[data-paper]").forEach((paper) => {
          const active = paper.dataset.paper === page;
          paper.classList.toggle("is-active", active);
          paper.hidden = !active;
        });
      });
    });
  }

  function initializeDefaults() {
    const dateField = form.elements.fecha;
    if (!dateField.value) {
      const now = new Date();
      const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      dateField.value = localDate;
    }
    const observations = form.elements.observacionesGenerales;
    document.querySelector("#observationsCount").textContent = String(observations.value.length);
  }

  function formatDate(value) {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return year && month && day ? `${day}-${month}-${year}` : value;
  }

  function createPageCanvas(targetCanvas) {
    targetCanvas.width = PAGE_WIDTH;
    targetCanvas.height = PAGE_HEIGHT;
    const ctx = targetCanvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
    ctx.textBaseline = "middle";
    ctx.lineWidth = 1;
    return ctx;
  }

  function setFont(ctx, size, weight = 400, style = "normal") {
    ctx.font = `${style} ${weight} ${size}px Arial, Helvetica, sans-serif`;
  }

  function drawLine(ctx, x1, y1, x2, y2, color = "#27313a", width = 1) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  function wrapText(ctx, text, maxWidth) {
    const words = String(text || "").split(/\s+/).filter(Boolean);
    if (!words.length) return [""];
    const lines = [];
    let line = words[0];
    for (let index = 1; index < words.length; index += 1) {
      const candidate = `${line} ${words[index]}`;
      if (ctx.measureText(candidate).width <= maxWidth) line = candidate;
      else {
        lines.push(line);
        line = words[index];
      }
    }
    lines.push(line);
    return lines;
  }

  function drawWrappedText(ctx, text, x, y, width, options = {}) {
    const {
      size = 13,
      weight = 400,
      color = "#20252a",
      align = "left",
      lineHeight = size * 1.25,
      maxLines = 3,
      style = "normal",
    } = options;
    setFont(ctx, size, weight, style);
    ctx.fillStyle = color;
    ctx.textAlign = align;
    const lines = wrapText(ctx, text, width).slice(0, maxLines);
    const startY = y - ((lines.length - 1) * lineHeight) / 2;
    const drawX = align === "center" ? x + width / 2 : align === "right" ? x + width : x;
    lines.forEach((line, index) => ctx.fillText(line, drawX, startY + index * lineHeight));
  }

  function drawCell(ctx, x, y, width, height, text = "", options = {}) {
    const { fill = "#ffffff", border = "#3b4248", padding = 8, align = "left", size = 13, weight = 400, color = "#20252a", style = "normal" } = options;
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
    drawWrappedText(ctx, text, x + padding, y + height / 2, width - padding * 2, {
      size,
      weight,
      color,
      align,
      maxLines: Math.max(1, Math.floor(height / (size * 1.18))),
      lineHeight: size * 1.18,
      style,
    });
  }

  function drawSectionBar(ctx, x, y, width, text, height = 38) {
    ctx.fillStyle = "#243849";
    ctx.fillRect(x, y, width, height);
    setFont(ctx, 16, 700);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(text, x + width / 2, y + height / 2 + 1);
  }

  function drawPageHeader(ctx, pageNumber) {
    setFont(ctx, 10, 700);
    ctx.fillStyle = "#26323b";
    ctx.textAlign = "left";
    ctx.fillText("FUERZA AÉREA DE CHILE", 58, 26);
    ctx.fillText("COMANDO DE PERSONAL", 58, 41);
    ctx.fillText("DIVISIÓN DE BIENESTAR SOCIAL", 58, 56);
    setFont(ctx, 21, 700);
    ctx.fillStyle = "#1d2831";
    ctx.textAlign = "center";
    ctx.fillText("ACTA DE ENTREGA Y/O DEVOLUCIÓN DE VIVIENDA FISCAL", PAGE_WIDTH / 2, 55);
    drawLine(ctx, 230, 73, PAGE_WIDTH - 230, 73, "#58636c", 1.2);
    ctx.save();
    ctx.translate(PAGE_WIDTH / 2, PAGE_HEIGHT / 2);
    ctx.rotate(-Math.PI / 7);
    setFont(ctx, 88, 700);
    ctx.fillStyle = "rgba(15, 48, 70, 0.035)";
    ctx.textAlign = "center";
    ctx.fillText("ACTA DIGITAL", 0, 0);
    ctx.restore();
    setFont(ctx, 10, 400);
    ctx.fillStyle = "#727b82";
    ctx.textAlign = "right";
    ctx.fillText(`Página ${pageNumber} de 2`, PAGE_WIDTH - 58, PAGE_HEIGHT - 30);
  }

  function drawLabeledField(ctx, x, y, width, height, label, value) {
    drawCell(ctx, x, y, width, height, "", { fill: "#ffffff" });
    setFont(ctx, 12, 700);
    ctx.fillStyle = "#293844";
    ctx.textAlign = "left";
    ctx.fillText(`${label}:`, x + 9, y + height / 2);
    const labelWidth = Math.min(width * 0.42, Math.max(76, ctx.measureText(`${label}:`).width + 14));
    drawWrappedText(ctx, value || "", x + labelWidth, y + height / 2, width - labelWidth - 8, { size: 13, weight: 400, maxLines: 1 });
  }

  function drawMotive(ctx, data, x, y, width) {
    drawSectionBar(ctx, x, y, width, "MOTIVO DEL ACTA", 34);
    const options = ["Entrega 1ª vez", "Entrega por cambio", "Devolución definitiva", "Devolución por cambio"];
    const optionWidth = width / 2;
    options.forEach((option, index) => {
      const row = Math.floor(index / 2);
      const column = index % 2;
      const cellX = x + column * optionWidth;
      const cellY = y + 34 + row * 34;
      drawCell(ctx, cellX, cellY, optionWidth, 34, "", {});
      const checked = data.motivo === option;
      ctx.strokeStyle = "#2c3943";
      ctx.strokeRect(cellX + optionWidth - 31, cellY + 8, 17, 17);
      if (checked) {
        drawLine(ctx, cellX + optionWidth - 28, cellY + 16, cellX + optionWidth - 23, cellY + 21, "#142d41", 2.3);
        drawLine(ctx, cellX + optionWidth - 23, cellY + 21, cellX + optionWidth - 16, cellY + 11, "#142d41", 2.3);
      }
      setFont(ctx, 12, 700);
      ctx.fillStyle = "#30383e";
      ctx.textAlign = "left";
      ctx.fillText(option.toUpperCase(), cellX + 10, cellY + 17);
    });
  }

  function drawInspectionTable(ctx, groups, x, y, width, options = {}) {
    const groupWidth = 136;
    const itemWidth = 157;
    const reviewWidth = 290;
    const conditionWidth = 350;
    const observationWidth = width - groupWidth - itemWidth - reviewWidth - conditionWidth;
    const conditionX = x + groupWidth + itemWidth + reviewWidth;
    const observationX = conditionX + conditionWidth;
    const sectionHeight = 34;
    const headerHeight = 86;
    const rowHeight = options.rowHeight || 31;

    drawSectionBar(ctx, x, y, width, "DORMITORIOS", sectionHeight);
    const headerY = y + sectionHeight;
    drawCell(ctx, x, headerY, groupWidth + itemWidth, headerHeight, "ÍTEM", { fill: "#f0f2f3", align: "center", weight: 700, size: 13 });
    drawCell(ctx, x + groupWidth + itemWidth, headerY, reviewWidth, headerHeight, "REVISIÓN", { fill: "#f0f2f3", align: "center", weight: 700, size: 13 });
    drawCell(ctx, conditionX, headerY, conditionWidth, 26, "CONDICIÓN", { fill: "#f0f2f3", align: "center", weight: 700, size: 12 });
    drawCell(ctx, conditionX, headerY + 26, conditionWidth / 2, 27, "BUENO", { fill: "#f0f2f3", align: "center", weight: 700, size: 11 });
    drawCell(ctx, conditionX + conditionWidth / 2, headerY + 26, conditionWidth / 2, 27, "MALO", { fill: "#f0f2f3", align: "center", weight: 700, size: 11 });
    const roomWidth = conditionWidth / 10;
    for (let index = 0; index < 10; index += 1) {
      drawCell(ctx, conditionX + index * roomWidth, headerY + 53, roomWidth, 33, String((index % 5) + 1), { fill: "#f0f2f3", align: "center", weight: 700, size: 10, padding: 0 });
    }
    drawCell(ctx, observationX, headerY, observationWidth, headerHeight, "OBS.\nU: Usuario · D: Diseño\nT: Tiempo", { fill: "#f0f2f3", align: "center", weight: 700, size: 10 });

    let currentY = headerY + headerHeight;
    groups.forEach((group) => {
      const groupHeight = group.items.length * rowHeight;
      drawCell(ctx, x, currentY, groupWidth, groupHeight, group.title.toUpperCase(), { align: "center", weight: 700, size: 11, fill: "#fafafa" });
      group.items.forEach(([id, name, review]) => {
        drawCell(ctx, x + groupWidth, currentY, itemWidth, rowHeight, name, { size: 11, padding: 6 });
        drawCell(ctx, x + groupWidth + itemWidth, currentY, reviewWidth, rowHeight, review, { size: 10.5, padding: 6 });
        const itemState = state.inspection[id];
        for (let conditionIndex = 0; conditionIndex < 10; conditionIndex += 1) {
          const roomIndex = conditionIndex % 5;
          const expected = conditionIndex < 5 ? "good" : "bad";
          drawCell(ctx, conditionX + conditionIndex * roomWidth, currentY, roomWidth, rowHeight, "", { padding: 0 });
          if (itemState.rooms[roomIndex] === expected) {
            setFont(ctx, 15, 700);
            ctx.fillStyle = "#173c55";
            ctx.textAlign = "center";
            ctx.fillText("✓", conditionX + conditionIndex * roomWidth + roomWidth / 2, currentY + rowHeight / 2 + 1);
          }
        }
        const obsText = [itemState.code, itemState.observation].filter(Boolean).join(" · ");
        drawCell(ctx, observationX, currentY, observationWidth, rowHeight, obsText, { size: 9.5, padding: 5 });
        currentY += rowHeight;
      });
    });
    return currentY;
  }

  function renderPageOne(canvas, data) {
    const ctx = createPageCanvas(canvas);
    const margin = 58;
    const width = PAGE_WIDTH - margin * 2;
    drawPageHeader(ctx, 1);

    let y = 92;
    drawSectionBar(ctx, margin, y, width, "ACTA Y/O DEVOLUCIÓN VV.FF.", 40);
    y += 40;
    const col = width / 3;
    drawLabeledField(ctx, margin, y, col, 36, "GRADO", data.grado);
    drawLabeledField(ctx, margin + col, y, col, 36, "N° EMPLEADO", data.empleado);
    drawLabeledField(ctx, margin + col * 2, y, col, 36, "RUT", data.rut);
    y += 36;
    drawLabeledField(ctx, margin, y, width, 34, "NOMBRE", data.nombre);
    y += 34;
    drawLabeledField(ctx, margin, y, width, 34, "UNIDAD", data.unidad);
    y += 34;
    drawLabeledField(ctx, margin, y, width, 34, "VILLA FACH", data.villa);
    y += 34;
    drawLabeledField(ctx, margin, y, width, 34, "DIRECCIÓN", data.direccion);
    y += 34;
    drawLabeledField(ctx, margin, y, width, 34, "FECHA", formatDate(data.fecha));
    y += 49;

    drawMotive(ctx, data, margin, y, width);
    y += 117;

    const pageOneGroups = inspectionGroups.filter((group) => group.id !== "cortinas");
    drawInspectionTable(ctx, pageOneGroups, margin, y, width, { rowHeight: 31 });
    return canvas;
  }

  function drawFinalCondition(ctx, data, x, y, width) {
    drawSectionBar(ctx, x, y, width, "CONDICIÓN FINAL DE LA VIVIENDA  (Marcar lo que corresponda)", 38);
    const choiceWidth = width / 3;
    const options = ["Aceptada", "Aceptada con observaciones", "Rechazada"];
    options.forEach((option, index) => {
      drawCell(ctx, x + index * choiceWidth, y + 38, choiceWidth, 49, option.toUpperCase(), { align: "center", weight: 700, size: 12, fill: "#f7f8f8" });
      drawCell(ctx, x + index * choiceWidth, y + 87, choiceWidth, 36, "", { fill: "#ffffff" });
      const boxX = x + index * choiceWidth + choiceWidth / 2 - 9;
      ctx.strokeStyle = "#27313a";
      ctx.strokeRect(boxX, y + 95, 18, 18);
      if (data.condicionFinal === option) {
        drawLine(ctx, boxX + 3, y + 103, boxX + 8, y + 108, "#173c55", 2.3);
        drawLine(ctx, boxX + 8, y + 108, boxX + 16, y + 98, "#173c55", 2.3);
      }
    });
    drawCell(ctx, x, y + 123, width, 84, data.observacionesGenerales || "", { size: 11, padding: 10 });
    setFont(ctx, 9, 700);
    ctx.fillStyle = "#4e5960";
    ctx.textAlign = "left";
    ctx.fillText("OBSERVACIONES GENERALES", x + 10, y + 133);
    return y + 207;
  }

  function drawDeclaration(ctx, x, y, width) {
    const text = 'El usuario que devuelve la vivienda declara “NO MANTENER DEUDAS PENDIENTES” que perjudiquen al nuevo usuario. Asimismo, garantiza por un período de un mes que los trabajos de pintura y elementos de grifería no presentan observaciones.';
    drawCell(ctx, x, y, width, 80, "", { fill: "#f7f8f8" });
    drawWrappedText(ctx, text, x + 13, y + 40, width - 26, { size: 12, style: "italic", lineHeight: 17, maxLines: 4 });
  }

  function drawSignatureBox(ctx, x, y, width, height, title, name, key) {
    ctx.strokeStyle = "#879099";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
    const pad = state.signaturePads[key];
    if (pad && pad.strokes.length) {
      const imageMargin = 28;
      ctx.drawImage(pad.canvas, x + imageMargin, y + 16, width - imageMargin * 2, height - 67);
    }
    drawLine(ctx, x + 35, y + height - 44, x + width - 35, y + height - 44, "#38444d", 1);
    setFont(ctx, 12, 700);
    ctx.fillStyle = "#26323b";
    ctx.textAlign = "center";
    ctx.fillText(title.toUpperCase(), x + width / 2, y + height - 27);
    setFont(ctx, 10, 400);
    ctx.fillStyle = "#56616a";
    ctx.fillText(name || "Grado y nombre", x + width / 2, y + height - 12);
  }

  function drawFinanceTable(ctx, data, x, y, width) {
    setFont(ctx, 15, 700);
    ctx.fillStyle = "#26323b";
    ctx.textAlign = "center";
    ctx.fillText("USO SECCIÓN GESTIÓN FINANCIERA", x + width / 2, y - 18);
    const itemW = 200;
    const ceseW = 250;
    const inicioW = 250;
    const responsibleW = width - itemW - ceseW - inicioW;
    drawCell(ctx, x, y, itemW, 72, "ÍTEM", { fill: "#eef1f2", align: "center", weight: 700, size: 12 });
    drawCell(ctx, x + itemW, y, ceseW, 36, "DEVOLUCIÓN", { fill: "#eef1f2", align: "center", weight: 700, size: 11 });
    drawCell(ctx, x + itemW, y + 36, ceseW, 36, "CESE DESCUENTO", { fill: "#eef1f2", align: "center", weight: 700, size: 10 });
    drawCell(ctx, x + itemW + ceseW, y, inicioW, 36, "ENTREGA", { fill: "#eef1f2", align: "center", weight: 700, size: 11 });
    drawCell(ctx, x + itemW + ceseW, y + 36, inicioW, 36, "INICIO DESCUENTO", { fill: "#eef1f2", align: "center", weight: 700, size: 10 });
    drawCell(ctx, x + itemW + ceseW + inicioW, y, responsibleW, 72, "NOMBRE RESPONSABLE", { fill: "#eef1f2", align: "center", weight: 700, size: 11 });

    const rows = [
      ["DRAA 5,5%", formatDate(data.draaCese), formatDate(data.draaInicio)],
      ["GASTO COMÚN", formatDate(data.gastoCese), formatDate(data.gastoInicio)],
      ["FECHA", formatDate(data.fechaGestion), ""],
    ];
    rows.forEach((row, index) => {
      const rowY = y + 72 + index * 44;
      drawCell(ctx, x, rowY, itemW, 44, row[0], { weight: 700, size: 11 });
      drawCell(ctx, x + itemW, rowY, ceseW, 44, row[1], { align: "center", size: 11 });
      drawCell(ctx, x + itemW + ceseW, rowY, inicioW, 44, row[2], { align: "center", size: 11 });
      if (index === 0) {
        drawCell(ctx, x + itemW + ceseW + inicioW, rowY, responsibleW, 132, data.responsableFinanzas || "", { align: "center", size: 11 });
      }
    });
  }

  function renderPageTwo(canvas, data) {
    const ctx = createPageCanvas(canvas);
    const margin = 58;
    const width = PAGE_WIDTH - margin * 2;
    drawPageHeader(ctx, 2);

    let y = 92;
    y = drawInspectionTable(ctx, inspectionGroups.filter((group) => group.id === "cortinas"), margin, y, width, { rowHeight: 35 });
    y += 34;
    y = drawFinalCondition(ctx, data, margin, y, width);
    y += 18;
    drawDeclaration(ctx, margin, y, width);
    y += 112;

    const signatureWidth = (width - 28) / 2;
    const signatureHeight = 205;
    drawSignatureBox(ctx, margin, y, signatureWidth, signatureHeight, "Devuelve", data.nombreDevuelve, "devuelve");
    drawSignatureBox(ctx, margin + signatureWidth + 28, y, signatureWidth, signatureHeight, "Inspector VV.FF.", data.nombreInspector, "inspector");
    y += signatureHeight + 24;
    drawSignatureBox(ctx, margin, y, signatureWidth, signatureHeight, "Recibe", data.nombreRecibe, "recibe");
    drawSignatureBox(ctx, margin + signatureWidth + 28, y, signatureWidth, signatureHeight, "Encargado Depto. VV.FF.", data.nombreEncargado, "encargado");
    y += signatureHeight + 70;

    drawFinanceTable(ctx, data, margin, y, width);
    return canvas;
  }

  function renderDocumentPages() {
    const data = collectFormData();
    renderPageOne(document.querySelector("#previewPage1"), data);
    renderPageTwo(document.querySelector("#previewPage2"), data);
  }

  function dataUrlToBytes(dataUrl) {
    const binary = atob(dataUrl.split(",")[1]);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return bytes;
  }

  function ascii(value) {
    return new TextEncoder().encode(value);
  }

  function createPdfBlob(pageCanvases) {
    const images = pageCanvases.map((canvas) => dataUrlToBytes(canvas.toDataURL("image/jpeg", 0.93)));
    const chunks = [];
    const offsets = new Array(9).fill(0);
    let byteLength = 0;

    const add = (chunk) => {
      const bytes = typeof chunk === "string" ? ascii(chunk) : chunk;
      chunks.push(bytes);
      byteLength += bytes.length;
    };
    const addObject = (id, parts) => {
      offsets[id] = byteLength;
      add(`${id} 0 obj\n`);
      parts.forEach(add);
      add("\nendobj\n");
    };

    add(new Uint8Array([37, 80, 68, 70, 45, 49, 46, 52, 10, 37, 255, 255, 255, 255, 10]));
    addObject(1, ["<< /Type /Catalog /Pages 2 0 R >>"]);
    addObject(2, ["<< /Type /Pages /Kids [3 0 R 6 0 R] /Count 2 >>"]);
    addObject(3, [`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PDF_WIDTH} ${PDF_HEIGHT}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>`]);
    addObject(4, [
      `<< /Type /XObject /Subtype /Image /Width ${PAGE_WIDTH} /Height ${PAGE_HEIGHT} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${images[0].length} >>\nstream\n`,
      images[0],
      "\nendstream",
    ]);
    const contentOne = `q\n${PDF_WIDTH} 0 0 ${PDF_HEIGHT} 0 0 cm\n/Im1 Do\nQ`;
    addObject(5, [`<< /Length ${contentOne.length} >>\nstream\n${contentOne}\nendstream`]);
    addObject(6, [`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PDF_WIDTH} ${PDF_HEIGHT}] /Resources << /XObject << /Im2 7 0 R >> >> /Contents 8 0 R >>`]);
    addObject(7, [
      `<< /Type /XObject /Subtype /Image /Width ${PAGE_WIDTH} /Height ${PAGE_HEIGHT} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${images[1].length} >>\nstream\n`,
      images[1],
      "\nendstream",
    ]);
    const contentTwo = `q\n${PDF_WIDTH} 0 0 ${PDF_HEIGHT} 0 0 cm\n/Im2 Do\nQ`;
    addObject(8, [`<< /Length ${contentTwo.length} >>\nstream\n${contentTwo}\nendstream`]);

    const xrefOffset = byteLength;
    let xref = "xref\n0 9\n0000000000 65535 f \n";
    for (let id = 1; id <= 8; id += 1) {
      xref += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
    }
    xref += `trailer\n<< /Size 9 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    add(xref);
    return new Blob(chunks, { type: "application/pdf" });
  }

  function safeFilename(value) {
    return String(value || "sin-nombre")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 55);
  }

  function openFinishModal(downloaded = true) {
    const backdrop = document.querySelector("#finishModal");
    const modal = backdrop.querySelector(".finish-modal");
    modal.classList.toggle("is-confirming", !downloaded);
    document.querySelector("#finishModalKicker").textContent = downloaded ? "Descarga completada" : "Nuevo formulario";
    document.querySelector("#finishModalTitle").textContent = downloaded ? "PDF descargado correctamente" : "¿Iniciar una nueva acta?";
    document.querySelector("#finishModalDescription").textContent = downloaded
      ? "Puedes conservar este borrador para retomarlo o limpiar todo y comenzar otra acta."
      : "Esta acción limpiará los campos, la inspección y todas las firmas guardadas en este dispositivo.";
    backdrop.hidden = false;
    document.body.classList.add("modal-open");
    window.setTimeout(() => document.querySelector("#keepDraft").focus(), 0);
  }

  function closeFinishModal() {
    document.querySelector("#finishModal").hidden = true;
    document.body.classList.remove("modal-open");
  }

  function clearDraftAndRestart() {
    window.ActaSecurity.clearDraft(STORAGE_KEY);
    window.location.reload();
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
        const canvases = [document.querySelector("#previewPage1"), document.querySelector("#previewPage2")];
        const blob = createPdfBlob(canvases);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const data = collectFormData();
        link.href = url;
        link.download = `acta-vivienda-${safeFilename(data.nombre || data.rut)}.pdf`;
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

  function initialize() {
    state.inspection = emptyInspection();
    loadDraft();
    initializeDefaults();
    initialValidation = window.ActaValidation.setup(form, {
      fieldNames: ["grado", "empleado", "rut", "nombre", "unidad", "villa", "fecha", "direccion"],
    });
    renderInspectionGroups();
    setupSignaturePads();
    setupFormEvents();
    updateProgress();
    showStep(0);
  }

  initialize();
})();
