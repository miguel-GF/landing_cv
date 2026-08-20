# IPES Curriculum

Landing page desarrollada con HTML5, CSS y Vue 3.

## Configuracion

Actualmente el proyecto no carga variables desde `.env`, ya que los archivos HTML y
JavaScript se sirven de forma estatica y no tienen un proceso de compilacion.

La configuracion activa se encuentra en `js/config.js`. Antes de publicar se deben
revisar al inicio de ese archivo la URL de la API, el token Bearer, la duracion de la
sesion, la clave de almacenamiento y la URL de redireccion al cerrar sesion.

El archivo `.env.example` queda unicamente como referencia para una posible migracion
futura a PHP o a una herramienta de compilacion como Vite.
