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
    },
  },
  auth: {
    signIn: {
      emailLabel: "E-Mail-Adresse",
      emailPlaceholder: "ihre@email.com",
      continue: "Weiter",
      register: "Registrieren",
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
    legal: {
      text: "Mit der Registrierung akzeptieren Sie unsere",
      terms: "Nutzungsbedingungen",
      and: "und",
      privacy: "Datenschutzrichtlinien",
    },
    comingSoon: "Bald verfügbar.",
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
  },
  splash: {
    tagline: "Ihr Sport-Universum",
  },
};

export default de;
