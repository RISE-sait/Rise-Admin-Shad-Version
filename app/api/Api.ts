/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ApiInternalDomainsTeamDtoRosterMemberInfo {
  assists?: number;
  country?: string;
  email?: string;
  id?: string;
  losses?: number;
  name?: string;
  points?: number;
  rebounds?: number;
  steals?: number;
  wins?: number;
}

export interface CustomerAthleteRegistrationRequestDto {
  country_code?: string;
  /** @example "2000-01-01" */
  dob: string;
  first_name: string;
  gender?: "M" | "F";
  has_consent_to_email_marketing?: boolean;
  has_consent_to_sms?: boolean;
  last_name: string;
  /** @example "+15141234567" */
  phone_number?: string;
  waivers?: CustomerWaiverSigningRequestDto[];
}

export interface CustomerAthleteResponseDto {
  assists?: number;
  losses?: number;
  points?: number;
  rebounds?: number;
  steals?: number;
  wins?: number;
}

export interface CustomerChildRegistrationRequestDto {
  country_code?: string;
  /** @example "2000-01-01" */
  dob: string;
  first_name: string;
  gender?: "M" | "F";
  last_name: string;
  waivers?: CustomerWaiverSigningRequestDto[];
}

export interface CustomerMembershipResponseDto {
  membership_name?: string;
  membership_plan_id?: string;
  membership_plan_name?: string;
  membership_renewal_date?: string;
  membership_start_date?: string;
}

export interface CustomerParentRegistrationRequestDto {
  country_code?: string;
  /** @example "2000-01-01" */
  dob: string;
  first_name: string;
  gender?: "M" | "F";
  has_consent_to_email_marketing?: boolean;
  has_consent_to_sms?: boolean;
  last_name: string;
  /** @example "+15141234567" */
  phone_number?: string;
}

export interface CustomerResponse {
  athlete_info?: CustomerAthleteResponseDto;
  country_code?: string;
  dob?: string;
  email?: string;
  first_name?: string;
  hubspot_id?: string;
  last_name?: string;
  membership_info?: CustomerMembershipResponseDto;
  phone?: string;
  user_id?: string;
}

export interface CustomerStatsUpdateRequestDto {
  assists?: number;
  losses?: number;
  points?: number;
  rebounds?: number;
  steals?: number;
  wins?: number;
}

export interface CustomerWaiverSigningRequestDto {
  is_waiver_signed?: boolean;
  waiver_url: string;
}

export interface EventCustomerResponseDto {
  email?: string;
  first_name?: string;
  gender?: string;
  has_cancelled_enrollment?: boolean;
  id?: string;
  last_name?: string;
  phone?: string;
}

export interface EventDeleteRequestDto {
  /** @minItems 1 */
  ids: string[];
}

export interface EventEventRequestDto {
  /** @example 100 */
  capacity?: number;
  /** @example "2023-10-05T07:00:00Z" */
  end_at: string;
  /** @example "0bab3927-50eb-42b3-9d6b-2350dd00a100" */
  location_id?: string;
  /** @example "f0e21457-75d4-4de6-b765-5ee13221fd72" */
  program_id?: string;
  /** @example "2023-10-05T07:00:00Z" */
  start_at: string;
  /** @example "0bab3927-50eb-42b3-9d6b-2350dd00a100" */
  team_id?: string;
}

export interface EventEventResponseDto {
  capacity?: number;
  created_by?: EventPersonResponseDto;
  customers?: EventCustomerResponseDto[];
  end_at?: string;
  id?: string;
  location?: EventLocationInfo;
  program?: EventProgramInfo;
  staff?: EventStaffResponseDto[];
  start_at?: string;
  team?: EventTeamInfo;
  updated_by?: EventPersonResponseDto;
}

export interface EventLocation {
  address?: string;
  id?: string;
  name?: string;
}

export interface EventLocationInfo {
  address?: string;
  id?: string;
  name?: string;
}

export interface EventPersonResponseDto {
  first_name?: string;
  id?: string;
  last_name?: string;
}

