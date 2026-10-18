import { TERMS_VERSION } from "@/features/auth/config/terms";
import { hasCurrentTerms } from "@/features/auth/utils/terms";

describe("hasCurrentTerms", () => {
  it("solo con la versión vigente", () => {
    expect(hasCurrentTerms({ terms_version: TERMS_VERSION })).toBe(true);
  });

  it.each([null, "legacy", "2020-01-01"])("con %s hay que pedirlos", (version) => {
    expect(hasCurrentTerms({ terms_version: version })).toBe(false);
  });
});
