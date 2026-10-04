import { makeStyles } from "@/shared/hooks/makeStyles";

import { BLOCKS_LEFT } from "../../utils/timelineMetrics";

export const useStyles = makeStyles((theme) => ({
  // Sin panel, sobre el fondo de marca (`relative pt-3` y `pb-2`).
  container: { paddingTop: theme.spacing.sm + theme.spacing.xs, paddingBottom: theme.spacing.sm },
  track: { position: "relative" },
  // Las tarjetas empiezan a la derecha de la línea (`left: 3.75rem`) y dejan un
  // respiro a la derecha (`width: calc(100% - 4.25rem)`).
  blocks: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: BLOCKS_LEFT,
    right: theme.spacing.sm,
  },
}));
