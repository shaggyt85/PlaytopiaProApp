import { Text } from "@/shared/components/Text";

/** Error del formulario entero (servidor, red), ya traducido. Nada si no hay. */
export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <Text color="danger" align="center" accessibilityRole="alert">
      {message}
    </Text>
  );
}
