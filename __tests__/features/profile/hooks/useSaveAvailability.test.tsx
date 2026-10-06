import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { useSaveAvailability } from "@/features/profile/hooks/useSaveAvailability";
import type { ProfileDetails } from "@/features/profile/schemas/profileDetails.schema";
import { profileKeys } from "@/features/profile/services/profileDetailsService";
import { createQueryClient } from "@/shared/config/queryClient";
import { useSessionStore } from "@/shared/store/sessionStore";

import { profileClub, profileDetails } from "../../../helpers/profileFactories";

function setup(replace = jest.fn().mockResolvedValue({ ...profileClub, week: { "5": [20] } })) {
  const client = createQueryClient();
  client.setQueryData(profileKeys.details(42, "es"), profileDetails());
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, replace, ...renderHook(() => useSaveAvailability({ replace }), { wrapper }) };
}

describe("useSaveAvailability", () => {
  beforeEach(() => useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 }));

  it("guarda la semana de esa sede", async () => {
    const { result, replace } = setup();

    await act(() => result.current.mutateAsync({ dbId: 7, clubId: 70, week: { "5": [20] } }));

    expect(replace).toHaveBeenCalledWith(7, 70, { "5": [20] });
  });

  it("deja la semana que devuelve Core en los detalles: la tarjeta la ve al instante", async () => {
    const { result, client } = setup();

    await act(() => result.current.mutateAsync({ dbId: 7, clubId: 70, week: { "5": [20] } }));

    const details = client.getQueryData<ProfileDetails>(profileKeys.details(42, "es"));
    expect(details?.availability[0].week).toEqual({ "5": [20] });
  });
});
