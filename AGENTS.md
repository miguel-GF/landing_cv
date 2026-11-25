# AGENTS.md — IPES Curriculum

## 1. Qué es este proyecto

Frontend estático para que los docentes del IPES capturen y actualicen su
currículum vitae. Está hecho con HTML, CSS, Bootstrap 5 y Vue 3, sin build
para el frontend.

El backend vive en otro proyecto Laravel:

| Proyecto | Ruta local | URL local |
|---|---|---|
| Frontend | `C:\laragon\www\ipes-curriculum` | `http://ipes-curriculum.test` |
| Backend / API | `C:\laragon\www\school-control` | `http://school-control.test/api/v1` |

## 2. Cómo se conecta al API

La configuración está en `js/config.js`.

- Si el hostname termina en `.test`, usa:
  `http://school-control.test/api/v1`
- En cualquier otro dominio usa:
  `http://127.0.0.1:8000/api/v1`
- El token Bearer es estático y está en `js/config.js`.
- El API usa el middleware `api.key` del proyecto `school-control`.
- Para guardar cambios del docente se usa además el header `X-CV-Token`.

Archivos que consumen el API:

- `js/main.js` — formulario del docente.
- `js/ver-latest.js` — pantalla admin de currículums.
- `js/detalle.js` — detalle de documentos.
- `js/ver.js` — pantalla anterior de consulta (legacy).

## 3. Flujo actual del docente

> Este es el flujo nuevo que se está terminando de implementar. El identificador
> ya NO es el celular: es el correo institucional.

1. El docente captura su correo institucional.
2. El sistema consulta si el correo existe:
   - **No existe:** crea el expediente, genera una contraseña de 12 caracteres
     (mayúsculas, minúsculas y números), la muestra una sola vez y exige que el
     docente haga clic en **Copiar contraseña** para continuar.
   - **Existe con contraseña:** pide la contraseña.
   - **Existe sin contraseña:** muestra aviso de contactar a soporte.
3. Al validar correo + contraseña, el backend devuelve un token temporal y los
   datos del expediente.
4. El docente ve su formulario con el porcentaje de avance y puede actualizar su
   información cuando quiera.
5. El docente **no cierra** su CV. El cierre/finalización es una acción del admin.
6. El admin también puede generar/restablecer contraseñas para entregarlas
   personalmente a docentes existentes.

### Documentos obligatorios (9)

`cv`, `planeacion_academica`, `ine`, `curp`, `domicilio`,
`situacion_fiscal`, `acta_nacimiento`, `cedula_profesional`, `cuenta_bancaria`.

### Reglas importantes

- El correo institucional es único a nivel aplicación. No se crean expedientes
  nuevos si el correo ya existe.
- El celular sigue siendo un dato del formulario, pero ya no es el identificador.
- La contraseña se guarda hasheada. Nunca se devuelve después de crearla.
- El token de acceso expira a las 8 horas. Si expira, se pide correo y contraseña.
- Los endpoints de admin nunca deben devolver `password_hash`,
  `access_token_hash` ni `access_token_expira`.
- Los registros en `Baja` se ignoran en las búsquedas.

## 4. Endpoints principales del backend

Base: `http://school-control.test/api/v1`

| Método | Endpoint | Uso |
|---|---|---|
| POST | `/docente/cv/correo` | Consulta o crea expediente por correo |
| POST | `/docente/cv/acceder` | Valida correo + contraseña |
| POST | `/docente/cv/{id}` | Guarda cambios. Requiere `X-CV-Token` |
| POST | `/docente/cv/{id}/password` | Admin: genera/restablece contraseña |
| POST | `/docente/cv/{id}/finalizar` | Admin: cierra el CV |
| POST | `/docente/cv/{id}/reabrir` | Admin: reabre el CV |
| GET | `/docente/cvs` | Admin: lista de currículums |
| GET | `/docente/cv/{id}` | Detalle con documentos activos |
| POST | `/docente/descargar/documento` | Descarga un documento |

Endpoints legacy que siguen existiendo pero ya no usa el flujo nuevo:

- `POST /docente/cv/buscar` — búsqueda por celular.
- `POST /docente/cv` — alta legacy.

## 5. Base de datos

Tablas:

- `curriculum_docentes`
- `curriculum_docentes_archivos`

Columnas nuevas del flujo actual:

- `curriculum_docentes.password_hash`
- `curriculum_docentes.access_token_hash`
- `curriculum_docentes.access_token_expira`
- `curriculum_docentes.finalizado_fecha`
- `curriculum_docentes_archivos.ruta`
- `numero_celular` ahora es nullable.
- Varios campos principales son nullable para permitir avances parciales.

Migraciones relevantes en `school-control`:

```text
database/migrations/2026_11_20_000000_add_finalizado_fecha_to_curriculum_docentes_table.php
database/migrations/2026_11_20_000001_make_curriculum_docentes_fields_nullable.php
database/migrations/2026_11_24_000000_add_password_access_to_curriculum_docentes_table.php
database/migrations/2025_01_22_230939_add_column_ruta_archivo_curriculum.php
```

