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
      emailLabel: "Adresse e-mail",
      emailPlaceholder: "votre@email.com",
      continue: "Continuer",
      register: "S'inscrire",
      notFound: "E-mail introuvable. Vérifiez votre e-mail ou inscrivez-vous",
    },
    password: {
      title: "Bon retour !",
      label: "Mot de passe",
      placeholder: "••••••••",
      submit: "Continuer",
      forgot: "Mot de passe oublié ?",
      invalidCredentials: "Email ou mot de passe incorrect.",
      studentHint: "Si vous êtes aussi élève, utilisez le mot de passe de votre compte coach.",
      noTeacherAccount: "Pas encore de compte coach ?",
      register: "S'inscrire",
      show: "Afficher le mot de passe",
      hide: "Masquer le mot de passe",
    },
    legal: {
      text: "En vous inscrivant, vous acceptez nos",
      terms: "conditions d'utilisation",
      and: "et",
      privacy: "politiques de confidentialité",
    },
    comingSoon: "Disponible très bientôt.",
  },
  // Textos legales (los mismos que la app de alumnos hasta tener los del profesor).
  legalDocs: {
    terms: {
      title: "Conditions générales",
      summary: "En utilisant notre application, vous acceptez nos conditions de service et notre politique de confidentialité. Cela inclut la collecte de données pour des expériences personnalisées, les directives de conduite des utilisateurs, la protection de la propriété intellectuelle et la limitation de responsabilité. Nos services sont fournis 'tels quels' avec le meilleur support possible. Nous nous réservons le droit de modifier ces conditions avec préavis. Votre utilisation continue indique l'acceptation de tout changement. Pour les détails complets et les obligations légales, consultez le document complet.",
    },
    privacy: {
      title: "Politique de confidentialité",
      summary: "Playtopia SL traite vos données personnelles conformément au RGPD pour la gestion des activités sportives, les communications et les paiements. Nous collectons des données d'identification, de contact, académiques et de paiement (tokenisées via Stripe). Nous utilisons la caméra en option pour la photo de profil. Base légale : consentement, exécution contractuelle et intérêt légitime. Nous partageons avec des fournisseurs autorisés (Stripe, CRM). Vous avez le droit d'accès, de rectification, de suppression et de portabilité. Les données des mineurs nécessitent le consentement parental. Nous mettons en œuvre des mesures de sécurité appropriées.",
    },
    viewFullDocument: "Voir le document complet",
    openFailed: "Erreur lors de l'ouverture du document. Réessayez.",
  },
  validation: {
    emailRequired: "Saisissez votre email.",
    emailInvalid: "L'adresse e-mail n'est pas valide",
    passwordRequired: "Saisissez votre mot de passe.",
  },
  splash: {
    tagline: "Votre univers sportif",
  },
};

export default fr;
