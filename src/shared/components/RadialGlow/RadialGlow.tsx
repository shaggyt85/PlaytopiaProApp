import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

import { styles } from "./RadialGlow.styles";

/** Un resplandor: un círculo de color que se apaga hacia fuera. */
export interface Glow {
  color: string;
  /** Opacidad en el centro. */
  opacity: number;
  /** Centro y radio, en puntos dentro de la caja. */
  cx: number;
  cy: number;
  r: number;
  /** Hasta qué fracción del radio llega el color antes de apagarse del todo (0–1). */
  reach: number;
}

interface RadialGlowProps {
  width: number;
  height: number;
  glows: readonly Glow[];
}

/**
 * Resplandores radiales detrás del contenido: los del fondo de marca y el halo
 * borroso de una tarjeta (el `blur-3xl` de Lovable, que React Native no tiene).
 * Se pintan con `react-native-svg`, sin tocar nada del contenido y sin recibir
 * toques.
 */
export function RadialGlow({ width, height, glows }: RadialGlowProps) {
  return (
    <Svg style={styles.fill} width={width} height={height} pointerEvents="none">
      <Defs>
        {glows.map((glow, index) => (
          <RadialGradient
            key={index}
            id={`glow-${index}`}
            cx={glow.cx}
            cy={glow.cy}
            r={glow.r}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0" stopColor={glow.color} stopOpacity={glow.opacity} />
            <Stop offset={glow.reach} stopColor={glow.color} stopOpacity={0} />
          </RadialGradient>
        ))}
      </Defs>
      {glows.map((_, index) => (
        <Rect key={index} width={width} height={height} fill={`url(#glow-${index})`} />
      ))}
    </Svg>
  );
}
