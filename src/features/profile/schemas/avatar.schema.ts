import { z } from "zod";

/** Lo que responde Core al subir la foto: su URL nueva (cada subida, una clave nueva en el bucket). */
export const AvatarUploadSchema = z.object({ url: z.string().min(1) });
export type AvatarUpload = z.infer<typeof AvatarUploadSchema>;

/** La foto lista para subir, como la quiere el `FormData` de React Native. */
export interface AvatarFile {
  uri: string;
  name: string;
  type: string;
}
