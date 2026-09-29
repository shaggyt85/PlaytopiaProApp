import { useMemo } from "react";

import { makeStyles } from "@/shared/hooks/makeStyles";
import { useTabBarInset } from "@/shared/hooks/useTabBarInset";

const useStyles = makeStyles((theme) => ({
  // flexGrow: el contenido corto (p. ej. «Próximamente» o una lista vacía) puede centrarse.
  content: { flexGrow: 1, paddingTop: theme.spacing.md + theme.spacing.xs },
}));

/**
 * Estilo del contenido desplazable de una pestaña del menú: el respiro de
 * arriba y el hueco de la barra flotante abajo. Lo comparten `TabScrollView`
 * y `TabFlatList`.
 */
export function useTabContentStyle() {
  const styles = useStyles();
  const bottomInset = useTabBarInset();
  return useMemo(() => [styles.content, { paddingBottom: bottomInset }], [styles.content, bottomInset]);
}
