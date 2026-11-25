import {
  validacionNombre,
} from "./validate.js";

const { createApp, ref, reactive, computed, onMounted } = Vue;

const normalizarCelular = (valor) => {
  let digitos = String(valor ?? "").replace(/\D+/g, "");

  if (digitos.length > 10 && digitos.startsWith("52")) {
    digitos = digitos.slice(-10);
  }

  return digitos.slice(0, 10);
};

const formatearCelular = (valor) => {
  const digitos = normalizarCelular(valor);

  if (digitos.length <= 3) return digitos;
  if (digitos.length <= 6) {
    return `${digitos.slice(0, 3)}-${digitos.slice(3)}`;
  }

  return `${digitos.slice(0, 3)}-${digitos.slice(3, 6)}-${digitos.slice(6)}`;
};

const emailValido = (valor) =>
  !valor || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valor).trim());

const codigoPostalValido = (valor) =>
  !valor || /^\d{5}$/.test(String(valor).trim());

const texto = (valor) => (valor === null || valor === undefined ? "" : String(valor));

const CAMPOS_REQUERIDOS = [
  { key: "nombre", label: "Nombre completo", grupo: "Datos personales" },
  { key: "fechaNacimiento", label: "Fecha de nacimiento", grupo: "Datos personales" },
  { key: "ciudad", label: "Ciudad de nacimiento", grupo: "Datos personales" },
  { key: "estado", label: "Estado de nacimiento", grupo: "Datos personales" },
  { key: "pais", label: "País de nacimiento", grupo: "Datos personales" },
  { key: "estadoCivil", label: "Estado civil", grupo: "Datos personales" },
  { key: "genero", label: "Género", grupo: "Datos personales" },
  { key: "correoInstitucional", label: "Correo institucional", grupo: "Datos personales" },
  { key: "celular", label: "Número de celular", grupo: "Datos personales" },
  { key: "domicilioCalle", label: "Calle del domicilio", grupo: "Domicilio" },
  { key: "domicilioNoExterior", label: "Número exterior", grupo: "Domicilio" },
  { key: "domicilioColonia", label: "Colonia", grupo: "Domicilio" },
  { key: "domicilioCiudad", label: "Ciudad del domicilio", grupo: "Domicilio" },
  { key: "domicilioEstado", label: "Estado del domicilio", grupo: "Domicilio" },
  { key: "domicilioCodigoPostal", label: "Código postal", grupo: "Domicilio" },
];

const DOCUMENTOS_REQUERIDOS = [
  {
    tipo: "cv",
    label: "Currículum (CV)",
    descripcion: "Tu trayectoria profesional y académica.",
    archivoKey: "archivoCurriculum",
    descripcionKey: "descripcionCurriculum",
    accept: ".pdf",
    icon: "bi-file-earmark-person",
  },
  {
    tipo: "planeacion_academica",
    label: "Planeación académica",
    descripcion: "Planeación de la materia que impartes.",
    archivoKey: "archivoPlaneacionAcademica",
    descripcionKey: "descripcionPlaneacionAcademica",
    accept: ".pdf",
    icon: "bi-journal-text",
  },
  {
    tipo: "ine",
    label: "INE",
    descripcion: "Identificación oficial vigente.",
    archivoKey: "archivoIne",
    descripcionKey: "descripcionIne",
    accept: ".pdf",
    icon: "bi-person-vcard",
  },
  {
    tipo: "curp",
    label: "CURP",
    descripcion: "Constancia de la CURP.",
    archivoKey: "archivoCurp",
    descripcionKey: "descripcionCurp",
    accept: ".pdf",
    icon: "bi-person-badge",
  },
  {
    tipo: "domicilio",
    label: "Comprobante de domicilio",
    descripcion: "Recibo reciente a tu nombre.",
    archivoKey: "archivoDomicilio",
    descripcionKey: "descripcionDomicilio",
    accept: ".pdf",
    icon: "bi-house-door",
  },
  {
    tipo: "situacion_fiscal",
    label: "Comprobante de situación fiscal",
    descripcion: "Constancia de situación fiscal del SAT.",
    archivoKey: "archivoSituacionFiscal",
    descripcionKey: "descripcionSituacionFiscal",
    accept: ".pdf",
    icon: "bi-receipt",
  },
  {
    tipo: "acta_nacimiento",
    label: "Acta de nacimiento",
    descripcion: "Acta de nacimiento legible.",
    archivoKey: "archivoActaNacimiento",
    descripcionKey: "descripcionActaNacimiento",
    accept: ".pdf",
    icon: "bi-file-earmark-text",
  },
  {
    tipo: "cedula_profesional",
    label: "Cédula profesional",
    descripcion: "Cédula profesional vigente.",
    archivoKey: "archivoCedula",
    descripcionKey: "descripcionCedula",
    accept: ".pdf",
    icon: "bi-award",
  },
  {
    tipo: "cuenta_bancaria",
    label: "Fotografía de cuenta bancaria",
    descripcion: "Carátula o estado de cuenta donde se vea la CLABE.",
    archivoKey: "archivoCuentaBancaria",
    descripcionKey: null,
    accept: ".jpg,.jpeg,.png",
    icon: "bi-credit-card",
  },
];

