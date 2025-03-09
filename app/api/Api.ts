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
  description?: string;
  name?: string;
}

export interface CourseResponseDto {
  createdAt?: string;
  description?: string;
  id?: string;
  name?: string;
  updatedAt?: string;
}

export interface CustomerChildRegistrationRequestDto {
  age: number;
  first_name: string;
  last_name: string;
  waivers: CustomerWaiverSigningRequestDto[];
}

export interface CustomerRegularCustomerRegistrationRequestDto {
  age: number;
  first_name: string;
  has_consent_to_email_marketing: boolean;
  has_consent_to_sms: boolean;
  last_name: string;
  /** @example "+15141234567" */
  phone_number?: string;
  waivers: CustomerWaiverSigningRequestDto[];
}

export interface CustomerResponse {
  email?: string;
  first_name?: string;
  hubspot_id?: string;
  last_name?: string;
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

export interface DtoPracticeRequestDto {
  description?: string;
  name?: string;
}

export interface DtoPracticeResponse {
  description?: string;
  id?: string;
  name?: string;
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
  /** @example "THURSDAY" */
  day: string;
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
  /** @example "23:00:00+00:00" */
  session_end_time: string;
  /** @example "23:00:00+00:00" */
  session_start_time: string;
}

export interface EventResponseDto {
  course_id?: string;
  day?: string;
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

export interface FacilityCategoryRequestDto {
  name: string;
}

export interface FacilityCategoryResponseDto {
  id?: string;
  name?: string;
}

export interface FacilityRequestDto {
  facility_type_id: string;
  location: string;
  name: string;
}

export interface FacilityResponseDto {
  address?: string;
  facility_category?: string;
  id?: string;
  name?: string;
}

export interface GameRequestDto {
  name?: string;
  video_link?: string;
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
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: string;
}

export interface IdentityUserNecessaryInfoRequestDto {
  age: number;
  first_name: string;
  last_name: string;
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
  payment_frequency?: string;
  price: number;
}

export interface MembershipPlanPlanResponse {
  amt_periods?: number;
  id?: string;
  membership_id?: string;
  name?: string;
  payment_frequency?: string;
  price?: number;
}

export interface PurchaseMembershipPlanRequestDto {
  membership_plan_id?: string;
  start_date: string;
  status?: string;
}

export interface StaffRegistrationRequestDto {
  hubspot_id: string;
  is_active: boolean;
  /** @example "+15141234567" */
  phone_number?: string;
  role_name: string;
}

export interface StaffRequestDto {
  is_active: boolean;
  role_name: string;
}

export interface StaffResponseDto {
  created_at?: string;
  email?: string;
  first_name?: string;
  hubspot_id?: string;
  id?: string;
  /** Indicates if the staff is still an active employee */
  is_active?: boolean;
  last_name?: string;
  phone?: string;
  role_id?: string;
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
     * @request POST:/auth/child/{hubspot_id}
     * @secure
     */
    childCreate: (hubspotId: string, params: RequestParams = {}) =>
      this.request<IdentityUserNecessaryInfoRequestDto, Record<string, any>>({
        path: `/auth/child/${hubspotId}`,
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
    coursesList: (
      query?: {
        /** Filter by course name */
        name?: string;
        /** Filter by course description */
        description?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CourseResponseDto[], Record<string, any>>({
        path: `/courses`,
        method: "GET",
        query: query,
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
     * @description Get a course by HubSpotId
     *
     * @tags courses
     * @name CoursesDetail
     * @summary Get a course by HubSpotId
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
     * @description Delete a course by HubSpotId
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
     * @description Retrieves a list of customers, optionally filtered by HubSpot IDs.
     *
     * @tags customers
     * @name CustomersList
     * @summary Get customers
     * @request GET:/customers
     */
    customersList: (
      query?: {
        /** Comma-separated list of HubSpot IDs to filter customers */
        hubspot_ids?: string;
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
     * @description Updates customer statistics (wins, losses, etc.) for the specified customer ID
     *
     * @tags customers
     * @name StatsPartialUpdate
     * @summary Update customer statistics
     * @request PATCH:/customers/{customer_id}/stats
     */
    statsPartialUpdate: (customerId: string, update_body: CustomerStatsUpdateRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/customers/${customerId}/stats`,
        method: "PATCH",
        body: update_body,
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
     * @description Retrieve all events, with optional filters by course, location, and practice.
     *
     * @tags events
     * @name EventsList
     * @summary Get all events
     * @request GET:/events
     */
    eventsList: (
      query?: {
        /** Filter by course ID (UUID) */
        courseId?: string;
        /** Filter by location ID (UUID) */
        locationId?: string;
        /** Filter by practice ID (UUID) */
        practiceId?: string;
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
     * @description Retrieves details of a specific event based on its HubSpotId.
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
     * @description Deletes an event by its HubSpotId.
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
  facilities = {
    /**
     * @description Retrieves a list of all facilities, optionally filtered by name.
     *
     * @tags facilities
     * @name FacilitiesList
     * @summary Get all facilities
     * @request GET:/facilities
     */
    facilitiesList: (
      query?: {
        /** Facility name filter */
        name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<FacilityResponseDto[], Record<string, any>>({
        path: `/facilities`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Registers a new facility with the provided details.
     *
     * @tags facilities
     * @name FacilitiesCreate
     * @summary Create a new facility
     * @request POST:/facilities
     */
    facilitiesCreate: (facility: FacilityRequestDto, params: RequestParams = {}) =>
      this.request<FacilityResponseDto, Record<string, any>>({
        path: `/facilities`,
        method: "POST",
        body: facility,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a list of all facility categories.
     *
     * @tags facility-categories
     * @name CategoriesList
     * @summary Get all facility categories
     * @request GET:/facilities/categories
     */
    categoriesList: (params: RequestParams = {}) =>
      this.request<FacilityCategoryResponseDto[], Record<string, any>>({
        path: `/facilities/categories`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Registers a new facility category with the provided name.
     *
     * @tags facility-categories
     * @name CategoriesCreate
     * @summary Create a new facility category
     * @request POST:/facilities/categories
     * @secure
     */
    categoriesCreate: (facility_category: FacilityCategoryRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/facilities/categories`,
        method: "POST",
        body: facility_category,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a facility category by its ID.
     *
     * @tags facility-categories
     * @name CategoriesDetail
     * @summary Get a facility category by ID
     * @request GET:/facilities/categories/{id}
     */
    categoriesDetail: (id: string, params: RequestParams = {}) =>
      this.request<FacilityCategoryResponseDto, Record<string, any>>({
        path: `/facilities/categories/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the details of an existing facility category by ID.
     *
     * @tags facility-categories
     * @name CategoriesUpdate
     * @summary Update a facility category
     * @request PUT:/facilities/categories/{id}
     */
    categoriesUpdate: (id: string, facility_category: FacilityCategoryRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/facilities/categories/${id}`,
        method: "PUT",
        body: facility_category,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Deletes a facility category by its ID.
     *
     * @tags facility-categories
     * @name CategoriesDelete
     * @summary Delete a facility category
     * @request DELETE:/facilities/categories/{id}
     */
    categoriesDelete: (id: string, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/facilities/categories/${id}`,
        method: "DELETE",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a facility by its HubSpotId.
     *
     * @tags facilities
     * @name FacilitiesDetail
     * @summary Get a facility by HubSpotId
     * @request GET:/facilities/{id}
     */
    facilitiesDetail: (id: string, params: RequestParams = {}) =>
      this.request<FacilityResponseDto, Record<string, any>>({
        path: `/facilities/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates the details of an existing facility by its HubSpotId.
     *
     * @tags facilities
     * @name FacilitiesUpdate
     * @summary Update a facility
     * @request PUT:/facilities/{id}
     */
    facilitiesUpdate: (id: string, facility: FacilityRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/facilities/${id}`,
        method: "PUT",
        body: facility,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Deletes a facility by its HubSpotId.
     *
     * @tags facilities
     * @name FacilitiesDelete
     * @summary Delete a facility
     * @request DELETE:/facilities/{id}
     */
    facilitiesDelete: (id: string, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/facilities/${id}`,
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
        /** Filter by game description */
        description?: string;
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
  membershipPlan = {
    /**
     * @description Get membership plans by membership HubSpotId
     *
     * @tags membership-plans
     * @name MembershipPlanList
     * @summary Get membership plans by membership HubSpotId
     * @request GET:/membership-plan
     */
    membershipPlanList: (
      query?: {
        /** Filter by customer ID */
        customerId?: string;
        /** Filter by membership ID */
        membershipId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<MembershipPlanPlanResponse[], Record<string, any>>({
        path: `/membership-plan`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new membership plan
     *
     * @tags membership-plans
     * @name MembershipPlanCreate
     * @summary Create a new membership plan
     * @request POST:/membership-plan
     * @secure
     */
    membershipPlanCreate: (plan: MembershipPlanPlanRequestDto, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/membership-plan`,
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
     * @name MembershipPlanUpdate
     * @summary Update a membership plan
     * @request PUT:/membership-plan/{id}
     * @secure
     */
    membershipPlanUpdate: (id: string, plan: MembershipPlanPlanRequestDto, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/membership-plan/${id}`,
        method: "PUT",
        body: plan,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Delete a membership plan by HubSpotId
     *
     * @tags membership-plans
     * @name MembershipPlanDelete
     * @summary Delete a membership plan
     * @request DELETE:/membership-plan/{id}
     * @secure
     */
    membershipPlanDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/membership-plan/${id}`,
        method: "DELETE",
        secure: true,
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
     * @description Get a membership by HubSpotId
     *
     * @tags memberships
     * @name MembershipsDetail
     * @summary Get a membership by HubSpotId
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
     * @description Delete a membership by HubSpotId
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
    practicesList: (
      query?: {
        /** Filter by practice name */
        name?: string;
        /** Filter by practice description */
        description?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DtoPracticeResponse[], Record<string, any>>({
        path: `/practices`,
        method: "GET",
        query: query,
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
    practicesCreate: (practice: DtoPracticeRequestDto, params: RequestParams = {}) =>
      this.request<DtoPracticeResponse, Record<string, any>>({
        path: `/practices`,
        method: "POST",
        body: practice,
        secure: true,
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
    practicesUpdate: (id: string, practice: DtoPracticeRequestDto, params: RequestParams = {}) =>
      this.request<void, Record<string, any>>({
        path: `/practices/${id}`,
        method: "PUT",
        body: practice,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Delete a practice by HubSpotId
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

    /**
     * @description Get a practice by name
     *
     * @tags practices
     * @name PracticesDetail
     * @summary Get a practice by name
     * @request GET:/practices/{name}
     */
    practicesDetail: (name: string, params: RequestParams = {}) =>
      this.request<DtoPracticeResponse, Record<string, any>>({
        path: `/practices/${name}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
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
     * @description Registers a new customer using the provided details, creates a customer account. The Firebase token is used for user verification.
     *
     * @tags registration
     * @name CustomerCreate
     * @summary Register a new customer
     * @request POST:/register/customer
     */
    customerCreate: (customer: CustomerRegularCustomerRegistrationRequestDto, params: RequestParams = {}) =>
      this.request<Record<string, any>, Record<string, any>>({
        path: `/register/customer`,
        method: "POST",
        body: customer,
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
     * @description Retrieves staff members based on optional filters like role or HubSpot IDs.
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
        /**
         * Comma-separated HubSpot IDs
         * @example ""123,456,789""
         */
        hubspot_ids?: string;
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
  users = {
    /**
     * @description Retrieves a repository using their email address
     *
     * @tags users
     * @name UsersDetail
     * @summary Get a repository by email
     * @request GET:/users/{email}
     */
    usersDetail: (email: string, params: RequestParams = {}) =>
      this.request<HubspotUserResponse, Record<string, any>>({
        path: `/users/${email}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a repository's children using the parent's email address
     *
     * @tags users
     * @name ChildrenDetail
     * @summary Get a repository's children by parent email
     * @request GET:/users/{email}/children
     */
    childrenDetail: (email: string, params: RequestParams = {}) =>
      this.request<HubspotUserResponse[], Record<string, any>>({
        path: `/users/${email}/children`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
