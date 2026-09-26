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
    },
  },
  auth: {
    signIn: {
      emailLabel: "E-mail",
      emailPlaceholder: "seu@email.com",
      continue: "Continuar",
      register: "Cadastrar-se",
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
    legal: {
      text: "Ao se cadastrar você aceita nossos",
      terms: "termos de uso",
      and: "e",
      privacy: "política de privacidade",
    },
    comingSoon: "Disponível em breve.",
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
  validation: {
    emailRequired: "Digite seu email.",
    emailInvalid: "Digite um endereço de e-mail válido",
    passwordRequired: "Digite sua senha.",
  },
  splash: {
    tagline: "Seu universo esportivo",
  },
};

export default pt;
