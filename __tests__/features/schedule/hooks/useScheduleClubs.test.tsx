import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { useScheduleClubs } from "@/features/schedule/hooks/useScheduleClubs";
import { createQueryClient } from "@/shared/config/queryClient";
import { darkTheme } from "@/shared/config/theme";
import { useSessionStore } from "@/shared/store/sessionStore";

import { schoolCard } from "../../../helpers/networkFactories";

function setup(clubs: ReturnType<typeof schoolCard>[]) {
  const getMyClubs = jest.fn().mockResolvedValue({ clubs });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
  );
  return renderHook(() => useScheduleClubs({ getMyClubs }), { wrapper });
}

describe("useScheduleClubs", () => {
  beforeEach(() => useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 }));

  it("cada sede con su nombre y el color de su posición en «Mis clubes»", async () => {
    const { result } = setup([
      schoolCard(4, 7, { name: "DN Padel Academy", club_name: "Sede Centro" }),
      schoolCard(5, 1, { name: "Wave Padel Club", club_name: null }),
    ]);

    await waitFor(() => expect(result.current.clubOf({ db_id: 4, club_id: 7 }).label).toBe("Sede Centro"));
    expect(result.current.clubOf({ db_id: 4, club_id: 7 }).colors).toBe(darkTheme.clubColors[0]);
    expect(result.current.clubOf({ db_id: 5, club_id: 1 })).toMatchObject({
      label: "Wave Padel Club",
      colors: darkTheme.clubColors[1],
    });
  });

  it("una sede que ya no está en «Mis clubes» sale sin nombre y con el color neutro", async () => {
    const { result } = setup([schoolCard(4, 7)]);
    await waitFor(() => expect(result.current.clubOf({ db_id: 4, club_id: 7 }).label).not.toBe(""));

    expect(result.current.clubOf({ db_id: 9, club_id: 9 })).toEqual({
      label: "",
      colors: darkTheme.clubColorUnknown,
    });
  });
});

describe("useScheduleClubs: la tarjeta de sede", () => {
  beforeEach(() => useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 }));

  it("la de «Mis clubes» por su sede; si ya no está, undefined", async () => {
    const card = schoolCard(4, 7, { address: "Pº de la Castellana 300" });
    const { result } = setup([card]);

    await waitFor(() => expect(result.current.cardOf({ db_id: 4, club_id: 7 })).toEqual(card));
    expect(result.current.cardOf({ db_id: 9, club_id: 9 })).toBeUndefined();
  });
});
