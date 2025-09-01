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

/** EventCheckoutRequest */
export interface EventCheckoutRequest {
  /**
   * Event Id
   * Valid event UUID
   * @minLength 1
   * @maxLength 100
   */
  event_id: string;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/**
 * SubscriptionAction
 * An enumeration.
 */
export enum SubscriptionAction {
  Pause = "pause",
  Resume = "resume",
  Cancel = "cancel",
  UpdateCard = "update_card",
}

/** SubscriptionManagementRequest */
export interface SubscriptionManagementRequest {
  /** Action to perform on subscription */
  action: SubscriptionAction;
  /**
   * Card Id
   * New card ID for update_card action
   */
  card_id?: string;
  /**
   * New Plan Variation Id
   * For upgrade/downgrade actions
   */
  new_plan_variation_id?: string;
  /**
   * Pause Cycle Duration
   * Number of billing cycles to pause
   */
  pause_cycle_duration?: number;
  /**
   * Cancel Reason
   * Reason for cancellation
   * @maxLength 500
   */
  cancel_reason?: string;
}

/** SubscriptionRequest */
export interface SubscriptionRequest {
  /**
   * Membership Plan Id
   * UUID of the membership plan
   */
  membership_plan_id: string;
  /**
   * Card Id
   * Card ID for automatic billing
   */
  card_id?: string;
  /**
   * Start Date
   * ISO date string for subscription start
   */
  start_date?: string;
  /**
   * Timezone
   * Timezone for the subscription
   * @default "UTC"
   */
  timezone?: string;
}

/** SubscriptionResponse */
export interface SubscriptionResponse {
  /** Subscription Id */
  subscription_id: string;
  /** Status */
  status: string;
  /** Message */
  message: string;
  /** Subscription Url */
  subscription_url?: string;
  /** Checkout Url */
  checkout_url?: string;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
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
 * @title Rise Square Payment Service
 * @version 1.0.0
 *
 * Square payment processing and subscription management
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  subscriptions = {
    /**
     * @description Create a Square Checkout link for subscription signup.
     *
     * @name CreateSubscriptionCheckoutSubscriptionsCheckoutPost
     * @summary Create Subscription Checkout
     * @request POST:/subscriptions/checkout
     * @secure
     */
    createSubscriptionCheckoutSubscriptionsCheckoutPost: (data: SubscriptionRequest, params: RequestParams = {}) =>
      this.request<SubscriptionResponse, HTTPValidationError>({
        path: `/subscriptions/checkout`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Manage subscription (pause, resume, cancel, etc.).
     *
     * @name ManageSubscriptionSubscriptionsSubscriptionIdManagePost
     * @summary Manage Subscription
     * @request POST:/subscriptions/{subscription_id}/manage
     * @secure
     */
    manageSubscriptionSubscriptionsSubscriptionIdManagePost: (
      subscriptionId: string,
      data: SubscriptionManagementRequest,
      params: RequestParams = {},
    ) =>
      this.request<SubscriptionResponse, HTTPValidationError>({
        path: `/subscriptions/${subscriptionId}/manage`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Manually trigger billing date sync for a subscription.
     *
     * @name ManualSyncBillingDateSubscriptionsSubscriptionIdSyncBillingPost
     * @summary Manual Sync Billing Date
     * @request POST:/subscriptions/{subscription_id}/sync-billing
     * @secure
     */
    manualSyncBillingDateSubscriptionsSubscriptionIdSyncBillingPost: (
      subscriptionId: string,
      params: RequestParams = {},
    ) =>
      this.request<object, HTTPValidationError>({
        path: `/subscriptions/${subscriptionId}/sync-billing`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get subscription details from Square API.
     *
     * @name GetSubscriptionDetailsSubscriptionsSubscriptionIdGet
     * @summary Get Subscription Details
     * @request GET:/subscriptions/{subscription_id}
     * @secure
     */
    getSubscriptionDetailsSubscriptionsSubscriptionIdGet: (subscriptionId: string, params: RequestParams = {}) =>
      this.request<object, HTTPValidationError>({
        path: `/subscriptions/${subscriptionId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  checkout = {
    /**
     * @description Create checkout for event enrollment.
     *
     * @name CheckoutEventCheckoutEventPost
     * @summary Checkout Event
     * @request POST:/checkout/event
     * @secure
     */
    checkoutEventCheckoutEventPost: (data: EventCheckoutRequest, params: RequestParams = {}) =>
      this.request<object, HTTPValidationError>({
        path: `/checkout/event`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  webhook = {
    /**
     * @description Handle Square webhooks.
     *
     * @name HandleWebhookWebhookPost
     * @summary Handle Webhook
     * @request POST:/webhook
     */
    handleWebhookWebhookPost: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/webhook`,
        method: "POST",
        format: "json",
        ...params,
      }),
  };
  admin = {
    /**
     * @description List available Square subscription plans.
     *
     * @name ListSquareSubscriptionPlansAdminSquareSubscriptionPlansGet
     * @summary List Square Subscription Plans
     * @request GET:/admin/square/subscription-plans
     * @secure
     */
    listSquareSubscriptionPlansAdminSquareSubscriptionPlansGet: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/admin/square/subscription-plans`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Expire memberships that have passed their renewal date.
     *
     * @name ExpireMembershipsAdminMembershipsExpirePost
     * @summary Expire Memberships
     * @request POST:/admin/memberships/expire
     * @secure
     */
    expireMembershipsAdminMembershipsExpirePost: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/admin/memberships/expire`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get comprehensive sync status and health metrics.
     *
     * @name GetSyncStatusAdminSyncStatusGet
     * @summary Get Sync Status
     * @request GET:/admin/sync/status
     * @secure
     */
    getSyncStatusAdminSyncStatusGet: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/admin/sync/status`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Manually trigger a full synchronization.
     *
     * @name ForceFullSyncAdminSyncForcePost
     * @summary Force Full Sync
     * @request POST:/admin/sync/force
     * @secure
     */
    forceFullSyncAdminSyncForcePost: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/admin/sync/force`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Manually retry processing of failed webhook events.
     *
     * @name RetryFailedWebhooksAdminWebhooksRetryPost
     * @summary Retry Failed Webhooks
     * @request POST:/admin/webhooks/retry
     * @secure
     */
    retryFailedWebhooksAdminWebhooksRetryPost: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/admin/webhooks/retry`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get rate limiter status for monitoring.
     *
     * @name GetRateLimiterStatusAdminRateLimiterStatusGet
     * @summary Get Rate Limiter Status
     * @request GET:/admin/rate-limiter/status
     * @secure
     */
    getRateLimiterStatusAdminRateLimiterStatusGet: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/admin/rate-limiter/status`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  debug = {
    /**
     * @description Debug checkout session status to see why payment failed.
     *
     * @name DebugCheckoutStatusDebugCheckoutCheckoutIdGet
     * @summary Debug Checkout Status
     * @request GET:/debug/checkout/{checkout_id}
     * @secure
     */
    debugCheckoutStatusDebugCheckoutCheckoutIdGet: (checkoutId: string, params: RequestParams = {}) =>
      this.request<any, HTTPValidationError>({
        path: `/debug/checkout/${checkoutId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
