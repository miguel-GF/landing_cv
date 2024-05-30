import {
  validacionGeneral,
  validacionNombre,
  validacionCodigoPostal,
} from "./validate.js";
const { createApp, ref, computed } = Vue;
createApp({
  setup() {
    const cargaInicial = ref(false);
    // Variables y validación respecto nombre
    const nombre = ref("");
    const nombreValido = ref(true);
    const validateNombre = () => {
      nombreValido.value = validacionNombre(nombre.value);
      return nombreValido.value;
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
    // DATOS DE CIUDAD
    const ciudad = ref("");
    const ciudadValida = ref(true);
    const validateCiudad = () => {
      ciudadValida.value = validacionGeneral(ciudad.value);
      return ciudadValida.value;
    };
    // DATOS DE ESTADO
    const estado = ref("");
    const estadoValido = ref(true);
    const validateEstado = () => {
      estadoValido.value = validacionGeneral(estado.value);
      return estadoValido.value;
    };
    // DATOS DE PAIS
    const pais = ref("México");
    const paisValido = ref(true);
    const validatePais = () => {
      paisValido.value = validacionGeneral(pais.value);
      return paisValido.value;
    };
    // DATOS ESTADO CIVIL
    const estadoCivil = ref("soltero");
    const estadoCivilValido = ref(true);
    const validateEstadoCivil = () => {
      estadoCivilValido.value = validacionGeneral(estadoCivil.value);
      return estadoCivilValido.value;
    };
    // DATOS GENERO
    const genero = ref("hombre");
    const generoValido = ref(true);
    const validateGenero = () => {
      generoValido.value = validacionGeneral(genero.value);
      return generoValido.value;
    };
    // DATOS CORREO
    const correo = ref("");
    const correoValido = ref(true);
    const validateCorreo = () => {
      correoValido.value = validacionGeneral(correo.value);
      return correoValido.value;
    };
    // DATOS CELULAR
    const celular = ref("");
    const celularValido = ref(true);
    const validateCelular = () => {
      celularValido.value = validacionGeneral(celular.value);
      return celularValido.value;
    };
    // DATOS FACEBOOK
    const facebook = ref("");
    // DATOS TELEFONO
    const telefono = ref("");
    // DATOS DOMICILIO CALLE
    const domicilioCalle = ref("");
    const domicilioCalleValida = ref(true);
    const validateDomicilioCalle = () => {
      domicilioCalleValida.value = validacionGeneral(domicilioCalle.value);
      return domicilioCalleValida.value;
    };
    // DATOS DOMICILIO NO EXTERIOR
    const domicilioNoExterior = ref("");
    const domicilioNoExteriorValido = ref(true);
    const validateDomicilioNoExterior = () => {
      domicilioNoExteriorValido.value = validacionGeneral(
        domicilioNoExterior.value
      );
      return domicilioNoExteriorValido.value;
    };
    // DATOS DOMICILIO NO INTERIOR
    const domicilioNoInterior = ref("");
    // DATOS DE DOMICILIO COLONIA
    const domicilioColonia = ref("");
    const domicilioColoniaValida = ref(true);
    const validateDomicilioColonia = () => {
      domicilioColoniaValida.value = validacionGeneral(domicilioColonia.value);
      return domicilioColoniaValida.value;
    };
    // DATOS DE DOMICILIO CIUDAD
    const domicilioCiudad = ref("");
    const domicilioCiudadValida = ref(true);
    const validateDomicilioCiudad = () => {
      domicilioCiudadValida.value = validacionGeneral(domicilioCiudad.value);
      return domicilioCiudadValida.value;
    };
    // DATOS DE DOMICILIO ESTADO
    const domicilioEstado = ref("");
    const domicilioEstadoValido = ref(true);
    const validateDomicilioEstado = () => {
      domicilioEstadoValido.value = validacionGeneral(domicilioEstado.value);
      return domicilioEstadoValido.value;
    };
    // DATOS DE DOMICILIO CP
    const domicilioCodigoPostal = ref("");
    const domicilioCodigoPostalValido = ref(true);
    const validateDomicilioCodigoPostal = () => {
      domicilioCodigoPostalValido.value = validacionCodigoPostal(
        domicilioCodigoPostal.value
      );
      return domicilioCodigoPostalValido.value;
    };
    // DATOS RFC
    const rfc = ref("");
    // DATOS CURP
    const curp = ref("");
    // DATOS CLABE
    const clabe = ref("");
    // DATOS BANCO
    const banco = ref("");
    // DATOS DOMICILIO FISCAL CALLE
    const fiscalCalle = ref("");
    // DATOS DOMICILIO FISCAL NO EXTERIOR
    const fiscalNoExterior = ref("");
    // DATOS DOMICILIO FISCAL NO INTERIOR
    const fiscalNoInterior = ref("");
    // DATOS DOMICILIO FISCAL COLONIA
    const fiscalColonia = ref("");
    // DATOS DOMICILIO FISCAL CIUDAD
    const fiscalCiudad = ref("");
    // DATOS DOMICILIO FISCAL ESTADO
    const fiscalEstado = ref("");
    // DATOS DOMICILIO FISCAL CP
    const fiscalCodigoPostal = ref("");
    // DATOS PORCENTAJE ACTIVIDAD PROF
    const porcentajeActividadProf = ref("25");
    // DATOS PORCENTAJE ACTIVIDAD PROF
    const porcentajeAsalariado = ref("25");
    // DATOS PORCENTAJE ACTIVIDAD PROF
    const porcentajePensionado = ref("25");
    // DATOS PORCENTAJE ACTIVIDAD PROF
    const porcentajeDocencia = ref("25");
    // DATOS ENFERMEDADES
    const enfermedades = ref("");
    // DATOS ALERGIAS
    const alergias = ref("");
    // DATOS SANGRE
    const tipoSangre = ref("");
    // ******* //
    // VALIDACION TODO FORMULARIO
    const formularioInvalido = computed(() => {
      return (
        validateNombre() &&
        validateFechaNacimiento() &&
        validateCiudad() &&
        validateEstado() &&
        validatePais() &&
        validateEstadoCivil() &&
        validateGenero() &&
        validateCorreo() &&
        validateCelular() &&
        validateDomicilioCalle() &&
        validateDomicilioNoExterior() &&
        validateDomicilioColonia() &&
        validateDomicilioCiudad() &&
        validateDomicilioEstado() &&
        validateDomicilioCodigoPostal()
      );
    });
    const validarFormulario = async () => {
      if (!formularioInvalido.value) {
        console.log("Faltan valores que completar");
      } else {
        await enviarForm();
      }
    };
    const enviarForm = async () => {
      try {
        // const response = await axios.get('https://pokeapi.co/api/v2/pokemon/ditto');
        cargaInicial.value = false;
        const response = await axios.post(
          "http://127.0.0.1:8000/api/v1/docente/cv",
          {
            nombre: nombre.value,
            fechaNacimiento: fechaNacimiento.value,
            ciudad: ciudad.value,
            estado: estado.value,
            pais: pais.value,
            estadoCivil: estadoCivil.value,
            genero: genero.value,
            correo: correo.value,
            celular: celular.value,
            facebook: facebook.value,
            telefono: telefono.value,
            domicilioCalle: domicilioCalle.value,
            domicilioNoExterior: domicilioNoExterior.value,
            domicilioNoInterior: domicilioNoInterior.value,
            domicilioColonia: domicilioColonia.value,
            domicilioCiudad: domicilioCiudad.value,
            domicilioEstado: domicilioEstado.value,
            domicilioCodigoPostal: domicilioCodigoPostal.value,
            rfc: rfc.value,
            curp: curp.value,
            clabe: clabe.value,
            banco: banco.value,
            fiscalCalle: fiscalCalle.value,
            fiscalNoExterior: fiscalNoExterior.value,
            fiscalNoInterior: fiscalNoInterior.value,
            fiscalColonia: fiscalColonia.value,
            fiscalCiudad: fiscalCiudad.value,
            fiscalEstado: fiscalEstado.value,
            fiscalCodigoPostal: fiscalCodigoPostal.value,
            porcentajeActividadProf: porcentajeActividadProf.value,
            porcentajeAsalariado: porcentajeAsalariado.value,
            porcentajePensionado: porcentajePensionado.value,
            porcentajeDocencia: porcentajeDocencia.value,
            enfermedades: enfermedades.value,
            alergias: alergias.value,
            tipoSangre: tipoSangre.value,
          }
        );
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
      ciudad,
      ciudadValida,
      validateCiudad,
      pais,
      paisValido,
      validatePais,
      estado,
      estadoValido,
      validateEstado,
      estadoCivil,
      estadoCivilValido,
      validateEstadoCivil,
      genero,
      generoValido,
      validateGenero,
      correo,
      correoValido,
      validateCorreo,
      celular,
      celularValido,
      validateCelular,
      facebook,
      telefono,
      domicilioCalle,
      domicilioCalleValida,
      validateDomicilioCalle,
      domicilioNoExterior,
      domicilioNoExteriorValido,
      validateDomicilioNoExterior,
      domicilioNoInterior,
      domicilioColonia,
      domicilioColoniaValida,
      validateDomicilioColonia,
      domicilioCiudad,
      domicilioCiudadValida,
      validateDomicilioCiudad,
      domicilioEstado,
      domicilioEstadoValido,
      validateDomicilioEstado,
      domicilioCodigoPostal,
      domicilioCodigoPostalValido,
      validateDomicilioCodigoPostal,
      rfc,
      curp,
      clabe,
      banco,
      fiscalCalle,
      fiscalNoExterior,
      fiscalNoInterior,
      fiscalColonia,
      fiscalCiudad,
      fiscalEstado,
      fiscalCodigoPostal,
      porcentajeActividadProf,
      porcentajeAsalariado,
      porcentajePensionado,
      porcentajeDocencia,
      enfermedades,
      alergias,
      tipoSangre,
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
