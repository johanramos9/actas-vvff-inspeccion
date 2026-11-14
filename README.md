# Actas VV.FF. — Aplicación digital

Aplicación independiente para completar, firmar y descargar actas de vivienda fiscal.

## Formularios disponibles

- **Acta 1 — Revisión por dormitorios:** evalúa elementos en los dormitorios 1 a 5 con condición Bueno/Malo y causa U/D/T.
- **Acta 2 — Matriz por dependencia:** cruza cada elemento con hall, terraza, living, dormitorios, baños, cocina y otros espacios; utiliza calificación B/R/M.
- **Acta 3 — Inspección por sectores:** checklist detallado por cocina/logia, living/pasillo/terraza, dormitorios, baños, bodega y varios, con condición y causa U/D/T.

## Abrir la demo

Desde esta carpeta ejecuta:

```bash
python3 -m http.server 4173
```

Luego abre `http://localhost:4173` en el navegador. El selector superior permite cambiar entre Acta 1, Acta 2 y Acta 3. Cada una conserva su propio borrador.

## Alcance actual

- Aplicación responsive para teléfono, tablet y computador.
- Datos del funcionario y de la vivienda.
- Motivo del acta.
- Matriz de inspección de dormitorios 1 a 5.
- Condición final y observaciones.
- Firmas táctiles.
- Vista previa y descarga de PDF A4 (dos páginas para Acta 1, cuatro páginas apaisadas para Acta 2 y seis páginas apaisadas para Acta 3).
- Guardado automático del borrador en el navegador.
- Validación de RUT chileno, número de empleado, nombres, ubicación y fecha antes de avanzar o descargar.
- Los acordeones de inspección conservan su estado al marcar condiciones.

La demo funciona completamente en el navegador y no envía datos a servidores.

## Privacidad y seguridad

- Cada acta guarda su propio borrador en `localStorage`; el borrador vence automáticamente después de 12 horas y también puede borrarse inmediatamente con **Nueva acta**.
- Una CSP estricta bloquea conexiones de red, scripts externos, iframes, objetos y envíos de formularios.
- Los borradores tienen un límite de 4 MB y las firmas restauradas se validan y limitan.
- Las entradas se validan y escapan antes de insertarlas en HTML; el PDF se dibuja en canvas sin interpretar HTML.
- `render.yaml` incluye cabeceras de seguridad para un futuro despliegue estático en Render.
- El modelo de amenazas y las recomendaciones operativas están en `SECURITY.md`.
