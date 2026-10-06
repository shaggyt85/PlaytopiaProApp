import { act, fireEvent, screen, waitFor, within } from "@testing-library/react-native";

import { ProfileEditorSheet } from "@/features/profile/components/ProfileEditorSheet";
import { availabilityService } from "@/features/profile/services/availabilityService";
import { profileDetailsService } from "@/features/profile/services/profileDetailsService";
import { sportsCatalogService } from "@/features/profile/services/sportsCatalogService";
import { useProfileEditorStore } from "@/features/profile/store/profileEditorStore";
import { HttpError } from "@/shared/services/HttpError";
import { myClubsService } from "@/shared/services/myClubsService";
import { teacherProfileService } from "@/shared/services/teacherProfileService";

import { schoolCard } from "../../../helpers/networkFactories";
import { profileClub, profileDetails, teacherProfile } from "../../../helpers/profileFactories";
import { renderWithProviders } from "../../../helpers/renderWithProviders";
import { signInTeacher } from "../../../helpers/scheduleMocks";

jest.mock("@/shared/services/teacherProfileService", () => ({
  ...jest.requireActual("@/shared/services/teacherProfileService"),
  teacherProfileService: { get: jest.fn(), update: jest.fn() },
}));
jest.mock("@/features/profile/services/profileDetailsService", () => ({
  ...jest.requireActual("@/features/profile/services/profileDetailsService"),
  profileDetailsService: { get: jest.fn() },
}));
jest.mock("@/features/profile/services/availabilityService", () => ({
  ...jest.requireActual("@/features/profile/services/availabilityService"),
  availabilityService: { replace: jest.fn() },
}));
jest.mock("@/shared/services/myClubsService", () => require("../../../helpers/scheduleMocks").myClubsServiceModule());
jest.mock("@/features/profile/services/sportsCatalogService", () => ({
  ...jest.requireActual("@/features/profile/services/sportsCatalogService"),
  sportsCatalogService: { getCatalog: jest.fn() },
}));
jest.mock("@react-native-community/datetimepicker", () => jest.requireActual("../../../helpers/dateTimePickerMock"));

const CATALOG = [
  {
    code: "padel",
    name: "Pádel",
    specialties: [
      { code: "technique", name: "Técnica" },
      { code: "tactics", name: "Táctica" },
      { code: "competition", name: "Competición" },
    ],
  },
  { code: "tennis", name: "Tenis", specialties: [] },
];

const conflict = (type: string) => HttpError.fromResponse(409, { type, title: "Conflict", status: 409 });

