import { zodResolver } from "@hookform/resolvers/zod";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { useForm } from "react-hook-form";
import { Text, TextInput } from "react-native";
import { z } from "zod";

import { ControlledField } from "@/shared/components/ControlledField";

const Schema = z.object({ name: z.string().min(2, "validation.firstNameMin") });

let trigger: () => Promise<boolean>;

function Form() {
  const { control, trigger: validate } = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: { name: "" },
  });
  trigger = () => validate();
  return (
    <ControlledField
      control={control}
      name="name"
      render={({ value, onChange, error }) => (
        <>
          <TextInput testID="input" value={value} onChangeText={onChange} />
          {error ? <Text>{error}</Text> : null}
        </>
      )}
    />
  );
}

describe("ControlledField", () => {
  it("el campo recibe su valor y lo cambia", () => {
    render(<Form />);

    fireEvent.changeText(screen.getByTestId("input"), "Lucía");

    expect(screen.getByTestId("input").props.value).toBe("Lucía");
  });

  it("el error de su campo llega ya traducido", async () => {
    render(<Form />);

    await act(() => trigger());

    expect(screen.getByText("El nombre debe tener al menos 2 caracteres")).toBeTruthy();
  });
});
