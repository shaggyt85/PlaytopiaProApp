import { ignoreRejection } from "@/shared/utils/ignoreRejection";

describe("ignoreRejection", () => {
  it("da el valor de la promesa", async () => {
    await expect(ignoreRejection(Promise.resolve(42))).resolves.toBe(42);
  });

  it("si se rechaza, `undefined` sin que salga el error (ya está en la mutación)", async () => {
    await expect(ignoreRejection(Promise.reject(new Error("sin red")))).resolves.toBeUndefined();
  });
});
