# IPES Curriculum

Landing page desarrollada con HTML5, CSS y Vue 3.

## Configuracion

Actualmente el proyecto no carga variables desde `.env`, ya que los archivos HTML y
JavaScript se sirven de forma estatica y no tienen un proceso de compilacion.

La configuracion activa se encuentra en `js/config.js`. Antes de publicar se deben
revisar al inicio de ese archivo la URL de la API, el token Bearer, la duracion de la
sesion, la clave de almacenamiento y la URL de redireccion al cerrar sesion.

En local, si se entra por `http://ipes-curriculum.test`, el proyecto usa
automaticamente `http://school-control.test/api/v1`. Para cualquier otro dominio usa
la URL configurada como respaldo.

El archivo `.env.example` queda unicamente como referencia para una posible migracion
futura a PHP o a una herramienta de compilacion como Vite.

## Flujo de captura

1. El docente captura su **correo institucional** en la pantalla inicial.
2. La API consulta si el correo ya existe:
   - **No existe:** crea el expediente y genera una contraseña segura de 12
     caracteres. La contraseña se muestra una sola vez y el docente debe copiarla
     para continuar.
   - **Existe con contraseña:** solicita la contraseña para abrir el expediente.
   - **Existe sin contraseña:** muestra un aviso para contactar a soporte.
3. Después de validar correo y contraseña, el docente puede capturar, guardar y
   actualizar su información cuando quiera. El expediente ya no se bloquea para él.
4. El indicador flotante muestra el porcentaje, lo capturado y lo que falta.
5. El **admin** puede generar/restablecer contraseñas y cerrar o reabrir un CV.
   El cierre no impide que el docente siga actualizando su información.

## Endpoints usados

- `POST /api/v1/docente/cv/correo` - consulta o crea un expediente por correo.
- `POST /api/v1/docente/cv/acceder` - valida correo y contraseña.
- `POST /api/v1/docente/cv/{id}` - guarda cambios. Requiere el header `X-CV-Token`.
- `POST /api/v1/docente/cv/{id}/password` - admin: genera/restablece contraseña.
- `POST /api/v1/docente/cv/{id}/finalizar` - admin: cierra el CV.
- `POST /api/v1/docente/cv/{id}/reabrir` - admin: reabre el CV.
- `GET /api/v1/docente/cv/{id}` - detalle completo con documentos activos.
- `GET /api/v1/docente/cvs` - lista de currículums para el admin.

El backend se encuentra en el proyecto `school-control`. Para publicar este flujo se
deben ejecutar las migraciones nuevas de `curriculum_docentes`.