export interface EventProgram {
  id?: string;
  name?: string;
  type?: string;
}

export interface EventProgramInfo {
  id?: string;
  name?: string;
  type?: string;
}

export interface EventRecurrenceRequestDto {
  /** @example 100 */
  capacity?: number;
  /** @example "THURSDAY" */
  day?: string;
  /** @example "23:00:00+00:00" */
  event_end_at: string;
  /** @example "23:00:00+00:00" */
  event_start_at: string;
  /** @example "0bab3927-50eb-42b3-9d6b-2350dd00a100" */
  location_id?: string;
  /** @example "f0e21457-75d4-4de6-b765-5ee13221fd72" */
  program_id?: string;
  /** @example "2023-10-05T07:00:00Z" */
  recurrence_end_at: string;
  /** @example "2023-10-05T07:00:00Z" */
  recurrence_start_at: string;
  /** @example "0bab3927-50eb-42b3-9d6b-2350dd00a100" */
  team_id?: string;
}

export interface EventRecurrenceResponseDto {
  day?: string;
  id?: string;
  location?: EventLocation;
  program?: EventProgram;
  recurrence_end_at?: string;
  recurrence_start_at?: string;
  session_end_at?: string;
  session_start_at?: string;
  team?: EventTeam;
}

export interface EventStaffResponseDto {
  email?: string;
  first_name?: string;
  gender?: string;
  id?: string;
  last_name?: string;
  phone?: string;
  role_name?: string;
}

export interface EventTeam {
  id?: string;
  name?: string;
}

export interface EventTeamInfo {
  id?: string;
  name?: string;
}

export interface GameRequestDto {
  description?: string;
  lose_score?: number;
  lose_team?: string;
  name: string;
  win_score?: number;
  win_team?: string;
}

export interface GameResponseDto {
  created_at?: string;
  description?: string;
  id?: string;
  lose_score?: number;
  lose_team?: string;
  name?: string;
  updated_at?: string;
  win_score?: number;
  win_team?: string;
}

export interface HaircutEventEventResponseDto {
  barber_id?: string;
  barber_name?: string;
  created_at?: string;
  customer_id?: string;
  customer_name?: string;
  end_at?: string;
  id?: string;
  start_at?: string;
  updated_at?: string;
}

export interface HaircutEventRequestDto {
  /** @example "f0e21457-75d4-4de6-b765-5ee13221fd72" */
  barber_id?: string;
  /** @example "2023-10-05T07:00:00Z" */
  begin_time: string;
  /** @example "2023-10-05T07:00:00Z" */
  end_time: string;
  /** @example "Haircut" */
  service_name: string;
}

export interface HaircutServiceBarberServiceResponseDto {
  barber_id?: string;
  barber_name?: string;
  created_at?: string;
  haircut_id?: string;
  haircut_name?: string;
  id?: string;
  updated_at?: string;
}

export interface HaircutServiceCreateBarberServiceRequestDto {
  /** @example "f0e21457-75d4-4de6-b765-5ee13221fd72" */
  barber_id?: string;
  /** @example "f0e21457-75d4-4de6-b765-5ee13221fd72" */
  haircut_service_id?: string;
}

export interface IdentityAthleteResponseDto {
  assists?: number;
  losses?: number;
  points?: number;
  rebounds?: number;
  steals?: number;
  wins?: number;
}

export interface IdentityMembershipReadResponseDto {
  membership_benefits?: string;
  membership_description?: string;
  membership_name?: string;
  plan_name?: string;
  renewal_date?: string;
  start_date?: string;
}

export interface IdentityUserAuthenticationResponseDto {
  age?: string;
  athlete_info?: IdentityAthleteResponseDto;
  country_code?: string;
  email?: string;
  first_name?: string;
  gender?: string;
  id?: string;
  is_active_staff?: boolean;
  last_name?: string;
  membership_info?: IdentityMembershipReadResponseDto;
  phone?: string;
  role?: string;
}

export interface LocationRequestDto {
  address: string;
  name: string;
}

