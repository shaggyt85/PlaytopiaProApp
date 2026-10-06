import { AVATAR_SIZES } from "@/shared/components/TeacherAvatar";
import { makeStyles } from "@/shared/hooks/makeStyles";

const { side } = AVATAR_SIZES.xl;
/** La insignia de la cámara (`h-8 w-8`) y su aro del color del fondo (`ring-2 ring-background`). */
export const BADGE_SIDE = 32;
const BADGE_RING = 2;

export const useStyles = makeStyles((theme) => ({
  // Del tamaño de la foto: la insignia y el indicador se colocan sobre ella.
  container: { width: side, height: side },
  // `absolute bottom-0 right-0 grid place-items-center rounded-full bg-surface-2`.
  badge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: BADGE_SIDE,
    height: BADGE_SIDE,
    borderRadius: BADGE_SIDE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceStrong,
    borderWidth: BADGE_RING,
    borderColor: theme.colors.background,
  },
  // Mientras sube: el velo sobre la foto, con el indicador en el centro.
  busy: {
    position: "absolute",
    top: 0,
    left: 0,
    width: side,
    height: side,
    borderRadius: side / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.overlay,
  },
}));
