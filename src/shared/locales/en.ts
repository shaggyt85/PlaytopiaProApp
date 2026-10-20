import type { Translations } from "./es";

const en: Translations = {
  common: {
    /** Rechazar una oferta para luego: la biometría, la versión nueva. */
    notNow: "Not now",
    /** Un enlace externo que el sistema no pudo abrir (`openExternalUrl`). */
    openFailed: "Failed to open the link. Please try again.",
    /** Un tiempo exacto: «5:50 h» (`courtTimeLabel`). */
    /** De qué hora a qué hora: «08:30–09:30», «16:00–19:00». */
    timeRange: "%{start}–%{end}",
    courtTime: "%{hours}:%{minutes} h",
    /** Lo hecho de lo planificado: «9:00 / 12:00 h» (`courtTimeProgressLabel`). */
    courtTimeProgress: "%{doneHours}:%{doneMinutes} / %{plannedHours}:%{plannedMinutes} h",
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
    contract: "We couldn't read the response. Update the app or try again later.",
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
      "not-class-teacher": "Another coach teaches this class.",
      "class-not-found": "This class no longer exists.",
      "student-not-in-class": "This student is no longer in the class.",
      "attendance-not-open": "Attendance can be taken once the class starts.",
      "attendance-closed": "The time to take attendance for this class is over.",
      "email-already-registered": "That email already belongs to another account.",
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
    },
    /** El selector de vistas (DÍA · SEMANA · MES). */
    views: {
      day: "Day",
      week: "Week",
      month: "Month",
    },
    /** El título encima de la navegación de la agenda («MI AGENDA»). */
    mySchedule: "My schedule",
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
      /** Una cifra del día encima de la agenda para el lector de pantalla: «clases hoy: 3». */
      stat: "%{label}: %{value}",
      students: "Students & attendance",
      noStudents: "No students signed up yet",
      /** A la derecha de «Alumnos y asistencia»: cuántos han venido. */
      presentCount: "%{present}/%{total} present",
      /** Lo mismo cuando ya tienen marca todos. */
      attendanceDone: "Attendance recorded · %{present}/%{total}",
      /** La etiqueta de quien está en la clase por una plaza de recuperación. */
      recovery: "Make-up",
      markPresent: "Mark %{name} as present",
      markAbsent: "Mark %{name} as absent",
      /** La sección de la última clase del grupo, su asistencia y cuántos alumnos tenía. */
      lastClass: "Last class of this group",
      lastClassAttendance: "Attendance %{present}/%{total}",
      studentCount: {
        one: "%{count} student",
        other: "%{count} students",
      },
      /** El panel con la lista de esa clase. */
      lastClassSheet: "Last class",
      lastClassHint: "Opens the list of that class",
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
      /** La marca de una clase que ya terminó, en la vista Día. */
      done: "Completed",
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
  /** «Mis grupos»: los grupos del profesor (la pestaña «Grupos»). */
  groups: {
    title: "My groups",
    active: {
      one: "%{count} active group",
      other: "%{count} active groups",
    },
    /** Sin ningún grupo con clases por delante. */
    empty: "You don't have any groups or classes yet",
    /** El detalle de un grupo. */
    detail: {
      /** Bajo la cabecera: los del grupo, sin los que vienen a recuperar. */
      members: {
        one: "%{count} student enrolled",
        other: "%{count} students enrolled",
      },
      students: "Group students",
      openStudentHint: "Opens their profile",
      nextClass: "Next class",
      /** En la próxima clase: los del grupo apuntados y todos los que se esperan. */
      enrolled: {
        one: "%{count} enrolled",
        other: "%{count} enrolled",
      },
      expected: {
        one: "%{count} student expected",
        other: "%{count} students expected",
      },
      notFound: "Group not found",
    },
    student: {
      notFound: "Student not found",
      level: "Level",
      group: "Their group",
      openGroup: "Goes back to the group",
      groupRange: "Group range",
      attendance: "Attendance",
      lastClasses: {
        one: "Last class",
        other: "Last %{count} classes",
      },
      classes: {
        one: "class",
        other: "classes",
      },
      attendanceA11y: {
        one: "Attended %{present} of %{count} class",
        other: "Attended %{present} of %{count} classes",
      },
      alert: {
        consecutiveAbsences: {
          one: "%{count} absence in a row",
          other: "%{count} absences in a row",
        },
        absencesInLast: {
          one: "%{count} absence in the last %{of} classes",
          other: "%{count} absences in the last %{of} classes",
        },
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
    /** El motivo de la baja de la cuenta. */
    reasonMin: "Tell us a bit more: at least 10 characters",
    reasonMax: "The reason can't be longer than 1000 characters",
    descriptionMax: "The introduction can't be longer than 500 characters",
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
  /** Los campos de los datos personales: el alta y el editor de Perfil. */
  personalData: {
    firstNameLabel: "First Name",
    firstNamePlaceholder: "Your first name",
    lastNameLabel: "Last Name",
    lastNamePlaceholder: "Your last name",
    birthdayLabel: "Date of birth",
  },
  profile: {
    title: "My profile",
    /** «Editar ›» a la derecha del título de una tarjeta. */
    edit: "Edit",
    /** La foto del profesor: tocarla la cambia. */
    avatar: {
      change: "Change photo",
      takePhoto: "Take a photo",
      chooseFromLibrary: "Choose from library",
      cameraDenied: "No camera access",
      cameraDeniedMessage: "Allow camera access in Settings to take your photo.",
      openSettings: "Open Settings",
    },
    role: "Coach",
    roleWithExperience: {
      zero: "Coach · less than a year of experience",
      one: "Coach · 1 year of experience",
      other: "Coach · %{count} years of experience",
    },
    hours: {
      title: "Hours this month",
      classes: {
        one: "%{done} of 1 class on court",
        other: "%{done} of %{count} classes on court",
      },
      history: "Hours history",
      monthClasses: {
        one: "%{done} of 1 class",
        other: "%{done} of %{count} classes",
      },
      monthA11y: "%{month}, %{hours}",
    },
    personal: {
      title: "Personal details",
      /** «Editar» de la tarjeta, para el lector de pantalla. */
      edit: "Edit personal details",
    },
    professional: {
      title: "Professional profile",
      /** «Editar» de la tarjeta, para el lector de pantalla. */
      edit: "Edit professional profile",
      years: "Years of experience",
      description: "Short introduction",
      specialties: "Specialties",
      /** Los botones − y + de los años, para el lector de pantalla. */
      fewerYears: "One year less",
      moreYears: "One year more",
      empty: "You haven't filled it in yet",
    },
    clubs: {
      title: "Clubs where you work",
      empty: "You don't work at any club yet",
    },
    availability: {
      title: "Availability",
      /** «Editar» de la tarjeta, para el lector de pantalla. */
      edit: "Edit availability",
      /** El editor: la sede, las franjas, los días y la semana resultante. */
      club: "Club",
      bandsTitle: "Time of day",
      daysTitle: "Days of the week",
      weekTitle: "Your week",
      /** Las dos formas de configurar la semana. */
      modes: {
        bands: "By time of day",
        day: "By day",
      },
      pickDay: "Pick a day",
      /** Las horas del día que se edita en «Por día». */
      dayHours: "%{day} hours",
      bands: {
        morning: "Morning",
        afternoon: "Afternoon",
        evening: "Evening",
        allDay: "All day",
      },
      /** Cada día por su número de Core, para el lector de pantalla (el chip solo dice «L»). */
      weekdays: {
        "0": "Sunday",
        "1": "Monday",
        "2": "Tuesday",
        "3": "Wednesday",
        "4": "Thursday",
        "5": "Friday",
        "6": "Saturday",
      },
      /** Una sede sin ninguna hora indicada. */
      empty: "You haven't set your availability yet",
      /** «3 días · 14 h semanales». */
      summary: "%{days} · %{hours} h a week",
      days: {
        one: "1 day",
        other: "%{count} days",
      },
      /** Un día con sus tramos: «Lun 16:00–19:00». */
      day: "%{day} %{ranges}",
      /** Entre dos tramos del mismo día: «09:00–11:00 y 17:00–19:00». */
      rangeSeparator: " and ",
    },
    signOutConfirm: "Do you want to sign out?",
    /** La baja de la cuenta: su botón, su panel, la confirmación y el aviso final. */
    deleteAccount: {
      title: "Delete account",
      warning: "You'll leave your clubs, and your classes that haven't started yet will be left without a coach. Your personal data will be deleted after a few days; until then you can recover your account by writing to support.",
      reason: "Why are you leaving?",
      confirm: "Delete your account?",
      confirmMessage: "You'll be signed out and leave your clubs.",
      done: "Account deleted",
      /** Con los días que da Core (`anonymize_after_days`). */
      doneMessage: {
        one: "Your personal data will be deleted in 1 day; until then you can recover your account by writing to support.",
        other: "Your personal data will be deleted in %{count} days; until then you can recover your account by writing to support.",
      },
    },
  },
  /** Los avisos de actualizar la app (version-check). */
  appUpdate: {
    force: {
      title: "Update Playtopia Pro",
      message: "This version no longer works. Install the new one to keep using the app.",
      action: "Update now",
    },
    soft: {
      title: "A new version is available",
      message: "Update to get the latest of Playtopia Pro.",
      action: "Update",
    },
    /** Sin URL de la tienda: dónde actualizarla. */
    noStore: "Update it from the App Store or Google Play.",
  },
  splash: {
    tagline: "Your sports universe",
    /** La tarjeta del splash mientras baja una actualización por OTA. */
    ota: {
      title: "Updating Playtopia Pro",
      subtitle: "You will be in as soon as it finishes",
      percent: "{{percent}}%",
    },
  },
};

export default en;
