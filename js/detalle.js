const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const docente = ref(null);
    const cargaInicial = ref(false);
    const error = ref(null);

    const obtenerIdDesdeURL = () => {
      const params = new URLSearchParams(window.location.search);
      return params.get("id");
    };

    const fetchDetalleDocente = async () => {
      const id = obtenerIdDesdeURL();
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/docente/cv/${id}`,
          {
            headers: {
              Authorization: "Bearer e993014b8b85736546e8b35171d3b072",
            },
          }
        );

        const { status, mensaje, curriculum } = response.data;

        if (Number(status) !== 200) {
          error.value = mensaje || "Ocurrió un error al cargar el detalle.";
        } else {
          docente.value = curriculum;
        }

      } catch (err) {
        error.value = "No se pudo conectar con el servidor.";
        console.error("Error al obtener detalle del CV:", err);
      } finally {
        cargaInicial.value = true;
      }
    };

    onMounted(fetchDetalleDocente);

    const descargarDocumento = async (archivoId, nombreArchivo) => {
      try {
        const formData = new FormData();
        formData.append("archivoId", archivoId)
        const response = await axios.post(
          `http://127.0.0.1:8000/api/v1/docente/descargar/documento`,
          formData,
          {
            headers: {
              Authorization: "Bearer e993014b8b85736546e8b35171d3b072",
            },
            responseType: "blob",
          }
        );

        // Crear un blob y simular la descarga
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = nombreArchivo || "archivo.pdf";
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        console.log('hasta qaqui llegos')
      } catch (error) {
        console.error("Error al descargar el archivo:", error);
        alert("No se pudo descargar el archivo.");
      }
    };


    return {
      docente,
      error,
      cargaInicial,
      descargarDocumento
    };
  }
}).mount("#app");
