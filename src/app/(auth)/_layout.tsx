import { Stack } from "expo-router";

import { useTheme } from "@/shared/hooks/useTheme";

// Rutas sin sesión: login, registro, recuperar contraseña. Como en la app de
// alumnos, cada pantalla entra deslizándose desde la derecha (en Android la
// animación por defecto es un fundido corto que se ve de golpe) y sobre el
// fondo del tema, para que no asome el claro del Stack durante el cambio.
export default function AuthLayout() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    />
  );
}
