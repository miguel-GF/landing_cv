// 1. Configuración Global de Axios
// Esto asegura que TODAS las peticiones lleven el token y apunten a tu servidor
axios.defaults.baseURL = "http://127.0.0.1:8000/api/v1/"; // <--- Ajusta tu ruta de localhost
axios.defaults.headers.common["Authorization"] = "Bearer e993014b8b85736546e8b35171d3b072"; // <--- Pon tu token real aquí
axios.defaults.headers.post["Content-Type"] = "application/json";

const { createApp } = Vue;

createApp({
  data() {
    return {
      // --- Control de Acceso (Modal) ---
      autenticado: false,
      cargandoLogin: false,
      errorLogin: "",
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
          this.autenticado = true;
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
        this.curriculums = response.data.curriculums;
        this.curriculumsFiltrados = response.data.curriculums;
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
        return docente.nombre.toLowerCase().includes(query);
      });
    },

    verDetalle(id) {
      window.location.href = `detalle-archivos.html?id=${id}`;
    },
  },
  mounted() {
    // Al cargar, el modal aparece por default porque autenticado es false
    // console.log("Sistema listo.");
  },
}).mount("#app");
