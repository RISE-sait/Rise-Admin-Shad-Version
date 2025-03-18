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

export interface CourseRequestDto {
  capacity: number;
  description?: string;
  name: string;
}

export interface CourseResponseDto {
  capacity?: number;
  createdAt?: string;
  description?: string;
  id?: string;
  name?: string;
  updatedAt?: string;
}

export interface CustomerAthleteRegistrationRequestDto {
  age: number;
  country_code?: string;
  first_name: string;
  has_consent_to_email_marketing?: boolean;
  has_consent_to_sms?: boolean;
  last_name: string;
  /** @example "+15141234567" */
  phone_number?: string;
  waivers?: CustomerWaiverSigningRequestDto[];
}

export interface CustomerAthleteResponseDto {
  assists?: number;
  created_at?: string;
  id?: string;
  losses?: number;
  points?: number;
  profile_pic?: string;
  rebounds?: number;
  steals?: number;
  updated_at?: string;
  wins?: number;
}

export interface CustomerChildRegistrationRequestDto {
  age: number;
  country_code?: string;
  first_name: string;
  last_name: string;
  waivers?: CustomerWaiverSigningRequestDto[];
}

export interface CustomerMembershipPlansResponseDto {
  created_at?: string;
  customer_id?: string;
  id?: string;
  membership_name?: string;
  membership_plan_id?: string;
  renewal_date?: string;
  start_date?: string;
  status?: string;
  updated_at?: string;
}

export interface CustomerParentRegistrationRequestDto {
  age: number;
  country_code?: string;
  first_name: string;
  has_consent_to_email_marketing?: boolean;
  has_consent_to_sms?: boolean;
  last_name: string;
  /** @example "+15141234567" */
  phone_number?: string;
}

