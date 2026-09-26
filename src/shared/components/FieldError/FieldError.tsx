import { Text } from "@/shared/components/Text";

/**
 * Mensaje de error bajo un campo, ya traducido. Nada si no hay. Se anuncia
 * solo en lectores de pantalla al aparecer.
 */
export function FieldError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <Text variant="caption" accessibilityLiveRegion="polite">
      {message}
    </Text>
  );
}
