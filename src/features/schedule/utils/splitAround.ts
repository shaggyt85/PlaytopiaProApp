// Marca que no aparece en ningún texto: donde cae, va el dato.
const MARK = "\u0000";

/**
 * Un texto traducido partido alrededor de su dato, para pintar el dato con otro
 * estilo sin concatenar frases: «Filtrado por %{day}» → ["Filtrado por ", ""],
 * y el día va entre las dos partes, en negrita. Cada idioma pone el dato donde
 * le toca.
 */
export function splitAround(render: (mark: string) => string): [before: string, after: string] {
  const [before = "", after = ""] = render(MARK).split(MARK);
  return [before, after];
}
