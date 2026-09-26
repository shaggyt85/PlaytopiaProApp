import { makeStyles } from "@/shared/hooks/makeStyles";

// Una variante por cada entrada de la tipografía del tema: una variante nueva
// en el tema llega sola a <Text variant="…">.
export const useStyles = makeStyles((theme) => ({ ...theme.typography }));
