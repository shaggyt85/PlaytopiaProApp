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
    signOut: "Sign Out",
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
      emailLabel: "Email",
      emailPlaceholder: "your@email.com",
      continue: "Continue",
      register: "Sign Up",
      notFound: "Email not found. Please check your email or sign up",
    },
    password: {
      label: "Password",
      placeholder: "••••••••",
      submit: "Continue",
      forgot: "Forgot your password?",
      invalidCredentials: "Incorrect email or password.",
      studentHint: "If you're also a student, use your coach account password.",
      show: "Show password",
      hide: "Hide password",
    },
    legal: {
      text: "By signing up you accept our",
      terms: "terms of use",
      and: "and",
      privacy: "privacy policy",
    },
    comingSoon: "Coming very soon.",
  },
  // Textos legales (los mismos que la app de alumnos hasta tener los del profesor).
  legalDocs: {
    terms: {
      title: "Terms and Conditions",
      summary: "By using our application, you agree to our terms of service and privacy policy. This includes data collection for personalized experiences, user conduct guidelines, intellectual property protection, and limitation of liability. Our services are provided 'as is' with best effort support. We reserve the right to modify these terms with notice. Your continued use indicates acceptance of any changes. For complete details and legal obligations, please review the full document.",
    },
    privacy: {
      title: "Privacy Policy",
      summary: "Playtopia SL processes your personal data in accordance with GDPR for sports activity management, communications, and payments. We collect identification, contact, academic, and payment data (tokenized via Stripe). Optional camera access for profile photos. Legal basis: consent, contract execution, and legitimate interest. We share with authorized providers (Stripe, CRM). You have rights to access, rectification, deletion, and portability. Minor data requires parental consent. We implement adequate security measures.",
    },
    viewFullDocument: "View Full Document",
    openFailed: "Failed to open the document. Please try again.",
  },
  validation: {
    emailRequired: "Enter your email.",
    emailInvalid: "Enter a valid email address",
    passwordRequired: "Enter your password.",
  },
  splash: {
    tagline: "Your sports universe",
  },
};

export default en;
