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
          "http://127.0.0.1:8000/api/v1/docente/cvs",
          {
            headers: {
              Authorization: "Bearer e993014b8b85736546e8b35171d3b072",
            },
          }
        );
        const { status, mensaje, curriculums: data } = response.data;
        if (Number(status) !== 200) {
          console.error("Error:", mensaje);
        } else {
          curriculums.value = data;
          docentesFiltrados.value = data;
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
