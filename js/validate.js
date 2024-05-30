export function validacionGeneral(val) {
  if (!val) {
    return false;
  }
  return true;
}

export function validacionNombre(val) {
  const validacionVacia = validacionGeneral(val);
  if (validacionVacia) {
    if (!(/^[a-zA-Z ]+$/.test(val.trim()))) {
      return false;
    }
  }
  return validacionVacia;
}

export function validacionCodigoPostal(val) {
  const validacionVacia = validacionGeneral(val);
  if (validacionVacia) {
    if (val.length != 5) {
      return false;
    }
  }
  return validacionVacia;
}
