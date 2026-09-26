import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold";
import { Sora_700Bold } from "@expo-google-fonts/sora/700Bold";
import { Sora_800ExtraBold } from "@expo-google-fonts/sora/800ExtraBold";
import * as Font from "expo-font";

/**
 * Fuentes del prototipo de Lovable: Sora para títulos y marca, Inter para el
 * resto. Solo los pesos que se usan, cada uno desde su subcarpeta: el índice
 * del paquete haría `require` de todos (18 de Inter) y Metro los metería en la app.
 *
 * Con fuentes propias el peso va en el nombre de la fuente, no en `fontWeight`
 * (en Android se ignora y sale la letra normal): el tema usa estos nombres.
 */
const FONT_FILES = {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Sora_700Bold,
  Sora_800ExtraBold,
} as const;

type FontName = keyof typeof FONT_FILES;

/** Nombre de cada fuente por su uso. */
export const FONTS = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
  display: "Sora_700Bold",
  displayHeavy: "Sora_800ExtraBold",
} as const satisfies Record<string, FontName>;

/** Carga las fuentes; el arranque (useAppReady) la espera antes de pintar. */
export const loadFonts = (): Promise<void> => Font.loadAsync(FONT_FILES);
