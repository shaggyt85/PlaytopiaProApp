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
  splash: {
    tagline: "Seu universo esportivo",
  },
};

export default pt;
