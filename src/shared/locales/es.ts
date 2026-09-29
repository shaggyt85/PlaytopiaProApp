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
    signOut: "Cerrar sesión",
    comingSoon: "Próximamente",
  },
  tabs: {
    today: "Hoy",
    calendar: "Agenda",
    groups: "Grupos",
    network: "Red",
    profile: "Perfil",
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
      "date-range-inverted": "La fecha de inicio no puede ser posterior a la de fin.",
      "date-range-too-long": "El rango de fechas es demasiado largo.",
    },
  },
  auth: {
    signIn: {
      emailLabel: "Correo electrónico",
      emailPlaceholder: "tu@correo.com",
      continue: "Continuar",
      register: "Registrarse",
      notFound: "Correo no encontrado. Verifica tu correo o regístrate",
    },
    password: {
      label: "Contraseña",
      placeholder: "••••••••",
      submit: "Continuar",
      forgot: "¿Has olvidado tu contraseña?",
      invalidCredentials: "Email o contraseña incorrectos.",
      studentHint: "Si también eres alumno, usa la contraseña de tu cuenta de profesor.",
      show: "Mostrar contraseña",
      hide: "Ocultar contraseña",
    },
    signUp: {
      title: "¡Regístrate!",
      firstNameLabel: "Nombre",
      firstNamePlaceholder: "Tu nombre",
      lastNameLabel: "Apellidos",
      lastNamePlaceholder: "Tu apellido",
      birthdayLabel: "Fecha de nacimiento",
      confirmPasswordLabel: "Repetir tu contraseña",
      submit: "Continuar",
      submitting: "Registrando...",
    },
    passwordRecovery: {
      title: "¿Olvidaste tu contraseña?",
      subtitle: "Ingresa tu correo electrónico y te enviaremos un enlace de recuperación",
      submit: "Enviar Correo de Recuperación",
      sentTitle: "¡Correo de recuperación enviado con éxito!",
      sentMessage: "Por favor revisa tu correo para obtener instrucciones sobre cómo restablecer tu contraseña",
      backToLogin: "Volver al Login",
      setupTitle: "Crea tu contraseña",
      setupSubtitle: "Tu club te ha dado de alta. Te enviaremos un correo para que crees tu contraseña.",
      setupSentMessage: "Revisa tu correo y sigue el enlace para crear tu contraseña. Después vuelve aquí para entrar.",
    },
    biometric: {
      signIn: "Acceder con biometría",
      prompt: "Verifica tu identidad para entrar en Playtopia Pro",
      failed: "No se ha podido verificar tu identidad. Inténtalo de nuevo.",
      expired: "Tu acceso con biometría ha caducado. Entra con tu contraseña para volver a activarlo.",
      tooManyAttempts: "Demasiados intentos. Entra con tu contraseña.",
      offer: {
        title: "Activa el acceso con biometría",
        subtitle: "Entra más rápido y seguro con la biometría de tu móvil",
        instant: "Acceso instantáneo",
        security: "Máxima seguridad",
        encrypted: "Datos cifrados",
        enable: "Activar biometría",
        enabling: "Activando…",
        notNow: "Ahora no",
        prompt: "Verifica tu identidad para activar la biometría",
        enabledTitle: "Biometría activada",
        enabledMessage: "La próxima vez podrás entrar con tu biometría.",
        failedTitle: "No se ha podido activar",
        failedMessage: "No se ha podido verificar tu identidad. Inténtalo de nuevo.",
        unavailableTitle: "Biometría no disponible",
        unavailableMessage: "Configura la biometría o un código de bloqueo en tu móvil e inténtalo de nuevo.",
        expiredTitle: "Tiempo agotado",
        expiredMessage: "Vuelve a entrar con tu contraseña para activar la biometría.",
      },
    },
    legal: {
      text: "Al registrarte aceptas nuestras",
      terms: "condiciones de uso",
      and: "y",
      privacy: "políticas de privacidad",
    },
  },
  // Textos legales (los mismos que la app de alumnos hasta tener los del profesor).
  legalDocs: {
    terms: {
      title: "Términos y Condiciones",
      summary: "Al usar nuestra aplicación, aceptas nuestros términos de servicio y política de privacidad. Esto incluye recopilación de datos para experiencias personalizadas, directrices de conducta del usuario, protección de propiedad intelectual y limitación de responsabilidad. Nuestros servicios se proporcionan 'tal como están' con el mejor esfuerzo de soporte. Nos reservamos el derecho de modificar estos términos con previo aviso. Tu uso continuado indica aceptación de cualquier cambio. Para detalles completos y obligaciones legales, revisa el documento completo.",
    },
    privacy: {
      title: "Política de Privacidad",
      summary: "Playtopia SL trata tus datos personales conforme al RGPD para gestión de actividades deportivas, comunicaciones y pagos. Recopilamos datos de identificación, contacto, académicos y de pago (tokenizados vía Stripe). Usamos cámara opcional para foto de perfil. Base legal: consentimiento, ejecución contractual e interés legítimo. Compartimos con proveedores autorizados (Stripe, CRM). Tienes derecho a acceso, rectificación, supresión y portabilidad. Datos de menores requieren consentimiento parental. Implementamos medidas de seguridad adecuadas.",
    },
    viewFullDocument: "Ver Documento Completo",
    openFailed: "Error al abrir el documento. Inténtalo de nuevo.",
  },
  schedule: {
    greeting: {
      morning: "Buenos días, entrenador",
      afternoon: "Buenas tardes, entrenador",
      evening: "Buenas noches, entrenador",
    },
    notifications: "Notificaciones",
    /** La tarjeta de la próxima clase, encima de la agenda. */
    next: {
      title: "Próxima clase",
      tomorrow: "Mañana",
      level: "Nivel %{range}",
      students: "%{taken}/%{max} alumnos",
    },
    day: {
      today: "Hoy · %{day}",
      /** La barra de las flechas: el día que se ve y la hora de ahora. */
      toolbar: "%{day} · %{time}",
      previousDay: "Día anterior",
      nextDay: "Día siguiente",
      free: "Día libre · sin compromisos",
      classes: {
        one: "%{count} clase",
        other: "%{count} clases",
      },
      minutes: "%{count} min",
      next: "Próxima",
      a11y: {
        duration: "%{count} minutos",
        seats: "%{taken} de %{max} plazas",
        past: "ya terminó",
        live: "en curso",
        next: "próxima clase",
      },
    },
  },
  network: {
    title: "Red de clubes",
    tabs: {
      myClubs: "Mis clubes",
      nearMe: "Cerca de mí",
    },
    myClubs: {
      emptyTitle: "Aún no trabajas en ningún club",
      emptyMessage: "Mira en «Cerca de mí» las escuelas a las que puedes unirte.",
    },
    nearMe: {
      emptyTitle: "No hay escuelas nuevas",
      emptyMessage: "Por ahora no hay más escuelas a las que unirte.",
    },
  },
  phone: {
    label: "Número de teléfono",
    placeholder: "Tu número de teléfono",
  },
  countryPicker: {
    title: "Selecciona tu país",
    searchPlaceholder: "Buscar país o prefijo",
    empty: "Ningún país coincide con la búsqueda",
  },
  datePicker: {
    placeholder: "DD/MM/AAAA",
  },
  gender: {
    label: "Género",
    male: "Masculino",
    female: "Femenino",
    preferNotToSay: "Prefiero no decirlo",
  },
  validation: {
    emailRequired: "Escribe tu email.",
    emailInvalid: "El correo electrónico no es válido",
    passwordRequired: "Escribe tu contraseña.",
    firstNameMin: "El nombre debe tener al menos 2 caracteres",
    lastNameMin: "Los apellidos deben tener al menos 2 caracteres",
    phoneNumbersOnly: "El teléfono solo debe contener números",
    phoneMin: "El teléfono debe tener al menos 9 dígitos",
    phoneMax: "El teléfono no puede exceder 15 dígitos",
    birthdayRequired: "Indica tu fecha de nacimiento",
    passwordMin: "La contraseña debe tener al menos 8 caracteres",
    passwordMax: "La contraseña no puede tener más de 50 caracteres",
    passwordUppercase: "La contraseña debe contener al menos una letra mayúscula",
    passwordLowercase: "La contraseña debe contener al menos una letra minúscula",
    passwordNumber: "La contraseña debe contener al menos un número",
    passwordSpecialChar: "La contraseña debe contener al menos un carácter especial",
    passwordNoSpaces: "La contraseña no puede contener espacios",
    confirmPasswordRequired: "Confirma tu contraseña",
    passwordsDontMatch: "Las contraseñas no coinciden",
    acceptTerms: "Debes aceptar los términos y condiciones",
  },
  splash: {
    tagline: "Tu universo deportivo",
  },
};

export type Translations = typeof es;

export default es;
