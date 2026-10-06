import * as ImagePicker from "expo-image-picker";

/** De dónde sale la foto. */
export type PhotoSource = "camera" | "library";

/** La foto elegida, con lo que se usa de ella. */
export interface PickedPhoto {
  uri: string;
  width?: number;
  height?: number;
  fileName?: string | null;
  mimeType?: string | null;
}

/** Lo que pasó al elegir: la foto, que la cancelara o que no diera permiso. */
export type PickResult = { status: "picked"; photo: PickedPhoto } | { status: "cancelled" } | { status: "denied" };

/** Elegir una foto del móvil (la de Perfil). Detrás, `expo-image-picker`. */
export interface IPhotoPicker {
  pick(source: PhotoSource): Promise<PickResult>;
}

/**
 * Cuadrada y recortada por el propio selector (en óvalo en Android, como se
 * verá). Solo imágenes. La calidad, la misma con la que se sube.
 */
const OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [1, 1],
  shape: "oval",
  quality: 0.8,
};

/**
 * Cómo se abre cada origen. La galería no pide permiso (el selector del
 * sistema en Android, PHPicker en iOS 14+); la cámara, sí.
 */
const SOURCES = {
  camera: { launch: ImagePicker.launchCameraAsync, permission: ImagePicker.requestCameraPermissionsAsync },
  library: { launch: ImagePicker.launchImageLibraryAsync, permission: null },
} as const satisfies Record<
  PhotoSource,
  {
    launch: (options: ImagePicker.ImagePickerOptions) => Promise<ImagePicker.ImagePickerResult>;
    permission: (() => Promise<ImagePicker.PermissionResponse>) | null;
  }
>;

export class ExpoPhotoPicker implements IPhotoPicker {
  async pick(source: PhotoSource): Promise<PickResult> {
    const { launch, permission } = SOURCES[source];
    if (permission && !(await permission()).granted) return { status: "denied" };
    const result = await launch(OPTIONS);
    const asset = result.canceled ? undefined : result.assets[0];
    if (!asset) return { status: "cancelled" };
    const { uri, width, height, fileName, mimeType } = asset;
    return { status: "picked", photo: { uri, width, height, fileName, mimeType } };
  }
}

export const photoPicker: IPhotoPicker = new ExpoPhotoPicker();
