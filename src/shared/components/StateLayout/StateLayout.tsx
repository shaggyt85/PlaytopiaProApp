import { View, type ViewProps } from "react-native";

import { useStyles } from "./StateLayout.styles";

/** Disposición común de LoadingState, ErrorState y EmptyState (centrada). */
export function StateLayout({ style, ...rest }: ViewProps) {
  const styles = useStyles();
  return <View style={[styles.container, style]} {...rest} />;
}
