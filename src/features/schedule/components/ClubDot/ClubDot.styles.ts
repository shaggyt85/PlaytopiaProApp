import { makeStyles } from "@/shared/hooks/makeStyles";

/** El punto, de 8. */
const DOT_SIZE = 8;

export const useStyles = makeStyles(() => ({
  dot: { width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE / 2 },
}));
