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
    comingSoon: "Coming soon",
  },
  tabs: {
    today: "Today",
    calendar: "Schedule",
    groups: "Groups",
    network: "Network",
    profile: "Profile",
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
      "date-range-inverted": "The start date cannot be after the end date.",
      "date-range-too-long": "The date range is too long.",
    },
  },
  auth: {
    signIn: {
      emailLabel: "Email",
      emailPlaceholder: "your@email.com",
      continue: "Continue",
      register: "Sign Up",
      noStudents: "No students signed up yet",
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
    signUp: {
      title: "Sign Up!",
      firstNameLabel: "First Name",
      firstNamePlaceholder: "Your first name",
      lastNameLabel: "Last Name",
      lastNamePlaceholder: "Your last name",
      birthdayLabel: "Date of birth",
      confirmPasswordLabel: "Repeat your password",
      submit: "Continue",
      submitting: "Registering...",
    },
    passwordRecovery: {
      title: "Forgot your password?",
      subtitle: "Enter your email address and we'll send you a recovery link",
      submit: "Send Recovery Email",
      sentTitle: "Recovery email sent successfully!",
      sentMessage: "Please check your email for instructions to reset your password",
      backToLogin: "Back to Login",
      setupTitle: "Create your password",
      setupSubtitle: "Your club has signed you up. We'll send you an email so you can create your password.",
      setupSentMessage: "Check your email and follow the link to create your password. Then come back here to sign in.",
    },
    biometric: {
      signIn: "Sign in with biometrics",
      prompt: "Verify your identity to sign in to Playtopia Pro",
      failed: "We couldn't verify your identity. Please try again.",
      expired: "Your biometric sign-in has expired. Sign in with your password to turn it on again.",
      tooManyAttempts: "Too many attempts. Sign in with your password.",
      offer: {
        title: "Turn on biometric sign-in",
        subtitle: "Sign in faster and more securely with your phone's biometrics",
        instant: "Instant access",
        security: "Maximum security",
        encrypted: "Encrypted data",
        enable: "Turn on biometrics",
        enabling: "Turning on…",
        notNow: "Not now",
        prompt: "Verify your identity to turn on biometrics",
        enabledTitle: "Biometrics turned on",
        enabledMessage: "Next time you can sign in with your biometrics.",
        failedTitle: "Couldn't turn it on",
        failedMessage: "We couldn't verify your identity. Please try again.",
        unavailableTitle: "Biometrics not available",
        unavailableMessage: "Set up biometrics or a screen lock on your phone and try again.",
        expiredTitle: "Time's up",
        expiredMessage: "Sign in again with your password to turn on biometrics.",
      },
    },
    legal: {
      text: "By signing up you accept our",
      terms: "terms of use",
      and: "and",
      privacy: "privacy policy",
    },
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
  schedule: {
    greeting: {
      morning: "Good morning, coach",
      afternoon: "Good afternoon, coach",
      evening: "Good evening, coach",
    },
    notifications: "Notifications",
    /** El avatar de la cabecera, que lleva a Perfil (lo lee el lector de pantalla). */
    myProfile: "My profile",
    /** Las cifras del día encima de la agenda (clases, alumnos y tiempo en pista). */
    today: {
      classes: "classes today",
      students: "students today",
      court: "on court today",
      /** El tiempo en pista exacto: «5:50 h». */
      courtTime: "%{hours}:%{minutes} h",
    },
    /** El selector de vistas (DÍA · SEMANA · MES). */
    views: {
      day: "Day",
      week: "Week",
      month: "Month",
    },
    /** El título encima de la navegación de la agenda («MI AGENDA»). */
    myAgenda: "My schedule",
    /** El centro de la barra: «Hoy» en la vista Día y, al tocarlo, volver a hoy. */
    toolbar: {
      today: "Today",
      goToday: "Back to today",
    },
    week: {
      /** Los extremos de la semana en la barra: «18 nov – 24 nov». */
      range: "%{from} – %{to}",
      previous: "Previous week",
      next: "Next week",
      /** La pastilla de la tarjeta de hoy. */
      todayNow: "Today · %{time}",
      filteredBy: "Filtered by %{day}",
      showAll: "See the whole week",
      /** La marca de la clase en curso («EN VIVO»). */
      live: "Live",
    },
    month: {
      previous: "Previous month",
      next: "Next month",
    },
    /** La tarjeta de la próxima clase, encima de la agenda. */
    next: {
      /** La clase que se está dando. */
      live: "In progress",
      /** La próxima, con cuándo empieza: «Próxima clase · en 45 min». */
      titleWhen: "Next class · %{when}",
      inMinutes: "in %{count} min",
      todayAt: "today %{time}",
      tomorrowAt: "tomorrow %{time}",
      /** «jue 18 · 18:00». */
      dayAt: "%{day} · %{time}",
      level: "Level %{range}",
      students: "%{taken}/%{max} students",
      /** Cuántos vienen a recuperar. */
      recoveries: {
        one: "+%{count} make-up",
        other: "+%{count} make-ups",
      },
      /** La marca sobre el círculo de quien recupera. */
      recoveryBadge: "M",
    },
    /** El detalle de una clase (se abre al tocarla en la agenda). */
    detail: {
      openHint: "Opens the class details",
      timeRange: "%{start}–%{end}",
      /** Una cifra de la cabecera para el lector de pantalla: «Alumnos: 2/4». */
      stat: "%{label}: %{value}",
      /** El título de la sección del club. */
      club: "Club",
      /** La tarjeta del club para el lector de pantalla: «Club: Wave Padel Club, Pº de la Castellana 300». */
      clubA11y: "Club: %{details}",
      students: "Students",
      level: "Level",
      noStudents: "No students signed up yet",
      notFound: "Class not found",
    },
    day: {
      today: "Today · %{day}",
      previousDay: "Previous day",
      nextDay: "Next day",
      free: "Free day · no commitments",
      classes: {
        one: "%{count} class",
        other: "%{count} classes",
      },
      minutes: "%{count} min",
      next: "Next",
      a11y: {
        /** Un día en la tira de la semana y en el mes: «martes 19, 3 clases». */
        summary: "%{day}, %{classes}",
        duration: "%{count} minutes",
        seats: "%{taken} of %{max} spots",
        past: "finished",
        live: "in progress",
        next: "next class",
      },
    },
  },
  network: {
    title: "Club Network",
    tabs: {
      myClubs: "My clubs",
      nearMe: "Near me",
    },
    myClubs: {
      emptyTitle: "You don't work at any club yet",
      emptyMessage: "Check “Near me” for schools you can join.",
    },
    nearMe: {
      emptyTitle: "No new schools",
      emptyMessage: "There are no more schools to join for now.",
    },
  },
  phone: {
    label: "Phone Number",
    placeholder: "Your phone number",
  },
  countryPicker: {
    title: "Select your country",
    searchPlaceholder: "Search country or code",
    empty: "No country matches your search",
  },
  datePicker: {
    placeholder: "MM/DD/YYYY",
  },
  gender: {
    label: "Gender",
    male: "Male",
    female: "Female",
    preferNotToSay: "Prefer not to say it",
  },
  validation: {
    emailRequired: "Enter your email.",
    emailInvalid: "Enter a valid email address",
    passwordRequired: "Enter your password.",
    firstNameMin: "First name must be at least 2 characters",
    lastNameMin: "Last name must be at least 2 characters",
    phoneNumbersOnly: "Phone number must contain only numbers",
    phoneMin: "Phone number must be at least 9 digits",
    phoneMax: "Phone number cannot exceed 15 digits",
    birthdayRequired: "Enter your date of birth",
    passwordMin: "Password must be at least 8 characters",
    passwordMax: "Password cannot exceed 50 characters",
    passwordUppercase: "Password must contain at least one uppercase letter",
    passwordLowercase: "Password must contain at least one lowercase letter",
    passwordNumber: "Password must contain at least one number",
    passwordSpecialChar: "Password must contain at least one special character",
    passwordNoSpaces: "Password cannot contain spaces",
    confirmPasswordRequired: "Please confirm your password",
    passwordsDontMatch: "Passwords do not match",
    acceptTerms: "You must accept the terms and conditions",
  },
  splash: {
    tagline: "Your sports universe",
  },
};

export default en;
