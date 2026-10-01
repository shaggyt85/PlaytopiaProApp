import * as Sentry from "@sentry/react-native";

import { initSentry, resolveSentryEnvironment } from "@/shared/config/sentry";

jest.mock("@sentry/react-native", () => ({
  init: jest.fn(),
  addBreadcrumb: jest.fn(),
  wrap: (component: unknown) => component,
}));

const DSN = "https://key@o1.ingest.de.sentry.io/2";

describe("resolveSentryEnvironment", () => {
  it("usa el entorno que declara el perfil, aunque el build sea Release", () => {
    expect(resolveSentryEnvironment("preview", false)).toBe("preview");
  });

  it("sin declarar, distingue desarrollo de producción por __DEV__", () => {
    expect(resolveSentryEnvironment(undefined, true)).toBe("development");
    expect(resolveSentryEnvironment(undefined, false)).toBe("production");
  });
});

describe("initSentry", () => {
  it("sin DSN no arranca", () => {
    const started = initSentry(
      { EXPO_PUBLIC_SENTRY_DSN: undefined, EXPO_PUBLIC_SENTRY_ENV: undefined },
      false,
    );

    expect(started).toBe(false);
    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it("con DSN arranca en el entorno del perfil y sin PII", () => {
    const started = initSentry(
      { EXPO_PUBLIC_SENTRY_DSN: DSN, EXPO_PUBLIC_SENTRY_ENV: "production" },
      false,
    );

    expect(started).toBe(true);
    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({ dsn: DSN, environment: "production", sendDefaultPii: false }),
    );
  });
});
