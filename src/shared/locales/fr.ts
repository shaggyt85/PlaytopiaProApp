import type { Translations } from "./es";

const fr: Translations = {
  common: {
    /** Rechazar una oferta para luego: la biometría, la versión nueva. */
    notNow: "Pas maintenant",
    /** Un enlace externo que el sistema no pudo abrir (`openExternalUrl`). */
    openFailed: "Erreur lors de l'ouverture du lien. Réessayez.",
    /** Un tiempo exacto: «5:50 h» (`courtTimeLabel`). */
    /** De qué hora a qué hora: «08:30–09:30», «16:00–19:00». */
    timeRange: "%{start}–%{end}",
    courtTime: "%{hours}:%{minutes} h",
    /** Lo hecho de lo planificado: «9:00 / 12:00 h» (`courtTimeProgressLabel`). */
    courtTimeProgress: "%{doneHours}:%{doneMinutes} / %{plannedHours}:%{plannedMinutes} h",
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
      "not-class-teacher": "Ce cours est donné par un autre coach.",
      "class-not-found": "Ce cours n'existe plus.",
      "student-not-in-class": "Cet élève n'est plus dans le cours.",
      "attendance-not-open": "Les présences se marquent quand le cours commence.",
      "attendance-closed": "Le délai pour marquer les présences de ce cours est passé.",
      "email-already-registered": "Cet e-mail appartient déjà à un autre compte.",
    },
  },
  auth: {
    signIn: {
      emailLabel: "Adresse e-mail",
      emailPlaceholder: "votre@email.com",
      continue: "Continuer",
      register: "S'inscrire",
      noStudents: "Aucun élève inscrit pour l'instant",
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
  },
  schedule: {
    greeting: {
      morning: "Bonjour, coach",
      afternoon: "Bon après-midi, coach",
      evening: "Bonsoir, coach",
    },
    notifications: "Notifications",
    /** El avatar de la cabecera, que lleva a Perfil (lo lee el lector de pantalla). */
    myProfile: "Mon profil",
    /** Las cifras del día encima de la agenda (clases, alumnos y tiempo en pista). */
    today: {
      classes: "cours aujourd'hui",
      students: "élèves aujourd'hui",
      court: "sur le court aujourd'hui",
      /** El tiempo en pista exacto: «5:50 h». */
    },
    /** El selector de vistas (DÍA · SEMANA · MES). */
    views: {
      day: "Jour",
      week: "Semaine",
      month: "Mois",
    },
    /** El título encima de la navegación de la agenda («MI AGENDA»). */
    myAgenda: "Mon agenda",
    /** El centro de la barra: «Hoy» en la vista Día y, al tocarlo, volver a hoy. */
    toolbar: {
      today: "Aujourd'hui",
      goToday: "Revenir à aujourd'hui",
    },
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
      /** La clase que se está dando. */
      live: "En cours",
      /** La próxima, con cuándo empieza: «Próxima clase · en 45 min». */
      titleWhen: "Prochain cours · %{when}",
      inMinutes: "dans %{count} min",
      todayAt: "aujourd'hui %{time}",
      tomorrowAt: "demain %{time}",
      /** «jue 18 · 18:00». */
      dayAt: "%{day} · %{time}",
      level: "Niveau %{range}",
      students: "%{taken}/%{max} élèves",
      /** Cuántos vienen a recuperar. */
      recoveries: {
        one: "+%{count} rattrapage",
        other: "+%{count} rattrapages",
      },
      /** La marca sobre el círculo de quien recupera. */
      recoveryBadge: "R",
    },
    /** El detalle de una clase (se abre al tocarla en la agenda). */
    detail: {
      openHint: "Ouvre le détail du cours",
      /** Una cifra del día encima de la agenda para el lector de pantalla: «clases hoy: 3». */
      stat: "%{label}: %{value}",
      students: "Élèves et présences",
      noStudents: "Aucun élève inscrit pour l'instant",
      /** A la derecha de «Alumnos y asistencia»: cuántos han venido. */
      presentCount: "%{present}/%{total} présents",
      /** Lo mismo cuando ya tienen marca todos. */
      attendanceDone: "Présences enregistrées · %{present}/%{total}",
      /** La etiqueta de quien está en la clase por una plaza de recuperación. */
      recovery: "Rattrapage",
      markPresent: "Marquer %{name} présent",
      markAbsent: "Marquer %{name} absent",
      /** La sección de la última clase del grupo, su asistencia y cuántos alumnos tenía. */
      lastClass: "Dernier cours de ce groupe",
      lastClassAttendance: "Présences %{present}/%{total}",
      studentCount: {
        one: "%{count} élève",
        other: "%{count} élèves",
      },
      /** El panel con la lista de esa clase. */
      lastClassSheet: "Dernier cours",
      lastClassHint: "Ouvre la liste de ce cours",
      notFound: "Cours introuvable",
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
      /** La marca de una clase que ya terminó, en la vista Día. */
      done: "Terminé",
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
  /** «Mis grupos»: los grupos del profesor (la pestaña «Grupos»). */
  groups: {
    title: "Mes groupes",
    active: {
      one: "%{count} groupe actif",
      other: "%{count} groupes actifs",
    },
    /** Sin ningún grupo con clases por delante. */
    empty: "Tu n'as pas encore de groupes ni de cours",
    /** El detalle de un grupo. */
    detail: {
      /** Bajo la cabecera: los del grupo, sin los que vienen a recuperar. */
      members: {
        one: "%{count} élève inscrit",
        other: "%{count} élèves inscrits",
      },
      students: "Élèves du groupe",
      openStudentHint: "Ouvre sa fiche",
      nextClass: "Prochain cours",
      /** En la próxima clase: los del grupo apuntados y todos los que se esperan. */
      enrolled: {
        one: "%{count} inscrit",
        other: "%{count} inscrits",
      },
      expected: {
        one: "%{count} élève attendu",
        other: "%{count} élèves attendus",
      },
      notFound: "Groupe introuvable",
    },
    student: {
      notFound: "Élève introuvable",
      level: "Niveau",
      group: "Son groupe",
      openGroup: "Revient au groupe",
      groupRange: "Niveau du groupe",
      attendance: "Présence",
      lastClasses: {
        one: "Dernier cours",
        other: "%{count} derniers cours",
      },
      classes: {
        one: "cours",
        other: "cours",
      },
      attendanceA11y: {
        one: "Présent à %{present} cours sur %{count}",
        other: "Présent à %{present} cours sur %{count}",
      },
      alert: {
        consecutiveAbsences: {
          one: "%{count} absence de suite",
          other: "%{count} absences de suite",
        },
        absencesInLast: {
          one: "%{count} absence sur les %{of} derniers cours",
          other: "%{count} absences sur les %{of} derniers cours",
        },
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
    /** El motivo de la baja de la cuenta. */
    reasonMin: "Dis-nous-en un peu plus : au moins 10 caractères",
    reasonMax: "Le motif ne peut pas dépasser 1000 caractères",
    descriptionMax: "La présentation ne peut pas dépasser 500 caractères",
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
  /** Los campos de los datos personales: el alta y el editor de Perfil. */
  personalData: {
    firstNameLabel: "Prénom",
    firstNamePlaceholder: "Votre prénom",
    lastNameLabel: "Nom de famille",
    lastNamePlaceholder: "Votre nom de famille",
    birthdayLabel: "Date de naissance",
  },
  profile: {
    title: "Mon profil",
    /** «Editar ›» a la derecha del título de una tarjeta. */
    edit: "Modifier",
    /** La foto del profesor: tocarla la cambia. */
    avatar: {
      change: "Changer la photo",
      takePhoto: "Prendre une photo",
      chooseFromLibrary: "Choisir dans la galerie",
      cameraDenied: "Pas d'accès à l'appareil photo",
      cameraDeniedMessage: "Autorise l'accès à l'appareil photo dans les réglages pour prendre ta photo.",
      openSettings: "Ouvrir les réglages",
    },
    role: "Entraîneur",
    roleWithExperience: {
      zero: "Entraîneur · moins d'un an d'expérience",
      one: "Entraîneur · 1 an d'expérience",
      other: "Entraîneur · %{count} ans d'expérience",
    },
    hours: {
      title: "Heures ce mois-ci",
      classes: {
        one: "%{done} sur 1 cours sur le terrain",
        other: "%{done} sur %{count} cours sur le terrain",
      },
      history: "Historique des heures",
      monthClasses: {
        one: "%{done} sur 1 cours",
        other: "%{done} sur %{count} cours",
      },
      monthA11y: "%{month}, %{hours}",
    },
    personal: {
      title: "Données personnelles",
      /** «Editar» de la tarjeta, para el lector de pantalla. */
      edit: "Modifier les données personnelles",
    },
    professional: {
      title: "Profil professionnel",
      /** «Editar» de la tarjeta, para el lector de pantalla. */
      edit: "Modifier le profil professionnel",
      years: "Années d'expérience",
      description: "Courte présentation",
      specialties: "Spécialités",
      /** Los botones − y + de los años, para el lector de pantalla. */
      fewerYears: "Une année de moins",
      moreYears: "Une année de plus",
      empty: "Tu ne l'as pas encore rempli",
    },
    clubs: {
      title: "Clubs où tu travailles",
      empty: "Tu ne travailles encore dans aucun club",
    },
    availability: {
      title: "Disponibilité",
      /** «Editar» de la tarjeta, para el lector de pantalla. */
      edit: "Modifier la disponibilité",
      /** El editor: la sede, las franjas, los días y la semana resultante. */
      club: "Site",
      bandsTitle: "Créneau",
      daysTitle: "Jours de la semaine",
      weekTitle: "Ta semaine",
      /** Las dos formas de configurar la semana. */
      modes: {
        bands: "Par créneau",
        day: "Par jour",
      },
      pickDay: "Choisis un jour",
      /** Las horas del día que se edita en «Por día». */
      dayHours: "Heures du %{day}",
      bands: {
        morning: "Matin",
        afternoon: "Après-midi",
        evening: "Soir",
        allDay: "Toute la journée",
      },
      /** Cada día por su número de Core, para el lector de pantalla (el chip solo dice «L»). */
      weekdays: {
        "0": "Dimanche",
        "1": "Lundi",
        "2": "Mardi",
        "3": "Mercredi",
        "4": "Jeudi",
        "5": "Vendredi",
        "6": "Samedi",
      },
      /** Una sede sin ninguna hora indicada. */
      empty: "Tu n'as pas encore indiqué ta disponibilité",
      /** «3 días · 14 h semanales». */
      summary: "%{days} · %{hours} h par semaine",
      days: {
        one: "1 jour",
        other: "%{count} jours",
      },
      /** Un día con sus tramos: «Lun 16:00–19:00». */
      day: "%{day} %{ranges}",
      /** Entre dos tramos del mismo día: «09:00–11:00 y 17:00–19:00». */
      rangeSeparator: " et ",
    },
    signOutConfirm: "Veux-tu te déconnecter ?",
    /** La baja de la cuenta: su botón, su panel, la confirmación y el aviso final. */
    deleteAccount: {
      title: "Supprimer le compte",
      warning: "Tu quitteras tes clubs et tes cours qui n'ont pas encore commencé resteront sans entraîneur. Tes données personnelles seront supprimées au bout de quelques jours ; d'ici là, tu peux récupérer ton compte en écrivant au support.",
      reason: "Pourquoi pars-tu ?",
      confirm: "Supprimer ton compte ?",
      confirmMessage: "Ta session sera fermée et tu quitteras tes clubs.",
      done: "Compte supprimé",
      /** Con los días que da Core (`anonymize_after_days`). */
      doneMessage: {
        one: "Tes données personnelles seront supprimées dans 1 jour ; d'ici là, tu peux récupérer ton compte en écrivant au support.",
        other: "Tes données personnelles seront supprimées dans %{count} jours ; d'ici là, tu peux récupérer ton compte en écrivant au support.",
      },
    },
  },
  /** Los avisos de actualizar la app (version-check). */
  appUpdate: {
    force: {
      title: "Mets à jour Playtopia Pro",
      message: "Cette version ne fonctionne plus. Installe la nouvelle pour continuer à utiliser l'app.",
      action: "Mettre à jour maintenant",
    },
    soft: {
      title: "Une nouvelle version est disponible",
      message: "Mets à jour pour profiter des nouveautés de Playtopia Pro.",
      action: "Mettre à jour",
    },
    /** Sin URL de la tienda: dónde actualizarla. */
    noStore: "Mets-la à jour depuis l'App Store ou Google Play.",
  },
  splash: {
    tagline: "Votre univers sportif",
  },
};

export default fr;
