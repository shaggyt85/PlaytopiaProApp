// Setup común de Jest. Aquí van los mocks globales que necesiten todos los
// tests (módulos nativos, etc.) a medida que la app los vaya usando.

// Variables mínimas para que shared/config/env.ts cargue en los tests. Nunca
// valores reales: los tests no llaman al servidor.
process.env.EXPO_PUBLIC_API_BASE_URL = "https://api.test.local/api";
process.env.EXPO_PUBLIC_USER_TEACHER_SHARED_SECRET = "secreto-de-los-tests";

// AsyncStorage en memoria (mock oficial del paquete).
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// Todos los tests empiezan en español, sea cual sea el idioma del equipo que
// los ejecuta (y aunque un test anterior lo haya cambiado).
beforeEach(async () => {
  const { changeLanguage } = require("@/shared/config/i18n");
  await changeLanguage("es");
});

// Zonas seguras simuladas (mock oficial del paquete).
jest.mock("react-native-safe-area-context", () =>
  require("react-native-safe-area-context/jest/mock").default,
);

// Iconos sin carga asíncrona de fuentes (en tests solo importa que estén).
jest.mock("@expo/vector-icons", () => {
  const { Text } = jest.requireActual("react-native");
  const Icon = ({ name }: { name: string }) => <Text>{name}</Text>;
  return { Ionicons: Icon };
});