export interface LocationResponseDto {
  address?: string;
  id?: string;
  name?: string;
}

export interface MembershipRequestDto {
  /** @example "Access to all premium features" */
  description?: string;
  /** @example "Premium Membership" */
  name: string;
}

export interface MembershipResponse {
  benefits?: string;
  created_at?: string;
  description?: string;
  id?: string;
  name?: string;
  updated_at?: string;
}

export interface MembershipPlanPlanRequestDto {
  amt_periods?: number;
  membership_id: string;
  name?: string;
  stripe_joining_fees_id?: string;
  stripe_price_id: string;
}

export interface MembershipPlanPlanResponse {
  amt_periods?: number;
  created_at?: string;
  id?: string;
  membership_id?: string;
  name?: string;
  stripe_joining_fees_id?: string;
  stripe_price_id?: string;
  updated_at?: string;
}

export interface PaymentCheckoutResponseDto {
  payment_url?: string;
}

export interface ProgramLevelsResponse {
  levels?: string[];
}

export interface ProgramRequestDto {
  capacity?: number;
  description?: string;
  level: string;
  name: string;
  type: string;
}

export interface ProgramResponse {
  capacity?: number;
  created_at?: string;
  description?: string;
  id?: string;
  level?: string;
  name?: string;
  type?: string;
  updated_at?: string;
}

export interface StaffCoachStatsResponseDto {
  losses?: number;
  wins?: number;
}

export interface StaffRegistrationRequestDto {
  country_code?: string;
  /** @example "2000-01-01" */
  dob: string;
  first_name: string;
  gender?: "M" | "F";
  is_active_staff?: boolean;
  last_name: string;
  /** @example "+15141234567" */
  phone_number?: string;
  role: string;
}

export interface StaffRequestDto {
  is_active: boolean;
  role_name: string;
}

export interface StaffResponseDto {
  coach_stats?: StaffCoachStatsResponseDto;
  country_code?: string;
  created_at?: string;
  email?: string;
  first_name?: string;
  hubspot_id?: string;
  id?: string;
  is_active?: boolean;
  last_name?: string;
  phone?: string;
  role_name?: string;
  updated_at?: string;
}

export interface StaffActivityLogsStaffActivityLogResponse {
  activity_description?: string;
  created_at?: string;
  email?: string;
  first_name?: string;
  id?: string;
  last_name?: string;
  staff_id?: string;
}

export interface TeamCoach {
  email?: string;
  id?: string;
  name?: string;
}

export interface TeamRequestDto {
  capacity: number;
  /** @example "faae4b3a-ad9f-463c-ae4b-3aad9fb63c9b" */
  coach_id?: string;
  name: string;
}

export interface TeamResponse {
  capacity?: number;
  coach?: TeamCoach;
  created_at?: string;
  id?: string;
  name?: string;
  roster?: ApiInternalDomainsTeamDtoRosterMemberInfo[];
  updated_at?: string;
}