const MAPA_SECCIONES = {
  "Datos personales": "seccion-datos-personales",
  Domicilio: "seccion-domicilio",
  Documentos: "seccion-documentos",
};

const crearFormularioInicial = () => ({
  nombre: "",
  fechaNacimiento: "",
  ciudad: "",
  estado: "",
  pais: "MEXICO",
  estadoCivil: "soltero",
  genero: "hombre",
  correo: "",
  correoInstitucional: "",
  celular: "",
  facebook: "",
  telefono: "",
  domicilioCalle: "",
  domicilioNoExterior: "",
  domicilioNoInterior: "",
  domicilioColonia: "",
  domicilioCiudad: "",
  domicilioEstado: "",
  domicilioCodigoPostal: "",
  rfc: "",
  curp: "",
  clabe: "",
  banco: "",
  fiscalCalle: "",
  fiscalNoExterior: "",
  fiscalNoInterior: "",
  fiscalColonia: "",
  fiscalCiudad: "",
  fiscalEstado: "",
  fiscalCodigoPostal: "",
  porcentajeActividadProf: "25",
  porcentajeAsalariado: "25",
  porcentajePensionado: "25",
  porcentajeDocencia: "25",
  enfermedades: "",
  alergias: "",
  tipoSangre: "",
  informacionAdicional: "",
});

