import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import { ProfileEditorSheet } from "@/features/profile/components/ProfileEditorSheet";
import { useProfileEditorStore } from "@/features/profile/store/profileEditorStore";
import { HttpError } from "@/shared/services/HttpError";
import { teacherProfileService } from "@/shared/services/teacherProfileService";

import { teacherProfile } from "../../../helpers/profileFactories";
import { renderWithProviders } from "../../../helpers/renderWithProviders";
import { signInTeacher } from "../../../helpers/scheduleMocks";

jest.mock("@/shared/services/teacherProfileService", () => ({
  ...jest.requireActual("@/shared/services/teacherProfileService"),
  teacherProfileService: { get: jest.fn(), update: jest.fn() },
}));
jest.mock("@react-native-community/datetimepicker", () => jest.requireActual("../../../helpers/dateTimePickerMock"));

const conflict = (type: string) => HttpError.fromResponse(409, { type, title: "Conflict", status: 409 });

describe("ProfileEditorSheet", () => {
  beforeEach(() => {
    signInTeacher();
    useProfileEditorStore.getState().close();
    jest.mocked(teacherProfileService.get).mockResolvedValue(teacherProfile());
  });

  it("cerrado no pinta nada", async () => {
    renderWithProviders(<ProfileEditorSheet />);

    await act(async () => undefined);
    expect(screen.queryByTestId("personal-data-editor")).toBeNull();
  });

  it("abierto en «personal»: su título y el formulario relleno con lo guardado", async () => {
    renderWithProviders(<ProfileEditorSheet />);
    act(() => useProfileEditorStore.getState().open("personal"));

    expect(await screen.findByTestId("personal-data-editor")).toBeTruthy();
    expect(screen.getByRole("header", { name: "Datos personales" })).toBeTruthy();
    expect(screen.getByDisplayValue("david@playtopia.com")).toBeTruthy();
    expect(screen.getByDisplayValue("600123456")).toBeTruthy();
  });

  it("«Guardar» envía los cambios como los espera Core y cierra el panel", async () => {
    jest.mocked(teacherProfileService.update).mockResolvedValue(teacherProfile({ name: "Lucía" }));
    renderWithProviders(<ProfileEditorSheet />);
    act(() => useProfileEditorStore.getState().open("personal"));

    fireEvent.changeText(await screen.findByDisplayValue("David"), "Lucía");
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Guardar" }));
    });

    expect(teacherProfileService.update).toHaveBeenCalledWith(42, {
      name: "Lucía",
      last_name: "Álvarez",
      email: "david@playtopia.com",
      phone_number: "+34600123456",
      birthday: "1990-05-15T00:00:00",
      gender: 1,
    });
    await waitFor(() => expect(useProfileEditorStore.getState().section).toBeNull());
  });

  it("un email que ya es de otra cuenta se marca en su campo y el panel sigue abierto", async () => {
    jest
      .mocked(teacherProfileService.update)
      .mockRejectedValue(conflict("urn:playtopia:problem:email-already-registered"));
    renderWithProviders(<ProfileEditorSheet />);
    act(() => useProfileEditorStore.getState().open("personal"));

    await screen.findByTestId("personal-data-editor");
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Guardar" }));
    });

    expect(await screen.findByText("Ese email ya es de otra cuenta.")).toBeTruthy();
    expect(useProfileEditorStore.getState().section).toBe("personal");
  });

  it("otro error sale abajo, traducido por su type", async () => {
    jest
      .mocked(teacherProfileService.update)
      .mockRejectedValue(HttpError.fromResponse(400, { type: "about:blank", title: "Bad Request", status: 400 }));
    renderWithProviders(<ProfileEditorSheet />);
    act(() => useProfileEditorStore.getState().open("personal"));

    await screen.findByTestId("personal-data-editor");
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Guardar" }));
    });

    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(useProfileEditorStore.getState().section).toBe("personal");
  });

  it("al cerrarlo sin guardar, lo escrito no vuelve la próxima vez", async () => {
    renderWithProviders(<ProfileEditorSheet />);
    act(() => useProfileEditorStore.getState().open("personal"));

    fireEvent.changeText(await screen.findByDisplayValue("David"), "Otro");
    act(() => useProfileEditorStore.getState().close());
    act(() => useProfileEditorStore.getState().open("personal"));

    expect(await screen.findByDisplayValue("David")).toBeTruthy();
    expect(teacherProfileService.update).not.toHaveBeenCalled();
  });
});
