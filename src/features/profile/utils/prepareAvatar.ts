import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

import type { AvatarFile } from "../schemas/avatar.schema";
import type { PickedPhoto } from "../services/photoPicker";

/**
 * Lado máximo que se sube. Core guarda el avatar a 512 px: lo de más viaja
 * para que el servidor lo tire, y una foto de 12 MP por red móvil tardaba
 * tanto que Core cortaba la petición (el 504 de la app de alumnos). Se deja
 * el doble de 512 a propósito: si Core sube su tamaño, la calidad no cae sin
 * que nadie se dé cuenta, y la diferencia son decenas de kilobytes.
 */
export const AVATAR_MAX_SIDE = 1024;
/** Calidad del JPEG que se sube (y la del selector). */
export const AVATAR_QUALITY = 0.8;

/** `true` si la foto ya cabe. Sin medidas no se sabe, y se reduce. */
export function fitsAvatar(width?: number, height?: number): boolean {
  if (!width || !height) return false;
  return width <= AVATAR_MAX_SIDE && height <= AVATAR_MAX_SIDE;
}

/** La foto tal cual, con nombre y tipo aunque el selector no los diga. */
const asIs = (photo: PickedPhoto): AvatarFile => ({
  uri: photo.uri,
  name: photo.fileName ?? "avatar.jpg",
  type: photo.mimeType ?? "image/jpeg",
});

/**
 * La foto lista para subir: si no cabe, reducida a `AVATAR_MAX_SIDE` en JPEG
 * (el recorte cuadrado ya lo hizo el selector). Si reducirla falla, la
 * original: se sube más despacio, pero se sube; lo contrario dejaría al
 * profesor sin poder cambiar su foto.
 */
export async function prepareAvatar(photo: PickedPhoto): Promise<AvatarFile> {
  if (fitsAvatar(photo.width, photo.height)) return asIs(photo);
  try {
    // Solo el ancho: el alto sale de la proporción.
    const image = await ImageManipulator.manipulate(photo.uri).resize({ width: AVATAR_MAX_SIDE }).renderAsync();
    const saved = await image.saveAsync({ compress: AVATAR_QUALITY, format: SaveFormat.JPEG });
    // Nombre y tipo nuevos: ahora es un JPEG, aunque llegara un HEIC.
    return { uri: saved.uri, name: "avatar.jpg", type: "image/jpeg" };
  } catch {
    return asIs(photo);
  }
}
