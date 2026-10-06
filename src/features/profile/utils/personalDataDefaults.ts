import { splitPhone } from "@/shared/components/PhoneInput";
import { GENDER } from "@/shared/config/gender";
import type { PersonalDataFormInput } from "@/shared/schemas/personalData.schema";
import type { TeacherProfile } from "@/shared/schemas/teacherProfile.schema";

type PersonalData = Pick<TeacherProfile, "name" | "last_name" | "email" | "phone_number" | "birthday" | "gender">;

const GENDERS: readonly PersonalDataFormInput["gender"][] = Object.values(GENDER);

/**
 * El formulario de datos personales relleno con lo guardado: el teléfono
 * separado en país y número (`splitPhone`), la fecha sin la hora y un género
 * que no está entre las opciones, «no lo dice». Lo contrario de
 * `toPersonalDataRequest`.
 */
export function personalDataDefaults(profile: PersonalData): PersonalDataFormInput {
  const { country, number } = splitPhone(profile.phone_number);
  return {
    firstName: profile.name,
    lastName: profile.last_name,
    email: profile.email,
    country,
    phone: number,
    // Core la guarda con hora ("1990-05-15T00:00:00"): es una fecha de calendario.
    birthday: profile.birthday ? profile.birthday.slice(0, 10) : "",
    gender: GENDERS.find((gender) => gender === profile.gender) ?? GENDER.NONE,
  };
}
