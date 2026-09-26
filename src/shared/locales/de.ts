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
  splash: {
    tagline: "Ihr Sport-Universum",
  },
};

export default de;
