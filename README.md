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

1. El docente captura su numero de celular en la pantalla inicial.
2. La API busca un expediente con ese celular (sin importar espacios, guiones o `+`).
   - Si no existe, se abre un expediente nuevo.
   - Si existe y esta `Activo`, se cargan sus datos y documentos para continuar.
   - Si existe y esta `Completado`, se muestra la pantalla de curriculum cerrado.
3. El docente puede guardar avances por partes. Los documentos se reemplazan por tipo
   en lugar de acumularse, y el celular evita crear registros duplicados.
4. El indicador flotante muestra el porcentaje, lo capturado y lo que falta.
5. Al enviar a revision se validan los datos y los 9 documentos obligatorios. Si todo
   esta completo, el expediente cambia a `Completado`, se guarda `finalizado_fecha` y
   queda bloqueado para el docente.

## Endpoints usados

- `POST /api/v1/docente/cv/buscar` - busca por celular y devuelve el estado de captura.
- `POST /api/v1/docente/cv` - crea o actualiza (por celular) un avance.
- `POST|PUT /api/v1/docente/cv/{id}` - actualiza un avance existente.
- `POST /api/v1/docente/cv/{id}/finalizar` - envia a revision y bloquea el expediente.
- `GET /api/v1/docente/cv/{id}` - detalle completo con documentos activos.

El backend se encuentra en el proyecto `school-control`. Para publicar este flujo se
deben ejecutar las migraciones nuevas de `curriculum_docentes` (fecha de finalizacion y
campos opcionales para permitir avances parciales).
