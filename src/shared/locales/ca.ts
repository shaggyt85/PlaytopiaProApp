import type { Translations } from "./es";

const ca: Translations = {
  common: {
    /** Un tiempo exacto: «5:50 h» (`courtTimeLabel`). */
    /** De qué hora a qué hora: «08:30–09:30», «16:00–19:00». */
    timeRange: "%{start}–%{end}",
    courtTime: "%{hours}:%{minutes} h",
    /** Lo hecho de lo planificado: «9:00 / 12:00 h» (`courtTimeProgressLabel`). */
    courtTimeProgress: "%{doneHours}:%{doneMinutes} / %{plannedHours}:%{plannedMinutes} h",
    accept: "Acceptar",
    cancel: "Cancel·lar",
    retry: "Tornar-ho a provar",
    save: "Desar",
    close: "Tancar",
    back: "Tornar",
    loading: "Carregant…",
    signOut: "Tancar sessió",
    comingSoon: "Properament",
  },
  tabs: {
    today: "Avui",
    calendar: "Agenda",
    groups: "Grups",
    network: "Xarxa",
    profile: "Perfil",
  },
  errors: {
    network: "Sense connexió. Revisa la xarxa i torna-ho a provar.",
    timeout: "La connexió ha trigat massa. Torna-ho a provar.",
    unknown: "Alguna cosa ha anat malament. Torna-ho a provar.",
    byStatus: {
      "400": "Les dades enviades no són vàlides.",
      "401": "No hem pogut verificar el teu accés. Revisa les dades o torna a iniciar sessió.",
      "403": "No tens permís per fer això.",
      "404": "No trobem el que busques.",
      "409": "Aquesta acció entra en conflicte amb dades que ja existeixen.",
      "422": "No s'ha pogut completar amb aquestes dades.",
      "429": "Massa intents. Espera un moment.",
      "500": "Error del servidor. Torna-ho a provar més tard.",
    },
    byType: {
      "request-timeout": "El servidor ha trigat massa a respondre. Torna-ho a provar.",
      "server-overloaded": "El servidor està saturat. Torna-ho a provar d'aquí a uns minuts.",
      "internal-error": "Error del servidor. Torna-ho a provar més tard.",
      "date-range-inverted": "La data d'inici no pot ser posterior a la de fi.",
      "date-range-too-long": "L'interval de dates és massa llarg.",
      "not-class-teacher": "Aquesta classe la fa un altre professor.",
      "class-not-found": "Aquesta classe ja no existeix.",
      "student-not-in-class": "Aquest alumne ja no és a la classe.",
      "attendance-not-open": "L'assistència es marca quan comença la classe.",
      "attendance-closed": "Ja ha passat el termini per marcar l'assistència d'aquesta classe.",
    },
  },
  auth: {
    signIn: {
      emailLabel: "Correu electrònic",
      emailPlaceholder: "el.teu@correu.com",
      continue: "Continuar",
      register: "Registrar-se",
      noStudents: "Encara no hi ha alumnes apuntats",
      notFound: "Correu no trobat. Verifica el teu correu o registra't",
    },
    password: {
      label: "Contrasenya",
      placeholder: "••••••••",
      submit: "Continuar",
      forgot: "Has oblidat la teva contrasenya?",
      invalidCredentials: "Email o contrasenya incorrectes.",
      studentHint: "Si també ets alumne, fes servir la contrasenya del teu compte de professor.",
      show: "Mostrar contrasenya",
      hide: "Amagar contrasenya",
    },
    signUp: {
      title: "Registra't!",
      firstNameLabel: "Nom",
      firstNamePlaceholder: "El teu nom",
      lastNameLabel: "Cognoms",
      lastNamePlaceholder: "El teu cognom",
      birthdayLabel: "Data de naixement",
      confirmPasswordLabel: "Repeteix la teva contrasenya",
      submit: "Continuar",
      submitting: "Registrant...",
    },
    passwordRecovery: {
      title: "Has oblidat la teva contrasenya?",
      subtitle: "Introdueix el teu correu electrònic i t'enviarem un enllaç de recuperació",
      submit: "Enviar Correu de Recuperació",
      sentTitle: "Correu de recuperació enviat amb èxit!",
      sentMessage: "Si us plau revisa el teu correu per obtenir instruccions sobre com restablir la teva contrasenya",
      backToLogin: "Tornar al Login",
      setupTitle: "Crea la teva contrasenya",
      setupSubtitle: "El teu club t'ha donat d'alta. T'enviarem un correu perquè creïs la teva contrasenya.",
      setupSentMessage: "Revisa el teu correu i segueix l'enllaç per crear la teva contrasenya. Després torna aquí per entrar.",
    },
    biometric: {
      signIn: "Accedeix amb biometria",
      prompt: "Verifica la teva identitat per entrar a Playtopia Pro",
      failed: "No s'ha pogut verificar la teva identitat. Torna-ho a provar.",
      expired: "El teu accés amb biometria ha caducat. Entra amb la contrasenya per tornar-lo a activar.",
      tooManyAttempts: "Massa intents. Entra amb la contrasenya.",
      offer: {
        title: "Activa l'accés amb biometria",
        subtitle: "Entra més ràpid i segur amb la biometria del teu mòbil",
        instant: "Accés instantani",
        security: "Màxima seguretat",
        encrypted: "Dades xifrades",
        enable: "Activa la biometria",
        enabling: "Activant…",
        notNow: "Ara no",
        prompt: "Verifica la teva identitat per activar la biometria",
        enabledTitle: "Biometria activada",
        enabledMessage: "La propera vegada podràs entrar amb la teva biometria.",
        failedTitle: "No s'ha pogut activar",
        failedMessage: "No s'ha pogut verificar la teva identitat. Torna-ho a provar.",
        unavailableTitle: "Biometria no disponible",
        unavailableMessage: "Configura la biometria o un bloqueig de pantalla al mòbil i torna-ho a provar.",
        expiredTitle: "Temps esgotat",
        expiredMessage: "Torna a entrar amb la contrasenya per activar la biometria.",
      },
    },
    legal: {
      text: "En registrar-te acceptes les nostres",
      terms: "condicions d'ús",
      and: "i",
      privacy: "polítiques de privacitat",
    },
  },
  // Textos legales (los mismos que la app de alumnos hasta tener los del profesor).
  legalDocs: {
    terms: {
      title: "Termes i Condicions",
      summary: "En utilitzar la nostra aplicació, acceptes els nostres termes de servei i política de privacitat. Això inclou recopilació de dades per a experiències personalitzades, directrius de conducta de l'usuari, protecció de propietat intel·lectual i limitació de responsabilitat. Els nostres serveis es proporcionen 'tal com estan' amb el millor esforç de suport. Ens reservem el dret de modificar aquests termes amb previ avís. El teu ús continuat indica acceptació de qualsevol canvi. Per a detalls complets i obligacions legals, revisa el document complet.",
    },
    privacy: {
      title: "Política de Privacitat",
      summary: "Playtopia SL tracta les teves dades personals d'acord amb el RGPD per a gestió d'activitats esportives, comunicacions i pagaments. Recopilem dades d'identificació, contacte, acadèmiques i de pagament (tokenitzades via Stripe). Utilitzem càmera opcional per a foto de perfil. Base legal: consentiment, execució contractual i interès legítim. Compartim amb proveïdors autoritzats (Stripe, CRM). Tens dret a accés, rectificació, supressió i portabilitat. Les dades de menors requereixen consentiment parental. Implementem mesures de seguretat adequades.",
    },
    viewFullDocument: "Veure Document Complet",
    openFailed: "Error en obrir el document. Torna-ho a provar.",
  },
  schedule: {
    greeting: {
      morning: "Bon dia, entrenador",
      afternoon: "Bona tarda, entrenador",
      evening: "Bona nit, entrenador",
    },
    notifications: "Notificacions",
    /** El avatar de la cabecera, que lleva a Perfil (lo lee el lector de pantalla). */
    myProfile: "El meu perfil",
    /** Las cifras del día encima de la agenda (clases, alumnos y tiempo en pista). */
    today: {
      classes: "classes avui",
      students: "alumnes avui",
      court: "a pista avui",
      /** El tiempo en pista exacto: «5:50 h». */
    },
    /** El selector de vistas (DÍA · SEMANA · MES). */
    views: {
      day: "Dia",
      week: "Setmana",
      month: "Mes",
    },
    /** El título encima de la navegación de la agenda («MI AGENDA»). */
    myAgenda: "La meva agenda",
    /** El centro de la barra: «Hoy» en la vista Día y, al tocarlo, volver a hoy. */
    toolbar: {
      today: "Avui",
      goToday: "Tornar a avui",
    },
    week: {
      /** Los extremos de la semana en la barra: «18 nov – 24 nov». */
      range: "%{from} – %{to}",
      previous: "Setmana anterior",
      next: "Setmana següent",
      /** La pastilla de la tarjeta de hoy. */
      todayNow: "Avui · %{time}",
      filteredBy: "Filtrat per %{day}",
      showAll: "Veure tota la setmana",
      /** La marca de la clase en curso («EN VIVO»). */
      live: "En directe",
    },
    month: {
      previous: "Mes anterior",
      next: "Mes següent",
    },
    /** La tarjeta de la próxima clase, encima de la agenda. */
    next: {
      /** La clase que se está dando. */
      live: "En curs",
      /** La próxima, con cuándo empieza: «Próxima clase · en 45 min». */
      titleWhen: "Propera classe · %{when}",
      inMinutes: "d'aquí a %{count} min",
      todayAt: "avui %{time}",
      tomorrowAt: "demà %{time}",
      /** «jue 18 · 18:00». */
      dayAt: "%{day} · %{time}",
      level: "Nivell %{range}",
      students: "%{taken}/%{max} alumnes",
      /** Cuántos vienen a recuperar. */
      recoveries: {
        one: "+%{count} recuperació",
        other: "+%{count} recuperacions",
      },
      /** La marca sobre el círculo de quien recupera. */
      recoveryBadge: "R",
    },
    /** El detalle de una clase (se abre al tocarla en la agenda). */
    detail: {
      openHint: "Obre el detall de la classe",
      /** Una cifra del día encima de la agenda para el lector de pantalla: «clases hoy: 3». */
      stat: "%{label}: %{value}",
      students: "Alumnes i assistència",
      noStudents: "Encara no hi ha alumnes apuntats",
      /** A la derecha de «Alumnos y asistencia»: cuántos han venido. */
      presentCount: "%{present}/%{total} presents",
      /** Lo mismo cuando ya tienen marca todos. */
      attendanceDone: "Assistència registrada · %{present}/%{total}",
      /** La etiqueta de quien está en la clase por una plaza de recuperación. */
      recovery: "Recuperació",
      markPresent: "Marcar present a %{name}",
      markAbsent: "Marcar absent a %{name}",
      /** La sección de la última clase del grupo, su asistencia y cuántos alumnos tenía. */
      lastClass: "Última classe d'aquest grup",
      lastClassAttendance: "Assistència %{present}/%{total}",
      studentCount: {
        one: "%{count} alumne",
        other: "%{count} alumnes",
      },
      /** El panel con la lista de esa clase. */
      lastClassSheet: "Última classe",
      lastClassHint: "Obre la llista d'aquella classe",
      notFound: "Classe no trobada",
    },
    day: {
      today: "Avui · %{day}",
      previousDay: "Dia anterior",
      nextDay: "Dia següent",
      free: "Dia lliure · sense compromisos",
      classes: {
        one: "%{count} classe",
        other: "%{count} classes",
      },
      minutes: "%{count} min",
      next: "Propera",
      /** La marca de una clase que ya terminó, en la vista Día. */
      done: "Completada",
      a11y: {
        /** Un día en la tira de la semana y en el mes: «martes 19, 3 clases». */
        summary: "%{day}, %{classes}",
        duration: "%{count} minuts",
        seats: "%{taken} de %{max} places",
        past: "ja ha acabat",
        live: "en curs",
        next: "propera classe",
      },
    },
  },
  /** «Mis grupos»: los grupos del profesor (la pestaña «Grupos»). */
  groups: {
    title: "Els meus grups",
    active: {
      one: "%{count} grup actiu",
      other: "%{count} grups actius",
    },
    /** Sin ningún grupo con clases por delante. */
    empty: "Encara no tens grups ni classes",
    /** El detalle de un grupo. */
    detail: {
      /** Bajo la cabecera: los del grupo, sin los que vienen a recuperar. */
      members: {
        one: "%{count} alumne inscrit",
        other: "%{count} alumnes inscrits",
      },
      students: "Alumnes del grup",
      openStudentHint: "Obre la seva fitxa",
      nextClass: "Propera classe",
      /** En la próxima clase: los del grupo apuntados y todos los que se esperan. */
      enrolled: {
        one: "%{count} inscrit",
        other: "%{count} inscrits",
      },
      expected: {
        one: "%{count} alumne previst",
        other: "%{count} alumnes previstos",
      },
      notFound: "Grup no trobat",
    },
    student: {
      notFound: "Alumne no trobat",
      level: "Nivell",
      group: "El seu grup",
      openGroup: "Torna al grup",
      groupRange: "Rang del grup",
      attendance: "Assistència",
      lastClasses: {
        one: "Última classe",
        other: "Últimes %{count} classes",
      },
      classes: {
        one: "classe",
        other: "classes",
      },
      attendanceA11y: {
        one: "Va venir a %{present} de %{count} classe",
        other: "Va venir a %{present} de %{count} classes",
      },
      alert: {
        consecutiveAbsences: {
          one: "%{count} absència seguida",
          other: "%{count} absències seguides",
        },
        absencesInLast: {
          one: "%{count} absència en les últimes %{of} classes",
          other: "%{count} absències en les últimes %{of} classes",
        },
      },
    },
  },
  network: {
    title: "Xarxa de clubs",
    tabs: {
      myClubs: "Els meus clubs",
      nearMe: "A prop meu",
    },
    myClubs: {
      emptyTitle: "Encara no treballes a cap club",
      emptyMessage: "Mira a «A prop meu» les escoles a les quals et pots unir.",
    },
    nearMe: {
      emptyTitle: "No hi ha escoles noves",
      emptyMessage: "De moment no hi ha més escoles a les quals unir-te.",
    },
  },
  phone: {
    label: "Número de telèfon",
    placeholder: "El teu número de telèfon",
  },
  countryPicker: {
    title: "Selecciona el teu país",
    searchPlaceholder: "Cerca país o prefix",
    empty: "Cap país coincideix amb la cerca",
  },
  datePicker: {
    placeholder: "DD/MM/AAAA",
  },
  gender: {
    label: "Gènere",
    male: "Masculí",
    female: "Femení",
    preferNotToSay: "Prefereixo no dir-ho",
  },
  validation: {
    emailRequired: "Escriu el teu email.",
    emailInvalid: "El correu electrònic no és vàlid",
    passwordRequired: "Escriu la teva contrasenya.",
    firstNameMin: "El nom ha de tenir almenys 2 caràcters",
    lastNameMin: "Els cognoms han de tenir almenys 2 caràcters",
    phoneNumbersOnly: "El telèfon només pot contenir números",
    phoneMin: "El telèfon ha de tenir almenys 9 dígits",
    phoneMax: "El telèfon no pot superar els 15 dígits",
    birthdayRequired: "Indica la teva data de naixement",
    passwordMin: "La contrasenya ha de tenir almenys 8 caràcters",
    passwordMax: "La contrasenya no pot tenir més de 50 caràcters",
    passwordUppercase: "La contrasenya ha de contenir almenys una lletra majúscula",
    passwordLowercase: "La contrasenya ha de contenir almenys una lletra minúscula",
    passwordNumber: "La contrasenya ha de contenir almenys un número",
    passwordSpecialChar: "La contrasenya ha de contenir almenys un caràcter especial",
    passwordNoSpaces: "La contrasenya no pot contenir espais",
    confirmPasswordRequired: "Confirma la teva contrasenya",
    passwordsDontMatch: "Les contrasenyes no coincideixen",
    acceptTerms: "Has d'acceptar els termes i condicions",
  },
  profile: {
    title: "El meu perfil",
    photo: "La teva foto de perfil",
    role: "Entrenador",
    roleWithExperience: {
      zero: "Entrenador · menys d'un any d'experiència",
      one: "Entrenador · 1 any d'experiència",
      other: "Entrenador · %{count} anys d'experiència",
    },
    hours: {
      title: "Hores aquest mes",
      classes: {
        one: "%{done} de 1 classe a pista",
        other: "%{done} de %{count} classes a pista",
      },
      history: "Historial d'hores",
      monthClasses: {
        one: "%{done} de 1 classe",
        other: "%{done} de %{count} classes",
      },
      monthA11y: "%{month}, %{hours}",
    },
    personal: {
      title: "Dades personals",
    },
    professional: {
      title: "Perfil professional",
      empty: "Encara no l'has completat",
    },
    clubs: {
      title: "Clubs on treballes",
      empty: "Encara no treballes a cap club",
    },
    availability: {
      title: "Disponibilitat",
      /** Una sede sin ninguna hora indicada. */
      empty: "Encara no has indicat la teva disponibilitat",
      /** «3 días · 14 h semanales». */
      summary: "%{days} · %{hours} h setmanals",
      days: {
        one: "1 dia",
        other: "%{count} dies",
      },
      /** Un día con sus tramos: «Lun 16:00–19:00». */
      day: "%{day} %{ranges}",
      /** Entre dos tramos del mismo día: «09:00–11:00 y 17:00–19:00». */
      rangeSeparator: " i ",
    },
    signOutConfirm: "Vols tancar la sessió?",
  },
  splash: {
    tagline: "El teu univers esportiu",
  },
};

export default ca;
