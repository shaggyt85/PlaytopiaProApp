import type { Translations } from "./es";

const de: Translations = {
  common: {
    accept: "OK",
    cancel: "Abbrechen",
    retry: "Erneut versuchen",
    save: "Speichern",
    close: "Schließen",
    back: "Zurück",
    loading: "Wird geladen…",
    signOut: "Abmelden",
    comingSoon: "Demnächst",
  },
  tabs: {
    today: "Heute",
    calendar: "Termine",
    groups: "Gruppen",
    network: "Netzwerk",
    profile: "Profil",
  },
  errors: {
    network: "Keine Verbindung. Prüfen Sie Ihr Netzwerk und versuchen Sie es erneut.",
    timeout: "Die Verbindung hat zu lange gedauert. Bitte versuchen Sie es erneut.",
    unknown: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
    byStatus: {
      "400": "Die gesendeten Daten sind ungültig.",
      "401": "Wir konnten Ihren Zugang nicht bestätigen. Prüfen Sie Ihre Daten oder melden Sie sich erneut an.",
      "403": "Sie haben keine Berechtigung dafür.",
      "404": "Wir konnten nicht finden, wonach Sie suchen.",
      "409": "Diese Aktion steht im Konflikt mit vorhandenen Daten.",
      "422": "Mit diesen Daten konnte der Vorgang nicht abgeschlossen werden.",
      "429": "Zu viele Versuche. Bitte warten Sie einen Moment.",
      "500": "Serverfehler. Bitte versuchen Sie es später erneut.",
    },
    byType: {
      "request-timeout": "Der Server hat zu lange gebraucht. Bitte versuchen Sie es erneut.",
      "server-overloaded": "Der Server ist ausgelastet. Bitte versuchen Sie es in ein paar Minuten erneut.",
      "internal-error": "Serverfehler. Bitte versuchen Sie es später erneut.",
      "date-range-inverted": "Das Startdatum darf nicht nach dem Enddatum liegen.",
      "date-range-too-long": "Der Datumsbereich ist zu lang.",
      "not-class-teacher": "Diese Stunde gibt ein anderer Trainer.",
      "class-not-found": "Diese Stunde gibt es nicht mehr.",
      "student-not-in-class": "Dieser Schüler ist nicht mehr in der Stunde.",
      "attendance-not-open": "Die Anwesenheit wird erfasst, sobald die Stunde beginnt.",
      "attendance-closed": "Die Frist für die Anwesenheit dieser Stunde ist abgelaufen.",
    },
  },
  auth: {
    signIn: {
      emailLabel: "E-Mail-Adresse",
      emailPlaceholder: "ihre@email.com",
      continue: "Weiter",
      register: "Registrieren",
      noStudents: "Noch keine Schüler angemeldet",
      notFound: "E-Mail nicht gefunden. Überprüfen Sie Ihre E-Mail oder registrieren Sie sich",
    },
    password: {
      label: "Passwort",
      placeholder: "••••••••",
      submit: "Weiter",
      forgot: "Passwort vergessen?",
      invalidCredentials: "E-Mail oder Passwort falsch.",
      studentHint: "Wenn Sie auch Schüler sind, verwenden Sie das Passwort Ihres Trainerkontos.",
      show: "Passwort anzeigen",
      hide: "Passwort verbergen",
    },
    signUp: {
      title: "Registrieren Sie sich!",
      firstNameLabel: "Vorname",
      firstNamePlaceholder: "Ihr Vorname",
      lastNameLabel: "Nachname",
      lastNamePlaceholder: "Ihr Nachname",
      birthdayLabel: "Geburtsdatum",
      confirmPasswordLabel: "Passwort wiederholen",
      submit: "Weiter",
      submitting: "Registrierung läuft...",
    },
    passwordRecovery: {
      title: "Passwort vergessen?",
      subtitle: "Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Wiederherstellungslink",
      submit: "Wiederherstellungs-E-Mail senden",
      sentTitle: "Wiederherstellungs-E-Mail erfolgreich gesendet!",
      sentMessage: "Bitte überprüfen Sie Ihre E-Mails für Anweisungen zum Zurücksetzen Ihres Passworts",
      backToLogin: "Zurück zur Anmeldung",
      setupTitle: "Erstellen Sie Ihr Passwort",
      setupSubtitle: "Ihr Club hat Sie registriert. Wir senden Ihnen eine E-Mail, damit Sie Ihr Passwort erstellen können.",
      setupSentMessage: "Prüfen Sie Ihre E-Mails und folgen Sie dem Link, um Ihr Passwort zu erstellen. Kommen Sie danach hierher zurück, um sich anzumelden.",
    },
    biometric: {
      signIn: "Mit Biometrie anmelden",
      prompt: "Bestätigen Sie Ihre Identität, um sich bei Playtopia Pro anzumelden",
      failed: "Ihre Identität konnte nicht bestätigt werden. Bitte versuchen Sie es erneut.",
      expired: "Ihre biometrische Anmeldung ist abgelaufen. Melden Sie sich mit Ihrem Passwort an, um sie wieder zu aktivieren.",
      tooManyAttempts: "Zu viele Versuche. Melden Sie sich mit Ihrem Passwort an.",
      offer: {
        title: "Biometrische Anmeldung aktivieren",
        subtitle: "Melden Sie sich schneller und sicherer mit der Biometrie Ihres Handys an",
        instant: "Sofortiger Zugang",
        security: "Maximale Sicherheit",
        encrypted: "Verschlüsselte Daten",
        enable: "Biometrie aktivieren",
        enabling: "Wird aktiviert…",
        notNow: "Jetzt nicht",
        prompt: "Bestätigen Sie Ihre Identität, um die Biometrie zu aktivieren",
        enabledTitle: "Biometrie aktiviert",
        enabledMessage: "Beim nächsten Mal können Sie sich mit Ihrer Biometrie anmelden.",
        failedTitle: "Aktivierung fehlgeschlagen",
        failedMessage: "Ihre Identität konnte nicht bestätigt werden. Bitte versuchen Sie es erneut.",
        unavailableTitle: "Biometrie nicht verfügbar",
        unavailableMessage: "Richten Sie auf Ihrem Handy Biometrie oder eine Displaysperre ein und versuchen Sie es erneut.",
        expiredTitle: "Zeit abgelaufen",
        expiredMessage: "Melden Sie sich erneut mit Ihrem Passwort an, um die Biometrie zu aktivieren.",
      },
    },
    legal: {
      text: "Mit der Registrierung akzeptieren Sie unsere",
      terms: "Nutzungsbedingungen",
      and: "und",
      privacy: "Datenschutzrichtlinien",
    },
  },
  // Textos legales (los mismos que la app de alumnos hasta tener los del profesor).
  legalDocs: {
    terms: {
      title: "Allgemeine Geschäftsbedingungen",
      summary: "Durch die Nutzung unserer Anwendung akzeptieren Sie unsere Nutzungsbedingungen und Datenschutzrichtlinien. Dies umfasst die Datenerfassung für personalisierte Erlebnisse, Richtlinien für Benutzerverhalten, Schutz des geistigen Eigentums und Haftungsbeschränkung. Unsere Dienste werden 'wie besehen' mit bestmöglicher Unterstützung bereitgestellt. Wir behalten uns das Recht vor, diese Bedingungen mit vorheriger Ankündigung zu ändern. Ihre fortgesetzte Nutzung zeigt die Akzeptanz aller Änderungen an. Für vollständige Details und rechtliche Verpflichtungen lesen Sie bitte das vollständige Dokument.",
    },
    privacy: {
      title: "Datenschutzrichtlinie",
      summary: "Playtopia SL verarbeitet Ihre personenbezogenen Daten gemäß DSGVO für die Verwaltung von Sportaktivitäten, Kommunikation und Zahlungen. Wir erfassen Identifikations-, Kontakt-, akademische und Zahlungsdaten (tokenisiert über Stripe). Wir verwenden optional die Kamera für Profilfotos. Rechtsgrundlage: Einwilligung, Vertragserfüllung und berechtigtes Interesse. Wir teilen mit autorisierten Anbietern (Stripe, CRM). Sie haben das Recht auf Zugang, Berichtigung, Löschung und Datenübertragbarkeit. Daten von Minderjährigen erfordern elterliche Einwilligung. Wir implementieren angemessene Sicherheitsmaßnahmen.",
    },
    viewFullDocument: "Vollständiges Dokument anzeigen",
    openFailed: "Fehler beim Öffnen des Dokuments. Versuchen Sie es erneut.",
  },
  schedule: {
    greeting: {
      morning: "Guten Morgen, Trainer",
      afternoon: "Guten Tag, Trainer",
      evening: "Guten Abend, Trainer",
    },
    notifications: "Benachrichtigungen",
    /** El avatar de la cabecera, que lleva a Perfil (lo lee el lector de pantalla). */
    myProfile: "Mein Profil",
    /** Las cifras del día encima de la agenda (clases, alumnos y tiempo en pista). */
    today: {
      classes: "Kurse heute",
      students: "Schüler heute",
      court: "auf dem Platz heute",
      /** El tiempo en pista exacto: «5:50 h». */
      courtTime: "%{hours}:%{minutes} h",
    },
    /** El selector de vistas (DÍA · SEMANA · MES). */
    views: {
      day: "Tag",
      week: "Woche",
      month: "Monat",
    },
    /** El título encima de la navegación de la agenda («MI AGENDA»). */
    myAgenda: "Mein Kalender",
    /** El centro de la barra: «Hoy» en la vista Día y, al tocarlo, volver a hoy. */
    toolbar: {
      today: "Heute",
      goToday: "Zurück zu heute",
    },
    week: {
      /** Los extremos de la semana en la barra: «18 nov – 24 nov». */
      range: "%{from} – %{to}",
      previous: "Vorherige Woche",
      next: "Nächste Woche",
      /** La pastilla de la tarjeta de hoy. */
      todayNow: "Heute · %{time}",
      filteredBy: "Gefiltert nach %{day}",
      showAll: "Ganze Woche anzeigen",
      /** La marca de la clase en curso («EN VIVO»). */
      live: "Live",
    },
    month: {
      previous: "Vorheriger Monat",
      next: "Nächster Monat",
    },
    /** La tarjeta de la próxima clase, encima de la agenda. */
    next: {
      /** La clase que se está dando. */
      live: "Läuft",
      /** La próxima, con cuándo empieza: «Próxima clase · en 45 min». */
      titleWhen: "Nächster Kurs · %{when}",
      inMinutes: "in %{count} Min.",
      todayAt: "heute %{time}",
      tomorrowAt: "morgen %{time}",
      /** «jue 18 · 18:00». */
      dayAt: "%{day} · %{time}",
      level: "Niveau %{range}",
      students: "%{taken}/%{max} Schüler",
      /** Cuántos vienen a recuperar. */
      recoveries: {
        one: "+%{count} Nachholstunde",
        other: "+%{count} Nachholstunden",
      },
      /** La marca sobre el círculo de quien recupera. */
      recoveryBadge: "N",
    },
    /** El detalle de una clase (se abre al tocarla en la agenda). */
    detail: {
      openHint: "Öffnet die Kursdetails",
      timeRange: "%{start}–%{end}",
      /** Una cifra del día encima de la agenda para el lector de pantalla: «clases hoy: 3». */
      stat: "%{label}: %{value}",
      students: "Schüler und Anwesenheit",
      noStudents: "Noch keine Schüler angemeldet",
      /** A la derecha de «Alumnos y asistencia»: cuántos han venido. */
      presentCount: "%{present}/%{total} anwesend",
      /** Lo mismo cuando ya tienen marca todos. */
      attendanceDone: "Anwesenheit erfasst · %{present}/%{total}",
      /** La etiqueta de quien está en la clase por una plaza de recuperación. */
      recovery: "Nachholstunde",
      markPresent: "%{name} als anwesend markieren",
      markAbsent: "%{name} als abwesend markieren",
      notFound: "Kurs nicht gefunden",
    },
    day: {
      today: "Heute · %{day}",
      previousDay: "Vorheriger Tag",
      nextDay: "Nächster Tag",
      free: "Freier Tag · keine Termine",
      classes: {
        one: "%{count} Kurs",
        other: "%{count} Kurse",
      },
      minutes: "%{count} Min.",
      next: "Nächster",
      /** La marca de una clase que ya terminó, en la vista Día. */
      done: "Abgeschlossen",
      a11y: {
        /** Un día en la tira de la semana y en el mes: «martes 19, 3 clases». */
        summary: "%{day}, %{classes}",
        duration: "%{count} Minuten",
        seats: "%{taken} von %{max} Plätzen",
        past: "beendet",
        live: "läuft gerade",
        next: "nächster Kurs",
      },
    },
  },
  network: {
    title: "Club-Netzwerk",
    tabs: {
      myClubs: "Meine Clubs",
      nearMe: "In meiner Nähe",
    },
    myClubs: {
      emptyTitle: "Du arbeitest noch in keinem Club",
      emptyMessage: "Unter „In meiner Nähe“ findest du Schulen, denen du beitreten kannst.",
    },
    nearMe: {
      emptyTitle: "Keine neuen Schulen",
      emptyMessage: "Im Moment gibt es keine weiteren Schulen zum Beitreten.",
    },
  },
  phone: {
    label: "Telefonnummer",
    placeholder: "Ihre Telefonnummer",
  },
  countryPicker: {
    title: "Land auswählen",
    searchPlaceholder: "Land oder Vorwahl suchen",
    empty: "Kein Land entspricht der Suche",
  },
  datePicker: {
    placeholder: "TT.MM.JJJJ",
  },
  gender: {
    label: "Geschlecht",
    male: "Männlich",
    female: "Weiblich",
    preferNotToSay: "Möchte es nicht sagen",
  },
  validation: {
    emailRequired: "Geben Sie Ihre E-Mail ein.",
    emailInvalid: "Die E-Mail-Adresse ist ungültig",
    passwordRequired: "Geben Sie Ihr Passwort ein.",
    firstNameMin: "Der Vorname muss mindestens 2 Zeichen lang sein",
    lastNameMin: "Der Nachname muss mindestens 2 Zeichen lang sein",
    phoneNumbersOnly: "Die Telefonnummer darf nur Zahlen enthalten",
    phoneMin: "Die Telefonnummer muss mindestens 9 Ziffern haben",
    phoneMax: "Die Telefonnummer darf nicht länger als 15 Ziffern sein",
    birthdayRequired: "Geben Sie Ihr Geburtsdatum an",
    passwordMin: "Das Passwort muss mindestens 8 Zeichen lang sein",
    passwordMax: "Das Passwort darf nicht länger als 50 Zeichen sein",
    passwordUppercase: "Das Passwort muss mindestens einen Großbuchstaben enthalten",
    passwordLowercase: "Das Passwort muss mindestens einen Kleinbuchstaben enthalten",
    passwordNumber: "Das Passwort muss mindestens eine Zahl enthalten",
    passwordSpecialChar: "Das Passwort muss mindestens ein Sonderzeichen enthalten",
    passwordNoSpaces: "Das Passwort darf keine Leerzeichen enthalten",
    confirmPasswordRequired: "Bestätigen Sie Ihr Passwort",
    passwordsDontMatch: "Die Passwörter stimmen nicht überein",
    acceptTerms: "Sie müssen die Allgemeinen Geschäftsbedingungen akzeptieren",
  },
  splash: {
    tagline: "Ihr Sport-Universum",
  },
};

export default de;
