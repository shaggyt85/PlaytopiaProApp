import { IconLoCalendarDays, IconLoMail, IconLoPhone, IconLoUser } from "@playtopia/icons/react-native";

import { GENDER_OPTIONS } from "@/shared/config/gender";
import type { t as translate } from "@/shared/config/i18n";
import type { IconComponent } from "@/shared/config/icons";
import type { TeacherProfile } from "@/shared/schemas/teacherProfile.schema";
import { formatNumericDate } from "@/shared/utils/formatDate";

/** Una línea de datos de una tarjeta de Perfil: su icono y su texto ya listo. */
export interface InfoRow {
  key: string;
  Icon: IconComponent;
  label: string;
}

type PersonalData = Pick<TeacherProfile, "email" | "phone_number" | "birthday" | "gender">;

/**
 * Los datos personales que se enseñan, en el orden del prototipo: email,
 * teléfono, nacimiento y género. Lo que no tiene no sale (sin «Sin teléfono»):
 * se rellena al editar.
 */
export function personalRows(data: PersonalData, t: typeof translate): InfoRow[] {
  const gender = GENDER_OPTIONS.find((option) => option.value === data.gender);
  const rows: (InfoRow | null)[] = [
    data.email.trim() ? { key: "email", Icon: IconLoMail, label: data.email } : null,
    data.phone_number.trim() ? { key: "phone", Icon: IconLoPhone, label: data.phone_number } : null,
    // Core la guarda con hora ("1990-05-15T00:00:00"): es una fecha de calendario.
    data.birthday ? { key: "birthday", Icon: IconLoCalendarDays, label: formatNumericDate(data.birthday.slice(0, 10)) } : null,
    gender ? { key: "gender", Icon: IconLoUser, label: t(gender.label) } : null,
  ];
  return rows.filter((row): row is InfoRow => row !== null);
}
