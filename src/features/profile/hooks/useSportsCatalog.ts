import { useQuery } from "@tanstack/react-query";

import { useTranslation } from "@/shared/hooks/useTranslation";

import { sportsCatalogQuery, sportsCatalogService, type ISportsCatalogService } from "../services/sportsCatalogService";

/** El catálogo de deportes en el idioma de la app: tras la primera vez, al instante. */
export function useSportsCatalog(service: ISportsCatalogService = sportsCatalogService) {
  const { locale } = useTranslation();
  return useQuery(sportsCatalogQuery(locale, service));
}
