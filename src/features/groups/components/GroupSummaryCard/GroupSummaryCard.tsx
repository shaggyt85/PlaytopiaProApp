import { IconLoCalendarDays, IconLoMapPin } from "@playtopia/icons/react-native";
import { View } from "react-native";

import { Chevron } from "@/shared/components/Chevron";
import { DiagonalGradient } from "@/shared/components/DiagonalGradient";
import { IconText } from "@/shared/components/IconText";
import { PressableScale } from "@/shared/components/PressableScale";
import { SectionLabel } from "@/shared/components/SectionLabel";
import { Text } from "@/shared/components/Text";
import { LEVEL_ICON } from "@/shared/config/icons";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { joinParts } from "@/shared/utils/joinParts";

import { groupColors } from "../../utils/groupColors";
import { groupPlace } from "../../utils/groupPlace";
import type { TeacherGroup } from "../../utils/groupsFromAgenda";
import { groupWhen } from "../../utils/groupWhen";

import { useStyles } from "./GroupSummaryCard.styles";

interface GroupSummaryCardProps {
  group: TeacherGroup;
  /** El nombre de su sede (`clubOf(…).label`); vacío si ya no está en «Mis clubes». */
  clubLabel: string;
  /** Vuelve a su detalle. */
  onPress: () => void;
}

/**
 * «Su grupo» en la ficha de un alumno, como el prototipo: sobre el
 * `gradient-ink`, el punto de su color y su nombre, cuándo es, la sede y la
 * pista y su rango de nivel. Todo de su próxima clase, como el detalle del grupo.
 */
export function GroupSummaryCard({ group, clubLabel, onPress }: GroupSummaryCardProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { next } = group;
  const when = groupWhen(group, t);
  const place = groupPlace(next, clubLabel);

  return (
    <PressableScale
      onPress={onPress}
      accessibilityLabel={joinParts(
        [t("groups.student.group"), next.title, when, place, `${t("groups.student.groupRange")} ${next.level_range}`],
        ", ",
      )}
      accessibilityHint={t("groups.student.openGroup")}
      style={styles.card}
      testID="student-group"
    >
      <DiagonalGradient colors={theme.gradients.ink} angle={160} style={styles.fill} />
      <SectionLabel label={t("groups.student.group")} />
      <View style={styles.titleRow}>
        <View style={[styles.dot, { backgroundColor: groupColors(next, theme.clubColors).color }]} />
        <Text variant="cardTitle" numberOfLines={1} style={styles.name}>
          {next.title}
        </Text>
        <Chevron />
      </View>
      <View style={styles.lines}>
        <IconText Icon={IconLoCalendarDays} label={when} size="card" />
        {place ? <IconText Icon={IconLoMapPin} label={place} size="card" numberOfLines={1} /> : null}
      </View>
      <View style={styles.range}>
        <IconText Icon={LEVEL_ICON} label={t("groups.student.groupRange")} size="card" style={styles.rangeLabel} />
        <Text variant="rowLabel">{next.level_range}</Text>
      </View>
    </PressableScale>
  );
}
