import { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, TextInput, View } from "react-native";

import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { COUNTRIES, flagEmoji } from "./countries";
import { useStyles } from "./CountryPickerModal.styles";

interface CountryPickerModalProps {
  visible: boolean;
  /** País elegido ahora; se resalta en la lista. */
  selected: string;
  onSelect: (cca2: string) => void;
  onClose: () => void;
}

/** Lista de países con buscador por nombre, código o prefijo. */
export function CountryPickerModal({ visible, selected, onSelect, onClose }: CountryPickerModalProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t, locale } = useTranslation();
  const [query, setQuery] = useState("");

  // Al salir se limpia la búsqueda: al reabrir con el filtro anterior
  // parecería que faltan países.
  const close = () => {
    setQuery("");
    onClose();
  };
  const select = (cca2: string) => {
    setQuery("");
    onSelect(cca2);
  };

  const countries = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = COUNTRIES.map((c) => ({ ...c, name: c.names[locale] }));
    if (!q) return list;
    // Quien sabe su prefijo ("+54") lo teclea antes que el nombre.
    const digits = q.replace(/^\+/, "");
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.cca2.toLowerCase().includes(q) ||
        c.callingCode.some((code) => code.startsWith(digits)),
    );
  }, [query, locale]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={close}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="subtitle">{t("countryPicker.title")}</Text>
          <Pressable
            onPress={close}
            hitSlop={theme.spacing.md}
            accessibilityRole="button"
            accessibilityLabel={t("common.close")}
          >
            <Text style={styles.close}>✕</Text>
          </Pressable>
        </View>

        <TextInput
          style={styles.search}
          placeholder={t("countryPicker.searchPlaceholder")}
          placeholderTextColor={theme.colors.textSecondary}
          accessibilityLabel={t("countryPicker.searchPlaceholder")}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
        />

        <FlatList
          data={countries}
          keyExtractor={(c) => c.cca2}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={15}
          ListEmptyComponent={
            <Text color="textSecondary" align="center" style={styles.empty}>
              {t("countryPicker.empty")}
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={[styles.row, item.cca2 === selected && styles.rowSelected]}
              onPress={() => select(item.cca2)}
              accessibilityRole="button"
              accessibilityLabel={`${item.name} +${item.callingCode[0]}`}
            >
              <Text style={styles.flag}>{flagEmoji(item.cca2)}</Text>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              <Text color="primary" style={styles.code}>
                +{item.callingCode[0]}
              </Text>
            </Pressable>
          )}
        />
      </View>
    </Modal>
  );
}
