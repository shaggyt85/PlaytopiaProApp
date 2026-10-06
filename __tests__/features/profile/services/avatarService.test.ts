import { AvatarService, UPLOAD_TIMEOUT_MS } from "@/features/profile/services/avatarService";

import { createFakeHttpClient as fakeHttp } from "../../../helpers/fakeHttpClient";

const file = { uri: "file:///avatar.jpg", name: "avatar.jpg", type: "image/jpeg" };

describe("AvatarService", () => {
  it("sube la foto en el campo avatarFile, con más margen que una petición normal, y devuelve su URL", async () => {
    const http = fakeHttp({ url: "https://cdn.playtopia/avatars/nueva.jpg" });
    // El FormData de Jest es el de Node, que pasa el objeto a texto; el de React Native sube `{ uri, name, type }`.
    const append = jest.spyOn(FormData.prototype, "append");

    const url = await new AvatarService(http).upload(file);

    const [path, body, config] = jest.mocked(http.post).mock.calls[0];
    expect(path).toBe("/MobileTeacher/UploadMobileTeacherAvatar");
    expect(body).toBeInstanceOf(FormData);
    expect(append).toHaveBeenCalledWith("avatarFile", file);
    expect(config).toEqual({ headers: { "Content-Type": "multipart/form-data" }, timeout: UPLOAD_TIMEOUT_MS });
    expect(url).toBe("https://cdn.playtopia/avatars/nueva.jpg");
  });

  it("una respuesta sin URL no cumple el contrato", async () => {
    await expect(new AvatarService(fakeHttp({})).upload(file)).rejects.toThrow();
  });
});