export interface CustomerResponse {
  age?: number;
  country_code?: string;
  email?: string;
  first_name?: string;
  hubspot_id?: string;
  last_name?: string;
  membership_name?: string;
  membership_start_date?: string;
  phone?: string;
  profile_pic?: string;
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

export interface EnrollmentCreateRequestDto {
  customer_id: string;
  event_id: string;
}

export interface EnrollmentResponseDto {
  checked_in_at?: string;
  created_at?: string;
  customer_id?: string;
  event_id?: string;
  id?: string;
  is_cancelled?: boolean;
  updated_at?: string;
}

export interface EventRequestDto {
  /** @example "00000000-0000-0000-0000-000000000000" */
  course_id?: string;
  /** @example "2023-10-05T07:00:00Z" */
  event_end_at: string;
  /** @example "2023-10-05T07:00:00Z" */
  event_start_at: string;
  /** @example "00000000-0000-0000-0000-000000000000" */
  game_id?: string;
  /** @example "0bab3927-50eb-42b3-9d6b-2350dd00a100" */
  location_id?: string;
  /** @example "f0e21457-75d4-4de6-b765-5ee13221fd72" */
  practice_id?: string;
}

export interface EventResponseDto {
  course_id?: string;
  event_end_at?: string;
  event_start_at?: string;
  game_id?: string;
  id?: string;
  location_id?: string;
  practice_id?: string;
  session_end_at?: string;
  session_start_at?: string;
}

export interface EventStaffEventStaffBase {
  event_id?: string;
  staff_id?: string;
}

export interface EventStaffRequestDto {
  base?: EventStaffEventStaffBase;
}

export interface GameRequestDto {
  name?: string;
}

export interface GameResponseDto {
  id?: string;
  name?: string;
  video_link?: string;
}

export interface HaircutRequestDto {
  /** @example "f0e21457-75d4-4de6-b765-5ee13221fd72" */
  barber_id?: string;
  /** @example "2023-10-05T07:00:00Z" */
  begin_time: string;
  /** @example "00000000-0000-0000-0000-000000000000" */
  customer_id?: string;
  /** @example "2023-10-05T07:00:00Z" */
  end_time: string;
}

export interface HaircutResponseDto {
  barber_id?: string;
  begin_time?: string;
  created_at?: string;
  customer_id?: string;
  end_time?: string;
  id?: string;
  updated_at?: string;
}

export interface HubspotUserAssociation {
  results?: HubspotUserAssociationResult[];
}

export interface HubspotUserAssociationResult {
  id?: string;
  type?: string;
}

export interface HubspotUserAssociations {
  contacts?: HubspotUserAssociation;
}

export interface HubspotUserProps {
  age?: string;
  email?: string;
  firstname?: string;
  has_marketing_email_consent?: string;
  has_sms_consent?: string;
  hs_country_region_code?: string;
  lastname?: string;
  phone?: string;
}

export interface HubspotUserResponse {
  associations?: HubspotUserAssociations;
  createdAt?: string;
  id?: string;
  properties?: HubspotUserProps;
  updatedAt?: string;
}

export interface IdentityUserAuthenticationResponseDto {
  age?: number;
  country_code?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
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
  payment_frequency: string;
  price: string;
}

export interface MembershipPlanPlanResponse {
  amt_periods?: number;
  created_at?: string;
  id?: string;
  joining_fees?: string;
  membership_id?: string;
  name?: string;
  payment_frequency?: string;
  price?: string;
  updated_at?: string;
}

export interface PracticeLevelsResponse {
  levels?: string[];
}

export interface PracticeRequestDto {
  capacity: number;
  description?: string;
  level: string;
  name: string;
}

export interface PracticeResponse {
  capacity?: number;
  createdAt?: string;
  description?: string;
  id?: string;
  level?: string;
  name?: string;
  updatedAt?: string;
}

export interface PurchaseMembershipPlanRequestDto {
  membership_plan_id?: string;
  start_date: string;
  status?: string;
}

export interface StaffRegistrationRequestDto {
  age: number;
  country_code?: string;
  first_name: string;
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
  public baseUrl: string = "//localhost:80";
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
 * @title No title
 * @baseUrl //localhost:80
 * @contact
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * @description Authenticates a user using Firebase token and returns a JWT token for the authenticated user
     *
     * @tags authentication
     * @name AuthCreate
     * @summary Authenticate a user and return a JWT token
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
  courses = {
    /**
     * @description Get a list of courses
     *
     * @tags courses
     * @name CoursesList
     * @summary Get a list of courses
     * @request GET:/courses
     */
    coursesList: (params: RequestParams = {}) =>
      this.request<CourseResponseDto[], Record<string, any>>({
        path: `/courses`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new course
     *
     * @tags courses
     * @name CoursesCreate
     * @summary Create a new course
     * @request POST:/courses
     * @secure
     */
    coursesCreate: (course: CourseRequestDto, params: RequestParams = {}) =>
      this.request<CourseResponseDto, Record<string, any>>({
        path: `/courses`,
        method: "POST",
        body: course,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get a course by Id
     *
     * @tags courses
     * @name CoursesDetail
     * @summary Get a course by Id
     * @request GET:/courses/{id}
     */
    coursesDetail: (id: string, params: RequestParams = {}) =>
      this.request<CourseResponseDto, Record<string, any>>({
        path: `/courses/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update a course
     *
     * @tags courses
     * @name CoursesUpdate
     * @summary Update a course
     * @request PUT:/courses/{id}
     * @secure
     */
    coursesUpdate: (id: string, course: CourseRequestDto, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/courses/${id}`,
        method: "PUT",
        body: course,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Delete a course by Id
     *
     * @tags courses
     * @name CoursesDelete
     * @summary Delete a course
     * @request DELETE:/courses/{id}
     * @secure
     */
    coursesDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/courses/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
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
      },
      params: RequestParams = {},
    ) =>
      this.request<CustomerResponse[], Record<string, any>>({
        path: `/customers`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Fetches customer statistics (wins, losses, etc.) for the specified customer ID.
     *
     * @tags customers
     * @name AthleteDetail
     * @summary Get customer statistics
     * @request GET:/customers/{customer_id}/athlete
     */
    athleteDetail: (customerId: string, params: RequestParams = {}) =>
      this.request<CustomerAthleteResponseDto, Record<string, any>>({
        path: `/customers/${customerId}/athlete`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates customer statistics (wins, losses, etc.) for the specified customer ID
     *
     * @tags customers
     * @name AthletePartialUpdate
     * @summary Update customer statistics
     * @request PATCH:/customers/{customer_id}/athlete
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
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a repository's children using the parent's ID
     *
     * @tags customers
     * @name ChildrenDetail
     * @summary Get a repository's children by parent ID
     * @request GET:/customers/{id}/children
     */
    childrenDetail: (email: string, id: string, params: RequestParams = {}) =>
      this.request<HubspotUserResponse[], Record<string, any>>({
        path: `/customers/${id}/children`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a list of membership plans associated with a specific customer, using the customer ID as a required parameter.
     *
     * @tags customers
     * @name MembershipPlansDetail
     * @summary Get membership plans by customer
     * @request GET:/customers/{id}/membership-plans
     */
    membershipPlansDetail: (id: string, params: RequestParams = {}) =>
      this.request<CustomerMembershipPlansResponseDto[], Record<string, any>>({
        path: `/customers/${id}/membership-plans`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  enrollments = {
    /**
     * @description Get enrollments by customer and event HubSpotId
     *
     * @tags enrollments
     * @name EnrollmentsList
     * @summary Get enrollments by customer and event HubSpotId
     * @request GET:/enrollments
     */
    enrollmentsList: (
      query?: {
        /** Customer ID */
        customerId?: string;
        /** Event ID */
        eventId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<EnrollmentResponseDto[], Record<string, any>>({
        path: `/enrollments`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new enrollment
     *
     * @tags enrollments
     * @name EnrollmentsCreate
     * @summary Create a new enrollment
     * @request POST:/enrollments
     * @secure
     */
    enrollmentsCreate: (enrollment: EnrollmentCreateRequestDto, params: RequestParams = {}) =>
      this.request<EnrollmentResponseDto, Record<string, any>>({
        path: `/enrollments`,
        method: "POST",
        body: enrollment,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete an enrollment by HubSpotId
     *
     * @tags enrollments
     * @name EnrollmentsDelete
     * @summary Delete an enrollment
     * @request DELETE:/enrollments/{id}
     * @secure
     */
    enrollmentsDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/enrollments/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  eventStaff = {
    /**
     * @description Retrieve all staff assigned to an event using event_id as a query parameter.
     *
     * @tags event_staff
     * @name EventStaffList
     * @summary Get staff assigned to an event
     * @request GET:/event-staff
     */
    eventStaffList: (
      query: {
        /** Event ID (UUID) */
        event_id: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<StaffResponseDto[], Record<string, any>>({
        path: `/event-staff`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Assign a staff member to an event using event_id and staff_id in the request body.
     *
     * @tags event_staff
     * @name EventStaffCreate
     * @summary Assign a staff member to an event
     * @request POST:/event-staff
     */
    eventStaffCreate: (request: EventStaffRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/event-staff`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Remove a staff member from an event using event_id and staff_id in the request body.
     *
     * @tags event_staff
     * @name EventStaffDelete
     * @summary Unassign a staff member from an event
     * @request DELETE:/event-staff
     */
    eventStaffDelete: (request: EventStaffRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/event-staff`,
        method: "DELETE",
        body: request,
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
     * @summary Get all events
     * @request GET:/events
     */
    eventsList: (
      query: {
        /**
         * Retrieve events after this date (format: YYYY-MM-DD)
         * @example ""2024-05-01""
         */
        after: string;
        /**
         * Retrieve events before this date (format: YYYY-MM-DD)
         * @example ""2024-06-01""
         */
        before: string;
        /**
         * Filter by game ID (UUID format)
         * @example ""550e8400-e29b-41d4-a716-446655440000""
         */
        game_id?: string;
        /**
         * Filter by course ID (UUID format)
         * @example ""550e8400-e29b-41d4-a716-446655440000""
         */
        course_id?: string;
        /**
         * Filter by practice ID (UUID format)
         * @example ""550e8400-e29b-41d4-a716-446655440000""
         */
        practice_id?: string;
        /**
         * Filter by location ID (UUID format)
         * @example ""550e8400-e29b-41d4-a716-446655440000""
         */
        location_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<EventResponseDto[], Record<string, any>>({
        path: `/events`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Registers a new event with the provided details.
     *
     * @tags events
     * @name EventsCreate
     * @summary Create a new event
     * @request POST:/events
     */
    eventsCreate: (event: EventRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/events`,
        method: "POST",
        body: event,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves details of a specific event based on its ID.
     *
     * @tags events
     * @name EventsDetail
     * @summary Get event details
     * @request GET:/events/{id}
     */
    eventsDetail: (id: string, params: RequestParams = {}) =>
      this.request<EventResponseDto, Record<string, any>>({
        path: `/events/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the details of an existing event.
     *
     * @tags events
     * @name EventsUpdate
     * @summary Update an event
     * @request PUT:/events/{id}
     */
    eventsUpdate: (id: string, event: EventRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/events/${id}`,
        method: "PUT",
        body: event,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Deletes an event by its ID.
     *
     * @tags events
     * @name EventsDelete
     * @summary Delete an event
     * @request DELETE:/events/{id}
     */
    eventsDelete: (id: string, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/events/${id}`,
        method: "DELETE",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  games = {
    /**
     * @description Get a list of games
     *
     * @tags games
     * @name GamesList
     * @summary Get a list of games
     * @request GET:/games
     */
    gamesList: (
      query?: {
        /** Filter by game name */
        name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GameResponseDto[], Record<string, any>>({
        path: `/games`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new game
     *
     * @tags games
     * @name GamesCreate
     * @summary Create a new game
     * @request POST:/games
     * @secure
     */
    gamesCreate: (game: GameRequestDto, params: RequestParams = {}) =>
      this.request<GameResponseDto, Record<string, any>>({
        path: `/games`,
        method: "POST",
        body: game,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get a game by ID
     *
     * @tags games
     * @name GamesDetail
     * @summary Get a game by ID
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
     * @description Update a game
     *
     * @tags games
     * @name GamesUpdate
     * @summary Update a game
     * @request PUT:/games/{id}
     * @secure
     */
    gamesUpdate: (id: string, game: GameRequestDto, params: RequestParams = {}) =>
      this.request<GameResponseDto, Record<string, any>>({
        path: `/games/${id}`,
        method: "PUT",
        body: game,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a game by ID
     *
     * @tags games
     * @name GamesDelete
     * @summary Delete a game
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
     * @description Retrieves all haircut images from a folder in S3. Optionally, specify a barber name to get images from that barber's folder.
     *
     * @tags haircut
     * @name HaircutsList
     * @summary Retrieve haircut images
     * @request GET:/haircuts
     */
    haircutsList: (
      query?: {
        /** Barber name to filter images */
        barber?: string;
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
     * @description Uploads a haircut image to S3 and returns the object URL.
     *
     * @tags haircut
     * @name HaircutsCreate
     * @summary Upload a haircut image
     * @request POST:/haircuts
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
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve all barber events, with optional filters by barber ID and customer ID.
     *
     * @tags haircut
     * @name EventsList
     * @summary Get all barber events
     * @request GET:/haircuts/events
     */
    eventsList: (
      query?: {
        /** Filter by barber ID */
        barber_id?: string;
        /** Filter by customer ID */
        customer_id?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<HaircutResponseDto[], Record<string, any>>({
        path: `/haircuts/events`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Registers a new barber event with the provided details.
     *
     * @tags haircut
     * @name EventsCreate
     * @summary Create a new barber event
     * @request POST:/haircuts/events
     */
    eventsCreate: (event: HaircutRequestDto, params: RequestParams = {}) =>
      this.request<HaircutResponseDto, Record<string, any>>({
        path: `/haircuts/events`,
        method: "POST",
        body: event,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves details of a specific barber event based on its ID.
     *
     * @tags haircut
     * @name EventsDetail
     * @summary Get barber event details
     * @request GET:/haircuts/events/{id}
     */
    eventsDetail: (id: string, params: RequestParams = {}) =>
      this.request<HaircutResponseDto, Record<string, any>>({
        path: `/haircuts/events/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the details of an existing barber event.
     *
     * @tags haircut
     * @name EventsUpdate
     * @summary Update a barber event
     * @request PUT:/haircuts/events/{id}
     */
    eventsUpdate: (id: string, event: HaircutRequestDto, params: RequestParams = {}) =>
      this.request<HaircutResponseDto, Record<string, any>>({
        path: `/haircuts/events/${id}`,
        method: "PUT",
        body: event,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Deletes a barber event by its ID.
     *
     * @tags haircut
     * @name EventsDelete
     * @summary Delete a barber event
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
     * @description Retrieves a list of available payment frequencies for membership plans.
     *
     * @tags membership-plans
     * @name PlansPaymentFrequenciesList
     * @summary Get payment frequencies for membership plans
     * @request GET:/memberships/plans/payment-frequencies
     */
    plansPaymentFrequenciesList: (params: RequestParams = {}) =>
      this.request<Record<string, string[]>, Record<string, any>>({
        path: `/memberships/plans/payment-frequencies`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
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
  practices = {
    /**
     * @description Get a list of practices
     *
     * @tags practices
     * @name PracticesList
     * @summary Get a list of practices
     * @request GET:/practices
     */
    practicesList: (params: RequestParams = {}) =>
      this.request<PracticeResponse[], Record<string, any>>({
        path: `/practices`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new practice
     *
     * @tags practices
     * @name PracticesCreate
     * @summary Create a new practice
     * @request POST:/practices
     * @secure
     */
    practicesCreate: (practice: PracticeRequestDto, params: RequestParams = {}) =>
      this.request<PracticeResponse, Record<string, any>>({
        path: `/practices`,
        method: "POST",
        body: practice,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a list of available practice levels.
     *
     * @tags practices
     * @name LevelsList
     * @summary Get practice levels
     * @request GET:/practices/levels
     */
    levelsList: (params: RequestParams = {}) =>
      this.request<PracticeLevelsResponse[], Record<string, any>>({
        path: `/practices/levels`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update a practice
     *
     * @tags practices
     * @name PracticesUpdate
     * @summary Update a practice
     * @request PUT:/practices/{id}
     */
    practicesUpdate: (id: string, practice: PracticeRequestDto, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/practices/${id}`,
        method: "PUT",
        body: practice,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Delete a practice by ID
     *
     * @tags practices
     * @name PracticesDelete
     * @summary Delete a practice
     * @request DELETE:/practices/{id}
     * @secure
     */
    practicesDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/practices/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  purchases = {
    /**
     * @description Allows a customer to purchase a membership plan by providing the plan details.
     *
     * @tags purchases
     * @name MembershipsCreate
     * @summary Purchase a membership plan
     * @request POST:/purchases/memberships
     * @secure
     */
    membershipsCreate: (request: PurchaseMembershipPlanRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/purchases/memberships`,
        method: "POST",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
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
}
