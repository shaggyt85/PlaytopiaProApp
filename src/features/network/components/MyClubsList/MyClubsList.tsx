import type { ReactElement } from "react";

import { useMyClubs } from "@/shared/hooks/useMyClubs";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { useRefreshing } from "../../hooks/useRefreshing";
import { SchoolCardList } from "../SchoolCardList";

interface MyClubsListProps {
  header?: ReactElement | null;
}

/** «Mis clubes»: las sedes donde trabaja. Vacía, le manda a «Cerca de mí». */
export function MyClubsList({ header }: MyClubsListProps) {
  const { t } = useTranslation();
  const { data, error, refetch } = useMyClubs();
  const { refreshing, onRefresh } = useRefreshing(refetch);

  return (
    <SchoolCardList
      schools={data?.clubs}
      error={error}
      onRetry={refetch}
      empty={{ title: t("network.myClubs.emptyTitle"), message: t("network.myClubs.emptyMessage") }}
      header={header}
      refreshing={refreshing}
      onRefresh={onRefresh}
      testID="my-clubs-list"
    />
  );
}
