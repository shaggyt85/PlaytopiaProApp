import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { useUploadAvatar } from "@/features/profile/hooks/useUploadAvatar";
import { createQueryClient } from "@/shared/config/queryClient";
import { teacherKeys } from "@/shared/services/teacherProfileService";
import { useSessionStore } from "@/shared/store/sessionStore";

import { teacherProfile } from "../../../helpers/profileFactories";

const photo = { uri: "file:///foto.jpg", width: 4000, height: 4000 };
const prepared = { uri: "file:///reducida.jpg", name: "avatar.jpg", type: "image/jpeg" };

function setup() {
  const client = createQueryClient();
  client.setQueryData(teacherKeys.profile(42, "es"), teacherProfile());
  const upload = jest.fn().mockResolvedValue("https://cdn/nueva.jpg");
  const prepare = jest.fn().mockResolvedValue(prepared);
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, upload, prepare, ...renderHook(() => useUploadAvatar({ upload }, prepare), { wrapper }) };
}

describe("useUploadAvatar", () => {
  beforeEach(() => useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 }));

  it("reduce la foto, la sube y deja la URL nueva en el perfil de la caché", async () => {
    const { result, client, upload, prepare } = setup();

    await act(() => result.current.mutateAsync(photo));

    expect(prepare).toHaveBeenCalledWith(photo);
    expect(upload).toHaveBeenCalledWith(prepared);
    expect(client.getQueryData(teacherKeys.profile(42, "es"))).toMatchObject({ avatar: "https://cdn/nueva.jpg" });
  });
});
