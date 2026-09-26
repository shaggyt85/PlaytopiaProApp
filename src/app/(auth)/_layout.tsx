import { Stack } from "expo-router";

// Rutas sin sesión: login, registro, recuperar contraseña.
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
