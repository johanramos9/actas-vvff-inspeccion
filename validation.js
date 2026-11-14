(() => {
  "use strict";

  const textPatterns = {
    grado: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9°ºª.'’ -]{2,40}$/,
    nombre: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ.'’ -]{3,80}$/,
    unidad: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9°ºª.,'’/&() -]{2,60}$/,
    location: /^[^<>{}]{2,80}$/,
    shortLocation: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9°ºª.,#/'’() -]{1,30}$/,
  };

  function cleanRut(value) {
    return String(value || "").replace(/[^0-9kK]/g, "").toUpperCase().slice(0, 9);
  }

  function formatRut(value) {
    const clean = cleanRut(value);
    if (clean.length <= 1) return clean;
    const body = clean.slice(0, -1);
    const verifier = clean.slice(-1);
    return `${Number(body).toLocaleString("es-CL")}-${verifier}`;
  }

  function isValidRut(value) {
    const clean = cleanRut(value);
    if (!/^\d{7,8}[0-9K]$/.test(clean)) return false;
    const body = clean.slice(0, -1);
    const enteredVerifier = clean.slice(-1);
    let sum = 0;
    let multiplier = 2;
    for (let index = body.length - 1; index >= 0; index -= 1) {
      sum += Number(body[index]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    const result = 11 - (sum % 11);
    const expectedVerifier = result === 11 ? "0" : result === 10 ? "K" : String(result);
    return enteredVerifier === expectedVerifier;
  }

  function localDateValue(date = new Date()) {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }

  function fieldMessage(field) {
    const value = field.value.trim();
    if (!value) return "";
    switch (field.name) {
      case "rut":
      case "rutConyuge":
        return isValidRut(value) ? "" : "Ingresa un RUT chileno válido, incluyendo dígito verificador.";
      case "empleado":
        return /^\d{1,10}$/.test(value) ? "" : "El número de empleado debe contener solo dígitos (máximo 10).";
      case "grado":
        return textPatterns.grado.test(value) ? "" : "Usa entre 2 y 40 caracteres válidos para el grado.";
      case "nombre":
        return textPatterns.nombre.test(value) ? "" : "El nombre debe tener al menos 3 caracteres y no incluir números.";
      case "unidad":
        return textPatterns.unidad.test(value) ? "" : "Ingresa una unidad válida, con un mínimo de 2 caracteres.";
      case "villa":
      case "calle":
      case "direccion":
        return textPatterns.location.test(value) ? "" : "Ingresa al menos 2 caracteres y evita símbolos < > { }.";
      case "block":
      case "deptoCasa":
      case "numero":
        return textPatterns.shortLocation.test(value) ? "" : "Usa letras, números y signos habituales de una dirección.";
      case "fecha": {
        const parsed = new Date(`${value}T12:00:00`);
        if (Number.isNaN(parsed.getTime())) return "Ingresa una fecha válida.";
        return value <= localDateValue() ? "" : "La fecha del acta no puede ser posterior a hoy.";
      }
      default:
        return "";
    }
  }

  function setup(form, options = {}) {
    const fieldNames = options.fieldNames || [];
    const fields = fieldNames.map((name) => form.elements[name]).filter(Boolean);

    const dateField = form.elements.fecha;
    if (dateField) dateField.max = localDateValue();

    function errorId(field) {
      return `${form.id}-${field.name}-error`;
    }

    function clearError(field) {
      const wrapper = field.closest(".field");
      if (!wrapper) return;
      wrapper.classList.remove("has-error");
      field.removeAttribute("aria-invalid");
      if (field.getAttribute("aria-describedby") === errorId(field)) field.removeAttribute("aria-describedby");
      const error = wrapper.querySelector(".field-error");
      if (error) error.remove();
    }

    function showError(field, message) {
      const wrapper = field.closest(".field");
      if (!wrapper) return;
      wrapper.classList.add("has-error");
      field.setAttribute("aria-invalid", "true");
      let error = wrapper.querySelector(".field-error");
      if (!error) {
        error = document.createElement("small");
        error.className = "field-error";
        error.id = errorId(field);
        wrapper.appendChild(error);
      }
      error.textContent = message;
      field.setAttribute("aria-describedby", error.id);
    }

    function validateField(field) {
      const message = fieldMessage(field);
      if (message) {
        showError(field, message);
        return false;
      }
      clearError(field);
      return true;
    }

    function validateAll({ focus = true } = {}) {
      const invalidFields = fields.filter((field) => !validateField(field));
      if (focus && invalidFields.length) {
        invalidFields[0].scrollIntoView({ behavior: "smooth", block: "center" });
        window.setTimeout(() => invalidFields[0].focus({ preventScroll: true }), 180);
      }
      return invalidFields.length === 0;
    }

    fields.forEach((field) => {
      if ((field.name === "rut" || field.name === "rutConyuge") && field.value) field.value = formatRut(field.value);
      field.addEventListener("input", () => {
        if (field.name === "rut" || field.name === "rutConyuge") field.value = formatRut(field.value);
        if (field.name === "empleado") field.value = field.value.replace(/\D/g, "").slice(0, 10);
        if (field.closest(".field")?.classList.contains("has-error")) validateField(field);
      });
      field.addEventListener("blur", () => {
        if (field.type !== "date") field.value = field.value.trim().replace(/\s{2,}/g, " ");
        validateField(field);
      });
    });

    return { validateAll, validateField, formatRut, isValidRut, localDateValue };
  }

  window.ActaValidation = { setup, formatRut, isValidRut, localDateValue };
})();
