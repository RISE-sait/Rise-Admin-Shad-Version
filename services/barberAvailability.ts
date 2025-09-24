import getValue from "@/configs/constants";

export type BarberAvailabilityDay = {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

type RawBarberAvailabilityDay = {
  id?: string;
  Id?: string;
  day_of_week?: number;
  dayOfWeek?: number;
  DayOfWeek?: number;
  start_time?: string;
  startTime?: string;
  StartTime?: string;
  end_time?: string;
  endTime?: string;
  EndTime?: string;
  is_active?: boolean;
  isActive?: boolean;
  IsActive?: boolean;
  created_at?: string;
  createdAt?: string;
  CreatedAt?: string;
  updated_at?: string;
  updatedAt?: string;
  UpdatedAt?: string;
};

export type WeeklyAvailabilityResponse = {
  barber_id?: string;
  barber_name?: string;
  availability: BarberAvailabilityDay[];
};

type BulkAvailabilityEntry = {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active?: boolean;
};

export type BulkAvailabilityPayload = {
  availability: BulkAvailabilityEntry[];
};

type RawWeeklyAvailabilityResponse = {
  availability?: RawBarberAvailabilityDay[];
  Availability?: RawBarberAvailabilityDay[];
  barber_id?: string;
  barberId?: string;
  BarberId?: string;
  barber_name?: string;
  barberName?: string;
  BarberName?: string;
};

function firstDefined<T>(...values: (T | undefined | null)[]): T | undefined {
  for (const value of values) {
    if (value !== undefined && value !== null) {
      return value;
    }
  }

  return undefined;
}

function normalizeAvailabilityDay(
  record: RawBarberAvailabilityDay
): BarberAvailabilityDay | null {
  const dayOfWeek = firstDefined(
    record.day_of_week,
    record.dayOfWeek,
    record.DayOfWeek
  );

  if (typeof dayOfWeek !== "number") {
    return null;
  }

  const startTime = firstDefined(
    record.start_time,
    record.startTime,
    record.StartTime
  );
  const endTime = firstDefined(record.end_time, record.endTime, record.EndTime);
  const isActive = firstDefined(
    record.is_active,
    record.isActive,
    record.IsActive
  );

  return {
    id: firstDefined(record.id, record.Id),
    day_of_week: dayOfWeek,
    start_time: typeof startTime === "string" ? startTime : "",
    end_time: typeof endTime === "string" ? endTime : "",
    is_active: typeof isActive === "boolean" ? isActive : undefined,
    created_at: firstDefined(
      record.created_at,
      record.createdAt,
      record.CreatedAt
    ),
    updated_at: firstDefined(
      record.updated_at,
      record.updatedAt,
      record.UpdatedAt
    ),
  };
}

function normalizeWeeklyAvailabilityResponse(
  data: unknown
): WeeklyAvailabilityResponse {
  if (!data || typeof data !== "object") {
    return { availability: [] };
  }

  const cast = data as RawWeeklyAvailabilityResponse;
  const availabilitySource = Array.isArray(cast.availability)
    ? cast.availability
    : Array.isArray(cast.Availability)
      ? cast.Availability
      : [];

  const availability = availabilitySource
    .map((item) => normalizeAvailabilityDay(item))
    .filter((item): item is BarberAvailabilityDay => Boolean(item));

  return {
    barber_id: firstDefined(cast.barber_id, cast.barberId, cast.BarberId),
    barber_name: firstDefined(
      cast.barber_name,
      cast.barberName,
      cast.BarberName
    ),
    availability,
  };
}

function serializeBulkAvailabilityPayload(payload: BulkAvailabilityPayload) {
  return {
    availability: payload.availability.map((entry) => {
      const serialized: Record<string, unknown> = {
        DayOfWeek: entry.day_of_week,
        StartTime: entry.start_time,
        EndTime: entry.end_time,
      };

      if (entry.is_active !== undefined) {
        serialized.IsActive = entry.is_active;
      }

      if (entry.id) {
        serialized.Id = entry.id;
      }

      return serialized;
    }),
  };
}

async function parseWeeklyAvailabilityResponse(
  response: Response
): Promise<WeeklyAvailabilityResponse> {
  if (response.status === 204) {
    return { availability: [] };
  }

  try {
    const data = await response.json();
    return normalizeWeeklyAvailabilityResponse(data);
  } catch {
    return { availability: [] };
  }
}

export async function getBarberAvailability(
  barberId: string,
  jwt: string
): Promise<WeeklyAvailabilityResponse> {
  const encodedId = encodeURIComponent(barberId);
  const baseUrl = getValue("API");
  const url = `${baseUrl}haircuts/barbers/me/availability?barber_id=${encodedId}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to fetch barber availability:", errorText);
    throw new Error("Failed to fetch barber availability");
  }

  return parseWeeklyAvailabilityResponse(response);
}

export async function getMyBarberAvailability(
  jwt: string
): Promise<WeeklyAvailabilityResponse> {
  const response = await fetch(
    `${getValue("API")}haircuts/barbers/me/availability`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to fetch barber availability:", errorText);
    throw new Error("Failed to fetch barber availability");
  }

  return parseWeeklyAvailabilityResponse(response);
}

export async function setMyBarberAvailabilityBulk(
  payload: BulkAvailabilityPayload,
  jwt: string
): Promise<WeeklyAvailabilityResponse> {
  const response = await fetch(
    `${getValue("API")}haircuts/barbers/me/availability/bulk`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(serializeBulkAvailabilityPayload(payload)),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to set barber availability:", errorText);
    throw new Error("Failed to set barber availability");
  }

  return parseWeeklyAvailabilityResponse(response);
}

export async function setBarberAvailabilityBulk(
  barberId: string,
  payload: BulkAvailabilityPayload,
  jwt: string
): Promise<WeeklyAvailabilityResponse> {
  const encodedId = encodeURIComponent(barberId);
  const baseUrl = getValue("API");
  const body = JSON.stringify(serializeBulkAvailabilityPayload(payload));
  const url = `${baseUrl}haircuts/barbers/me/availability/bulk?barber_id=${encodedId}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to set barber availability:", errorText);
    throw new Error("Failed to set barber availability");
  }

  if (response.status === 204) {
    return {
      barber_id: barberId,
      availability: payload.availability,
    };
  }

  return parseWeeklyAvailabilityResponse(response);
}
