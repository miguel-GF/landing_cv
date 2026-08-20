const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const cargaInicial = ref(false);
    const curriculums = ref([]);
    const busqueda = ref("");
    const docentesFiltrados = ref([]);

    const fetchDocentes = async () => {
      try {
        const response = await axios.get(
          `${window.IPES_CONFIG.apiBaseUrl}/docente/cvs`,
          {
            headers: {
              Authorization: `Bearer ${window.IPES_CONFIG.bearerToken}`,
            },
          }
        );
        const { status, mensaje, curriculums: data } = response.data;
        if (Number(status) !== 200) {
          console.error("Error:", mensaje);
        } else {
          const curriculumsOrdenados = [...(data || [])].sort((a, b) => {
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
          });

          curriculums.value = curriculumsOrdenados;
          docentesFiltrados.value = curriculumsOrdenados;
        }
      } catch (error) {
        console.error("Error al obtener docentes:", error);
      } finally {
        cargaInicial.value = true;
      }
    };

    const filtrarDocentes = () => {
      const filtro = busqueda.value.toLowerCase();
      docentesFiltrados.value = curriculums.value.filter((docente) =>
        docente.nombre.toLowerCase().includes(filtro)
      );
    };

    const verDetalle = (id) => {
      window.location.href = `detalle-archivos.html?id=${id}`;
    };

    onMounted(fetchDocentes);

    return {
      cargaInicial,
      curriculums: docentesFiltrados, // esto es lo que ve el HTML
      busqueda,
      filtrarDocentes,
      verDetalle,
    };
  },
}).mount("#app");
