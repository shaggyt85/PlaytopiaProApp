import { ENDPOINTS } from "@/shared/config/endpoints";
import type { IHttpClient } from "@/shared/services/BaseHttpClient";
import { httpClient } from "@/shared/services/httpClient";

import { ClubAvailabilitySchema, type ClubAvailability } from "../schemas/profileDetails.schema";
import type { WeeklyHours } from "../schemas/weeklyHours.schema";

/** La semana del profesor en una de sus sedes. */
export interface IAvailabilityService {
  /**
   * Sustituye su semana en esa sede (vacía, la borra) y devuelve la sede con la
   * semana como quedó (las horas ordenadas y sin repetir).
   */
  replace(dbId: number, clubId: number, week: WeeklyHours): Promise<ClubAvailability>;
}

export class AvailabilityService implements IAvailabilityService {
  constructor(private readonly http: IHttpClient) {}

  async replace(dbId: number, clubId: number, week: WeeklyHours): Promise<ClubAvailability> {
    return this.http.put(ENDPOINTS.MOBILE_TEACHER.AVAILABILITY(dbId, clubId), { week }, ClubAvailabilitySchema);
  }
}

export const availabilityService: IAvailabilityService = new AvailabilityService(httpClient);
