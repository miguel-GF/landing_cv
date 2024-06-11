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
    const pais = ref("MEXICO");
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
    // INFORMACION ADICIONAL
    const informacionAdicional = ref("");
    // DESCRIPCION ARCHVOS
    const descripcionCurriculum = ref("");
    const descripcionIne = ref("");
    const descripcionCurp = ref("");
    const descripcionDomicilio = ref("");
    const descripcionSituacionFiscal = ref("");
    const descripcionActaNacimiento = ref("");
    const descripcionCedula = ref("");
    // ARCHIVOS
    const archivoCurriculum = ref(null);
    const archivoIne = ref(null);
    const archivoCurp = ref(null);
    const archivoDomicilio = ref(null);
    const archivoSituacionFiscal = ref(null);
    const archivoActaNacimiento = ref(null);
    const archivoCedula = ref(null);
    const mensajeError = ref("");
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
        const modal = new bootstrap.Modal(document.getElementById('modalInformacion'));
        modal.show();
      } else {
        await enviarForm();
      }
    };
    const enviarForm = async () => {
      try {
        cargaInicial.value = false;
        const formData = new FormData();
        formData.append("nombre", nombre.value);
        formData.append("fechaNacimiento", fechaNacimiento.value);
        formData.append("ciudad", ciudad.value);
        formData.append("estado", estado.value);
        formData.append("pais", pais.value);
        formData.append("estadoCivil", estadoCivil.value);
        formData.append("genero", genero.value);
        formData.append("correo", correo.value);
        formData.append("celular", celular.value);
        formData.append("facebook", facebook.value);
        formData.append("telefono", telefono.value);
        formData.append("domicilioCalle", domicilioCalle.value);
        formData.append("domicilioNoExterior", domicilioNoExterior.value);
        formData.append("domicilioNoInterior", domicilioNoInterior.value);
        formData.append("domicilioColonia", domicilioColonia.value);
        formData.append("domicilioCiudad", domicilioCiudad.value);
        formData.append("domicilioEstado", domicilioEstado.value);
        formData.append("domicilioCodigoPostal", domicilioCodigoPostal.value);
        formData.append("rfc", rfc.value);
        formData.append("curp", curp.value);
        formData.append("clabe", clabe.value);
        formData.append("banco", banco.value);
        formData.append("fiscalCalle", fiscalCalle.value);
        formData.append("fiscalNoExterior", fiscalNoExterior.value);
        formData.append("fiscalNoInterior", fiscalNoInterior.value);
        formData.append("fiscalColonia", fiscalColonia.value);
        formData.append("fiscalCiudad", fiscalCiudad.value);
        formData.append("fiscalEstado", fiscalEstado.value);
        formData.append("fiscalCodigoPostal", fiscalCodigoPostal.value);
        formData.append(
          "porcentajeActividadProf",
          porcentajeActividadProf.value
        );
        formData.append("porcentajeAsalariado", porcentajeAsalariado.value);
        formData.append("porcentajePensionado", porcentajePensionado.value);
        formData.append("porcentajeDocencia", porcentajeDocencia.value);
        formData.append("enfermedades", enfermedades.value);
        formData.append("alergias", alergias.value);
        formData.append("tipoSangre", tipoSangre.value);
        formData.append("informacionAdicional", informacionAdicional.value);
        formData.append("descripcionCurriculum", descripcionCurriculum.value);
        formData.append("descripcionIne", descripcionIne.value);
        formData.append("descripcionCurp", descripcionCurp.value);
        formData.append("descripcionDomicilio", descripcionDomicilio.value);
        formData.append(
          "descripcionSituacionFiscal",
          descripcionSituacionFiscal.value
        );
        formData.append(
          "descripcionActaNacimiento",
          descripcionActaNacimiento.value
        );
        formData.append("descripcionCedula", descripcionCedula.value);
        if (archivoCurriculum.value) {
          formData.append("archivoCurriculum", archivoCurriculum.value);
        }
        if (archivoIne.value) {
          formData.append("archivoIne", archivoIne.value);
        }
        if (archivoCurp.value) {
          formData.append("archivoCurp", archivoCurp.value);
        }
        if (archivoDomicilio.value) {
          formData.append("archivoDomicilio", archivoDomicilio.value);
        }
        if (archivoSituacionFiscal.value) {
          formData.append(
            "archivoSituacionFiscal",
            archivoSituacionFiscal.value
          );
        }
        if (archivoActaNacimiento.value) {
          formData.append("archivoActaNacimiento", archivoActaNacimiento.value);
        }
        if (archivoCedula.value) {
          formData.append("archivoCedula", archivoCedula.value);
        }
        const response = await axios.post(
          "http://127.0.0.1:8000/api/v1/docente/cv",
          formData,
          {
            headers: {
              Authorization: "Bearer e993014b8b85736546e8b35171d3b072",
            },
          }
        );
        const { status, mensaje } = response.data;
        if (Number(status) != 200) {
          mensajeError.value = mensaje;
          const modal = new bootstrap.Modal(document.getElementById('modalError'));
          modal.show();  
        } else {
          const modal = new bootstrap.Modal(document.getElementById('modalExito'));
          modal.show();
          limpiarDatos();
        }
      } catch (error) {
        mensajeError.value = error.response.data.error ?? '';
        const modal = new bootstrap.Modal(document.getElementById('modalError'));
        modal.show();
      } finally {
        cargaInicial.value = true;
      }
    };
    const limpiarDatos = () => {
      nombre.value = "";
      nombreValido.value = true;
      fechaNacimiento.value = "";
      fechaNacimientoValido.value = true;
      ciudad.value = "";
      ciudadValida.value = true;
      pais.value = "MEXICO";
      paisValido.value = true;
      estado.value = "";
      estadoValido.value = true;
      estadoCivil.value = "soltero";
      estadoCivilValido.value = true;
      genero.value = "hombre";
      generoValido.value = true;
      correo.value = "";
      correoValido.value = true;
      celular.value = "";
      celularValido.value = "";
      facebook.value = "";
      telefono.value = "";
      domicilioCalle.value = "";
      domicilioCalleValida.value = true;
      domicilioNoExterior.value = "";
      domicilioNoExteriorValido.value = true;
      domicilioNoInterior.value = "";
      domicilioColonia.value = "";
      domicilioColoniaValida.value = true;
      domicilioCiudad.value = "";
      domicilioCiudadValida.value = true;
      domicilioEstado.value = "";
      domicilioEstadoValido.value = true;
      domicilioCodigoPostal.value = "";
      domicilioCodigoPostalValido.value = true;
      rfc.value = "";
      curp.value = "";
      clabe.value = "";
      banco.value = "";
      fiscalCalle.value = "";
      fiscalNoExterior.value = "";
      fiscalNoInterior.value = "";
      fiscalColonia.value = "";
      fiscalCiudad.value = "";
      fiscalEstado.value = "";
      fiscalCodigoPostal.value = "";
      porcentajeActividadProf.value = "25";
      porcentajeAsalariado.value = "25";
      porcentajePensionado.value = "25";
      porcentajeDocencia.value = "25";
      enfermedades.value = "";
      alergias.value = "";
      tipoSangre.value = "";
      informacionAdicional.value = "";
      descripcionCurriculum.value = "";
      descripcionIne.value = "";
      descripcionCurp.value = "";
      descripcionDomicilio.value = "";
      descripcionSituacionFiscal.value = "";
      descripcionActaNacimiento.value = "";
      descripcionCedula.value = "";
      archivoCurriculum.value = null;
      archivoIne.value = null;
      archivoCurp.value = null;
      archivoDomicilio.value = null;
      archivoSituacionFiscal.value = null;
      archivoActaNacimiento.value = null;
      archivoCedula.value = null;
      mensajeError.value = "";
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
      informacionAdicional,
      descripcionCurriculum,
      descripcionIne,
      descripcionCurp,
      descripcionDomicilio,
      descripcionSituacionFiscal,
      descripcionActaNacimiento,
      descripcionCedula,
      archivoCurriculum,
      archivoIne,
      archivoCurp,
      archivoDomicilio,
      archivoSituacionFiscal,
      archivoActaNacimiento,
      archivoCedula,
      validarFormulario,
      enviarForm,
      mensajeError,
    };
  },
  mounted() {
    setTimeout(() => {
      this.cargaInicial = true;
    }, 450);
  },
}).mount("#app");
