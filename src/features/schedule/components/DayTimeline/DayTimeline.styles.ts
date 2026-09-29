import { makeStyles } from "@/shared/hooks/makeStyles";

import { HOUR_LABEL_WIDTH } from "../../utils/timelineMetrics";

export const useStyles = makeStyles((theme) => ({
  // `rounded-3xl bg-card p-3 ring-soft`: el `ring-soft` como borde fino.
  container: {
    padding: theme.spacing.sm + theme.spacing.xs,
    borderRadius: theme.radius.xxxl,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    backgroundColor: theme.colors.card,
  },
  track: { position: "relative" },
  // Las tarjetas empiezan tras la columna de horas (`left-12`) y dejan un
  // respiro a la derecha (`right-2`); dentro, las columnas van en porcentaje.
  blocks: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: HOUR_LABEL_WIDTH + theme.spacing.sm,
    right: theme.spacing.sm,
  },
}));
