import type { Translations } from "./es";

const pt: Translations = {
  common: {
    accept: "Aceitar",
    cancel: "Cancelar",
    retry: "Tentar novamente",
    save: "Salvar",
    close: "Fechar",
    back: "Voltar",
    loading: "Carregando…",
    signOut: "Sair",
    comingSoon: "Em breve",
  },
  tabs: {
    today: "Hoje",
    calendar: "Agenda",
    groups: "Grupos",
    network: "Rede",
    profile: "Perfil",
  },
  errors: {
    network: "Sem conexão. Verifique sua rede e tente novamente.",
    timeout: "A conexão demorou demais. Tente novamente.",
    unknown: "Algo deu errado. Tente novamente.",
    byStatus: {
      "400": "Os dados enviados não são válidos.",
      "401": "Não conseguimos verificar seu acesso. Revise seus dados ou entre novamente.",
      "403": "Você não tem permissão para fazer isso.",
      "404": "Não encontramos o que você procura.",
      "409": "Esta ação entra em conflito com dados existentes.",
      "422": "Não foi possível concluir com esses dados.",
      "429": "Muitas tentativas. Aguarde um momento.",
      "500": "Erro no servidor. Tente mais tarde.",
    },
    byType: {
      "request-timeout": "O servidor demorou demais para responder. Tente novamente.",
      "server-overloaded": "O servidor está sobrecarregado. Tente em alguns minutos.",
      "internal-error": "Erro no servidor. Tente mais tarde.",
      "date-range-inverted": "A data de início não pode ser posterior à data de fim.",
      "date-range-too-long": "O intervalo de datas é longo demais.",
      "not-class-teacher": "Esta aula é dada por outro professor.",
      "class-not-found": "Esta aula não existe mais.",
      "student-not-in-class": "Este aluno não está mais na aula.",
      "attendance-not-open": "As presenças são marcadas quando a aula começa.",
      "attendance-closed": "Já passou o prazo para marcar as presenças desta aula.",
    },
  },
  auth: {
    signIn: {
      emailLabel: "E-mail",
      emailPlaceholder: "seu@email.com",
      continue: "Continuar",
      register: "Cadastrar-se",
      noStudents: "Ainda não há alunos inscritos",
      notFound: "E-mail não encontrado. Verifique seu e-mail ou cadastre-se",
    },
    password: {
      label: "Senha",
      placeholder: "••••••••",
      submit: "Continuar",
      forgot: "Esqueceu sua senha?",
      invalidCredentials: "Email ou senha incorretos.",
      studentHint: "Se você também é aluno, use a senha da sua conta de professor.",
      show: "Mostrar senha",
      hide: "Ocultar senha",
    },
    signUp: {
      title: "Cadastre-se!",
      firstNameLabel: "Nome",
      firstNamePlaceholder: "Seu nome",
      lastNameLabel: "Sobrenome",
      lastNamePlaceholder: "Seu sobrenome",
      birthdayLabel: "Data de nascimento",
      confirmPasswordLabel: "Repita sua senha",
      submit: "Continuar",
      submitting: "Registrando...",
    },
    passwordRecovery: {
      title: "Esqueceu sua senha?",
      subtitle: "Digite seu endereço de email e enviaremos um link de recuperação",
      submit: "Enviar Email de Recuperação",
      sentTitle: "Email de recuperação enviado com sucesso!",
      sentMessage: "Por favor, verifique seu email para obter instruções sobre como redefinir sua senha",
      backToLogin: "Voltar ao Login",
      setupTitle: "Crie sua senha",
      setupSubtitle: "Seu clube fez o seu cadastro. Enviaremos um email para você criar sua senha.",
      setupSentMessage: "Verifique seu email e siga o link para criar sua senha. Depois volte aqui para entrar.",
    },
    biometric: {
      signIn: "Entrar com biometria",
      prompt: "Verifique sua identidade para entrar no Playtopia Pro",
      failed: "Não foi possível verificar sua identidade. Tente novamente.",
      expired: "Seu acesso com biometria expirou. Entre com sua senha para ativá-lo de novo.",
      tooManyAttempts: "Muitas tentativas. Entre com sua senha.",
      offer: {
        title: "Ative o acesso com biometria",
        subtitle: "Entre mais rápido e com mais segurança com a biometria do seu celular",
        instant: "Acesso instantâneo",
        security: "Máxima segurança",
        encrypted: "Dados criptografados",
        enable: "Ativar biometria",
        enabling: "Ativando…",
        notNow: "Agora não",
        prompt: "Verifique sua identidade para ativar a biometria",
        enabledTitle: "Biometria ativada",
        enabledMessage: "Da próxima vez você poderá entrar com sua biometria.",
        failedTitle: "Não foi possível ativar",
        failedMessage: "Não foi possível verificar sua identidade. Tente novamente.",
        unavailableTitle: "Biometria indisponível",
        unavailableMessage: "Configure a biometria ou um bloqueio de tela no seu celular e tente novamente.",
        expiredTitle: "Tempo esgotado",
        expiredMessage: "Entre novamente com sua senha para ativar a biometria.",
      },
    },
    legal: {
      text: "Ao se cadastrar você aceita nossos",
      terms: "termos de uso",
      and: "e",
      privacy: "política de privacidade",
    },
  },
  // Textos legales (los mismos que la app de alumnos hasta tener los del profesor).
  legalDocs: {
    terms: {
      title: "Termos e Condições",
      summary: "Ao usar nossa aplicação, você concorda com nossos termos de serviço e política de privacidade. Isso inclui coleta de dados para experiências personalizadas, diretrizes de conduta do usuário, proteção de propriedade intelectual e limitação de responsabilidade. Nossos serviços são fornecidos 'como estão' com melhor esforço de suporte. Reservamos o direito de modificar estes termos com aviso prévio. Seu uso continuado indica aceitação de quaisquer alterações. Para detalhes completos e obrigações legais, revise o documento completo.",
    },
    privacy: {
      title: "Política de Privacidade",
      summary: "Playtopia SL processa seus dados pessoais de acordo com o GDPR para gestão de atividades esportivas, comunicações e pagamentos. Coletamos dados de identificação, contato, acadêmicos e de pagamento (tokenizados via Stripe). Acesso opcional à câmera para fotos de perfil. Base legal: consentimento, execução de contrato e interesse legítimo. Compartilhamos com provedores autorizados (Stripe, CRM). Você tem direitos de acesso, retificação, exclusão e portabilidade. Dados de menores requerem consentimento parental. Implementamos medidas de segurança adequadas.",
    },
    viewFullDocument: "Ver Documento Completo",
    openFailed: "Falha ao abrir o documento. Tente novamente.",
  },
  schedule: {
    greeting: {
      morning: "Bom dia, treinador",
      afternoon: "Boa tarde, treinador",
      evening: "Boa noite, treinador",
    },
    notifications: "Notificações",
    /** El avatar de la cabecera, que lleva a Perfil (lo lee el lector de pantalla). */
    myProfile: "Meu perfil",
    /** Las cifras del día encima de la agenda (clases, alumnos y tiempo en pista). */
    today: {
      classes: "aulas hoje",
      students: "alunos hoje",
      court: "em quadra hoje",
      /** El tiempo en pista exacto: «5:50 h». */
      courtTime: "%{hours}:%{minutes} h",
    },
    /** El selector de vistas (DÍA · SEMANA · MES). */
    views: {
      day: "Dia",
      week: "Semana",
      month: "Mês",
    },
    /** El título encima de la navegación de la agenda («MI AGENDA»). */
    myAgenda: "Minha agenda",
    /** El centro de la barra: «Hoy» en la vista Día y, al tocarlo, volver a hoy. */
    toolbar: {
      today: "Hoje",
      goToday: "Voltar para hoje",
    },
    week: {
      /** Los extremos de la semana en la barra: «18 nov – 24 nov». */
      range: "%{from} – %{to}",
      previous: "Semana anterior",
      next: "Próxima semana",
      /** La pastilla de la tarjeta de hoy. */
      todayNow: "Hoje · %{time}",
      filteredBy: "Filtrado por %{day}",
      showAll: "Ver a semana toda",
      /** La marca de la clase en curso («EN VIVO»). */
      live: "Ao vivo",
    },
    month: {
      previous: "Mês anterior",
      next: "Próximo mês",
    },
    /** La tarjeta de la próxima clase, encima de la agenda. */
    next: {
      /** La clase que se está dando. */
      live: "Em andamento",
      /** La próxima, con cuándo empieza: «Próxima clase · en 45 min». */
      titleWhen: "Próxima aula · %{when}",
      inMinutes: "em %{count} min",
      todayAt: "hoje %{time}",
      tomorrowAt: "amanhã %{time}",
      /** «jue 18 · 18:00». */
      dayAt: "%{day} · %{time}",
      level: "Nível %{range}",
      students: "%{taken}/%{max} alunos",
      /** Cuántos vienen a recuperar. */
      recoveries: {
        one: "+%{count} reposição",
        other: "+%{count} reposições",
      },
      /** La marca sobre el círculo de quien recupera. */
      recoveryBadge: "R",
    },
    /** El detalle de una clase (se abre al tocarla en la agenda). */
    detail: {
      openHint: "Abre os detalhes da aula",
      timeRange: "%{start}–%{end}",
      /** Una cifra del día encima de la agenda para el lector de pantalla: «clases hoy: 3». */
      stat: "%{label}: %{value}",
      students: "Alunos e presenças",
      noStudents: "Ainda não há alunos inscritos",
      /** A la derecha de «Alumnos y asistencia»: cuántos han venido. */
      presentCount: "%{present}/%{total} presentes",
      /** Lo mismo cuando ya tienen marca todos. */
      attendanceDone: "Presenças registradas · %{present}/%{total}",
      /** La etiqueta de quien está en la clase por una plaza de recuperación. */
      recovery: "Reposição",
      markPresent: "Marcar %{name} como presente",
      markAbsent: "Marcar %{name} como ausente",
      /** La sección de la última clase del grupo, su asistencia y cuántos alumnos tenía. */
      lastClass: "Última aula deste grupo",
      lastClassAttendance: "Presença %{present}/%{total}",
      studentCount: {
        one: "%{count} aluno",
        other: "%{count} alunos",
      },
      /** El panel con la lista de esa clase. */
      lastClassSheet: "Última aula",
      lastClassHint: "Abre a lista dessa aula",
      notFound: "Aula não encontrada",
    },
    day: {
      today: "Hoje · %{day}",
      previousDay: "Dia anterior",
      nextDay: "Dia seguinte",
      free: "Dia livre · sem compromissos",
      classes: {
        one: "%{count} aula",
        other: "%{count} aulas",
      },
      minutes: "%{count} min",
      next: "Próxima",
      /** La marca de una clase que ya terminó, en la vista Día. */
      done: "Concluída",
      a11y: {
        /** Un día en la tira de la semana y en el mes: «martes 19, 3 clases». */
        summary: "%{day}, %{classes}",
        duration: "%{count} minutos",
        seats: "%{taken} de %{max} vagas",
        past: "já terminou",
        live: "em andamento",
        next: "próxima aula",
      },
    },
  },
  /** «Mis grupos»: los grupos del profesor (la pestaña «Grupos»). */
  groups: {
    title: "Meus grupos",
    active: {
      one: "%{count} grupo ativo",
      other: "%{count} grupos ativos",
    },
    /** Sin ningún grupo con clases por delante. */
    empty: "Você ainda não tem grupos nem aulas",
    /** El detalle de un grupo. */
    detail: {
      /** Bajo la cabecera: los del grupo, sin los que vienen a recuperar. */
      members: {
        one: "%{count} aluno inscrito",
        other: "%{count} alunos inscritos",
      },
      students: "Alunos do grupo",
      nextClass: "Próxima aula",
      /** En la próxima clase: los del grupo apuntados y todos los que se esperan. */
      enrolled: {
        one: "%{count} inscrito",
        other: "%{count} inscritos",
      },
      expected: {
        one: "%{count} aluno previsto",
        other: "%{count} alunos previstos",
      },
      notFound: "Grupo não encontrado",
    },
  },
  network: {
    title: "Rede de clubes",
    tabs: {
      myClubs: "Meus clubes",
      nearMe: "Perto de mim",
    },
    myClubs: {
      emptyTitle: "Você ainda não trabalha em nenhum clube",
      emptyMessage: "Veja em “Perto de mim” as escolas em que você pode entrar.",
    },
    nearMe: {
      emptyTitle: "Nenhuma escola nova",
      emptyMessage: "Por enquanto não há mais escolas para entrar.",
    },
  },
  phone: {
    label: "Número de telefone",
    placeholder: "Seu número de telefone",
  },
  countryPicker: {
    title: "Seleciona o teu país",
    searchPlaceholder: "Pesquisar país ou indicativo",
    empty: "Nenhum país corresponde à pesquisa",
  },
  datePicker: {
    placeholder: "DD/MM/AAAA",
  },
  gender: {
    label: "Gênero",
    male: "Masculino",
    female: "Feminino",
    preferNotToSay: "Prefiro não dizê-lo",
  },
  validation: {
    emailRequired: "Digite seu email.",
    emailInvalid: "Digite um endereço de e-mail válido",
    passwordRequired: "Digite sua senha.",
    firstNameMin: "O nome deve ter pelo menos 2 caracteres",
    lastNameMin: "O sobrenome deve ter pelo menos 2 caracteres",
    phoneNumbersOnly: "O telefone deve conter apenas números",
    phoneMin: "O telefone deve ter pelo menos 9 dígitos",
    phoneMax: "O telefone não pode exceder 15 dígitos",
    birthdayRequired: "Indique a sua data de nascimento",
    passwordMin: "A senha deve ter pelo menos 8 caracteres",
    passwordMax: "A senha não pode exceder 50 caracteres",
    passwordUppercase: "A senha deve conter pelo menos uma letra maiúscula",
    passwordLowercase: "A senha deve conter pelo menos uma letra minúscula",
    passwordNumber: "A senha deve conter pelo menos um número",
    passwordSpecialChar: "A senha deve conter pelo menos um caractere especial",
    passwordNoSpaces: "A senha não pode conter espaços",
    confirmPasswordRequired: "Confirme sua senha",
    passwordsDontMatch: "As senhas não coincidem",
    acceptTerms: "Você deve aceitar os termos e condições",
  },
  splash: {
    tagline: "Seu universo esportivo",
  },
};

export default pt;
