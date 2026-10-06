/**
 * La lista con ese elemento quitado si estaba o añadido al final si no, sin
 * tocar la de entrada. Única forma de marcar y desmarcar en los editores de
 * Perfil: especialidades, franjas, días y horas.
 */
export const toggleIn = <T,>(list: readonly T[], item: T): T[] =>
  list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
