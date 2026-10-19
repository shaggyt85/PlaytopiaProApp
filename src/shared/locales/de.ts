import type { Translations } from "./es";

const de: Translations = {
  common: {
    /** Rechazar una oferta para luego: la biometría, la versión nueva. */
    notNow: "Jetzt nicht",
    /** Un enlace externo que el sistema no pudo abrir (`openExternalUrl`). */
    openFailed: "Fehler beim Öffnen des Links. Versuchen Sie es erneut.",
    /** Un tiempo exacto: «5:50 h» (`courtTimeLabel`). */
    /** De qué hora a qué hora: «08:30–09:30», «16:00–19:00». */
    timeRange: "%{start}–%{end}",
    courtTime: "%{hours}:%{minutes} h",
    /** Lo hecho de lo planificado: «9:00 / 12:00 h» (`courtTimeProgressLabel`). */
    courtTimeProgress: "%{doneHours}:%{doneMinutes} / %{plannedHours}:%{plannedMinutes} h",
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
      "email-already-registered": "Diese E-Mail gehört bereits zu einem anderen Konto.",
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
    },
    /** El selector de vistas (DÍA · SEMANA · MES). */
    views: {
      day: "Tag",
      week: "Woche",
      month: "Monat",
    },
    /** El título encima de la navegación de la agenda («MI AGENDA»). */
    mySchedule: "Mein Kalender",
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
      /** La sección de la última clase del grupo, su asistencia y cuántos alumnos tenía. */
      lastClass: "Letzte Stunde dieser Gruppe",
      lastClassAttendance: "Anwesenheit %{present}/%{total}",
      studentCount: {
        one: "%{count} Schüler",
        other: "%{count} Schüler",
      },
      /** El panel con la lista de esa clase. */
      lastClassSheet: "Letzte Stunde",
      lastClassHint: "Öffnet die Liste dieser Stunde",
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
  /** «Mis grupos»: los grupos del profesor (la pestaña «Grupos»). */
  groups: {
    title: "Meine Gruppen",
    active: {
      one: "%{count} aktive Gruppe",
      other: "%{count} aktive Gruppen",
    },
    /** Sin ningún grupo con clases por delante. */
    empty: "Du hast noch keine Gruppen oder Stunden",
    /** El detalle de un grupo. */
    detail: {
      /** Bajo la cabecera: los del grupo, sin los que vienen a recuperar. */
      members: {
        one: "%{count} Schüler angemeldet",
        other: "%{count} Schüler angemeldet",
      },
      students: "Schüler der Gruppe",
      openStudentHint: "Öffnet sein Profil",
      nextClass: "Nächste Stunde",
      /** En la próxima clase: los del grupo apuntados y todos los que se esperan. */
      enrolled: {
        one: "%{count} angemeldet",
        other: "%{count} angemeldet",
      },
      expected: {
        one: "%{count} Schüler erwartet",
        other: "%{count} Schüler erwartet",
      },
      notFound: "Gruppe nicht gefunden",
    },
    student: {
      notFound: "Schüler nicht gefunden",
      level: "Niveau",
      group: "Seine Gruppe",
      openGroup: "Zurück zur Gruppe",
      groupRange: "Niveau der Gruppe",
      attendance: "Anwesenheit",
      lastClasses: {
        one: "Letzte Stunde",
        other: "Letzte %{count} Stunden",
      },
      classes: {
        one: "Stunde",
        other: "Stunden",
      },
      attendanceA11y: {
        one: "Bei %{present} von %{count} Stunde da",
        other: "Bei %{present} von %{count} Stunden da",
      },
      alert: {
        consecutiveAbsences: {
          one: "%{count} Fehlstunde in Folge",
          other: "%{count} Fehlstunden in Folge",
        },
        absencesInLast: {
          one: "%{count} Fehlstunde in den letzten %{of} Stunden",
          other: "%{count} Fehlstunden in den letzten %{of} Stunden",
        },
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
    /** El motivo de la baja de la cuenta. */
    reasonMin: "Erzähl uns etwas mehr: mindestens 10 Zeichen",
    reasonMax: "Der Grund darf höchstens 1000 Zeichen lang sein",
    descriptionMax: "Die Vorstellung darf höchstens 500 Zeichen lang sein",
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
  /** Los campos de los datos personales: el alta y el editor de Perfil. */
  personalData: {
    firstNameLabel: "Vorname",
    firstNamePlaceholder: "Ihr Vorname",
    lastNameLabel: "Nachname",
    lastNamePlaceholder: "Ihr Nachname",
    birthdayLabel: "Geburtsdatum",
  },
  profile: {
    title: "Mein Profil",
    /** «Editar ›» a la derecha del título de una tarjeta. */
    edit: "Bearbeiten",
    /** La foto del profesor: tocarla la cambia. */
    avatar: {
      change: "Foto ändern",
      takePhoto: "Foto aufnehmen",
      chooseFromLibrary: "Aus der Mediathek wählen",
      cameraDenied: "Kein Kamerazugriff",
      cameraDeniedMessage: "Erlaube den Kamerazugriff in den Einstellungen, um dein Foto aufzunehmen.",
      openSettings: "Einstellungen öffnen",
    },
    role: "Trainer",
    roleWithExperience: {
      zero: "Trainer · weniger als ein Jahr Erfahrung",
      one: "Trainer · 1 Jahr Erfahrung",
      other: "Trainer · %{count} Jahre Erfahrung",
    },
    hours: {
      title: "Stunden diesen Monat",
      classes: {
        one: "%{done} von 1 Kurs auf dem Platz",
        other: "%{done} von %{count} Kurse auf dem Platz",
      },
      history: "Stundenverlauf",
      monthClasses: {
        one: "%{done} von 1 Kurs",
        other: "%{done} von %{count} Kurse",
      },
      monthA11y: "%{month}, %{hours}",
    },
    personal: {
      title: "Persönliche Daten",
      /** «Editar» de la tarjeta, para el lector de pantalla. */
      edit: "Persönliche Daten bearbeiten",
    },
    professional: {
      title: "Berufsprofil",
      /** «Editar» de la tarjeta, para el lector de pantalla. */
      edit: "Berufsprofil bearbeiten",
      years: "Jahre Erfahrung",
      description: "Kurze Vorstellung",
      specialties: "Spezialisierungen",
      /** Los botones − y + de los años, para el lector de pantalla. */
      fewerYears: "Ein Jahr weniger",
      moreYears: "Ein Jahr mehr",
      empty: "Du hast es noch nicht ausgefüllt",
    },
    clubs: {
      title: "Clubs, in denen du arbeitest",
      empty: "Du arbeitest noch in keinem Club",
    },
    availability: {
      title: "Verfügbarkeit",
      /** «Editar» de la tarjeta, para el lector de pantalla. */
      edit: "Verfügbarkeit bearbeiten",
      /** El editor: la sede, las franjas, los días y la semana resultante. */
      club: "Standort",
      bandsTitle: "Tageszeit",
      daysTitle: "Wochentage",
      weekTitle: "Deine Woche",
      /** Las dos formas de configurar la semana. */
      modes: {
        bands: "Nach Tageszeit",
        day: "Nach Tag",
      },
      pickDay: "Wähle einen Tag",
      /** Las horas del día que se edita en «Por día». */
      dayHours: "Stunden am %{day}",
      bands: {
        morning: "Morgen",
        afternoon: "Nachmittag",
        evening: "Abend",
        allDay: "Ganztägig",
      },
      /** Cada día por su número de Core, para el lector de pantalla (el chip solo dice «L»). */
      weekdays: {
        "0": "Sonntag",
        "1": "Montag",
        "2": "Dienstag",
        "3": "Mittwoch",
        "4": "Donnerstag",
        "5": "Freitag",
        "6": "Samstag",
      },
      /** Una sede sin ninguna hora indicada. */
      empty: "Du hast deine Verfügbarkeit noch nicht angegeben",
      /** «3 días · 14 h semanales». */
      summary: "%{days} · %{hours} Std. pro Woche",
      days: {
        one: "1 Tag",
        other: "%{count} Tage",
      },
      /** Un día con sus tramos: «Lun 16:00–19:00». */
      day: "%{day} %{ranges}",
      /** Entre dos tramos del mismo día: «09:00–11:00 y 17:00–19:00». */
      rangeSeparator: " und ",
    },
    signOutConfirm: "Möchtest du dich abmelden?",
    /** La baja de la cuenta: su botón, su panel, la confirmación y el aviso final. */
    deleteAccount: {
      title: "Konto löschen",
      warning: "Du verlässt deine Clubs, und deine noch nicht begonnenen Stunden haben dann keinen Trainer mehr. Deine persönlichen Daten werden nach einigen Tagen gelöscht; bis dahin kannst du dein Konto über den Support wiederherstellen.",
      reason: "Warum gehst du?",
      confirm: "Dein Konto löschen?",
      confirmMessage: "Du wirst abgemeldet und verlässt deine Clubs.",
      done: "Konto gelöscht",
      /** Con los días que da Core (`anonymize_after_days`). */
      doneMessage: {
        one: "Deine persönlichen Daten werden in 1 Tag gelöscht; bis dahin kannst du dein Konto über den Support wiederherstellen.",
        other: "Deine persönlichen Daten werden in %{count} Tagen gelöscht; bis dahin kannst du dein Konto über den Support wiederherstellen.",
      },
    },
  },
  /** Los avisos de actualizar la app (version-check). */
  appUpdate: {
    force: {
      title: "Aktualisiere Playtopia Pro",
      message: "Diese Version funktioniert nicht mehr. Installiere die neue, um die App weiter zu nutzen.",
      action: "Jetzt aktualisieren",
    },
    soft: {
      title: "Eine neue Version ist da",
      message: "Aktualisiere, um das Neueste von Playtopia Pro zu bekommen.",
      action: "Aktualisieren",
    },
    /** Sin URL de la tienda: dónde actualizarla. */
    noStore: "Aktualisiere sie im App Store oder bei Google Play.",
  },
  splash: {
    tagline: "Ihr Sport-Universum",
    /** La tarjeta del splash mientras baja una actualización por OTA. */
    ota: {
      title: "Playtopia Pro wird aktualisiert",
      subtitle: "Sobald es fertig ist, geht es los",
      percent: "{{percent}} %",
    },
  },
};

export default de;
