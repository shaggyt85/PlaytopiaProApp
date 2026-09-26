import { Asset } from "expo-asset";
import { Image } from "expo-image";

/** Imágenes de marca: un único require por asset (los usan splash y auth). */
export const BRAND_ASSETS = {
  logoWhite: require("../../../assets/images/logoWhite.png"),
} as const;

/**
 * Deja las imágenes de marca en la caché en memoria de expo-image antes de
 * pintar nada. Así, al pasar de una pantalla a otra, el logo sale al instante
 * en vez de volver a cargarse (en Expo Go, además, llega por la red).
 */
export async function preloadBrandAssets(): Promise<void> {
  const uris = Object.values(BRAND_ASSETS).map((module) => Asset.fromModule(module).uri);
  await Image.prefetch(uris, "memory-disk");
}
