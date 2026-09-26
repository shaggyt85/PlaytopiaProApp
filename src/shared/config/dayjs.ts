import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

// dayjs configurado una sola vez. Solo se usa para cálculos con zonas
// horarias (shared/utils/clubClock); lo que ve el usuario se formatea con
// shared/utils/formatDate, que usa Intl y el idioma activo. Por eso aquí no
// se cargan idiomas de dayjs.
dayjs.extend(utc);
dayjs.extend(timezone);

export { dayjs };
