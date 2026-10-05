// https://docs.expo.dev/guides/using-eslint/
const fs = require("node:fs");
const path = require("node:path");

const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

// La estructura de carpetas (CLAUDE.md, «Estructura» 4), comprobada en cada
// `pnpm lint` en vez de a ojo: `shared/` no importa de `features/`, y una
// feature no importa de otra. Una regla por feature, sacada de las carpetas de
// `src/features`: una feature nueva queda cubierta sin tocar este fichero.
const FEATURES_DIR = path.join(__dirname, "src", "features");
const features = fs
  .readdirSync(FEATURES_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const forbidImports = (files, group, message) => ({
  files,
  rules: { "no-restricted-imports": ["error", { patterns: [{ group, message }] }] },
});

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*", "coverage/*", ".expo/*"],
  },
  forbidImports(
    ["src/shared/**/*.{ts,tsx}"],
    ["@/features", "@/features/**"],
    "shared/ no importa de features/: si lo necesitan dos features, va a shared/.",
  ),
  ...features.map((feature) =>
    forbidImports(
      [`src/features/${feature}/**/*.{ts,tsx}`],
      ["@/features/**", `!@/features/${feature}`, `!@/features/${feature}/**`],
      "Una feature no importa de otra: lo que comparten va a shared/.",
    ),
  ),
]);