describe("ProfileEditorSheet", () => {
  beforeEach(() => {
    signInTeacher();
    useProfileEditorStore.getState().close();
    jest.mocked(teacherProfileService.get).mockResolvedValue(teacherProfile());
    jest.mocked(sportsCatalogService.getCatalog).mockResolvedValue(CATALOG);
    jest.mocked(myClubsService.getMyClubs).mockResolvedValue({
      clubs: [schoolCard(7, 70, { club_name: "Indoor Centro" }), schoolCard(7, 71, { club_name: "Indoor Norte" })],
    });
    jest.mocked(profileDetailsService.get).mockResolvedValue(
      profileDetails({
        availability: [
          { ...profileClub, week: { "1": [18, 19, 20, 21, 22, 23], "3": [18, 19, 20, 21, 22, 23] } },
          { ...profileClub, club_id: 71, club_name: "Indoor Norte", week: {} },
        ],
      }),
    );
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

  it("abierto en «professional»: los años, la presentación y las especialidades del catálogo", async () => {
    renderWithProviders(<ProfileEditorSheet />);
    act(() => useProfileEditorStore.getState().open("professional"));

    expect(await screen.findByTestId("professional-editor")).toBeTruthy();
    expect(screen.getByRole("header", { name: "Perfil profesional" })).toBeTruthy();
    expect(screen.getByTestId("years-value")).toHaveTextContent("6");
    expect(screen.getByRole("checkbox", { name: "Técnica", checked: true })).toBeTruthy();
    expect(screen.getByRole("checkbox", { name: "Competición", checked: false })).toBeTruthy();
  });

  it("«Guardar» envía el perfil profesional como lo espera Core y cierra el panel", async () => {
    jest.mocked(teacherProfileService.update).mockResolvedValue(teacherProfile({ experience_years: 7 }));
    renderWithProviders(<ProfileEditorSheet />);
    act(() => useProfileEditorStore.getState().open("professional"));

    await screen.findByTestId("professional-editor");
    fireEvent.press(screen.getByRole("button", { name: "Un año más" }));
    fireEvent.press(screen.getByRole("checkbox", { name: "Competición" }));
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Guardar" }));
    });

    expect(teacherProfileService.update).toHaveBeenCalledWith(42, {
      description: "Entrenador de pádel especializado en cantera y competición.",
      experience_years: 7,
      sports: [{ code: "padel", specialties: ["technique", "tactics", "competition"] }],
    });
    await waitFor(() => expect(useProfileEditorStore.getState().section).toBeNull());
  });

  it("si el catálogo no llega, el error con «Reintentar» en vez del formulario", async () => {
    jest
      .mocked(sportsCatalogService.getCatalog)
      .mockRejectedValue(HttpError.fromResponse(403, { type: "about:blank", title: "Forbidden", status: 403 }));
    renderWithProviders(<ProfileEditorSheet />);
    act(() => useProfileEditorStore.getState().open("professional"));

    expect(await screen.findByRole("button", { name: "Reintentar" })).toBeTruthy();
    expect(screen.queryByTestId("professional-editor")).toBeNull();
  });

  it("abierto en «availability»: la sede, y lo guardado marcado en franjas y días", async () => {
    renderWithProviders(<ProfileEditorSheet />);
    act(() => useProfileEditorStore.getState().open("availability"));

    expect(await screen.findByTestId("availability-editor")).toBeTruthy();
    expect(screen.getByRole("header", { name: "Disponibilidad" })).toBeTruthy();
    expect(await screen.findByRole("checkbox", { name: "Indoor Centro", checked: true })).toBeTruthy();
    expect(screen.getByRole("checkbox", { name: "Noche", checked: true })).toBeTruthy();
    expect(screen.getByRole("checkbox", { name: "Mañana", checked: false })).toBeTruthy();
    expect(screen.getByRole("checkbox", { name: "Lunes", checked: true })).toBeTruthy();
    expect(screen.getByRole("checkbox", { name: "Martes", checked: false })).toBeTruthy();
    expect(within(screen.getByTestId("availability-week")).getByText("Lun 18:00–24:00")).toBeTruthy();
  });

  it("marcar franjas y días cambia «Tu semana» y «Guardar» envía la semana de esa sede", async () => {
    jest.mocked(availabilityService.replace).mockResolvedValue({ ...profileClub, week: {} });
    renderWithProviders(<ProfileEditorSheet />);
    act(() => useProfileEditorStore.getState().open("availability"));

    await screen.findByTestId("availability-editor");
    fireEvent.press(screen.getByRole("checkbox", { name: "Tarde" }));
    fireEvent.press(screen.getByRole("checkbox", { name: "Martes" }));
    expect(within(screen.getByTestId("availability-week")).getByText("Lun 12:00–24:00")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Guardar" }));
    });

    const hours = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    expect(availabilityService.replace).toHaveBeenCalledWith(7, 70, { "1": hours, "2": hours, "3": hours });
    await waitFor(() => expect(useProfileEditorStore.getState().section).toBeNull());
  });

  it("se puede guardar la semana vacía: borra la disponibilidad de esa sede, como acepta Core", async () => {
    jest.mocked(availabilityService.replace).mockResolvedValue({ ...profileClub, week: {} });
    renderWithProviders(<ProfileEditorSheet />);
    act(() => useProfileEditorStore.getState().open("availability"));

    await screen.findByTestId("availability-editor");
    fireEvent.press(screen.getByRole("checkbox", { name: "Noche" }));
    expect(within(screen.getByTestId("availability-week")).getByText("Aún no has indicado tu disponibilidad")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Guardar" }));
    });

    expect(availabilityService.replace).toHaveBeenCalledWith(7, 70, {});
  });

  it("otra sede carga su semana y guarda en ella", async () => {
    jest.mocked(availabilityService.replace).mockResolvedValue({ ...profileClub, club_id: 71, week: {} });
    renderWithProviders(<ProfileEditorSheet />);
    act(() => useProfileEditorStore.getState().open("availability"));

    fireEvent.press(await screen.findByRole("checkbox", { name: "Indoor Norte" }));
    expect(screen.getByRole("checkbox", { name: "Noche", checked: false })).toBeTruthy();
    fireEvent.press(screen.getByRole("checkbox", { name: "Mañana" }));
    fireEvent.press(screen.getByRole("checkbox", { name: "Sábado" }));
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Guardar" }));
    });

    expect(availabilityService.replace).toHaveBeenCalledWith(7, 71, { "6": [6, 7, 8, 9, 10, 11] });
  });

  it("una semana de franjas se abre «Por franja»", async () => {
    renderWithProviders(<ProfileEditorSheet />);
    act(() => useProfileEditorStore.getState().open("availability"));

    expect(await screen.findByRole("tab", { name: "Por franja", selected: true })).toBeTruthy();
  });

  it("«Por día»: empieza en el primer día con horas y marca y quita horas de ese día", async () => {
    jest.mocked(availabilityService.replace).mockResolvedValue({ ...profileClub, week: {} });
    renderWithProviders(<ProfileEditorSheet />);
    act(() => useProfileEditorStore.getState().open("availability"));

    fireEvent.press(await screen.findByRole("tab", { name: "Por día" }));
    expect(screen.getByRole("checkbox", { name: "Lunes", checked: true })).toBeTruthy();
    expect(screen.getByText("Horas del Lunes")).toBeTruthy();
    const hours = within(screen.getByTestId("day-hours"));
    expect(hours.getByRole("checkbox", { name: "18:00", checked: true })).toBeTruthy();
    fireEvent.press(hours.getByRole("checkbox", { name: "09:00" }));
    fireEvent.press(hours.getByRole("checkbox", { name: "23:00" }));
    expect(within(screen.getByTestId("availability-week")).getByText("Lun 09:00–10:00 y 18:00–23:00")).toBeTruthy();

    fireEvent.press(screen.getByRole("checkbox", { name: "Martes" }));
    fireEvent.press(within(screen.getByTestId("day-hours")).getByRole("checkbox", { name: "07:00" }));
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Guardar" }));
    });

    expect(availabilityService.replace).toHaveBeenCalledWith(7, 70, {
      "1": [9, 18, 19, 20, 21, 22],
      "2": [7],
      "3": [18, 19, 20, 21, 22, 23],
    });
  });

  it("una sede con horas sueltas se abre «Por día», con su primer día", async () => {
    jest.mocked(profileDetailsService.get).mockResolvedValue(
      profileDetails({ availability: [{ ...profileClub, week: { "4": [9, 10, 17] } }] }),
    );
    renderWithProviders(<ProfileEditorSheet />);
    act(() => useProfileEditorStore.getState().open("availability"));

    expect(await screen.findByRole("tab", { name: "Por día", selected: true })).toBeTruthy();
    expect(screen.getByRole("checkbox", { name: "Jueves", checked: true })).toBeTruthy();
    expect(within(screen.getByTestId("day-hours")).getByRole("checkbox", { name: "17:00", checked: true })).toBeTruthy();
  });

  it("volver a «Por franja» marca las franjas de la semana editada «Por día»", async () => {
    renderWithProviders(<ProfileEditorSheet />);
    act(() => useProfileEditorStore.getState().open("availability"));

    fireEvent.press(await screen.findByRole("tab", { name: "Por día" }));
    fireEvent.press(screen.getByRole("checkbox", { name: "Miércoles" }));
    for (const hour of ["18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]) {
      fireEvent.press(within(screen.getByTestId("day-hours")).getByRole("checkbox", { name: hour }));
    }
    fireEvent.press(screen.getByRole("tab", { name: "Por franja" }));

    expect(screen.getByRole("checkbox", { name: "Noche", checked: true })).toBeTruthy();
    expect(screen.getByRole("checkbox", { name: "Lunes", checked: true })).toBeTruthy();
    expect(screen.getByRole("checkbox", { name: "Miércoles", checked: false })).toBeTruthy();
  });
});
