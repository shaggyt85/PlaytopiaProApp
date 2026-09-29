import { makeStyles } from "@/shared/hooks/makeStyles";

/** El tamaño del punto (el emoji de 9 px del prototipo). */
const DOT = 8;

export const useStyles = makeStyles(() => ({
  dot: { width: DOT, height: DOT, borderRadius: DOT / 2 },
}));
