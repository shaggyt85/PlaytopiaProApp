#!/usr/bin/env node
/**
 * Sube la versión de la app para una release a tienda (guía §14).
 *
 * La versión vive en un solo sitio, package.json, y app.config.js la lee de ahí:
 * con dos copias se separan (en la appStudent, package.json dice 2.0.3 y
 * app.config.js 2.0.4). Es la que compara Core en el version-check para obligar
 * a actualizar, así que tiene que subir de verdad en cada release.
 *
 * El build (versionCode / buildNumber) no se toca: lo sube EAS en cada build.
 *
 * Uso:
 *   pnpm release patch   # 1.0.0 → 1.0.1  correcciones
 *   pnpm release minor   # 1.0.1 → 1.1.0  funcionalidad nueva
 *   pnpm release major   # 1.1.0 → 2.0.0  cambios incompatibles
 *
 * Hace el commit `chore(release): X.Y.Z` y la etiqueta `vX.Y.Z`. No hace push:
 * eso es `git push --follow-tags`, a mano.
 */

const { execFileSync } = require("node:child_process");
const { readFileSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

const KINDS = ["patch", "minor", "major"];

/** La versión siguiente según SemVer. Solo acepta `MAJOR.MINOR.PATCH`. */
function bumpVersion(version, kind) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) throw new Error(`La versión actual no es MAJOR.MINOR.PATCH: "${version}"`);
  if (!KINDS.includes(kind)) {
    throw new Error(`Tipo de subida no válido: "${kind}". Usa ${KINDS.join(", ")}.`);
  }
  const [major, minor, patch] = match.slice(1).map(Number);
  if (kind === "major") return `${major + 1}.0.0`;
  if (kind === "minor") return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

function git(...args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

function main() {
  const kind = process.argv[2];
  const packagePath = join(__dirname, "..", "package.json");
  const text = readFileSync(packagePath, "utf8");
  const current = JSON.parse(text).version;
  const next = bumpVersion(current, kind);

  // Con cambios a medias, el commit de la release se los llevaría dentro.
  if (git("status", "--porcelain") !== "") {
    throw new Error("Hay cambios sin commitear. Commitea o descártalos antes de la release.");
  }
  if (git("tag", "--list", `v${next}`) !== "") {
    throw new Error(`La etiqueta v${next} ya existe.`);
  }

  // Se reemplaza el texto y no se reescribe el JSON, para no tocar el formato.
  const updated = text.replace(`"version": "${current}"`, `"version": "${next}"`);
  writeFileSync(packagePath, updated);

  git("add", "package.json");
  git("commit", "-m", `chore(release): ${next}`);
  git("tag", "-a", `v${next}`, "-m", next);

  console.log(`Versión ${current} → ${next} (commit y etiqueta v${next}).`);
  console.log("Siguiente:");
  console.log("  git push --follow-tags");
  console.log("  eas build -p all --profile production --auto-submit");
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { bumpVersion };
