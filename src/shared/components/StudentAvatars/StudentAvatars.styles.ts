import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  row: { flexDirection: "row", alignItems: "center" },
  // `-space-x-1.5`: cada círculo se mete bajo el anterior.
  overlap: { marginLeft: -(theme.spacing.xs + theme.spacing.xs / 2) },
}));
