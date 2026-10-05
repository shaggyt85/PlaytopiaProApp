import { IconLoActivity, IconLoChevronRight, IconLoClock, IconLoMapPin } from "@playtopia/icons/react-native";
import { memo } from "react";
import { View } from "react-native";

import { IconText } from "@/shared/components/IconText";
import { PressableScale } from "@/shared/components/PressableScale";
import { StripeCard } from "@/shared/components/StripeCard";
import { StudentAvatars } from "@/shared/components/StudentAvatars";
import { Text } from "@/shared/components/Text";
import type { ColorPair } from "@/shared/config/theme";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { withAlpha } from "@/shared/utils/color";
import { joinParts } from "@/shared/utils/joinParts";
import { studentsLabel } from "@/shared/utils/seatsLabel";

import type { TeacherGroup } from "../../utils/groupsFromAgenda";
import { groupWhen } from "../../utils/groupWhen";

import { CHEVRON_SIZE, LEVEL_ICON_SIZE, useStyles } from "./GroupCard.styles";

interface GroupCardProps {
  group: TeacherGroup;
  /** Su color en la lista: la franja, los iconos, el nivel y las plazas. */
  colors: ColorPair;
  /** El nombre de su sede (`clubOf(…).label`); vacío si ya no está en «Mis clubes». */
  clubLabel: string;
  onPress: (group: TeacherGroup) => void;
}

/**
 * Un grupo en «Mis grupos», como el prototipo: la franja de su color, el título
 * y el nivel, cuándo es («Lunes, miércoles · 18:00–19:30»), la sede y la pista
 * y, abajo, los círculos de sus alumnos con las plazas libres y «2/4 alumnos».
 * Todo de su próxima clase. Se lee de una vez.
 *
 * Provisional: el nivel lleva `IconLoActivity` hasta que `@playtopia/icons`
 * publique `IconLoBarChart2` (1.10.0).
 */
export const GroupCard = memo(function GroupCard({ group, colors, clubLabel, onPress }: GroupCardProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { next } = group;
  const when = groupWhen(group, t);
  const place = joinParts([clubLabel, next.track_name]);
  const seats = studentsLabel(next, t);

  return (
    <PressableScale
      onPress={() => onPress(group)}
      accessibilityLabel={joinParts([next.title, t("schedule.next.level", { range: next.level_range }), when, place, seats], ", ")}
      testID="group-card"
    >
      <StripeCard stripe={colors.gradient}>
        <View style={styles.content}>
          <View style={styles.top}>
            <View style={styles.titles}>
              <Text variant="subtitle" numberOfLines={1}>
                {next.title}
              </Text>
              <View style={styles.level}>
                <IconLoActivity size={LEVEL_ICON_SIZE} color={colors.color} />
                <Text variant="rowTitle" style={{ color: colors.color }}>
                  {next.level_range}
                </Text>
              </View>
            </View>
            <View style={styles.chevron}>
              <IconLoChevronRight size={CHEVRON_SIZE} color={theme.colors.textSecondary} />
            </View>
          </View>

          <View style={styles.meta}>
            <IconText Icon={IconLoClock} label={when} size="card" iconTint={colors.color} />
            {place ? (
              <IconText Icon={IconLoMapPin} label={place} size="card" iconTint={colors.color} numberOfLines={1} />
            ) : null}
          </View>

          <View style={styles.footer}>
            <StudentAvatars students={next.students} capacity={next.max_participants} />
            <View style={[styles.seats, { backgroundColor: withAlpha(colors.color, 0.1) }]}>
              <Text variant="timeBadge" style={{ color: colors.color }}>
                {seats}
              </Text>
            </View>
          </View>
        </View>
      </StripeCard>
    </PressableScale>
  );
});
