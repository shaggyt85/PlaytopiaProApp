import { zodResolver } from "@hookform/resolvers/zod";
import { fireEvent, render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { PersonalDataFields } from "@/shared/components/PersonalDataFields";
import { GENDER } from "@/shared/config/gender";
import { PersonalDataFormSchema, type PersonalDataFormInput } from "@/shared/schemas/personalData.schema";

jest.mock("@react-native-community/datetimepicker", () => jest.requireActual("../../../helpers/dateTimePickerMock"));

const DEFAULTS: PersonalDataFormInput = {
  firstName: "David",
  lastName: "Álvarez",
  email: "david@playtopia.com",
  country: "ES",
  phone: "600123456",
  birthday: "",
  gender: GENDER.NONE,
};

function Form({ children }: { children: ReactNode }) {
  const form = useForm<PersonalDataFormInput>({
    resolver: zodResolver(PersonalDataFormSchema),
    mode: "onTouched",
    defaultValues: DEFAULTS,
  });
  return <FormProvider {...form}>{children}</FormProvider>;
}

describe("PersonalDataFields", () => {
  it("los campos de los datos personales, rellenos con lo que tiene el formulario", () => {
    render(
      <Form>
        <PersonalDataFields />
      </Form>,
    );

    expect(screen.getByDisplayValue("David")).toBeTruthy();
    expect(screen.getByDisplayValue("Álvarez")).toBeTruthy();
    expect(screen.getByDisplayValue("david@playtopia.com")).toBeTruthy();
    expect(screen.getByDisplayValue("600123456")).toBeTruthy();
    expect(screen.getByText("Nombre")).toBeTruthy();
    expect(screen.getByText("Fecha de nacimiento")).toBeTruthy();
  });

  it("el error de un campo sale traducido al dejarlo", async () => {
    render(
      <Form>
        <PersonalDataFields />
      </Form>,
    );

    const name = screen.getByDisplayValue("David");
    fireEvent.changeText(name, "D");
    fireEvent(name, "blur");

    expect(await screen.findByText("El nombre debe tener al menos 2 caracteres")).toBeTruthy();
  });
});
