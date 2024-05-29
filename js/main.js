const { createApp, ref, computed } = Vue;
createApp({
  setup() {
    const cargaInicial = ref(false);
    // Variables y validación respecto nombre
    const nombre = ref("");
    const nombreValido = ref(true);
    const validateNombre = () => {
      if (!nombre.value) {
        nombreValido.value = false;
        return false;
      }
      else if (!(/^[a-zA-Z ]+$/.test(nombre.value.trim()))) {
        nombreValido.value = false;
        return false;
      }
      nombreValido.value = true;
      return true;
    };
    // Variables y validación respecto fecha nacimiento
    const fechaNacimiento = ref("");
    const fechaNacimientoValido = ref(true);
    const validateFechaNacimiento = () => {
      if (!fechaNacimiento.value) {
        fechaNacimientoValido.value = false;
        return false;
      }
      fechaNacimientoValido.value = true;
      return true;
    };
    // VALIDACION TODO FORMULARIO
    const formularioInvalido = computed(() => {
      return validateNombre() && validateFechaNacimiento();
    });
    // const setValidacionesTrue = () => {
    //   nombreValido.value = false;
    // };
    const validarFormulario = async () => {
      // setValidacionesTrue();
      if (!formularioInvalido.value) {
        console.log("Faltan valores que completar");
      } else {
        console.log("Nombre:", nombre.value);
        await enviarForm();
      }
    };
    const enviarForm = async () => {
      try {
        // const response = await axios.get('https://pokeapi.co/api/v2/pokemon/ditto');
        cargaInicial.value = false;
        const response = await axios.post('http://127.0.0.1:8000/api/v1/docente/cv', {
          nombre: nombre.value,
          fechaNacimiento: fechaNacimiento.value,
          valor: 'xd',
          edad: 34,
        });
        console.log(response);
      } catch (error) {
        console.error(error);
      } finally {
        cargaInicial.value = true;
      }
    };
    return {
      cargaInicial,
      nombre,
      nombreValido,
      validateNombre,
      fechaNacimiento,
      fechaNacimientoValido,
      validateFechaNacimiento,
      validarFormulario,
      enviarForm,
    };
  },
  mounted() {
    setTimeout(() => {
      this.cargaInicial = true;
    }, 1000);
  },
}).mount("#app");