createApp({
  setup() {
    const API = window.IPES_CONFIG.apiBaseUrl;
    const HEADERS = {
      Authorization: `Bearer ${window.IPES_CONFIG.bearerToken}`,
    };

    const cargaInicial = ref(false);
    const pantalla = ref("identificacion");
    const estadoCaptura = ref(null);
    const curriculumId = ref(null);
    const tokenAcceso = ref("");

    const correoAcceso = ref("");
    const correoAccesoValido = ref(true);
    const passwordAcceso = ref("");
    const passwordNueva = ref("");
    const passwordCopiada = ref(false);

    const buscando = ref(false);
    const guardando = ref(false);
    const guardadoEn = ref("");

    const mensajeInfo = ref("");
    const mensajeError = ref("");
    const exitoTitulo = ref("");
    const exitoMensaje = ref("");
    const progresoAbierto = ref(false);

    const formulario = reactive(crearFormularioInicial());
    const descripciones = reactive({});
    const archivosNuevos = reactive({});
    const archivosExistentes = reactive({});

    let modalPasswordNueva = null;
    let modalError = null;
    let modalExito = null;

    DOCUMENTOS_REQUERIDOS.forEach((documento) => {
      descripciones[documento.tipo] = "";
    });

    const erroresFormato = computed(() => {
      const errores = [];

      if (!formulario.correoInstitucional || !emailValido(formulario.correoInstitucional)) {
        errores.push("El correo institucional no es válido.");
      }

      if (formulario.nombre && !validacionNombre(formulario.nombre)) {
        errores.push("El nombre solo puede contener letras y espacios.");
      }

      if (
        formulario.fechaNacimiento &&
        formulario.fechaNacimiento >= new Date().toISOString().slice(0, 10)
      ) {
        errores.push("La fecha de nacimiento debe ser anterior a hoy.");
      }

      if (!emailValido(formulario.correo)) {
        errores.push("El correo electrónico no tiene un formato válido.");
      }

      if (formulario.celular && !/^\d{10}$/.test(formulario.celular)) {
        errores.push("El celular debe tener 10 dígitos.");
      }

      if (!codigoPostalValido(formulario.domicilioCodigoPostal)) {
        errores.push("El código postal debe tener 5 dígitos.");
      }

      if (!codigoPostalValido(formulario.fiscalCodigoPostal)) {
        errores.push("El código postal fiscal debe tener 5 dígitos.");
      }

      return errores;
    });

    const progreso = computed(() => {
      const items = [];

      CAMPOS_REQUERIDOS.forEach((campo) => {
        const completo = texto(formulario[campo.key]).trim() !== "";
        items.push({
          clave: `campo-${campo.key}`,
          label: campo.label,
          grupo: campo.grupo,
          completo,
        });
      });

      DOCUMENTOS_REQUERIDOS.forEach((documento) => {
        items.push({
          clave: `documento-${documento.tipo}`,
          label: documento.label,
          grupo: "Documentos",
          completo: Boolean(
            archivosExistentes[documento.tipo] || archivosNuevos[documento.tipo]
          ),
        });
      });

      const agrupados = {};
      items.forEach((item) => {
        if (!agrupados[item.grupo]) agrupados[item.grupo] = [];
        agrupados[item.grupo].push(item);
      });

      const total = items.length;
      const completos = items.filter((item) => item.completo).length;

      return {
        items,
        grupos: Object.entries(agrupados).map(([nombre, itemsGrupo]) => ({
          nombre,
          items: itemsGrupo,
        })),
        total,
        completos,
        porcentaje: total ? Math.round((completos / total) * 100) : 0,
        faltantes: items.filter((item) => !item.completo).map((item) => item.label),
      };
    });

    const pasoActual = computed(() => {
      if (pantalla.value === "formulario") {
        return progreso.value.porcentaje === 100 ? 3 : 2;
      }
      return 1;
    });

    const celularFormateado = computed(() =>
      formatearCelular(formulario.celular)
    );

    const asignarFormulario = (valores = {}) => {
      Object.assign(formulario, crearFormularioInicial(), valores);
    };

    const limpiarArchivosNuevos = () => {
      DOCUMENTOS_REQUERIDOS.forEach((documento) => {
        delete archivosNuevos[documento.tipo];
        const input = document.getElementById(`archivo_${documento.tipo}`);
        if (input) input.value = "";
      });
    };

    const limpiarFormulario = () => {
      asignarFormulario();
      limpiarArchivosNuevos();
      DOCUMENTOS_REQUERIDOS.forEach((documento) => {
        delete archivosExistentes[documento.tipo];
        descripciones[documento.tipo] = "";
      });
      guardadoEn.value = "";
      mensajeInfo.value = "";
      mensajeError.value = "";
      progresoAbierto.value = false;
    };

    const limpiarEstado = () => {
      limpiarFormulario();
      curriculumId.value = null;
      tokenAcceso.value = "";
      correoAcceso.value = "";
      correoAccesoValido.value = true;
      passwordAcceso.value = "";
      passwordNueva.value = "";
      passwordCopiada.value = false;
      estadoCaptura.value = null;
    };

    const aplicarCurriculum = (curriculum) => {
      if (!curriculum) return;

      curriculumId.value = curriculum.curriculum_docente_id;

      asignarFormulario({
        nombre: texto(curriculum.nombre),
        fechaNacimiento: texto(curriculum.fecha_nacimiento).slice(0, 10),
        ciudad: texto(curriculum.ciudad),
        estado: texto(curriculum.estado),
        pais: texto(curriculum.pais) || "MEXICO",
        estadoCivil: texto(curriculum.estado_civil) || "soltero",
        genero: texto(curriculum.genero) || "hombre",
        correo: texto(curriculum.correo_electronico),
        correoInstitucional:
          texto(curriculum.correo_institucional) || correoAcceso.value,
        celular: normalizarCelular(curriculum.numero_celular),
        facebook: texto(curriculum.facebook),
        telefono: texto(curriculum.numero_casa),
        domicilioCalle: texto(curriculum.domicilio_calle),
        domicilioNoExterior: texto(curriculum.domicilio_no_exterior),
        domicilioNoInterior: texto(curriculum.domicilio_no_interior),
        domicilioColonia: texto(curriculum.domicilio_colonia),
        domicilioCiudad: texto(curriculum.domicilio_ciudad),
        domicilioEstado: texto(curriculum.domicilio_estado),
        domicilioCodigoPostal: texto(curriculum.domicilio_codigo_postal),
        rfc: texto(curriculum.dato_fiscal_rfc),
        curp: texto(curriculum.dato_fiscal_curp),
        clabe: texto(curriculum.dato_fiscal_clabe),
        banco: texto(curriculum.dato_fiscal_banco),
        fiscalCalle: texto(curriculum.dato_fiscal_calle),
        fiscalNoExterior: texto(curriculum.dato_fiscal_no_exterior),
        fiscalNoInterior: texto(curriculum.dato_fiscal_no_interior),
        fiscalColonia: texto(curriculum.dato_fiscal_colonia),
        fiscalCiudad: texto(curriculum.dato_fiscal_ciudad),
        fiscalEstado: texto(curriculum.dato_fiscal_estado),
        fiscalCodigoPostal: texto(curriculum.dato_fiscal_codigo_postal),
        porcentajeActividadProf:
          curriculum.porcentaje_actividad_profesional != null
            ? String(Number(curriculum.porcentaje_actividad_profesional))
            : "25",
        porcentajeAsalariado:
          curriculum.porcentaje_asalariado != null
            ? String(Number(curriculum.porcentaje_asalariado))
            : "25",
        porcentajePensionado:
          curriculum.porcentaje_pensionado != null
            ? String(Number(curriculum.porcentaje_pensionado))
            : "25",
        porcentajeDocencia:
          curriculum.porcentaje_docencia != null
            ? String(Number(curriculum.porcentaje_docencia))
            : "25",
        enfermedades: texto(curriculum.enfermedades),
        alergias: texto(curriculum.alergias),
        tipoSangre: texto(curriculum.tipo_sangre),
        informacionAdicional: texto(curriculum.comentarios),
      });

      if (curriculum.correo_institucional) {
        correoAcceso.value = texto(curriculum.correo_institucional).toLowerCase();
      }
    };

    const aplicarDocumentos = (documentos = []) => {
      const mapa = {};

      documentos.forEach((documento) => {
        if (!mapa[documento.tipo]) {
          mapa[documento.tipo] = documento;
        }
      });

      DOCUMENTOS_REQUERIDOS.forEach((documento) => {
        archivosExistentes[documento.tipo] = mapa[documento.tipo] || null;
        descripciones[documento.tipo] = mapa[documento.tipo]?.descripcion || "";
      });
    };

    const mostrarError = (error) => {
      const data = error?.response?.data;
      let mensaje = data?.mensaje || data?.error || "";

      if (!mensaje) {
        if (error?.message === "Network Error") {
          mensaje = "No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.";
        } else {
          mensaje = error?.message || "Ocurrió un error inesperado.";
        }
      }

      mensajeError.value = mensaje;
      if (modalError) modalError.show();
    };

    const mostrarExito = (titulo, mensaje) => {
      exitoTitulo.value = titulo;
      exitoMensaje.value = mensaje;
      if (modalExito) modalExito.show();
    };

    const copiarAlPortapapeles = async (valor) => {
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
    };

    const consultarCorreo = async () => {
      const correo = String(correoAcceso.value || "").trim().toLowerCase();

      if (!emailValido(correo)) {
        correoAccesoValido.value = false;
        return;
      }

      correoAccesoValido.value = true;
      buscando.value = true;

      try {
        const { data } = await axios.post(
          `${API}/docente/cv/correo`,
          { correo },
          { headers: HEADERS }
        );

        if (Number(data.status) !== 200) {
          throw new Error(data.mensaje || "No se pudo consultar el correo.");
        }

        if (data.estado === "creado") {
          limpiarFormulario();
          correoAcceso.value = correo;
          tokenAcceso.value = data.token || "";
          curriculumId.value = data.curriculum?.curriculum_docente_id || null;
          passwordNueva.value = data.password || "";
          passwordCopiada.value = false;
          estadoCaptura.value = "nuevo";
          aplicarCurriculum(data.curriculum);
          if (modalPasswordNueva) modalPasswordNueva.show();
          return;
        }

        if (data.estado === "password_requerido") {
          correoAcceso.value = correo;
          passwordAcceso.value = "";
          mensajeInfo.value = data.mensaje || "";
          pantalla.value = "password";
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        if (data.estado === "sin_password") {
          correoAcceso.value = correo;
          mensajeInfo.value =
            data.mensaje ||
            "Tu expediente ya existe, pero aún no tiene contraseña. Contacta a soporte para que te la proporcionen.";
          pantalla.value = "sin_password";
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        throw new Error(data.mensaje || "No se pudo consultar el correo.");
      } catch (error) {
        mostrarError(error);
      } finally {
        buscando.value = false;
      }
    };

    const copiarPasswordNueva = async () => {
      if (!passwordNueva.value) return;

      const copiado = await copiarAlPortapapeles(passwordNueva.value);
      passwordCopiada.value = copiado;

      if (!copiado) {
        mensajeError.value =
          "No se pudo copiar automáticamente. Selecciona la contraseña y cópiala manualmente.";
        if (modalError) modalError.show();
      }
    };

    const continuarConPasswordNueva = () => {
      if (!passwordCopiada.value) return;

      if (modalPasswordNueva) modalPasswordNueva.hide();

      passwordNueva.value = "";
      passwordCopiada.value = false;
      pantalla.value = "formulario";
      mensajeInfo.value =
        "Tu expediente fue creado. Captura tu información y guarda los cambios cuando lo necesites.";
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const accederConPassword = async () => {
      const correo = String(correoAcceso.value || "").trim().toLowerCase();

      if (!passwordAcceso.value) {
        mensajeError.value = "Ingresa tu contraseña.";
        if (modalError) modalError.show();
        return;
      }

      buscando.value = true;

      try {
        const { data } = await axios.post(
          `${API}/docente/cv/acceder`,
          { correo, password: passwordAcceso.value },
          { headers: HEADERS }
        );

        if (Number(data.status) !== 200) {
          throw new Error(data.mensaje || "No se pudo acceder al expediente.");
        }

        limpiarFormulario();
        correoAcceso.value = correo;
        tokenAcceso.value = data.token || "";
        curriculumId.value = data.curriculum?.curriculum_docente_id || null;
        estadoCaptura.value = "existente";
        aplicarCurriculum(data.curriculum);
        aplicarDocumentos(data.documentos || []);
        mensajeInfo.value = `Bienvenido de nuevo. Ya llevas ${progreso.value.porcentaje}% de tu expediente.`;
        pantalla.value = "formulario";
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        mostrarError(error);
      } finally {
        buscando.value = false;
      }
    };

    const construirFormData = () => {
      const formData = new FormData();

      const campos = {
        nombre: formulario.nombre,
        fechaNacimiento: formulario.fechaNacimiento,
        ciudad: formulario.ciudad,
        estado: formulario.estado,
        pais: formulario.pais,
        estadoCivil: formulario.estadoCivil,
        genero: formulario.genero,
        correo: formulario.correo,
        correoInstitucional: formulario.correoInstitucional,
        celular: normalizarCelular(formulario.celular),
        facebook: formulario.facebook,
        telefono: formulario.telefono,
        domicilioCalle: formulario.domicilioCalle,
        domicilioNoExterior: formulario.domicilioNoExterior,
        domicilioNoInterior: formulario.domicilioNoInterior,
        domicilioColonia: formulario.domicilioColonia,
        domicilioCiudad: formulario.domicilioCiudad,
        domicilioEstado: formulario.domicilioEstado,
        domicilioCodigoPostal: formulario.domicilioCodigoPostal,
        rfc: formulario.rfc,
        curp: formulario.curp,
        clabe: formulario.clabe,
        banco: formulario.banco,
        fiscalCalle: formulario.fiscalCalle,
        fiscalNoExterior: formulario.fiscalNoExterior,
        fiscalNoInterior: formulario.fiscalNoInterior,
        fiscalColonia: formulario.fiscalColonia,
        fiscalCiudad: formulario.fiscalCiudad,
        fiscalEstado: formulario.fiscalEstado,
        fiscalCodigoPostal: formulario.fiscalCodigoPostal,
        porcentajeActividadProf: formulario.porcentajeActividadProf,
        porcentajeAsalariado: formulario.porcentajeAsalariado,
        porcentajePensionado: formulario.porcentajePensionado,
        porcentajeDocencia: formulario.porcentajeDocencia,
        enfermedades: formulario.enfermedades,
        alergias: formulario.alergias,
        tipoSangre: formulario.tipoSangre,
        informacionAdicional: formulario.informacionAdicional,
      };

      Object.entries(campos).forEach(([campo, valor]) => {
        formData.append(campo, valor ?? "");
      });

      DOCUMENTOS_REQUERIDOS.forEach((documento) => {
        if (documento.descripcionKey) {
          formData.append(
            documento.descripcionKey,
            descripciones[documento.tipo] || ""
          );
        }

        if (archivosNuevos[documento.tipo]) {
          formData.append(documento.archivoKey, archivosNuevos[documento.tipo]);
        }
      });

      return formData;
    };

    const aplicarRespuestaGuardado = (data) => {
      curriculumId.value = data.curriculum_docente_id || curriculumId.value;

      if (data.curriculum) aplicarCurriculum(data.curriculum);
      if (data.documentos) aplicarDocumentos(data.documentos);

      limpiarArchivosNuevos();
      guardadoEn.value = new Date().toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const guardarAvance = async () => {
      if (!curriculumId.value || !tokenAcceso.value) {
        mensajeError.value =
          "Tu sesión expiró. Vuelve a ingresar con tu correo y contraseña.";
        if (modalError) modalError.show();
        limpiarEstado();
        pantalla.value = "identificacion";
        return false;
      }

      if (erroresFormato.value.length) {
        mensajeError.value = erroresFormato.value.join(" ");
        if (modalError) modalError.show();
        return false;
      }

      guardando.value = true;

      try {
        const { data } = await axios.post(
          `${API}/docente/cv/${curriculumId.value}`,
          construirFormData(),
          {
            headers: {
              ...HEADERS,
              "X-CV-Token": tokenAcceso.value,
            },
          }
        );

        if (Number(data.status) !== 200) {
          throw new Error(data.mensaje || "No se pudieron guardar los cambios.");
        }

        aplicarRespuestaGuardado(data);
        mostrarExito(
          "Cambios guardados",
          "Tu información se actualizó correctamente. Puedes volver cuando quieras para seguir editando."
        );

        return true;
      } catch (error) {
        if (error?.response?.status === 401) {
          limpiarEstado();
          pantalla.value = "identificacion";
          mensajeError.value =
            error.response.data?.mensaje ||
            "Tu sesión expiró. Vuelve a ingresar con tu correo y contraseña.";
          if (modalError) modalError.show();
          return false;
        }

        mostrarError(error);
        return false;
      } finally {
        guardando.value = false;
      }
    };

    const onCelularFormularioInput = (event) => {
      formulario.celular = normalizarCelular(event.target.value);
      event.target.value = formatearCelular(formulario.celular);
    };

    const onArchivoChange = (tipo, event) => {
      const documento = DOCUMENTOS_REQUERIDOS.find((item) => item.tipo === tipo);
      const archivo = event.target.files?.[0];

      if (!documento || !archivo) return;

      const extension = archivo.name.split(".").pop().toLowerCase();
      const extensionesPermitidas = documento.accept
        .split(",")
        .map((valor) => valor.trim().replace(".", "").toLowerCase());

      if (!extensionesPermitidas.includes(extension)) {
        mensajeError.value = `El archivo de ${documento.label} debe ser ${documento.accept}.`;
        if (modalError) modalError.show();
        event.target.value = "";
        delete archivosNuevos[tipo];
        return;
      }

      if (archivo.size > 10 * 1024 * 1024) {
        mensajeError.value = "El archivo no debe pesar más de 10 MB.";
        if (modalError) modalError.show();
        event.target.value = "";
        delete archivosNuevos[tipo];
        return;
      }

      archivosNuevos[tipo] = archivo;
    };

    const quitarArchivoNuevo = (tipo) => {
      delete archivosNuevos[tipo];
      const input = document.getElementById(`archivo_${tipo}`);
      if (input) input.value = "";
    };

    const descargarExistente = async (tipo) => {
      const documento = archivosExistentes[tipo];
      if (!documento) return;

      try {
        const formData = new FormData();
        formData.append("archivoId", documento.curriculum_docente_archivo_id);

        const response = await axios.post(
          `${API}/docente/descargar/documento`,
          formData,
          { headers: HEADERS, responseType: "blob" }
        );

        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = documento.nombre || "documento.pdf";
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } catch (error) {
        mostrarError(error);
      }
    };

    const volverAlInicio = () => {
      if (
        pantalla.value === "formulario" &&
        !window.confirm(
          "Si regresas al inicio se perderán los cambios que no hayas guardado. Para volver a entrar necesitarás tu correo y contraseña. ¿Deseas continuar?"
        )
      ) {
        return;
      }

      limpiarEstado();
      pantalla.value = "identificacion";
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const irASeccion = (grupo) => {
      progresoAbierto.value = false;
      const id = MAPA_SECCIONES[grupo];
      const seccion = id ? document.getElementById(id) : null;
      if (seccion) seccion.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const limpiarBackdrops = () => {
      if (document.querySelector(".modal.show")) return;
      document.querySelectorAll(".modal-backdrop").forEach((elemento) => {
        elemento.remove();
      });
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("padding-right");
      document.body.style.removeProperty("overflow");
    };

    onMounted(() => {
      setTimeout(() => {
        cargaInicial.value = true;
      }, 300);

      modalPasswordNueva = new bootstrap.Modal(
        document.getElementById("modalPasswordNueva"),
        { backdrop: "static", keyboard: false }
      );
      modalError = new bootstrap.Modal(document.getElementById("modalError"));
      modalExito = new bootstrap.Modal(document.getElementById("modalExito"));

      ["modalPasswordNueva", "modalError", "modalExito"].forEach((id) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.addEventListener("hidden.bs.modal", limpiarBackdrops);
      });
    });

    return {
      cargaInicial,
      pantalla,
      estadoCaptura,
      correoAcceso,
      correoAccesoValido,
      passwordAcceso,
      passwordNueva,
      passwordCopiada,
      buscando,
      guardando,
      guardadoEn,
      mensajeInfo,
      mensajeError,
      exitoTitulo,
      exitoMensaje,
      progresoAbierto,
      formulario,
      descripciones,
      archivosNuevos,
      archivosExistentes,
      erroresFormato,
      progreso,
      pasoActual,
      celularFormateado,
      documentosRequeridos: DOCUMENTOS_REQUERIDOS,
      consultarCorreo,
      copiarPasswordNueva,
      continuarConPasswordNueva,
      accederConPassword,
      guardarAvance,
      onCelularFormularioInput,
      onArchivoChange,
      quitarArchivoNuevo,
      descargarExistente,
      volverAlInicio,
      irASeccion,
    };
  },
}).mount("#app");
