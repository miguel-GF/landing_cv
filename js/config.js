// Configuracion de despliegue.
// Cambia solamente este archivo al publicar el proyecto.
const IPES_SESSION_STORAGE_KEY = "ipes_curriculums_sesion";

window.IPES_CONFIG = Object.freeze({
  apiBaseUrl: "http://127.0.0.1:8000/api/v1",
  bearerToken: "e993014b8b85736546e8b35171d3b072",
  sessionDurationMinutes: 30,
  sessionStorageKey: IPES_SESSION_STORAGE_KEY,
  cerrarSesion() {
    localStorage.removeItem(IPES_SESSION_STORAGE_KEY);
    window.location.href = "ver-curriculums.html";
  },
});
