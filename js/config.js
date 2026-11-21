// Configuracion activa del proyecto.
// Este sitio es HTML estatico y por el momento NO carga valores desde .env.
// Cambia solamente estas constantes al publicar el proyecto.
const IPES_ES_ENTORNO_LOCAL = window.location.hostname.endsWith(".test");
const IPES_API_BASE_URL = IPES_ES_ENTORNO_LOCAL
  ? "http://school-control.test/api/v1"
  : "http://127.0.0.1:8000/api/v1";
const IPES_BEARER_TOKEN = "e993014b8b85736546e8b35171d3b072";
const IPES_SESSION_DURATION_MINUTES = 30;
const IPES_SESSION_STORAGE_KEY = "ipes_curriculums_sesion";
const IPES_LOGOUT_REDIRECT_URL = "ver-curriculums.html";

window.IPES_CONFIG = Object.freeze({
  apiBaseUrl: IPES_API_BASE_URL,
  bearerToken: IPES_BEARER_TOKEN,
  sessionDurationMinutes: IPES_SESSION_DURATION_MINUTES,
  sessionStorageKey: IPES_SESSION_STORAGE_KEY,
  logoutRedirectUrl: IPES_LOGOUT_REDIRECT_URL,
  cerrarSesion() {
    localStorage.removeItem(IPES_SESSION_STORAGE_KEY);
    window.location.href = IPES_LOGOUT_REDIRECT_URL;
  },
});
