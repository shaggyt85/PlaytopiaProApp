// Tests en __tests__/, espejo de src/: a src/x/y.ts le corresponde
// __tests__/x/y.test.ts. helpers/ y setup/ son lo único fuera del espejo.
module.exports = {
  preset: "jest-expo",
  testMatch: ["<rootDir>/__tests__/**/*.test.(ts|tsx)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup/jest.setup.tsx"],
  // Cada test empieza con los mocks sin llamadas previas (no borra sus implementaciones).
  clearMocks: true,
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/index.ts"],
  coverageDirectory: "coverage",
};
