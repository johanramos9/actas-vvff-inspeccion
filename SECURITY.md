# Seguridad de Actas VV.FF.

## Modelo de seguridad

- La aplicación es completamente estática: no contiene backend, base de datos, cuentas ni API.
- Los RUT, firmas y demás datos no se transmiten por red. El PDF se genera dentro del navegador.
- Cada borrador se guarda solamente en el navegador actual y vence automáticamente después de 12 horas.
- Los borradores corruptos, vencidos o mayores a 4 MB se descartan.
- Las firmas se validan y limitan antes de restaurarlas para evitar consumos excesivos de memoria.
- Una política CSP bloquea scripts, conexiones, formularios, marcos y objetos que no pertenecen a la aplicación.
- `render.yaml` prepara las cabeceras de seguridad para un futuro sitio estático en Render.

## Riesgos que siguen existiendo

- El almacenamiento local no es cifrado. Cualquier persona que tenga acceso al mismo perfil desbloqueado del navegador durante las 12 horas puede abrir el borrador.
- Un sitio estático público no controla quién abre la aplicación. Si el acceso debe limitarse a inspectores, se necesita una capa real de autenticación o una red privada; un PIN escrito solo en JavaScript no ofrece protección real.
- El PDF descargado queda bajo la protección del dispositivo y de la carpeta donde se guarde.

## Recomendaciones de operación

1. Usar tablets institucionales con bloqueo de pantalla, cifrado del dispositivo y perfil individual.
2. Presionar **Nueva acta** después de descargar y verificar el PDF cuando no sea necesario retomar el borrador.
3. No utilizar equipos públicos o perfiles compartidos del navegador.
4. Mantener HTTPS y las cabeceras definidas en `render.yaml` al publicar.
5. No agregar analítica, scripts externos ni gestores de etiquetas sin revisar primero la CSP.
