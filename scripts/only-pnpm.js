/**
 * Guard de gestor de paquetes: este proyecto se instala SOLO con pnpm.
 *
 * EAS Build elige el gestor según el lockfile que encuentra. Un `npm install`
 * accidental genera un `package-lock.json`, y a partir de ahí el build puede
 * instalar con npm y un lock que nadie mantiene, y fallar en
 * "Install dependencies" con un error que no apunta a la causa. Mejor
 * cortarlo aquí, con un mensaje que se entienda.
 *
 * Solo corre en instalaciones (`preinstall`); `npm run start`, `npm test` y
 * cualquier otro `npm run` no lo disparan y siguen funcionando igual.
 */
const userAgent = process.env.npm_config_user_agent || "";

if (!userAgent.startsWith("pnpm")) {
  const gestor = userAgent.split("/")[0] || "otro gestor";
  console.error(`
┌───────────────────────────────────────────────────────────────┐
│  Este proyecto se instala con pnpm, no con ${gestor}.
│
│  Usa:   pnpm install          (en vez de npm install)
│         pnpm add <paquete>    (en vez de npm install <paquete>)
│
│  Los scripts no cambian: npm run start, npm test y npx siguen
│  funcionando igual.
│
│  Motivo: instalar con npm genera package-lock.json, y EAS Build
│  elige el gestor por el lockfile.
└───────────────────────────────────────────────────────────────┘
`);
  process.exit(1);
}