SQL manual:

```text
school-control/database/sql/curriculum_agregar_campos.sql
```

## 6. SQL de fusión y cierre

Carpeta:

```text
C:\laragon\www\school-control\database\sql\
```

| Archivo | Uso |
|---|---|
| `curriculum_fusion_preview.sql` | Diagnóstico de duplicados. No modifica nada |
| `curriculum_fusion_duplicados.sql` | Fusiona por celular y marca duplicados como `Baja` |
| `curriculum_cerrar_todos.sql` | Cierra solo los CV con los 9 documentos |
| `curriculum_agregar_campos.sql` | Agrega columnas nuevas si no existen |

Notas:

- La fusión sigue siendo **por celular**, por decisión del usuario.
- No hace `DELETE` físicos: mueve documentos y marca duplicados como `Baja`.
- Los SQL demo (`curriculum_demo_*.sql`) son solo para local.

## 7. Estado actual del trabajo

Fecha de referencia: **2026-11-24**

### Terminado

- Backend:
  - Búsqueda/creación por correo.
  - Acceso con contraseña.
  - Generación de contraseña de 12 caracteres.
  - Hash de contraseña.
  - Token temporal `X-CV-Token`.
  - Reset de contraseña para admin.
  - Cerrar/reabrir CV para admin.
  - Migración de columnas nuevas.
  - Endpoints probados por HTTP.
- Frontend:
  - `js/main.js` reescrito para correo + contraseña + token.
  - Pantallas de correo, contraseña y “sin contraseña” en `index.html`.
  - Modal de contraseña nueva con botón de copiar.
  - Formulario editable con porcentaje.
  - Se quitó la pantalla de CV cerrado del docente.
  - Pantalla admin con botones de contraseña, cerrar y reabrir.
  - Modales admin de contraseña y de documentos faltantes.
- Pruebas en navegador:
  - correo nuevo → contraseña → copiar → formulario,
  - correo existente → contraseña incorrecta → error,
  - correo existente → contraseña correcta → formulario,
  - guardar cambios con `X-CV-Token`,
  - correo existente sin contraseña → aviso de soporte,
  - admin genera contraseña y la copia,
  - admin intenta cerrar CV incompleto y ve faltantes.
- Codificación UTF-8 corregida en frontend y backend.
- SQL de fusión y cierre.
- Build del backend ejecutado correctamente.

### Pendiente / siguiente

- Commit final de estos cambios.
- Desplegar migraciones y SQL a producción.
- Decidir si se limpian los datos demo locales (`curriculum_demo_cleanup.sql`).
- La fusión histórica sigue siendo por celular, no por correo.
- Si se quiere, agregar una fusión/preview por correo para limpiar correos
  duplicados históricos.

## 8. Cómo trabajar en una nueva tarea

1. Leer este `AGENTS.md` primero.
2. Revisar `git status` en ambos repos.
3. Confirmar con el usuario el alcance si hay ambigüedad.
4. Mantener sincronizados frontend y backend.
5. No reintroducir el celular como identificador.
6. No exponer hashes ni tokens en respuestas.
7. Probar el flujo con el API local.
8. Actualizar la sección **Estado actual** de este archivo.
9. Hacer commit en el repo correspondiente.

## 9. Comandos útiles

Frontend local:

```text
http://ipes-curriculum.test/index.html
http://ipes-curriculum.test/ver-curriculums.html
```

Backend:

```bash
cd C:\laragon\www\school-control
php artisan migrate
php artisan config:clear
npm.cmd run build
```

> En PowerShell, `npm run build` puede fallar por ExecutionPolicy.
> Usar `npm.cmd run build`.

## 10. Commits recientes

Frontend:

```text
a0079a4 feat: nuevo flujo de captura por celular y logo institucional
caab390 fix: corregir cierre del modal de soporte y fondo
```

Backend:

```text
bb08147 feat: busqueda, actualizacion, fusion y cierre de curriculums
5e12457 chore: actualizar versiones de frontend y API
420791a docs: agregar SQL manual para campos del curriculum
7f475aa fix: simplificar SQL de campos del curriculum
8af5c93 fix: agregar columnas de curriculum solo si no existen
961029b feat: mostrar cobertura final de documentos en preview
127db0a feat: cerrar solo curriculums con los 9 documentos
```

## 11. Cuidados conocidos

- `.env` está ignorado por Git. No se commitea.
- Los ZIP `public/build-*.zip` no se deben commitear.
- Hubo problemas de codificación al editar HTML con PowerShell.
  Usar las herramientas de edición del agente y verificar con Node:
  ```bash
  node -e "const fs=require('fs'); const s=fs.readFileSync('index.html','utf8'); console.log(s.includes('Identifícate'))"
  ```
- El API y el frontend deben usar la misma URL configurada en `js/config.js`.
- El token Bearer es estático; el `X-CV-Token` es por docente.
- Si se reinicia MySQL/Laragon, validar que `school-control.test` responda.
