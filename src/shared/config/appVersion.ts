import Constants from "expo-constants";

/**
 * La versión instalada: la de `package.json`, que `app.config.js` mete en la
 * build. La que se enseña en el acceso y la que se compara con Core en el
 * version-check. Un OTA no la cambia. `null` si no se sabe (no se compara).
 */
export const APP_VERSION: string | null = Constants.expoConfig?.version ?? null;
