import { useCallback, type ReactElement } from "react";
import { ActivityIndicator, RefreshControl, View, type ListRenderItem } from "react-native";

import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import { TabFlatList } from "@/shared/components/TabFlatList";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";

import type { SchoolCard as SchoolCardData } from "../../schemas/network.schema";
import { sedeKey } from "../../utils/sedeKey";
import { SchoolCard } from "../SchoolCard";

import { useStyles } from "./SchoolCardList.styles";

export interface SchoolCardListProps {
  /** Sin datos todavía: `undefined` (se está cargando o ha fallado). */
  schools: readonly SchoolCardData[] | undefined;
  /** Error de la carga; solo se enseña si no hay nada que pintar. */
  error: unknown;
  onRetry: () => void | Promise<unknown>;
  /** Textos ya traducidos para la lista vacía. */
  empty: { title: string; message: string };
  /** Lo que va sobre la lista (cabecera de la pantalla, pestañas). */
  header?: ReactElement | null;
  refreshing: boolean;
  onRefresh: () => void;
  /** Para pedir la página siguiente; quien lo pasa decide si toca. */
  onEndReached?: () => void;
  isFetchingNextPage?: boolean;
  testID?: string;
}

// A un 30 % de pantalla del final, como la lista de clubes de alumnos.
const END_REACHED_THRESHOLD = 0.3;

/**
 * Lista de tarjetas de sede de una pestaña. Los estados van dentro de la lista
 * para que la cabecera y las pestañas no desaparezcan: cargando, error con
 * «Reintentar» si no hay nada que enseñar, y vacía. Si falla una recarga o la
 * página siguiente, se siguen viendo las sedes que había.
 */
export function SchoolCardList({
  schools,
  error,
  onRetry,
  empty,
  header,
  refreshing,
  onRefresh,
  onEndReached,
  isFetchingNextPage = false,
  testID,
}: SchoolCardListProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();

  const renderItem = useCallback<ListRenderItem<SchoolCardData>>(
    ({ item }) => (
      <View style={styles.item}>
        <SchoolCard card={item} testID={testID ? `${testID}-${sedeKey(item)}` : undefined} />
      </View>
    ),
    [styles.item, testID],
  );

  const renderSeparator = useCallback(() => <View style={styles.separator} />, [styles.separator]);

  let emptyContent: ReactElement;
  if (schools) emptyContent = <EmptyState title={empty.title} message={empty.message} />;
  else if (error) emptyContent = <ErrorState error={error} onRetry={onRetry} />;
  else emptyContent = <LoadingState />;

  return (
    <TabFlatList
      data={schools}
      keyExtractor={sedeKey}
      renderItem={renderItem}
      ItemSeparatorComponent={renderSeparator}
      header={header}
      ListEmptyComponent={emptyContent}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator
            style={styles.footer}
            color={theme.colors.primary}
            accessibilityLabel={t("common.loading")}
          />
        ) : null
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={END_REACHED_THRESHOLD}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary}
          colors={[theme.colors.primary]}
        />
      }
      testID={testID}
    />
  );
}
