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

      // --- Acciones admin ---
      docentePassword: null,
      passwordGenerada: "",
      passwordCopiada: false,
      faltantesAdmin: [],
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

    async copiarTexto(valor) {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(valor);
          return true;
        }
      } catch (error) {
        // Intentar con el metodo alternativo.
      }

      try {
        const input = document.createElement("textarea");
        input.value = valor;
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        const copiado = document.execCommand("copy");
        document.body.removeChild(input);
        return copiado;
      } catch (error) {
        return false;
      }
    },

    async generarPassword(docente) {
      const nombre = docente.nombre || docente.correo_institucional || "docente";
      if (
        !window.confirm(
          `¿Generar una nueva contraseña para ${nombre}? La contraseña anterior dejará de funcionar.`
        )
      ) {
        return;
      }

      try {
        const response = await axios.post(
          `docente/cv/${docente.curriculum_docente_id}/password`
        );

        if (Number(response.data.status) !== 200) {
          throw new Error(response.data.mensaje || "No se pudo generar la contraseña.");
        }

        this.docentePassword = docente;
        this.passwordGenerada = response.data.password;
        this.passwordCopiada = false;
        docente.tiene_password = true;

        bootstrap.Modal.getOrCreateInstance(
          document.getElementById("modalPasswordAdmin")
        ).show();
      } catch (error) {
        alert(
          error.response?.data?.mensaje ||
            error.message ||
            "No se pudo generar la contraseña."
        );
      }
    },

    async copiarPasswordAdmin() {
      if (!this.passwordGenerada) return;

      const copiado = await this.copiarTexto(this.passwordGenerada);
      this.passwordCopiada = copiado;

      if (!copiado) {
        alert("No se pudo copiar automáticamente. Selecciona la contraseña y cópiala manualmente.");
      }
    },

    async cerrarCV(docente) {
      const nombre = docente.nombre || docente.correo_institucional || "docente";
      if (!window.confirm(`¿Cerrar el CV de ${nombre}?`)) return;

      try {
        const response = await axios.post(
          `docente/cv/${docente.curriculum_docente_id}/finalizar`
        );

        if (Number(response.data.status) === 422) {
          this.faltantesAdmin = response.data.faltantes || [];
          bootstrap.Modal.getOrCreateInstance(
            document.getElementById("modalFaltantesAdmin")
          ).show();
          return;
        }

        if (Number(response.data.status) !== 200) {
          throw new Error(response.data.mensaje || "No se pudo cerrar el CV.");
        }

        docente.status = "Completado";
        docente.finalizado_fecha =
          response.data.curriculum?.finalizado_fecha || new Date().toISOString();
      } catch (error) {
        alert(
          error.response?.data?.mensaje ||
            error.message ||
            "No se pudo cerrar el CV."
        );
      }
    },

    async reabrirCV(docente) {
      const nombre = docente.nombre || docente.correo_institucional || "docente";
      if (!window.confirm(`¿Reabrir el CV de ${nombre}?`)) return;

      try {
        const response = await axios.post(
          `docente/cv/${docente.curriculum_docente_id}/reabrir`
        );

        if (Number(response.data.status) !== 200) {
          throw new Error(response.data.mensaje || "No se pudo reabrir el CV.");
        }

        docente.status = "Activo";
        docente.finalizado_fecha = null;
      } catch (error) {
        alert(
          error.response?.data?.mensaje ||
            error.message ||
            "No se pudo reabrir el CV."
        );
      }
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
