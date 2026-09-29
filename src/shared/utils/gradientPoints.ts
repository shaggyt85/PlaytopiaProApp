/** Los `start` y `end` de `LinearGradient`, en fracciones de la caja. */
export interface GradientPoints {
  start: { x: number; y: number };
  end: { x: number; y: number };
}

// Con cuatro decimales basta para pintar, y así 135° da justo (0, 0) → (1, 1).
const round = (value: number) => Math.round(value * 10_000) / 10_000 || 0;

/**
 * Un ángulo de CSS (`linear-gradient(160deg, …)`: 0° hacia arriba, 90° hacia la
 * derecha) pasado a los puntos de `LinearGradient`. La línea va por el centro y
 * se alarga hasta las esquinas, como en CSS, así el primer y el último color
 * quedan en ellas.
 */
export function gradientPoints(angleDeg: number): GradientPoints {
  const radians = (angleDeg * Math.PI) / 180;
  const dx = Math.sin(radians);
  const dy = -Math.cos(radians);
  const half = (Math.abs(dx) + Math.abs(dy)) / 2;
  return {
    start: { x: round(0.5 - dx * half), y: round(0.5 - dy * half) },
    end: { x: round(0.5 + dx * half), y: round(0.5 + dy * half) },
  };
}
