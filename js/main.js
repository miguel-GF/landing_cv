import {
  validacionNombre,
} from "./validate.js";

const { createApp, ref, reactive, computed, onMounted } = Vue;

const normalizarCelular = (valor) => {
  let digitos = String(valor ?? "").replace(/\D+/g, "");

  // Si pegan el numero con lada de Mexico (+52 o 52 + 1), conservar los ultimos 10 digitos.
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

const fechaLegible = (valor) => {
  if (!valor) return "—";
  const fecha = new Date(String(valor).replace(" ", "T"));
  if (Number.isNaN(fecha.getTime())) return String(valor);
  return fecha.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

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
    const curriculumResumen = ref(null);
    const documentosServidor = ref([]);

    const celularBusqueda = ref("");
    const celularBusquedaValido = ref(true);
    const buscando = ref(false);
    const guardando = ref(false);
    const finalizando = ref(false);
    const guardadoEn = ref("");

    const mensajeInfo = ref("");
    const mensajeError = ref("");
    const exitoTitulo = ref("");
    const exitoMensaje = ref("");
    const faltantesLista = ref([]);
    const progresoAbierto = ref(false);

    const formulario = reactive(crearFormularioInicial());
    const descripciones = reactive({});
    const archivosNuevos = reactive({});
    const archivosExistentes = reactive({});

    let modalFaltantes = null;
    let modalConfirmar = null;
    let modalError = null;
    let modalExito = null;
    let modalSoporte = null;

    DOCUMENTOS_REQUERIDOS.forEach((documento) => {
      descripciones[documento.tipo] = "";
    });

    const erroresFormato = computed(() => {
      const errores = [];

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

      if (!emailValido(formulario.correoInstitucional)) {
        errores.push("El correo institucional no tiene un formato válido.");
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
      if (pantalla.value === "completado") return 3;
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

    const limpiarEstado = () => {
      asignarFormulario();
      limpiarArchivosNuevos();
      DOCUMENTOS_REQUERIDOS.forEach((documento) => {
        delete archivosExistentes[documento.tipo];
        descripciones[documento.tipo] = "";
      });
      documentosServidor.value = [];
      curriculumId.value = null;
      curriculumResumen.value = null;
      estadoCaptura.value = null;
      celularBusqueda.value = "";
      celularBusquedaValido.value = true;
      mensajeInfo.value = "";
      mensajeError.value = "";
      guardadoEn.value = "";
      faltantesLista.value = [];
      progresoAbierto.value = false;
    };

    const aplicarCurriculum = (curriculum) => {
      if (!curriculum) return;

      curriculumResumen.value = curriculum;
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
        correoInstitucional: texto(curriculum.correo_institucional),
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

      celularBusqueda.value = formatearCelular(curriculum.numero_celular);
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
        descripciones[documento.tipo] =
          mapa[documento.tipo]?.descripcion || "";
      });

      documentosServidor.value = documentos;
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

    const onCelularBusquedaInput = () => {
      celularBusqueda.value = formatearCelular(celularBusqueda.value);
      celularBusquedaValido.value = true;
    };

    const buscarExpediente = async () => {
      const celular = normalizarCelular(celularBusqueda.value);

      if (!/^\d{10}$/.test(celular)) {
        celularBusquedaValido.value = false;
        return;
      }

      buscando.value = true;

      try {
        const { data } = await axios.post(
          `${API}/docente/cv/buscar`,
          { celular },
          { headers: HEADERS }
        );

        if (Number(data.status) !== 200) {
          throw new Error(data.mensaje || "No se pudo consultar el expediente.");
        }

        limpiarEstado();
        celularBusqueda.value = formatearCelular(celular);

        if (data.estado_captura === "nuevo") {
          formulario.celular = celular;
          estadoCaptura.value = "nuevo";
          mensajeInfo.value =
            "No encontramos un expediente con este número. Captura tu información y guarda tu avance cuando lo necesites.";
          pantalla.value = "formulario";
        } else if (data.estado_captura === "completado") {
          aplicarCurriculum(data.curriculum);
          aplicarDocumentos(data.documentos || []);
          estadoCaptura.value = "completado";
          pantalla.value = "completado";
          if (modalSoporte) modalSoporte.show();
        } else {
          aplicarCurriculum(data.curriculum);
          aplicarDocumentos(data.documentos || []);
          estadoCaptura.value = "en_captura";
          mensajeInfo.value = `Continuando tu captura. Ya llevas ${progreso.value.porcentaje}% de tu expediente.`;
          pantalla.value = "formulario";
        }

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

      estadoCaptura.value = data.estado_captura || "en_captura";
      limpiarArchivosNuevos();
      guardadoEn.value = new Date().toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const guardarAvance = async (silencioso = false) => {
      if (estadoCaptura.value === "completado") return false;

      if (erroresFormato.value.length) {
        mensajeError.value = erroresFormato.value.join(" ");
        if (modalError) modalError.show();
        return false;
      }

      const celular = normalizarCelular(formulario.celular);

      if (!/^\d{10}$/.test(celular)) {
        mensajeError.value = "Captura un número de celular válido de 10 dígitos.";
        if (modalError) modalError.show();
        return false;
      }

      guardando.value = true;

      try {
        const url = curriculumId.value
          ? `${API}/docente/cv/${curriculumId.value}`
          : `${API}/docente/cv`;

        const { data } = await axios.post(url, construirFormData(), {
          headers: HEADERS,
        });

        if (Number(data.status) === 409 && data.estado_captura === "completado") {
          if (data.curriculum) aplicarCurriculum(data.curriculum);
          if (data.documentos) aplicarDocumentos(data.documentos);
          estadoCaptura.value = "completado";
          pantalla.value = "completado";
          return false;
        }

        if (Number(data.status) !== 200) {
          throw new Error(data.mensaje || "No se pudo guardar el avance.");
        }

        aplicarRespuestaGuardado(data);

        if (!silencioso) {
          mostrarExito(
            "Avance guardado",
            "Puedes cerrar la página y continuar después con tu número de celular. Tus datos y documentos ya quedaron guardados."
          );
        }

        return true;
      } catch (error) {
        mostrarError(error);
        return false;
      } finally {
        guardando.value = false;
      }
    };

    const intentarFinalizar = () => {
      if (estadoCaptura.value === "completado") return;

      if (erroresFormato.value.length) {
        mensajeError.value = erroresFormato.value.join(" ");
        if (modalError) modalError.show();
        return;
      }

      if (progreso.value.faltantes.length) {
        faltantesLista.value = progreso.value.faltantes;
        if (modalFaltantes) modalFaltantes.show();
        return;
      }

      if (modalConfirmar) modalConfirmar.show();
    };

    const confirmarFinalizar = async () => {
      if (modalConfirmar) modalConfirmar.hide();

      finalizando.value = true;

      try {
        const guardado = await guardarAvance(true);
        if (!guardado) return;

        const { data } = await axios.post(
          `${API}/docente/cv/${curriculumId.value}/finalizar`,
          {},
          { headers: HEADERS }
        );

        if (Number(data.status) === 422) {
          faltantesLista.value = data.faltantes || [];
          if (modalFaltantes) modalFaltantes.show();
          return;
        }

        if (Number(data.status) === 409 && data.estado_captura === "completado") {
          if (data.curriculum) aplicarCurriculum(data.curriculum);
          if (data.documentos) aplicarDocumentos(data.documentos);
          estadoCaptura.value = "completado";
          pantalla.value = "completado";
          return;
        }

        if (Number(data.status) !== 200) {
          throw new Error(data.mensaje || "No se pudo enviar el currículum.");
        }

        if (data.curriculum) aplicarCurriculum(data.curriculum);
        if (data.documentos) aplicarDocumentos(data.documentos);
        estadoCaptura.value = "completado";
        pantalla.value = "completado";
        progresoAbierto.value = false;
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        mostrarError(error);
      } finally {
        finalizando.value = false;
      }
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
          "Si regresas al inicio se perderán los cambios que no hayas guardado. El expediente actual conservará el celular con el que se identifica. ¿Deseas continuar?"
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

    const abrirSoporte = () => {
      if (modalSoporte) modalSoporte.show();
    };

    onMounted(() => {
      setTimeout(() => {
        cargaInicial.value = true;
      }, 300);

      modalFaltantes = new bootstrap.Modal(
        document.getElementById("modalFaltantes")
      );
      modalConfirmar = new bootstrap.Modal(
        document.getElementById("modalConfirmarFinalizar")
      );
      modalError = new bootstrap.Modal(document.getElementById("modalError"));
      modalExito = new bootstrap.Modal(document.getElementById("modalExito"));
      modalSoporte = new bootstrap.Modal(document.getElementById("modalSoporte"));
    });

    return {
      cargaInicial,
      pantalla,
      estadoCaptura,
      curriculumId,
      curriculumResumen,
      documentosServidor,
      celularBusqueda,
      celularBusquedaValido,
      buscando,
      guardando,
      finalizando,
      guardadoEn,
      mensajeInfo,
      mensajeError,
      exitoTitulo,
      exitoMensaje,
      faltantesLista,
      progresoAbierto,
      formulario,
      descripciones,
      archivosNuevos,
      archivosExistentes,
      erroresFormato,
      progreso,
      pasoActual,
      celularFormateado,
      camposRequeridos: CAMPOS_REQUERIDOS,
      documentosRequeridos: DOCUMENTOS_REQUERIDOS,
      onCelularBusquedaInput,
      buscarExpediente,
      guardarAvance,
      intentarFinalizar,
      confirmarFinalizar,
      onArchivoChange,
      quitarArchivoNuevo,
      descargarExistente,
      volverAlInicio,
      irASeccion,
      abrirSoporte,
      fechaLegible,
    };
  },
}).mount("#app");
