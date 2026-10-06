// Diccionario de referencia: el resto de idiomas se tipa a partir de este, así
// una clave que falte en cualquiera de ellos es un error de compilación.
const es = {
  common: {
    /** Un tiempo exacto: «5:50 h» (`courtTimeLabel`). */
    /** De qué hora a qué hora: «08:30–09:30», «16:00–19:00». */
    timeRange: "%{start}–%{end}",
    courtTime: "%{hours}:%{minutes} h",
    /** Lo hecho de lo planificado: «9:00 / 12:00 h» (`courtTimeProgressLabel`). */
    courtTimeProgress: "%{doneHours}:%{doneMinutes} / %{plannedHours}:%{plannedMinutes} h",
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
      "not-class-teacher": "Esta clase la da otro profesor.",
      "class-not-found": "Esta clase ya no existe.",
      "student-not-in-class": "Este alumno ya no está en la clase.",
      "attendance-not-open": "La asistencia se marca cuando empieza la clase.",
      "attendance-closed": "Ya pasó el plazo para marcar la asistencia de esta clase.",
      "email-already-registered": "Ese email ya es de otra cuenta.",
    },
  },
  auth: {
    signIn: {
      emailLabel: "Correo electrónico",
      emailPlaceholder: "tu@correo.com",
      continue: "Continuar",
      register: "Registrarse",
      noStudents: "Aún no hay alumnos apuntados",
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
    /** El avatar de la cabecera, que lleva a Perfil (lo lee el lector de pantalla). */
    myProfile: "Mi perfil",
    /** Las cifras del día encima de la agenda (clases, alumnos y tiempo en pista). */
    today: {
      classes: "clases hoy",
      students: "alumnos hoy",
      court: "en pista hoy",
      /** El tiempo en pista exacto: «5:50 h». */
    },
    /** El selector de vistas (DÍA · SEMANA · MES). */
    views: {
      day: "Día",
      week: "Semana",
      month: "Mes",
    },
    /** El título encima de la navegación de la agenda («MI AGENDA»). */
    myAgenda: "Mi agenda",
    /** El centro de la barra: «Hoy» en la vista Día y, al tocarlo, volver a hoy. */
    toolbar: {
      today: "Hoy",
      goToday: "Volver a hoy",
    },
    week: {
      /** Los extremos de la semana en la barra: «18 nov – 24 nov». */
      range: "%{from} – %{to}",
      previous: "Semana anterior",
      next: "Semana siguiente",
      /** La pastilla de la tarjeta de hoy. */
      todayNow: "Hoy · %{time}",
      filteredBy: "Filtrado por %{day}",
      showAll: "Ver toda la semana",
      /** La marca de la clase en curso («EN VIVO»). */
      live: "En vivo",
    },
    month: {
      previous: "Mes anterior",
      next: "Mes siguiente",
    },
    /** La tarjeta de la próxima clase, encima de la agenda. */
    next: {
      /** La clase que se está dando. */
      live: "En curso",
      /** La próxima, con cuándo empieza: «Próxima clase · en 45 min». */
      titleWhen: "Próxima clase · %{when}",
      inMinutes: "en %{count} min",
      todayAt: "hoy %{time}",
      tomorrowAt: "mañana %{time}",
      /** «jue 18 · 18:00». */
      dayAt: "%{day} · %{time}",
      level: "Nivel %{range}",
      students: "%{taken}/%{max} alumnos",
      /** Cuántos vienen a recuperar. */
      recoveries: {
        one: "+%{count} recuperación",
        other: "+%{count} recuperaciones",
      },
      /** La marca sobre el círculo de quien recupera. */
      recoveryBadge: "R",
    },
    /** El detalle de una clase (se abre al tocarla en la agenda). */
    detail: {
      openHint: "Abre el detalle de la clase",
      /** Una cifra del día encima de la agenda para el lector de pantalla: «clases hoy: 3». */
      stat: "%{label}: %{value}",
      students: "Alumnos y asistencia",
      noStudents: "Aún no hay alumnos apuntados",
      /** A la derecha de «Alumnos y asistencia»: cuántos han venido. */
      presentCount: "%{present}/%{total} presentes",
      /** Lo mismo cuando ya tienen marca todos. */
      attendanceDone: "Asistencia registrada · %{present}/%{total}",
      /** La etiqueta de quien está en la clase por una plaza de recuperación. */
      recovery: "Recuperación",
      markPresent: "Marcar presente a %{name}",
      markAbsent: "Marcar ausente a %{name}",
      /** La sección de la última clase del grupo, su asistencia y cuántos alumnos tenía. */
      lastClass: "Última clase de este grupo",
      lastClassAttendance: "Asistencia %{present}/%{total}",
      studentCount: {
        one: "%{count} alumno",
        other: "%{count} alumnos",
      },
      /** El panel con la lista de esa clase. */
      lastClassSheet: "Última clase",
      lastClassHint: "Abre la lista de esa clase",
      notFound: "Clase no encontrada",
    },
    day: {
      today: "Hoy · %{day}",
      previousDay: "Día anterior",
      nextDay: "Día siguiente",
      free: "Día libre · sin compromisos",
      classes: {
        one: "%{count} clase",
        other: "%{count} clases",
      },
      minutes: "%{count} min",
      next: "Próxima",
      /** La marca de una clase que ya terminó, en la vista Día. */
      done: "Completada",
      a11y: {
        /** Un día en la tira de la semana y en el mes: «martes 19, 3 clases». */
        summary: "%{day}, %{classes}",
        duration: "%{count} minutos",
        seats: "%{taken} de %{max} plazas",
        past: "ya terminó",
        live: "en curso",
        next: "próxima clase",
      },
    },
  },
  /** «Mis grupos»: los grupos del profesor (la pestaña «Grupos»). */
  groups: {
    title: "Mis grupos",
    active: {
      one: "%{count} grupo activo",
      other: "%{count} grupos activos",
    },
    /** Sin ningún grupo con clases por delante. */
    empty: "Aún no tienes grupos ni clases",
    /** El detalle de un grupo. */
    detail: {
      /** Bajo la cabecera: los del grupo, sin los que vienen a recuperar. */
      members: {
        one: "%{count} alumno inscrito",
        other: "%{count} alumnos inscritos",
      },
      students: "Alumnos del grupo",
      openStudentHint: "Abre su ficha",
      nextClass: "Próxima clase",
      /** En la próxima clase: los del grupo apuntados y todos los que se esperan. */
      enrolled: {
        one: "%{count} inscrito",
        other: "%{count} inscritos",
      },
      expected: {
        one: "%{count} alumno previsto",
        other: "%{count} alumnos previstos",
      },
      notFound: "Grupo no encontrado",
    },
    /** La ficha de un alumno, desde el detalle de su grupo. */
    student: {
      notFound: "Alumno no encontrado",
      level: "Nivel",
      group: "Su grupo",
      openGroup: "Vuelve al grupo",
      groupRange: "Rango del grupo",
      attendance: "Asistencia",
      lastClasses: {
        one: "Última clase",
        other: "Últimas %{count} clases",
      },
      /** Tras «7/10»: cuántas clases cuentan. */
      classes: {
        one: "clase",
        other: "clases",
      },
      attendanceA11y: {
        one: "Vino a %{present} de %{count} clase",
        other: "Vino a %{present} de %{count} clases",
      },
      /** El aviso de faltas que manda Core, por su `kind`. */
      alert: {
        consecutiveAbsences: {
          one: "%{count} ausencia seguida",
          other: "%{count} ausencias seguidas",
        },
        absencesInLast: {
          one: "%{count} ausencia en las últimas %{of} clases",
          other: "%{count} ausencias en las últimas %{of} clases",
        },
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
    descriptionMax: "La presentación no puede pasar de 500 caracteres",
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
  /** Los campos de los datos personales: el alta y el editor de Perfil. */
  personalData: {
    firstNameLabel: "Nombre",
    firstNamePlaceholder: "Tu nombre",
    lastNameLabel: "Apellidos",
    lastNamePlaceholder: "Tu apellido",
    birthdayLabel: "Fecha de nacimiento",
  },
  profile: {
    title: "Mi perfil",
    /** «Editar ›» a la derecha del título de una tarjeta. */
    edit: "Editar",
    /** La foto del profesor, para el lector de pantalla. */
    photo: "Tu foto de perfil",
    /** Sin años de experiencia: solo el rol. */
    role: "Entrenador",
    /** El rol con sus años de experiencia. */
    roleWithExperience: {
      zero: "Entrenador · menos de un año de experiencia",
      one: "Entrenador · 1 año de experiencia",
      other: "Entrenador · %{count} años de experiencia",
    },
    hours: {
      title: "Horas este mes",
      /** Las clases dadas de las planificadas este mes: «8 de 11 clases en pista». */
      classes: {
        one: "%{done} de 1 clase en pista",
        other: "%{done} de %{count} clases en pista",
      },
      history: "Historial de horas",
      /** Al abrir un mes del historial. */
      monthClasses: {
        one: "%{done} de 1 clase",
        other: "%{done} de %{count} clases",
      },
      /** Un mes del historial, para el lector de pantalla: «Octubre, 9:00 h». */
      monthA11y: "%{month}, %{hours}",
    },
    personal: {
      title: "Datos personales",
      /** «Editar» de la tarjeta, para el lector de pantalla. */
      edit: "Editar datos personales",
    },
    professional: {
      title: "Perfil profesional",
      /** «Editar» de la tarjeta, para el lector de pantalla. */
      edit: "Editar perfil profesional",
      years: "Años de experiencia",
      description: "Presentación breve",
      specialties: "Especialidades",
      /** Los botones − y + de los años, para el lector de pantalla. */
      fewerYears: "Un año menos",
      moreYears: "Un año más",
      /** Sin presentación ni deportes. */
      empty: "Aún no lo has completado",
    },
    clubs: {
      title: "Clubes donde trabajas",
      empty: "Aún no trabajas en ningún club",
    },
    availability: {
      title: "Disponibilidad",
      /** «Editar» de la tarjeta, para el lector de pantalla. */
      edit: "Editar disponibilidad",
      /** El editor: la sede, las franjas, los días y la semana resultante. */
      club: "Sede",
      bandsTitle: "Franja horaria",
      daysTitle: "Días de la semana",
      weekTitle: "Tu semana",
      bands: {
        morning: "Mañana",
        afternoon: "Tarde",
        evening: "Noche",
        allDay: "Todo",
      },
      /** Cada día por su número de Core, para el lector de pantalla (el chip solo dice «L»). */
      weekdays: {
        "0": "Domingo",
        "1": "Lunes",
        "2": "Martes",
        "3": "Miércoles",
        "4": "Jueves",
        "5": "Viernes",
        "6": "Sábado",
      },
      /** Una sede sin ninguna hora indicada. */
      empty: "Aún no has indicado tu disponibilidad",
      /** «3 días · 14 h semanales». */
      summary: "%{days} · %{hours} h semanales",
      days: {
        one: "1 día",
        other: "%{count} días",
      },
      /** Un día con sus tramos: «Lun 16:00–19:00». */
      day: "%{day} %{ranges}",
      /** Entre dos tramos del mismo día: «09:00–11:00 y 17:00–19:00». */
      rangeSeparator: " y ",
    },
    signOutConfirm: "¿Quieres cerrar sesión?",
  },
  splash: {
    tagline: "Tu universo deportivo",
  },
};

export type Translations = typeof es;

export default es;
