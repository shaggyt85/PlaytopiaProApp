import type { Translations } from "./es";

const fr: Translations = {
  common: {
    accept: "Accepter",
    cancel: "Annuler",
    retry: "Réessayer",
    save: "Enregistrer",
    close: "Fermer",
    back: "Retour",
    loading: "Chargement…",
  },
  errors: {
    network: "Pas de connexion. Vérifiez votre réseau et réessayez.",
    timeout: "La connexion a pris trop de temps. Veuillez réessayer.",
    unknown: "Une erreur s'est produite. Veuillez réessayer.",
    byStatus: {
      "400": "Les données envoyées ne sont pas valides.",
      "401": "Nous n'avons pas pu vérifier votre accès. Vérifiez vos informations ou reconnectez-vous.",
      "403": "Vous n'avez pas l'autorisation de faire cela.",
      "404": "Nous n'avons pas trouvé ce que vous cherchez.",
      "409": "Cette action est en conflit avec des données existantes.",
      "422": "Impossible de terminer avec ces données.",
      "429": "Trop de tentatives. Veuillez patienter un instant.",
      "500": "Erreur du serveur. Veuillez réessayer plus tard.",
    },
    byType: {
      "request-timeout": "Le serveur a mis trop de temps à répondre. Veuillez réessayer.",
      "server-overloaded": "Le serveur est surchargé. Réessayez dans quelques minutes.",
      "internal-error": "Erreur du serveur. Veuillez réessayer plus tard.",
    },
  },
  auth: {
    signIn: {
      title: "Bonjour, coach",
      subtitle: "Saisissez votre email pour continuer",
      emailLabel: "Email",
      emailPlaceholder: "vous@email.com",
      continue: "Continuer",
      notFound: "Nous n'avons trouvé aucun compte avec cet email.",
      createAccount: "Créer un compte coach",
    },
    password: {
      title: "Votre mot de passe",
      subtitle: "Connexion en tant que {{email}}",
      label: "Mot de passe",
      submit: "Se connecter",
      forgot: "Mot de passe oublié ?",
      changeEmail: "Changer d'email",
      invalidCredentials: "Email ou mot de passe incorrect.",
      studentHint: "Si vous êtes aussi élève, utilisez le mot de passe de votre compte coach.",
      noTeacherAccount: "Pas encore de compte coach ?",
      register: "S'inscrire",
      show: "Afficher le mot de passe",
      hide: "Masquer le mot de passe",
    },
    comingSoon: "Disponible très bientôt.",
  },
  validation: {
    emailRequired: "Saisissez votre email.",
    emailInvalid: "Cet email n'est pas valide.",
    passwordRequired: "Saisissez votre mot de passe.",
  },
  splash: {
    tagline: "Votre univers sportif",
  },
};

export default fr;