export interface UserUpdateRequestDto {
  /** @example "US" */
  country_alpha2_code: string;
  /** @example "2000-01-01" */
  dob: string;
  email?: string;
  first_name: string;
  gender?: "M" | "F";
  has_marketing_email_consent: boolean;
  has_sms_consent: boolean;
  last_name: string;
  parent_id?: string;
  phone?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Rise API
 * @version 1.0
 * @contact <klintlee1@gmail.com>
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  athletes = {
    /**
     * No description
     *
     * @tags athletes
     * @name TeamUpdate
     * @request PUT:/athletes/{athlete_id}/team/{team_id}
     * @secure
     */
    teamUpdate: (athleteId: string, teamId: string, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/athletes/${athleteId}/team/${teamId}`,
        method: "PUT",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags athletes
     * @name StatsPartialUpdate
     * @request PATCH:/athletes/{id}/stats
     * @secure
     */
    statsPartialUpdate: (id: string, update_body: CustomerStatsUpdateRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/athletes/${id}/stats`,
        method: "PATCH",
        body: update_body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  auth = {
    /**
     * No description
     *
     * @tags authentication
     * @name AuthCreate
     * @request POST:/auth
     */
    authCreate: (params: RequestParams = {}) =>
      this.request<IdentityUserAuthenticationResponseDto, Record<string, any>>({
        path: `/auth`,
        method: "POST",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Authenticates a user using Firebase token and returns a JWT token for the authenticated user
     *
     * @tags authentication
     * @name ChildCreate
     * @summary Authenticate a user and return a JWT token
     * @request POST:/auth/child/{id}
     * @secure
     */
    childCreate: (id: string, params: RequestParams = {}) =>
      this.request<IdentityUserAuthenticationResponseDto, Record<string, any>>({
        path: `/auth/child/${id}`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  checkout = {
    /**
     * No description
     *
     * @tags payments
     * @name EventsCreate
     * @request POST:/checkout/events/{id}
     * @secure
     */
    eventsCreate: (id: string, params: RequestParams = {}) =>
      this.request<PaymentCheckoutResponseDto, Record<string, any>>({
        path: `/checkout/events/${id}`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Generates a payment link for purchasing a membership plan.
     *
     * @tags payments
     * @name MembershipPlansCreate
     * @request POST:/checkout/membership_plans/{id}
     * @secure
     */
    membershipPlansCreate: (id: string, params: RequestParams = {}) =>
      this.request<PaymentCheckoutResponseDto, Record<string, any>>({
        path: `/checkout/membership_plans/${id}`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags payments
     * @name ProgramsCreate
     * @request POST:/checkout/programs/{id}
     * @secure
     */
    programsCreate: (id: string, params: RequestParams = {}) =>
      this.request<PaymentCheckoutResponseDto, Record<string, any>>({
        path: `/checkout/programs/${id}`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  customers = {
    /**
     * @description Retrieves a list of customers, optionally filtered by fields like parent ID, name, email, phone, and ID, with pagination support.
     *
     * @tags customers
     * @name CustomersList
     * @summary Get customers
     * @request GET:/customers
     */
    customersList: (
      query?: {
        /** Number of customers to retrieve (default: 20, max: 20) */
        limit?: number;
        /** Number of customers to skip (default: 0) */
        offset?: number;
        /** Search term to filter customers */
        search?: string;
        /** Parent ID to filter customers (example: 123e4567-e89b-12d3-a456-426614174000) */
        parent_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CustomerResponse[], void>({
        path: `/customers`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags customers
     * @name EmailDetail
     * @request GET:/customers/email/{email}
     */
    emailDetail: (email: string, params: RequestParams = {}) =>
      this.request<CustomerResponse, void>({
        path: `/customers/email/${email}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags customers
     * @name GetCustomers
     * @request GET:/customers/id/{id}
     */
    getCustomers: (id: string, params: RequestParams = {}) =>
      this.request<CustomerResponse, void>({
        path: `/customers/id/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  events = {
    /**
     * No description
     *
     * @tags events
     * @name EventsList
     * @request GET:/events
     */
    eventsList: (
      query?: {
        /**
         * Start date of the events range (YYYY-MM-DD)
         * @format date
         * @example ""2025-03-01""
         */
        after?: string;
        /**
         * End date of the events range (YYYY-MM-DD)
         * @format date
         * @example ""2025-03-31""
         */
        before?: string;
        /**
         * Filter by program ID
         * @format uuid
         * @example ""550e8400-e29b-41d4-a716-446655440000""
         */
        program_id?: string;
        /**
         * Filter by participant ID
         * @format uuid
         * @example ""550e8400-e29b-41d4-a716-446655440000""
         */
        participant_id?: string;
        /**
         * Filter by team ID
         * @format uuid
         * @example ""550e8400-e29b-41d4-a716-446655440000""
         */
        team_id?: string;
        /**
         * Filter by location ID
         * @format uuid
         * @example ""550e8400-e29b-41d4-a716-446655440000""
         */
        location_id?: string;
        /**
         * Filter by program type
         * @example "game"
         */
        program_type?: "game" | "practice" | "course" | "others";
        /**
         * Response format type
         * @default "date"
         * @example "date"
         */
        response_type?: "date" | "day";
        /**
         * ID of person who created the event
         * @format uuid
         * @example ""550e8400-e29b-41d4-a716-446655440000""
         */
        created_by?: string;
        /**
         * ID of person who updated the event
         * @format uuid
         * @example ""550e8400-e29b-41d4-a716-446655440000""
         */
        updated_by?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<EventRecurrenceResponseDto[], Record<string, any>>({
        path: `/events`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags events
     * @name EventsDelete
     * @request DELETE:/events
     * @secure
     */
    eventsDelete: (ids: EventDeleteRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/events`,
        method: "DELETE",
        body: ids,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags events
     * @name OneTimeCreate
     * @request POST:/events/one-time
     * @secure
     */
    oneTimeCreate: (event: EventEventRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/events/one-time`,
        method: "POST",
        body: event,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags events
     * @name RecurringCreate
     * @request POST:/events/recurring
     * @secure
     */
    recurringCreate: (event: EventRecurrenceRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/events/recurring`,
        method: "POST",
        body: event,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags events
     * @name RecurringUpdate
     * @request PUT:/events/recurring/{id}
     * @secure
     */
    recurringUpdate: (id: string, event: EventRecurrenceRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/events/recurring/${id}`,
        method: "PUT",
        body: event,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Assign a staff member to an event using event_id and staff_id in the request body.
     *
     * @tags event_staff
     * @name StaffsCreate
     * @summary Assign a staff member to an event
     * @request POST:/events/{event_id}/staffs/{staff_id}
     */
    staffsCreate: (eventId: string, staffId: string, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/events/${eventId}/staffs/${staffId}`,
        method: "POST",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Remove a staff member from an event using event_id and staff_id in the request body.
     *
     * @tags event_staff
     * @name StaffsDelete
     * @summary Unassign a staff member from an event
     * @request DELETE:/events/{event_id}/staffs/{staff_id}
     */
    staffsDelete: (eventId: string, staffId: string, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/events/${eventId}/staffs/${staffId}`,
        method: "DELETE",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags events
     * @name EventsDetail
     * @request GET:/events/{id}
     */
    eventsDetail: (id: string, params: RequestParams = {}) =>
      this.request<EventEventResponseDto, Record<string, any>>({
        path: `/events/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags events
     * @name EventsUpdate
     * @request PUT:/events/{id}
     * @secure
     */
    eventsUpdate: (id: string, event: EventEventRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/events/${id}`,
        method: "PUT",
        body: event,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  games = {
    /**
     * No description
     *
     * @tags games
     * @name GamesList
     * @request GET:/games
     */
    gamesList: (params: RequestParams = {}) =>
      this.request<GameResponseDto[], Record<string, any>>({
        path: `/games`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags games
     * @name GamesCreate
     * @request POST:/games
     * @secure
     */
    gamesCreate: (game: GameRequestDto, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/games`,
        method: "POST",
        body: game,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags games
     * @name GamesDetail
     * @request GET:/games/{id}
     */
    gamesDetail: (id: string, params: RequestParams = {}) =>
      this.request<GameResponseDto, Record<string, any>>({
        path: `/games/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags games
     * @name GamesUpdate
     * @request PUT:/games/{id}
     * @secure
     */
    gamesUpdate: (id: string, game: GameRequestDto, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/games/${id}`,
        method: "PUT",
        body: game,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags games
     * @name GamesDelete
     * @request DELETE:/games/{id}
     * @secure
     */
    gamesDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/games/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  haircuts = {
    /**
     * @description Retrieves all haircut images from a folder in Google Cloud Storage. Optionally, specify a barber name to get images from that barber's folder.
     *
     * @tags haircuts
     * @name HaircutsList
     * @request GET:/haircuts
     */
    haircutsList: (
      query?: {
        /** Barber ID to filter images */
        barber_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<string[], Record<string, string>>({
        path: `/haircuts`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Uploads a haircut image to Google Cloud Storage and returns the object URL.
     *
     * @tags haircuts
     * @name HaircutsCreate
     * @request POST:/haircuts
     * @secure
     */
    haircutsCreate: (
      data: {
        /**
         * Haircut image to upload
         * @format binary
         */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/haircuts`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve all haircut events, with optional filters by barber ID and customer ID.
     *
     * @tags haircuts
     * @name EventsList
     * @summary Get all haircut events
     * @request GET:/haircuts/events
     */
    eventsList: (
      query?: {
        /**
         * Start date of the events range (YYYY-MM-DD)
         * @example ""2025-03-01""
         */
        after?: string;
        /**
         * End date of the events range (YYYY-MM-DD)
         * @example ""2025-03-31""
         */
        before?: string;
        /** Filter by barber ID */
        barber_id?: string;
        /** Filter by customer ID */
        customer_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<HaircutEventEventResponseDto[], Record<string, any>>({
        path: `/haircuts/events`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Registers a new haircut event with the provided details from request body. Requires an Authorization header containing the customer's JWT, ensuring only logged-in customers can make the request.
     *
     * @tags haircuts
     * @name EventsCreate
     * @request POST:/haircuts/events
     * @secure
     */
    eventsCreate: (event: HaircutEventRequestDto, params: RequestParams = {}) =>
      this.request<HaircutEventEventResponseDto, Record<string, any>>({
        path: `/haircuts/events`,
        method: "POST",
        body: event,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves details of a specific haircut event based on its ID.
     *
     * @tags haircuts
     * @name EventsDetail
     * @request GET:/haircuts/events/{id}
     */
    eventsDetail: (id: string, params: RequestParams = {}) =>
      this.request<HaircutEventEventResponseDto, Record<string, any>>({
        path: `/haircuts/events/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Deletes a haircut event by its ID.
     *
     * @tags haircuts
     * @name EventsDelete
     * @request DELETE:/haircuts/events/{id}
     */
    eventsDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/haircuts/events/${id}`,
        method: "DELETE",
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags haircuts
     * @name ServicesList
     * @request GET:/haircuts/services
     */
    servicesList: (params: RequestParams = {}) =>
      this.request<HaircutServiceBarberServiceResponseDto[], Record<string, any>>({
        path: `/haircuts/services`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags haircuts
     * @name ServicesCreate
     * @request POST:/haircuts/services
     */
    servicesCreate: (request: HaircutServiceCreateBarberServiceRequestDto, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/haircuts/services`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags haircuts
     * @name ServicesDelete
     * @request DELETE:/haircuts/services/{id}
     */
    servicesDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/haircuts/services/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  locations = {
    /**
     * No description
     *
     * @tags locations
     * @name LocationsList
     * @request GET:/locations
     */
    locationsList: (params: RequestParams = {}) =>
      this.request<LocationResponseDto[], Record<string, any>>({
        path: `/locations`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags locations
     * @name LocationsCreate
     * @request POST:/locations
     */
    locationsCreate: (body: LocationRequestDto, params: RequestParams = {}) =>
      this.request<LocationResponseDto, Record<string, any>>({
        path: `/locations`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags locations
     * @name LocationsDetail
     * @request GET:/locations/{id}
     */
    locationsDetail: (id: string, params: RequestParams = {}) =>
      this.request<LocationResponseDto, Record<string, any>>({
        path: `/locations/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags locations
     * @name LocationsUpdate
     * @request PUT:/locations/{id}
     */
    locationsUpdate: (id: string, body: LocationRequestDto, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/locations/${id}`,
        method: "PUT",
        body: body,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags locations
     * @name LocationsDelete
     * @request DELETE:/locations/{id}
     */
    locationsDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/locations/${id}`,
        method: "DELETE",
        type: ContentType.Json,
        ...params,
      }),
  };
  memberships = {
    /**
     * No description
     *
     * @tags memberships
     * @name MembershipsList
     * @request GET:/memberships
     */
    membershipsList: (params: RequestParams = {}) =>
      this.request<MembershipResponse[], Record<string, any>>({
        path: `/memberships`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags memberships
     * @name MembershipsCreate
     * @request POST:/memberships
     * @secure
     */
    membershipsCreate: (membership: MembershipRequestDto, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/memberships`,
        method: "POST",
        body: membership,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags membership-plans
     * @name PlansCreate
     * @request POST:/memberships/plans
     * @secure
     */
    plansCreate: (plan: MembershipPlanPlanRequestDto, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/memberships/plans`,
        method: "POST",
        body: plan,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags membership-plans
     * @name PlansUpdate
     * @request PUT:/memberships/plans/{id}
     * @secure
     */
    plansUpdate: (id: string, plan: MembershipPlanPlanRequestDto, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/memberships/plans/${id}`,
        method: "PUT",
        body: plan,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags membership-plans
     * @name PlansDelete
     * @request DELETE:/memberships/plans/{id}
     * @secure
     */
    plansDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/memberships/plans/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags memberships
     * @name MembershipsDetail
     * @request GET:/memberships/{id}
     */
    membershipsDetail: (id: string, params: RequestParams = {}) =>
      this.request<MembershipResponse, Record<string, any>>({
        path: `/memberships/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags memberships
     * @name MembershipsUpdate
     * @request PUT:/memberships/{id}
     * @secure
     */
    membershipsUpdate: (id: string, membership: MembershipRequestDto, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/memberships/${id}`,
        method: "PUT",
        body: membership,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags memberships
     * @name MembershipsDelete
     * @request DELETE:/memberships/{id}
     * @secure
     */
    membershipsDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/memberships/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags membership-plans
     * @name PlansDetail
     * @request GET:/memberships/{id}/plans
     */
    plansDetail: (id: string, params: RequestParams = {}) =>
      this.request<MembershipPlanPlanResponse[], Record<string, any>>({
        path: `/memberships/${id}/plans`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  programs = {
    /**
     * No description
     *
     * @tags programs
     * @name ProgramsList
     * @request GET:/programs
     */
    programsList: (
      query?: {
        /** Program Type (game, practice, course, others) */
        type?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ProgramResponse[], Record<string, any>>({
        path: `/programs`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags programs
     * @name ProgramsCreate
     * @request POST:/programs
     * @secure
     */
    programsCreate: (program: ProgramRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/programs`,
        method: "POST",
        body: program,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags programs
     * @name LevelsList
     * @request GET:/programs/levels
     */
    levelsList: (params: RequestParams = {}) =>
      this.request<ProgramLevelsResponse[], Record<string, any>>({
        path: `/programs/levels`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags programs
     * @name ProgramsDetail
     * @request GET:/programs/{id}
     */
    programsDetail: (id: string, params: RequestParams = {}) =>
      this.request<ProgramResponse[], Record<string, any>>({
        path: `/programs/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags programs
     * @name ProgramsUpdate
     * @request PUT:/programs/{id}
     */
    programsUpdate: (id: string, program: ProgramRequestDto, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/programs/${id}`,
        method: "PUT",
        body: program,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags programs
     * @name ProgramsDelete
     * @request DELETE:/programs/{id}
     * @secure
     */
    programsDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/programs/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  register = {
    /**
     * @description Registers a new athlete by verifying the Firebase token and creating an account based on the provided details.
     *
     * @tags registration
     * @name AthleteCreate
     * @summary Register a new athlete
     * @request POST:/register/athlete
     */
    athleteCreate: (athlete: CustomerAthleteRegistrationRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/register/athlete`,
        method: "POST",
        body: athlete,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Registers a new child account using the provided details and associates it with the parent based on the Firebase authentication token.
     *
     * @tags registration
     * @name ChildCreate
     * @summary Register a new child account and associate it with the parent
     * @request POST:/register/child
     */
    childCreate: (customer: CustomerChildRegistrationRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/register/child`,
        method: "POST",
        body: customer,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Registers a new parent by verifying the Firebase token and creating an account based on the provided details.
     *
     * @tags registration
     * @name ParentCreate
     * @summary Register a new parent
     * @request POST:/register/parent
     */
    parentCreate: (parent: CustomerParentRegistrationRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/register/parent`,
        method: "POST",
        body: parent,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates a new staff account in the system using the provided registration details.
     *
     * @tags registration
     * @name StaffCreate
     * @summary Register a new staff member
     * @request POST:/register/staff
     */
    staffCreate: (staff: StaffRegistrationRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/register/staff`,
        method: "POST",
        body: staff,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Approves a pending staff member's account in the system
     *
     * @tags registration
     * @name StaffApproveCreate
     * @summary Approve a pending staff member
     * @request POST:/register/staff/approve/{id}
     * @secure
     */
    staffApproveCreate: (staffId: string, id: string, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/register/staff/approve/${id}`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  staffs = {
    /**
     * No description
     *
     * @tags staff
     * @name StaffsList
     * @request GET:/staffs
     */
    staffsList: (
      query?: {
        /**
         * Role name to filter staff
         * @example ""Coach""
         */
        role?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<StaffResponseDto[], Record<string, any>>({
        path: `/staffs`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a paginated list of staff activity logs with optional filtering
     *
     * @tags staff_activity_logs
     * @name LogsList
     * @summary Get staff activity logs
     * @request GET:/staffs/logs
     */
    logsList: (
      query?: {
        /**
         * Filter by staff member ID (UUID format)
         * @example ""550e8400-e29b-41d4-a716-446655440000""
         */
        staff_id?: string;
        /** Search term to filter activity descriptions (case-insensitive partial match) */
        search_description?: string;
        /**
         * Number of records to return (default: 10)
         * @example 10
         */
        limit?: number;
        /**
         * Number of records to skip for pagination (default: 0)
         * @example 0
         */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<StaffActivityLogsStaffActivityLogResponse[], Record<string, any>>({
        path: `/staffs/logs`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags staff
     * @name StaffsUpdate
     * @request PUT:/staffs/{id}
     * @secure
     */
    staffsUpdate: (id: string, staff: StaffRequestDto, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/staffs/${id}`,
        method: "PUT",
        body: staff,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags staff
     * @name StaffsDelete
     * @request DELETE:/staffs/{id}
     * @secure
     */
    staffsDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/staffs/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  teams = {
    /**
     * No description
     *
     * @tags teams
     * @name TeamsList
     * @request GET:/teams
     */
    teamsList: (params: RequestParams = {}) =>
      this.request<TeamResponse[], Record<string, any>>({
        path: `/teams`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags teams
     * @name TeamsCreate
     * @request POST:/teams
     * @secure
     */
    teamsCreate: (team: TeamRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/teams`,
        method: "POST",
        body: team,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags teams
     * @name TeamsDetail
     * @request GET:/teams/{id}
     */
    teamsDetail: (id: string, params: RequestParams = {}) =>
      this.request<TeamResponse, Record<string, any>>({
        path: `/teams/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags teams
     * @name TeamsUpdate
     * @request PUT:/teams/{id}
     * @secure
     */
    teamsUpdate: (id: string, team: TeamRequestDto, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/teams/${id}`,
        method: "PUT",
        body: team,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags teams
     * @name TeamsDelete
     * @request DELETE:/teams/{id}
     * @secure
     */
    teamsDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/teams/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags users
     * @name UsersUpdate
     * @request PUT:/users/{id}
     * @secure
     */
    usersUpdate: (id: string, user: UserUpdateRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/users/${id}`,
        method: "PUT",
        body: user,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  webhooks = {
    /**
     * @description - checkout.session.completed: Logs completed checkout sessions
     *
     * @tags payments
     * @name StripeCreate
     * @request POST:/webhooks/stripe
     */
    stripeCreate: (request: string, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/webhooks/stripe`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
