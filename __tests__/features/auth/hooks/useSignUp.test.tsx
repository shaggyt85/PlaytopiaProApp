import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { useSignUp } from "@/features/auth/hooks/useSignUp";
import { TERMS_VERSION } from "@/features/auth/config/terms";
import { SignUpFormSchema } from "@/features/auth/schemas/signUp.schema";
import type { ISignUpService } from "@/features/auth/services/signUpService";
import { createQueryClient } from "@/shared/config/queryClient";
import { GENDER } from "@/shared/config/gender";
import { session } from "@/shared/services/session";

jest.mock("@/shared/services/session", () => ({
  session: { start: jest.fn() },
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
);

const form = SignUpFormSchema.parse({
  firstName: "Ana",
  lastName: "García",
  email: "ana@club.com",
  country: "ES",
  phone: "612345678",
  birthday: "1990-05-03",
  gender: GENDER.NONE,
  password: "Segura1!",
  confirmPassword: "Segura1!",
  acceptedTerms: true,
});

describe("useSignUp", () => {
  it("envía a Core el formulario ya convertido a su contrato", async () => {
    const service: ISignUpService = {
      signUp: jest.fn().mockResolvedValue({ id: 42, email: "ana@club.com" }),
    };
    const { result } = renderHook(() => useSignUp(service), { wrapper });

    await act(() => result.current.mutateAsync(form));

    expect(service.signUp).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "ana@club.com",
        phone_number: "+34612345678",
        birthday: "1990-05-03T00:00:00",
        terms_version: TERMS_VERSION,
      }),
    );
  });

  it("no abre sesión: tras el alta el profesor entra con su contraseña", async () => {
    const service: ISignUpService = {
      signUp: jest.fn().mockResolvedValue({ id: 42, email: "ana@club.com" }),
    };
    const { result } = renderHook(() => useSignUp(service), { wrapper });

    await act(() => result.current.mutateAsync(form));

    expect(session.start).not.toHaveBeenCalled();
  });

  it("si Core lo rechaza, el error queda en la mutación y no se reintenta", async () => {
    const service: ISignUpService = { signUp: jest.fn().mockRejectedValue(new Error("409")) };
    const { result } = renderHook(() => useSignUp(service), { wrapper });

    await act(() => result.current.mutateAsync(form).catch(() => undefined));
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(service.signUp).toHaveBeenCalledTimes(1);
  });
});
