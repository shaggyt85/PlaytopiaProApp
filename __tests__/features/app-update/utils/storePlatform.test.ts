import { storePlatformOf, storeUrlFor } from "@/features/app-update/utils/storePlatform";

const urls = { ios: "https://apps.apple.com/pro", android: "https://play.google.com/pro" };

describe("storePlatformOf", () => {
  it("iOS y Android tienen tienda; la web no", () => {
    expect(storePlatformOf("ios")).toBe("ios");
    expect(storePlatformOf("android")).toBe("android");
    expect(storePlatformOf("web")).toBeNull();
  });
});

describe("storeUrlFor", () => {
  it("la URL de la tienda de este móvil", () => {
    expect(storeUrlFor(urls, "ios")).toBe(urls.ios);
    expect(storeUrlFor(urls, "android")).toBe(urls.android);
  });

  it("sin tienda, o sin URL configurada en Core, ninguna", () => {
    expect(storeUrlFor(urls, null)).toBeNull();
    expect(storeUrlFor({ ...urls, android: null }, "android")).toBeNull();
  });
});
