import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles(() => ({
  // Ocupa lo que le da quien lo usa (el hueco de la tarjeta en la tira, la fila).
  fill: { flexGrow: 1 },
}));
