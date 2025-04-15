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

export interface CustomerAthleteRegistrationRequestDto {
  age: number;
  country_code?: string;
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
  age: number;
  country_code?: string;
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
  age: number;
  country_code?: string;
  first_name: string;
  gender?: "M" | "F";
  has_consent_to_email_marketing?: boolean;
  has_consent_to_sms?: boolean;
  last_name: string;
  /** @example "+15141234567" */
  phone_number?: string;
}

export interface CustomerResponse {
  age?: number;
  athlete_info?: CustomerAthleteResponseDto;
  country_code?: string;
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

export interface EventCreateRequestDto {
  /** @example 100 */
  capacity?: number;
  /** @example "THURSDAY" */
  day?: string;
  /** @example "23:00:00+00:00" */
  end_at: string;
  /** @example "0bab3927-50eb-42b3-9d6b-2350dd00a100" */
  location_id?: string;
  /** @example "f0e21457-75d4-4de6-b765-5ee13221fd72" */
  program_id?: string;
  /** @example "2023-10-05T07:00:00Z" */
  recurrence_end_at: string;
  /** @example "2023-10-05T07:00:00Z" */
  recurrence_start_at: string;
  /** @example "23:00:00+00:00" */
  start_at: string;
  /** @example "0bab3927-50eb-42b3-9d6b-2350dd00a100" */
  team_id?: string;
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

export interface EventScheduleResponseDto {
  day?: string;
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

export interface EventUpdateEventsRequestDto {
  /** @example 100 */
  new_capacity?: number;
  /** @example "23:00:00+00:00" */
  new_event_end_at: string;
  /** @example "21:00:00+00:00" */
  new_event_start_at: string;
  /** @example "0bab3927-50eb-42b3-9d6b-2350dd00a100" */
  new_location_id?: string;
  /** @example "f0e21457-75d4-4de6-b765-5ee13221fd72" */
  new_program_id?: string;
  /** @example "2023-10-05T07:00:00Z" */
  new_recurrence_end_at: string;
  /** @example "2023-10-05T07:00:00Z" */
  new_recurrence_start_at: string;
  /** @example "0bab3927-50eb-42b3-9d6b-2350dd00a100" */
  new_team_id?: string;
  /** @example 100 */
  original_capacity?: number;
  /** @example "13:00:00+00:00" */
  original_event_end_at: string;
  /** @example "10:00:00+00:00" */
  original_event_start_at: string;
  /** @example "0bab3927-50eb-42b3-9d6b-2350dd00a100" */
  original_location_id?: string;
  /** @example "f0e21457-75d4-4de6-b765-5ee13221fd72" */
  original_program_id?: string;
  /** @example "2023-10-05T07:00:00Z" */
  original_recurrence_end_at: string;
  /** @example "2023-10-05T07:00:00Z" */
  original_recurrence_start_at: string;
  /** @example "0bab3927-50eb-42b3-9d6b-2350dd00a100" */
  original_team_id?: string;
}

export interface EventUpdateRequestDto {
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

export interface HaircutBarberServiceResponseDto {
  barber_id?: string;
  barber_name?: string;
  created_at?: string;
  haircut_name?: string;
  id?: string;
  service_type_id?: string;
  updated_at?: string;
}

export interface HaircutCreateBarberServiceRequestDto {
  /** @example "f0e21457-75d4-4de6-b765-5ee13221fd72" */
  barber_id?: string;
  /** @example "f0e21457-75d4-4de6-b765-5ee13221fd72" */
  haircut_service_id?: string;
}

export interface HaircutEventResponseDto {
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

export interface HaircutRequestDto {
  /** @example "f0e21457-75d4-4de6-b765-5ee13221fd72" */
  barber_id?: string;
  /** @example "2023-10-05T07:00:00Z" */
  begin_time: string;
  /** @example "2023-10-05T07:00:00Z" */
  end_time: string;
  /** @example "Haircut" */
  service_name: string;
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
  age?: number;
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
  age: number;
  country_code?: string;
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

export interface TeamRequestDto {
  capacity: number;
  coach_id?: string;
  name: string;
}

export interface TeamResponse {
  capacity?: number;
  coach_id?: string;
  created_at?: string;
  id?: string;
  name?: string;
  updated_at?: string;
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
  barbers = {
    /**
     * @description Retrieve a list of all barber services
     *
     * @tags barber
     * @name ServicesList
     * @summary Get all barber services
     * @request GET:/barbers/services
     */
    servicesList: (params: RequestParams = {}) =>
      this.request<HaircutBarberServiceResponseDto[], Record<string, any>>({
        path: `/barbers/services`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new barber service with the provided details
     *
     * @tags barber
     * @name ServicesCreate
     * @summary Create a new barber service
     * @request POST:/barbers/services
     */
    servicesCreate: (request: HaircutCreateBarberServiceRequestDto, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/barbers/services`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Delete a barber service by its ID
     *
     * @tags barber
     * @name ServicesDelete
     * @summary Delete a barber service
     * @request DELETE:/barbers/services/{id}
     */
    servicesDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/barbers/services/${id}`,
        method: "DELETE",
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
     * @summary CheckoutMembershipPlan a membership plan
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
     * @description Retrieves a list of customers, optionally filtered by HubSpot IDs, with pagination support.
     *
     * @tags customers
     * @name CustomersList
     * @summary Get customers
     * @request GET:/customers
     */
    customersList: (
      query?: {
        /** Number of customers to retrieve (default: 20) */
        limit?: number;
        /** Number of customers to skip (default: 0) */
        offset?: number;
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

    /**
     * No description
     *
     * @tags customers
     * @name AthletePartialUpdate
     * @request PATCH:/customers/{customer_id}/athlete
     * @secure
     */
    athletePartialUpdate: (
      customerId: string,
      update_body: CustomerStatsUpdateRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/customers/${customerId}/athlete`,
        method: "PATCH",
        body: update_body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  events = {
    /**
     * @description Retrieve all events within a specific date range, with optional filters by course, location, game, and practice.
     *
     * @tags events
     * @name EventsList
     * @summary Get events
     * @request GET:/events
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
        /**
         * Filter by program ID (UUID format)
         * @example ""550e8400-e29b-41d4-a716-446655440000""
         */
        program_id?: string;
        /**
         * Filter by participant ID (UUID format)
         * @example ""550e8400-e29b-41d4-a716-446655440000""
         */
        participant_id?: string;
        /**
         * Filter by team ID (UUID format)
         * @example ""550e8400-e29b-41d4-a716-446655440000""
         */
        team_id?: string;
        /**
         * Filter by location ID (UUID format)
         * @example ""550e8400-e29b-41d4-a716-446655440000""
         */
        location_id?: string;
        /** Program Type (game, practice, course, others) */
        program_type?: string;
        /**
         * ID of person who created the event (UUID format)
         * @example ""550e8400-e29b-41d4-a716-446655440000""
         */
        created_by?: string;
        /**
         * ID of person who updated the event (UUID format)
         * @example ""550e8400-e29b-41d4-a716-446655440000""
         */
        updated_by?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<EventEventResponseDto[], Record<string, any>>({
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
     * @name EventsUpdate
     * @request PUT:/events
     * @secure
     */
    eventsUpdate: (event: EventUpdateEventsRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/events`,
        method: "PUT",
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
     * @name EventsCreate
     * @request POST:/events
     * @secure
     */
    eventsCreate: (event: EventCreateRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/events`,
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
    eventsDetail: (
      id: string,
      query?: {
        /** Choose between 'date' and 'day'. Response type for the schedule, in specific dates or recurring day information. Default is 'day'. */
        view?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<EventEventResponseDto, Record<string, any>>({
        path: `/events/${id}`,
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
     * @name EventsUpdate2
     * @request PUT:/events/{id}
     * @originalName eventsUpdate
     * @duplicate
     * @secure
     */
    eventsUpdate2: (id: string, event: EventUpdateRequestDto, params: RequestParams = {}) =>
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
     * @tags haircut
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
     * @tags haircut
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
     * @tags haircut
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
      this.request<HaircutEventResponseDto[], Record<string, any>>({
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
     * @tags haircut
     * @name EventsCreate
     * @request POST:/haircuts/events
     * @secure
     */
    eventsCreate: (event: HaircutRequestDto, params: RequestParams = {}) =>
      this.request<HaircutEventResponseDto, Record<string, any>>({
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
     * @tags haircut
     * @name EventsDetail
     * @request GET:/haircuts/events/{id}
     */
    eventsDetail: (id: string, params: RequestParams = {}) =>
      this.request<HaircutEventResponseDto, Record<string, any>>({
        path: `/haircuts/events/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Deletes a haircut event by its ID.
     *
     * @tags haircut
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
  };
  locations = {
    /**
     * @description Retrieves a list of all locations.
     *
     * @tags locations
     * @name LocationsList
     * @summary Get all locations
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
     * @description Registers a new Location with the provided details.
     *
     * @tags locations
     * @name LocationsCreate
     * @summary Create a new Location
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
     * @description Retrieves a Location by its unique identifier.
     *
     * @tags locations
     * @name LocationsDetail
     * @summary Get a Location by ID
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
     * @description Updates the details of an existing Location by its UUID.
     *
     * @tags locations
     * @name LocationsUpdate
     * @summary Update a Location
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
     * @description Deletes a Location by its UUID.
     *
     * @tags locations
     * @name LocationsDelete
     * @summary Delete a Location
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
     * @description Get a list of memberships
     *
     * @tags memberships
     * @name MembershipsList
     * @summary Get a list of memberships
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
     * @description Create a new membership
     *
     * @tags memberships
     * @name MembershipsCreate
     * @summary Create a new membership
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
     * @description Create a new membership plan
     *
     * @tags membership-plans
     * @name PlansCreate
     * @summary Create a new membership plan
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
     * @description Update a membership plan
     *
     * @tags membership-plans
     * @name PlansUpdate
     * @summary Update a membership plan
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
     * @description Delete a membership plan by ID
     *
     * @tags membership-plans
     * @name PlansDelete
     * @summary Delete a membership plan
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
     * @description Get a membership by ID
     *
     * @tags memberships
     * @name MembershipsDetail
     * @summary Get a membership by ID
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
     * @description Update a membership
     *
     * @tags memberships
     * @name MembershipsUpdate
     * @summary Update a membership
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
     * @description Delete a membership by ID
     *
     * @tags memberships
     * @name MembershipsDelete
     * @summary Delete a membership
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
     * @description Get membership plans by membership ID
     *
     * @tags membership-plans
     * @name PlansDetail
     * @summary Get membership plans by membership ID
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
     * @description Get a list of programs
     *
     * @tags programs
     * @name ProgramsList
     * @summary Get a list of programs
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
     * @description Create a new program
     *
     * @tags programs
     * @name ProgramsCreate
     * @summary Create a new program
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
     * @description Retrieves a list of available program levels.
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
     * @description Update a program
     *
     * @tags programs
     * @name ProgramsUpdate
     * @summary Update a program
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
  schedules = {
    /**
     * No description
     *
     * @tags Schedules
     * @name SchedulesList
     * @request GET:/schedules
     */
    schedulesList: (
      query?: {
        /**
         * Start date of the events range (YYYY-MM-DD format)
         * @example ""2025-03-01""
         */
        after?: string;
        /**
         * End date of the events range (YYYY-MM-DD format)
         * @example ""2025-03-31""
         */
        before?: string;
        /**
         * Filter by program ID (UUID format)
         * @example ""550e8400-e29b-41d4-a716-446655440000""
         */
        program_id?: string;
        /**
         * Filter by user ID (UUID format)
         * @example ""550e8400-e29b-41d4-a716-446655440000""
         */
        user_id?: string;
        /**
         * Filter by team ID (UUID format)
         * @example ""550e8400-e29b-41d4-a716-446655440000""
         */
        team_id?: string;
        /**
         * Filter by location ID (UUID format)
         * @example ""550e8400-e29b-41d4-a716-446655440000""
         */
        location_id?: string;
        /** Filter by program type */
        program_type?: "game" | "practice" | "course" | "others";
        /**
         * Filter by creator ID (UUID format)
         * @example ""550e8400-e29b-41d4-a716-446655440000""
         */
        created_by?: string;
        /**
         * Filter by updater ID (UUID format)
         * @example ""550e8400-e29b-41d4-a716-446655440000""
         */
        updated_by?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<EventScheduleResponseDto[], Record<string, any>>({
        path: `/schedules`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  staffs = {
    /**
     * @description Retrieves staff members based on optional role filter.
     *
     * @tags staff
     * @name StaffsList
     * @summary Get a list of staff members
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
     * @description Update a staff member
     *
     * @tags staff
     * @name StaffsUpdate
     * @summary Update a staff member
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
     * @description Delete a staff member by HubSpotId
     *
     * @tags staff
     * @name StaffsDelete
     * @summary Delete a staff member
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
