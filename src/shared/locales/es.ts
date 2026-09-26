// Diccionario de referencia: el resto de idiomas se tipa a partir de este, así
// una clave que falte en cualquiera de ellos es un error de compilación.
const es = {
  common: {
    accept: "Aceptar",
    cancel: "Cancelar",
    retry: "Reintentar",
    save: "Guardar",
    close: "Cerrar",
    back: "Volver",
    loading: "Cargando…",
  },
  errors: {
    network: "Sin conexión. Revisa tu red e inténtalo de nuevo.",
    timeout: "La conexión tardó demasiado. Inténtalo de nuevo.",
    unknown: "Algo salió mal. Inténtalo de nuevo.",
    // Texto genérico por status, cuando el error no trae un `type` traducido.
    byStatus: {
      "400": "Los datos enviados no son válidos.",
      "401": "No hemos podido verificar tu acceso. Revisa tus datos o vuelve a iniciar sesión.",
      "403": "No tienes permiso para hacer esto.",
      "404": "No encontramos lo que buscas.",
      "409": "Esta acción choca con datos que ya existen.",
      "422": "No se pudo completar con estos datos.",
      "429": "Demasiados intentos. Espera un momento.",
      "500": "Error del servidor. Inténtalo más tarde.",
    },
    // Por `type` de Core (urn:playtopia:problem:<clave>). Manda sobre byStatus.
    byType: {
      "request-timeout": "El servidor tardó demasiado en responder. Inténtalo de nuevo.",
      "server-overloaded": "El servidor está saturado. Inténtalo en unos minutos.",
      "internal-error": "Error del servidor. Inténtalo más tarde.",
    },
  },
  splash: {
    tagline: "Tu universo deportivo",
  },
};

export type Translations = typeof es;

export default es;
