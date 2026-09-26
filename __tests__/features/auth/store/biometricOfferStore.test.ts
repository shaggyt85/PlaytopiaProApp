import {
  BIOMETRIC_OFFER_TTL_MS,
  isOfferValid,
  useBiometricOfferStore,
} from "@/features/auth/store/biometricOfferStore";

describe("biometricOfferStore", () => {
  beforeEach(() => useBiometricOfferStore.getState().clear());

  it("guarda la oferta con su momento y la borra", () => {
    jest.spyOn(Date, "now").mockReturnValue(1_000);

    useBiometricOfferStore.getState().setOffer("ana@club.com", 42);
    expect(useBiometricOfferStore.getState().offer).toEqual({
      email: "ana@club.com",
      userId: 42,
      createdAt: 1_000,
    });

    useBiometricOfferStore.getState().clear();
    expect(useBiometricOfferStore.getState().offer).toBeNull();
    jest.restoreAllMocks();
  });

  it(`vale durante ${BIOMETRIC_OFFER_TTL_MS / 1000} s`, () => {
    const offer = { email: "ana@club.com", userId: 42, createdAt: 0 };

    expect(isOfferValid(offer, BIOMETRIC_OFFER_TTL_MS - 1)).toBe(true);
    expect(isOfferValid(offer, BIOMETRIC_OFFER_TTL_MS)).toBe(false);
    expect(isOfferValid(null)).toBe(false);
  });
});
