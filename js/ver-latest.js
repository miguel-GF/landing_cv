// 1. Configuración Global de Axios
// Esto asegura que TODAS las peticiones lleven el token y apunten a tu servidor
const { apiBaseUrl, bearerToken, sessionDurationMinutes } = window.IPES_CONFIG;

axios.defaults.baseURL = `${apiBaseUrl}/`;
axios.defaults.headers.common["Authorization"] = `Bearer ${bearerToken}`;
axios.defaults.headers.post["Content-Type"] = "application/json";

const CLAVE_SESION_CURRICULUMS = window.IPES_CONFIG.sessionStorageKey;
const DURACION_SESION_MS = sessionDurationMinutes * 60 * 1000;

function leerSesionCurriculums() {
  try {
    const sesionGuardada = JSON.parse(
      localStorage.getItem(CLAVE_SESION_CURRICULUMS)
    );

    if (sesionGuardada && Number(sesionGuardada.expiraEn) > Date.now()) {
      return sesionGuardada;
    }

    localStorage.removeItem(CLAVE_SESION_CURRICULUMS);
  } catch (error) {
    console.warn("No se pudo leer la sesion local:", error);
  }

  return null;
}

function guardarSesionCurriculums() {
  localStorage.setItem(
    CLAVE_SESION_CURRICULUMS,
    JSON.stringify({ expiraEn: Date.now() + DURACION_SESION_MS })
  );
}

function borrarSesionCurriculums() {
  localStorage.removeItem(CLAVE_SESION_CURRICULUMS);
}

const { createApp } = Vue;

createApp({
  data() {
    return {
      // --- Control de Acceso (Modal) ---
      autenticado: Boolean(leerSesionCurriculums()),
      cargandoLogin: false,
      errorLogin: "",
      temporizadorSesion: null,
      login: {
        user: "",
        password: "",
      },

      // --- Datos de la página ---
      curriculums: [],
      curriculumsFiltrados: [], // Para la búsqueda local
      busqueda: "",
      cargaInicial: false,
    };
  },
  methods: {
    iniciarTemporizadorSesion() {
      const sesion = leerSesionCurriculums();

      if (!sesion) {
        this.cerrarSesion();
        return;
      }

      clearTimeout(this.temporizadorSesion);
      this.temporizadorSesion = setTimeout(() => {
        this.cerrarSesion("La sesion expiro. Inicia sesion nuevamente.");
      }, Math.max(0, Number(sesion.expiraEn) - Date.now()));
    },

    validarSesion() {
      if (leerSesionCurriculums()) {
        if (!this.autenticado) {
          this.autenticado = true;
          this.obtenerCurriculums();
        }
        this.iniciarTemporizadorSesion();
      } else if (this.autenticado) {
        this.cerrarSesion("La sesion expiro. Inicia sesion nuevamente.");
      }
    },

    cerrarSesion(mensaje = "") {
      borrarSesionCurriculums();
      clearTimeout(this.temporizadorSesion);
      this.temporizadorSesion = null;
      this.autenticado = false;
      this.curriculums = [];
      this.curriculumsFiltrados = [];
      this.cargaInicial = false;
      this.login.user = "";
      this.login.password = "";
      this.errorLogin = mensaje;
    },

    /**
     * Intento de login al modal
     */
    async intentarLogin() {
      if (!this.login.user || !this.login.password) {
        this.errorLogin = "Ingresa usuario y contraseña.";
        return;
      }

      this.cargandoLogin = true;
      this.errorLogin = "";

      try {
        // Petición al endpoint de validación
        // Como ya configuramos baseURL arriba, solo pones el nombre del endpoint
        const response = await axios.post("auth/login/portalcv", {
          usuario: this.login.user,
          password: sha256(this.login.password),
        });

        if (response.data === true || response.data.success === true) {
          guardarSesionCurriculums();
          this.autenticado = true;
          this.iniciarTemporizadorSesion();
          // Si el login es exitoso, traemos los documentos
          this.obtenerCurriculums();
        } else {
          this.errorLogin = "Credenciales incorrectas.";
        }
      } catch (error) {
        console.error("Error en Login:", error);
        this.errorLogin = "Error de conexión con el servidor.";
      } finally {
        this.cargandoLogin = false;
      }
    },

    /**
     * Obtener la lista de currículums (Solo tras autenticarse)
     */
    async obtenerCurriculums() {
      this.cargaInicial = false;
      try {
        // Esta petición ya llevará el Bearer Token automáticamente
        const response = await axios.get("docente/cvs");
        const curriculumsOrdenados = [...(response.data.curriculums || [])].sort(
          (a, b) => {
            const fechaA = Date.parse(
              String(a.registro_fecha || "").replace(" ", "T")
            ) || 0;
            const fechaB = Date.parse(
              String(b.registro_fecha || "").replace(" ", "T")
            ) || 0;

            return (
              fechaB - fechaA ||
              Number(b.curriculum_docente_id || 0) -
                Number(a.curriculum_docente_id || 0)
            );
          }
        );

        this.curriculums = curriculumsOrdenados;
        this.curriculumsFiltrados = curriculumsOrdenados;
      } catch (error) {
        console.error("Error al cargar datos:", error);
        alert("Error al obtener la información de la API.");
      } finally {
        this.cargaInicial = true;
      }
    },

    /**
     * Filtro dinámico por nombre
     */
    filtrarDocentes() {
      const query = this.busqueda.toLowerCase();
      this.curriculumsFiltrados = this.curriculums.filter((docente) => {
        return String(docente.nombre || "").toLowerCase().includes(query);
      });
    },

    verDetalle(id) {
      window.location.href = `detalle-archivos.html?id=${id}`;
    },
  },
  mounted() {
    if (this.autenticado) {
      this.iniciarTemporizadorSesion();
      this.obtenerCurriculums();
    }

    window.addEventListener("focus", this.validarSesion);
  },
}).mount("#app");
