(() => {
  "use strict";

  const DRAFT_TTL_MS = 12 * 60 * 60 * 1000;
  const MAX_DRAFT_BYTES = 4 * 1024 * 1024;
  const MAX_SIGNATURE_STROKES = 60;
  const MAX_POINTS_PER_STROKE = 1500;
  const ENVELOPE_VERSION = 1;

  function clearDraft(key) {
    try { localStorage.removeItem(key); } catch { /* El almacenamiento puede estar bloqueado. */ }
  }

  function saveDraft(key, data) {
    const now = Date.now();
    const serialized = JSON.stringify({
      __actaDraft: ENVELOPE_VERSION,
      savedAt: now,
      expiresAt: now + DRAFT_TTL_MS,
      data,
    });
    if (serialized.length > MAX_DRAFT_BYTES) throw new Error("El borrador supera el límite seguro de almacenamiento.");
    localStorage.setItem(key, serialized);
  }

  function loadDraft(key) {
    let raw;
    try { raw = localStorage.getItem(key); } catch { return null; }
    if (!raw) return null;
    if (raw.length > MAX_DRAFT_BYTES) {
      clearDraft(key);
      return null;
    }
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.__actaDraft === ENVELOPE_VERSION) {
        if (!Number.isFinite(parsed.expiresAt) || parsed.expiresAt <= Date.now()) {
          clearDraft(key);
          return null;
        }
        return parsed.data && typeof parsed.data === "object" ? parsed.data : null;
      }
      if (parsed && typeof parsed === "object") {
        try { saveDraft(key, parsed); } catch { /* El borrador legado sigue disponible en memoria. */ }
        return parsed;
      }
    } catch {
      clearDraft(key);
    }
    return null;
  }

  function restoreFieldValue(field, value) {
    let restored = String(value ?? "");
    const maxLength = Number(field.maxLength);
    if (Number.isFinite(maxLength) && maxLength > 0) restored = restored.slice(0, maxLength);
    field.value = restored;
  }

  function cleanPoint(point, normalized) {
    if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) return null;
    const maximum = normalized ? 1 : 4096;
    return { x: Math.max(0, Math.min(maximum, point.x)), y: Math.max(0, Math.min(maximum, point.y)) };
  }

  function cleanStrokes(value, normalized) {
    if (!Array.isArray(value)) return [];
    return value.slice(0, MAX_SIGNATURE_STROKES).map((stroke) => {
      if (!Array.isArray(stroke)) return [];
      return stroke.slice(0, MAX_POINTS_PER_STROKE).map((point) => cleanPoint(point, normalized)).filter(Boolean);
    }).filter((stroke) => stroke.length);
  }

  function cleanSignatures(value, allowedKeys, options = {}) {
    const result = {};
    const source = value && typeof value === "object" ? value : {};
    const normalized = options.normalized !== false;
    allowedKeys.forEach((key) => { result[key] = cleanStrokes(source[key], normalized); });
    return result;
  }

  function isIOSDevice() {
    const agent = navigator.userAgent || "";
    return /iPad|iPhone|iPod/.test(agent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }

  async function deliverPdf(blob, filename, title) {
    if (!(blob instanceof Blob) || blob.type !== "application/pdf") throw new Error("El archivo PDF no es válido.");
    if (isIOSDevice() && typeof File === "function" && typeof navigator.share === "function" && typeof navigator.canShare === "function") {
      const file = new File([blob], filename, { type: "application/pdf", lastModified: Date.now() });
      const shareData = { files: [file], title: title || "Acta de vivienda fiscal" };
      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return "shared";
      }
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    if (isIOSDevice()) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.download = filename;
    }
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), isIOSDevice() ? 60000 : 3000);
    return isIOSDevice() ? "opened" : "downloaded";
  }

  window.ActaSecurity = Object.freeze({
    clearDraft,
    loadDraft,
    saveDraft,
    restoreFieldValue,
    cleanSignatures,
    deliverPdf,
    isIOSDevice,
    pdfActionLabel: isIOSDevice() ? "Guardar / compartir PDF" : "Descargar PDF",
    limits: Object.freeze({
      maxSignatureStrokes: MAX_SIGNATURE_STROKES,
      maxPointsPerStroke: MAX_POINTS_PER_STROKE,
    }),
    draftHours: DRAFT_TTL_MS / 3600000,
  });
})();
