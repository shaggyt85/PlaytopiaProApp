import {
  bounceStarts,
  SPLASH_TIMING,
  textStartMs,
} from "@/features/splash/components/AnimatedSplash/AnimatedSplash.animation";

describe("la coreografía del splash", () => {
  it("cada rebote empieza al terminar el anterior, tras la caída", () => {
    expect(bounceStarts()).toEqual([500, 1000, 1320]);
  });

  it("el texto aparece a los 1,66 s, como siempre", () => {
    expect(textStartMs()).toBe(1660);
  });

  it("el título cabe en la duración: se ve completo al menos medio segundo", () => {
    expect(SPLASH_TIMING.duration - (textStartMs() + SPLASH_TIMING.textFadeIn)).toBeGreaterThanOrEqual(500);
  });
});
