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
      title: "Hola, profe",
      subtitle: "Escriu el teu email per continuar",
      emailLabel: "Email",
      emailPlaceholder: "tu@email.com",
      continue: "Continuar",
      notFound: "No trobem cap compte amb aquest email.",
      createAccount: "Crear compte de professor",
    },
    password: {
      title: "La teva contrasenya",
      subtitle: "Entrant com a {{email}}",
      label: "Contrasenya",
      submit: "Entrar",
      forgot: "Has oblidat la contrasenya?",
      changeEmail: "Canviar email",
      invalidCredentials: "Email o contrasenya incorrectes.",
      studentHint: "Si també ets alumne, fes servir la contrasenya del teu compte de professor.",
      noTeacherAccount: "Encara no tens compte de professor?",
      register: "Registra't",
      show: "Mostrar contrasenya",
      hide: "Amagar contrasenya",
    },
    comingSoon: "Disponible molt aviat.",
  },
  validation: {
    emailRequired: "Escriu el teu email.",
    emailInvalid: "Aquest email no és vàlid.",
    passwordRequired: "Escriu la teva contrasenya.",
  },
  splash: {
    tagline: "El teu univers esportiu",
  },
};

export default ca;
