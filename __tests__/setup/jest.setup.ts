// Setup común de Jest. Aquí van los mocks globales que necesiten todos los
// tests (módulos nativos, etc.) a medida que la app los vaya usando.

// Variables mínimas para que shared/config/env.ts cargue en los tests. Nunca
// valores reales: los tests no llaman al servidor.
process.env.EXPO_PUBLIC_API_BASE_URL = "https://api.test.local/api";

// AsyncStorage en memoria (mock oficial del paquete).
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);
