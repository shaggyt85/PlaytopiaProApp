import type { Translations } from "./es";

const ca: Translations = {
  common: {
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
      courtTime: "%{hours}:%{minutes} h",
    },
    /** El selector de vistas (DÍA · SEMANA · MES). */
    views: {
      day: "Dia",
      week: "Setmana",
      month: "Mes",
    },
    /** La barra de las flechas: el día, la semana o el mes que se ve y la hora de ahora. */
    toolbar: "%{label} · %{time}",
    /** La fila de los clubes con su color, encima de la agenda. */
    legend: "Clubs",
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
      title: "Propera classe",
      tomorrow: "Demà",
      level: "Nivell %{range}",
      students: "%{taken}/%{max} alumnes",
    },
    /** El detalle de una clase (se abre al tocarla en la agenda). */
    detail: {
      openHint: "Obre el detall de la classe",
      timeRange: "%{start}–%{end}",
      /** Una cifra de la cabecera para el lector de pantalla: «Alumnos: 2/4». */
      stat: "%{label}: %{value}",
      /** El título de la sección del club. */
      club: "Club",
      /** La tarjeta del club para el lector de pantalla: «Club: Wave Padel Club, Pº de la Castellana 300». */
      clubA11y: "Club: %{details}",
      students: "Alumnes",
      level: "Nivell",
      noStudents: "Encara no hi ha alumnes apuntats",
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
  splash: {
    tagline: "El teu univers esportiu",
  },
};

export default ca;
