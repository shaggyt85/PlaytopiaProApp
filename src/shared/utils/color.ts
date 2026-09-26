/**
 * Un color `#RRGGBB` con transparencia: `withAlpha("#C21D93", 0.25)` →
 * `"rgba(194, 29, 147, 0.25)"`. Así los tonos translúcidos salen de los
 * colores de marca y no se escriben a mano.
 */
export function withAlpha(hex: string, alpha: number): string {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!match) throw new Error(`Color no válido: ${hex} (se espera #RRGGBB)`);
  const value = parseInt(match[1], 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
