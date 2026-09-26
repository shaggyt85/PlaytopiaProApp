import type { Translations } from "./es";

const en: Translations = {
  common: {
    accept: "OK",
    cancel: "Cancel",
    retry: "Retry",
    save: "Save",
    close: "Close",
    back: "Back",
    loading: "Loading…",
  },
  errors: {
    network: "No connection. Check your network and try again.",
    timeout: "The connection took too long. Please try again.",
    unknown: "Something went wrong. Please try again.",
    byStatus: {
      "400": "The data sent is not valid.",
      "401": "We couldn't verify your access. Check your details or sign in again.",
      "403": "You don't have permission to do this.",
      "404": "We couldn't find what you're looking for.",
      "409": "This action conflicts with existing data.",
      "422": "This couldn't be completed with this data.",
      "429": "Too many attempts. Please wait a moment.",
      "500": "Server error. Please try again later.",
    },
    byType: {
      "request-timeout": "The server took too long to respond. Please try again.",
      "server-overloaded": "The server is busy. Please try again in a few minutes.",
      "internal-error": "Server error. Please try again later.",
    },
  },
  auth: {
    signIn: {
      title: "Hi, coach",
      subtitle: "Enter your email to continue",
      emailLabel: "Email",
      emailPlaceholder: "you@email.com",
      continue: "Continue",
      notFound: "We couldn't find an account with this email.",
      createAccount: "Create a coach account",
    },
    password: {
      title: "Your password",
      subtitle: "Signing in as {{email}}",
      label: "Password",
      submit: "Sign in",
      forgot: "Forgot your password?",
      changeEmail: "Change email",
      invalidCredentials: "Incorrect email or password.",
      studentHint: "If you're also a student, use your coach account password.",
      noTeacherAccount: "Don't have a coach account yet?",
      register: "Sign up",
      show: "Show password",
      hide: "Hide password",
    },
    comingSoon: "Coming very soon.",
  },
  validation: {
    emailRequired: "Enter your email.",
    emailInvalid: "That email isn't valid.",
    passwordRequired: "Enter your password.",
  },
  splash: {
    tagline: "Your sports universe",
  },
};

export default en;
