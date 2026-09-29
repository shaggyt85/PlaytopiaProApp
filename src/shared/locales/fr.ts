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
    signOut: "Se déconnecter",
    comingSoon: "Bientôt",
  },
  tabs: {
    today: "Aujourd'hui",
    calendar: "Agenda",
    groups: "Groupes",
    network: "Réseau",
    profile: "Profil",
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
      "date-range-inverted": "La date de début ne peut pas être postérieure à la date de fin.",
      "date-range-too-long": "La période est trop longue.",
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
      label: "Mot de passe",
      placeholder: "••••••••",
      submit: "Continuer",
      forgot: "Mot de passe oublié ?",
      invalidCredentials: "Email ou mot de passe incorrect.",
      studentHint: "Si vous êtes aussi élève, utilisez le mot de passe de votre compte coach.",
      show: "Afficher le mot de passe",
      hide: "Masquer le mot de passe",
    },
    signUp: {
      title: "Inscrivez-vous !",
      firstNameLabel: "Prénom",
      firstNamePlaceholder: "Votre prénom",
      lastNameLabel: "Nom de famille",
      lastNamePlaceholder: "Votre nom de famille",
      birthdayLabel: "Date de naissance",
      confirmPasswordLabel: "Répétez votre mot de passe",
      submit: "Continuer",
      submitting: "Inscription en cours...",
    },
    passwordRecovery: {
      title: "Mot de passe oublié ?",
      subtitle: "Entrez votre adresse e-mail et nous vous enverrons un lien de récupération",
      submit: "Envoyer l'e-mail de récupération",
      sentTitle: "E-mail de récupération envoyé avec succès !",
      sentMessage: "Veuillez consulter votre e-mail pour obtenir des instructions sur la réinitialisation de votre mot de passe",
      backToLogin: "Retour à la connexion",
      setupTitle: "Créez votre mot de passe",
      setupSubtitle: "Votre club vous a inscrit. Nous vous enverrons un e-mail pour que vous puissiez créer votre mot de passe.",
      setupSentMessage: "Consultez votre e-mail et suivez le lien pour créer votre mot de passe. Revenez ensuite ici pour vous connecter.",
    },
    biometric: {
      signIn: "Se connecter avec la biométrie",
      prompt: "Vérifiez votre identité pour vous connecter à Playtopia Pro",
      failed: "Impossible de vérifier votre identité. Veuillez réessayer.",
      expired: "Votre accès biométrique a expiré. Connectez-vous avec votre mot de passe pour le réactiver.",
      tooManyAttempts: "Trop de tentatives. Connectez-vous avec votre mot de passe.",
      offer: {
        title: "Activez l'accès biométrique",
        subtitle: "Connectez-vous plus vite et en toute sécurité avec la biométrie de votre téléphone",
        instant: "Accès instantané",
        security: "Sécurité maximale",
        encrypted: "Données chiffrées",
        enable: "Activer la biométrie",
        enabling: "Activation…",
        notNow: "Pas maintenant",
        prompt: "Vérifiez votre identité pour activer la biométrie",
        enabledTitle: "Biométrie activée",
        enabledMessage: "La prochaine fois, vous pourrez vous connecter avec votre biométrie.",
        failedTitle: "Activation impossible",
        failedMessage: "Impossible de vérifier votre identité. Veuillez réessayer.",
        unavailableTitle: "Biométrie indisponible",
        unavailableMessage: "Configurez la biométrie ou un verrouillage d'écran sur votre téléphone, puis réessayez.",
        expiredTitle: "Délai dépassé",
        expiredMessage: "Reconnectez-vous avec votre mot de passe pour activer la biométrie.",
      },
    },
    legal: {
      text: "En vous inscrivant, vous acceptez nos",
      terms: "conditions d'utilisation",
      and: "et",
      privacy: "politiques de confidentialité",
    },
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
  schedule: {
    greeting: {
      morning: "Bonjour, coach",
      afternoon: "Bon après-midi, coach",
      evening: "Bonsoir, coach",
    },
    notifications: "Notifications",
    /** El selector de vistas (DÍA · SEMANA · MES). */
    views: {
      day: "Jour",
      week: "Semaine",
      month: "Mois",
    },
    /** La barra de las flechas: el día, la semana o el mes que se ve y la hora de ahora. */
    toolbar: "%{label} · %{time}",
    /** La fila de los clubes con su color, encima de la agenda. */
    legend: "Clubs",
    week: {
      /** Los extremos de la semana en la barra: «18 nov – 24 nov». */
      range: "%{from} – %{to}",
      previous: "Semaine précédente",
      next: "Semaine suivante",
      /** La pastilla de la tarjeta de hoy. */
      todayNow: "Aujourd'hui · %{time}",
      filteredBy: "Filtré par %{day}",
      showAll: "Voir toute la semaine",
      /** La marca de la clase en curso («EN VIVO»). */
      live: "En direct",
    },
    month: {
      previous: "Mois précédent",
      next: "Mois suivant",
    },
    /** La tarjeta de la próxima clase, encima de la agenda. */
    next: {
      title: "Prochain cours",
      tomorrow: "Demain",
      level: "Niveau %{range}",
      students: "%{taken}/%{max} élèves",
    },
    day: {
      today: "Aujourd'hui · %{day}",
      previousDay: "Jour précédent",
      nextDay: "Jour suivant",
      free: "Jour libre · aucun engagement",
      classes: {
        one: "%{count} cours",
        other: "%{count} cours",
      },
      minutes: "%{count} min",
      next: "Prochain",
      a11y: {
        /** Un día en la tira de la semana y en el mes: «martes 19, 3 clases». */
        summary: "%{day}, %{classes}",
        duration: "%{count} minutes",
        seats: "%{taken} sur %{max} places",
        past: "terminé",
        live: "en cours",
        next: "prochain cours",
      },
    },
  },
  network: {
    title: "Réseau de clubs",
    tabs: {
      myClubs: "Mes clubs",
      nearMe: "Près de moi",
    },
    myClubs: {
      emptyTitle: "Vous ne travaillez encore dans aucun club",
      emptyMessage: "Consultez « Près de moi » pour trouver les écoles que vous pouvez rejoindre.",
    },
    nearMe: {
      emptyTitle: "Aucune nouvelle école",
      emptyMessage: "Il n'y a pas d'autres écoles à rejoindre pour le moment.",
    },
  },
  phone: {
    label: "Numéro de téléphone",
    placeholder: "Votre numéro de téléphone",
  },
  countryPicker: {
    title: "Sélectionne ton pays",
    searchPlaceholder: "Rechercher un pays ou un indicatif",
    empty: "Aucun pays ne correspond à la recherche",
  },
  datePicker: {
    placeholder: "JJ/MM/AAAA",
  },
  gender: {
    label: "Genre",
    male: "Masculin",
    female: "Féminin",
    preferNotToSay: "Je préfère ne pas le dire",
  },
  validation: {
    emailRequired: "Saisissez votre email.",
    emailInvalid: "L'adresse e-mail n'est pas valide",
    passwordRequired: "Saisissez votre mot de passe.",
    firstNameMin: "Le prénom doit contenir au moins 2 caractères",
    lastNameMin: "Le nom de famille doit contenir au moins 2 caractères",
    phoneNumbersOnly: "Le numéro de téléphone ne peut contenir que des chiffres",
    phoneMin: "Le numéro de téléphone doit contenir au moins 9 chiffres",
    phoneMax: "Le numéro de téléphone ne peut pas dépasser 15 chiffres",
    birthdayRequired: "Indiquez votre date de naissance",
    passwordMin: "Le mot de passe doit contenir au moins 8 caractères",
    passwordMax: "Le mot de passe ne peut pas dépasser 50 caractères",
    passwordUppercase: "Le mot de passe doit contenir au moins une lettre majuscule",
    passwordLowercase: "Le mot de passe doit contenir au moins une lettre minuscule",
    passwordNumber: "Le mot de passe doit contenir au moins un chiffre",
    passwordSpecialChar: "Le mot de passe doit contenir au moins un caractère spécial",
    passwordNoSpaces: "Le mot de passe ne peut pas contenir d'espaces",
    confirmPasswordRequired: "Confirmez votre mot de passe",
    passwordsDontMatch: "Les mots de passe ne correspondent pas",
    acceptTerms: "Vous devez accepter les conditions générales",
  },
  splash: {
    tagline: "Votre univers sportif",
  },
};

export default fr;
