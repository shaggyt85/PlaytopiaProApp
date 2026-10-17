import { makeStyles } from "@/shared/hooks/makeStyles";

// La X de los paneles de Lovable (`h-9 w-9`), en su esquina (`top-4 right-4`).
export const CLOSE_SIZE = 36;

export const useStyles = makeStyles((theme) => ({
  corner: { position: "absolute", top: theme.spacing.md, right: theme.spacing.md },
}));
