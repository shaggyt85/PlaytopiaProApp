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
    },
  },
  auth: {
    signIn: {
      emailLabel: "Correu electrònic",
      emailPlaceholder: "el.teu@correu.com",
      continue: "Continuar",
      register: "Registrar-se",
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
    legal: {
      text: "En registrar-te acceptes les nostres",
      terms: "condicions d'ús",
      and: "i",
      privacy: "polítiques de privacitat",
    },
    comingSoon: "Disponible molt aviat.",
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
