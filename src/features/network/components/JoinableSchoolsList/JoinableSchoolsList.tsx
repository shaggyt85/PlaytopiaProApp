import { useCallback, type ReactElement } from "react";

import { useTranslation } from "@/shared/hooks/useTranslation";

import { useJoinableSchools } from "../../hooks/useJoinableSchools";
import { useRefreshing } from "../../hooks/useRefreshing";
import { SchoolCardList } from "../SchoolCardList";

interface JoinableSchoolsListProps {
  header?: ReactElement | null;
  /** Solo pide con la pestaña a la vista (ver `useJoinableSchools`). */
  enabled: boolean;
}

/**
 * «Cerca de mí»: las sedes a las que puede pedir unirse, de página en página al
 * llegar al final. Si la página siguiente falla, no se enseña nada: se vuelve a
 * intentar al llegar otra vez al final.
 */
export function JoinableSchoolsList({ header, enabled }: JoinableSchoolsListProps) {
  const { t } = useTranslation();
  const { data, error, hasNextPage, isFetchingNextPage, fetchNextPage, refetch, refresh } =
    useJoinableSchools({ enabled });
  const { refreshing, onRefresh } = useRefreshing(refresh);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <SchoolCardList
      schools={data?.schools}
      error={error}
      onRetry={refetch}
      empty={{ title: t("network.nearMe.emptyTitle"), message: t("network.nearMe.emptyMessage") }}
      header={header}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
      isFetchingNextPage={isFetchingNextPage}
      testID="joinable-schools-list"
    />
  );
}
