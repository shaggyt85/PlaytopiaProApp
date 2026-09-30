#!/usr/bin/env node
/**
 * Comprueba que un `eas update` se puede publicar en un canal sin romper nada.
 * Viene de la appStudent (scripts/verificar-antes-de-publicar.mjs), donde cada
 * comprobación corresponde a un incidente real:
 *
 * 1. **Un update apuntando al Core equivocado.** `eas update` genera el bundle en
 *    esta máquina, así que las `EXPO_PUBLIC_*` pueden salir del `.env` local y no
 *    del entorno de EAS. No basta con razonarlo: se mira el bundle generado.
 * 2. **Un update que no llega a nadie.** Con `runtimeVersion` `fingerprint`, EAS
 *    solo entrega el update a los binarios con el mismo runtime. Si ningún build
 *    del canal lo tiene (cambió algo nativo), se avisa antes de publicar.
 *
 * Uso:
 *   node scripts/verify-ota.mjs preview      # el bundle apunta a core-dev
 *   node scripts/verify-ota.mjs production   # el bundle apunta a producción
 *
 * No publica nada: informa y devuelve código de salida 1 si algo no cuadra.
 */

import { execSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = "dist-verify";

// El Core al que tiene que apuntar cada canal, y el que no puede aparecer.
const CHANNELS = {
  preview: { expected: "core-dev.playtopiax.com", forbidden: "core-api.playtopiax.com" },
  production: { expected: "core-api.playtopiax.com", forbidden: "core-dev.playtopiax.com" },
};

const channel = process.argv[2];
if (!CHANNELS[channel]) {
  console.error(`Uso: node scripts/verify-ota.mjs <${Object.keys(CHANNELS).join("|")}>`);
  process.exit(1);
}

let problems = 0;

const step = (title) => console.log(`\n\x1b[1m${title}\x1b[0m`);
const ok = (msg) => console.log(`  \x1b[32m✓\x1b[0m ${msg}`);
const fail = (msg) => {
  console.log(`  \x1b[31m✗\x1b[0m ${msg}`);
  problems++;
};
const warn = (msg) => console.log(`  \x1b[33m!\x1b[0m ${msg}`);

/** Todos los ficheros del bundle, para buscar dentro de los `.hbc`. */
function filesIn(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) out.push(...filesIn(path));
    else out.push(path);
  }
  return out;
}

// ── 1. El bundle, y a qué Core apunta ───────────────────────────────────────
step(`1. Generando el bundle igual que lo hará \`eas update\` (canal ${channel})`);

if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true, force: true });
execSync(`npx expo export --platform all --output-dir ${OUT_DIR}`, {
  stdio: ["ignore", "ignore", "inherit"],
});

const bundle = filesIn(OUT_DIR).map((path) => readFileSync(path, "latin1"));
const countWith = (domain) => bundle.filter((text) => text.includes(domain)).length;

step("2. ¿A qué Core apunta el bundle?");

const { expected, forbidden } = CHANNELS[channel];
const forbiddenCount = countWith(forbidden);
if (forbiddenCount > 0) fail(`${forbidden} está DENTRO del bundle (${forbiddenCount} ficheros)`);
else ok(`${forbidden} no aparece`);

const expectedCount = countWith(expected);
if (expectedCount === 0) fail(`${expected} NO aparece: el bundle no apunta al Core de ${channel}`);
else ok(`${expected} presente (${expectedCount} ficheros)`);

// ── 2. El runtime, contra los builds del canal ──────────────────────────────
step(`3. ¿Hay un build de ${channel} que pueda recibir este update?`);

function fingerprint(platform) {
  const out = execSync(`npx expo-updates fingerprint:generate --platform ${platform}`, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
    maxBuffer: 20 * 1024 * 1024,
  });
  return JSON.parse(out.slice(out.indexOf("{"))).hash;
}

const runtimes = { android: fingerprint("android"), ios: fingerprint("ios") };
console.log(`     android: ${runtimes.android}`);
console.log(`     ios:     ${runtimes.ios}`);

let builds = null;
try {
  const out = execSync(
    `npx eas-cli build:list --platform all --status finished --channel ${channel} --limit 20 --json --non-interactive`,
    { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 120000 },
  );
  builds = JSON.parse(out.slice(out.indexOf("[")));
} catch {
  warn(
    "no se pudieron consultar los builds de EAS (¿sin sesión?). Comprueba a mano que el runtime de arriba coincide con el del build instalado.",
  );
}

if (builds) {
  for (const platform of ["android", "ios"]) {
    const own = builds.filter((b) => (b.platform || "").toLowerCase() === platform);
    const match = own.find((b) => b.runtimeVersion === runtimes[platform]);
    if (match) {
      ok(`${platform}: hay build con este runtime (${match.id?.slice(0, 8)})`);
    } else {
      const seen = [...new Set(own.map((b) => b.runtimeVersion))].slice(0, 3);
      fail(
        `${platform}: NINGÚN build de ${channel} tiene el runtime ${runtimes[platform]}. ` +
          `Los que hay tienen: ${seen.join(", ") || "(ninguno)"}. ` +
          "Este update no llegaría a nadie: hace falta un build nuevo.",
      );
    }
  }
}

// ── 3. Limpieza y veredicto ─────────────────────────────────────────────────
rmSync(OUT_DIR, { recursive: true, force: true });

step(problems === 0 ? "Listo para publicar" : `${problems} problema(s)`);
if (problems > 0) {
  console.log("\n  No publiques hasta resolverlos.\n");
  process.exit(1);
}
console.log(
  `\n  pnpm eas:update:${channel} --message "..."\n` +
    "\n  El update se aplica en el SEGUNDO arranque de la app. Apunta el group ID del\n" +
    "  update anterior para poder hacer `eas update:republish` si algo sale mal.\n",
);
