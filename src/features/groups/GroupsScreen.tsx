import { useCallback, useMemo } from "react";
import { View, type ListRenderItem } from "react-native";

import { DataState } from "@/shared/components/DataState";
import { EmptyNote } from "@/shared/components/EmptyNote";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { TabFlatList } from "@/shared/components/TabFlatList";
import { TabScreen } from "@/shared/components/TabScreen";
import { useOpenClass } from "@/shared/hooks/useOpenClass";
import { useScheduleClubs } from "@/shared/hooks/useScheduleClubs";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { colorAt } from "@/shared/utils/colorAt";

import { GroupCard } from "./components";
import { useStyles } from "./GroupsScreen.styles";
import { useTeacherGroups } from "./hooks/useTeacherGroups";
import type { TeacherGroup } from "./utils/groupsFromAgenda";

/**
 * «Mis grupos», como el prototipo: «Mis grupos», cuántos tiene activos y una
 * tarjeta por grupo (`GroupCard`), cada uno con el color de su posición, en
 * ciclo sobre la paleta, como los clubes. Los grupos salen de su agenda
 * (`useTeacherGroups`). Los estados van dentro de la lista, como en «Mis
 * clubes», para que la cabecera no desaparezca: cargando, el error con
 * «Reintentar» y, sin grupos, la tarjeta vacía de siempre.
 *
 * Tocar un grupo abre su próxima clase, hasta que exista su propio detalle.
 */
export function GroupsScreen() {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { groups, hasData, error, refetch } = useTeacherGroups();
  const { clubOf } = useScheduleClubs();
  const openClass = useOpenClass();
  const openGroup = useCallback((group: TeacherGroup) => openClass(group.next), [openClass]);

  const header = useMemo(
    () => (
      <ScreenHeader
        title={t("groups.title")}
        subtitle={hasData ? t("groups.active", { count: groups.length }) : undefined}
      />
    ),
    [t, hasData, groups.length],
  );

  const renderItem = useCallback<ListRenderItem<TeacherGroup>>(
    ({ item, index }) => (
      <View style={styles.item}>
        <GroupCard
          group={item}
          colors={colorAt(theme.clubColors, index)}
          clubLabel={clubOf(item.next).label}
          onPress={openGroup}
        />
      </View>
    ),
    [styles.item, theme.clubColors, clubOf, openGroup],
  );

  const renderSeparator = useCallback(() => <View style={styles.separator} />, [styles.separator]);

  return (
    <TabScreen testID="groups-screen">
      <TabFlatList
        data={groups}
        keyExtractor={(group) => group.key}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        header={header}
        ListEmptyComponent={
          <View style={styles.item}>
            <DataState hasData={hasData} error={error} onRetry={refetch}>
              <EmptyNote message={t("groups.empty")} testID="no-groups" />
            </DataState>
          </View>
        }
      />
    </TabScreen>
  );
}
