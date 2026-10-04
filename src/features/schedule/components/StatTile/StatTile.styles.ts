import { makeStyles } from "@/shared/hooks/makeStyles";

/** El icono (`h-4 w-4`). */
export const ICON_SIZE = 16;

export const useStyles = makeStyles((theme) => ({
  // `flex flex-col items-center gap-1.5`, sin fondo.
  tile: { flex: 1, alignItems: "center", gap: theme.spacing.xs + theme.spacing.xs / 2 },
  // `flex items-center gap-1.5`: el icono al lado de la cifra.
  head: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs + theme.spacing.xs / 2 },
}));
