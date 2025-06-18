import { Platform } from 'react-native';
import { fetch as sslFetch } from 'react-native-ssl-pinning';
import * as URL from 'url';

type Headers = {
  Accept: string;
  Authorization?: string;
  'Content-Type': string;
  Signature?: string;
  Date?: string;
  Platform: string;
  mock: string;
};

type Response<JsonData = { [key: string]: any }> = Omit<
  Awaited<ReturnType<typeof sslFetch>>,
  'headers' | 'json'
> & {
  json: () => Promise<JsonData>;
};

type Method = 'DELETE' | 'GET' | 'POST' | 'PUT' | 'PATCH';
export type ApiOptions = {
  method: Method;
  timeoutMilliseconds?: number;
  token?: string | null;
  secret?: string | null;
  headers?: Partial<Headers>;
  mirageIntercept?: boolean;
  payload?: Record<string, unknown> | Array<Record<string, unknown>>;
  sslPinning?: {
    certs: string[];
  };
};

const defaultApiOptions = {
  method: 'GET' as const,
  timeoutMilliseconds: 30 * 1000,
};

export class ApiError extends Error {
  response: Response;

  constructor(message: string, response: Response) {
    super(message);
    this.response = response;
  }
}

export async function fetchApi<JsonData>(
  endPoint: string,
  optionsWithoutDefaults: ApiOptions | Record<string, never> = {},
  apiVersion = 'v1'
): Promise<Response<JsonData>> {
  const options: ApiOptions = { ...defaultApiOptions, ...optionsWithoutDefaults };
  options.method = options.method.toUpperCase() as Method;

  const headers: Partial<Headers> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Platform: Platform.OS,
    ...options.headers,
  };

  const certificates = {
    certs: ['Local'],
  };

  const url = URL.parse(endPoint).host ? endPoint : `http://localhost:8080/${apiVersion}/${endPoint}`;

  const defaultOptions = {
    method: options.method,
    headers,
    body: JSON.stringify(options.payload),
  };

  const sslOptions = {
    timeoutInterval: options.timeoutMilliseconds,
    sslPinning: certificates,
  };

  const onFetchSuccess = (response: Response): Response => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }

    throw new ApiError('bad response code', response);
  };

  const onFetchFail = (response: Response) => {
    throw new ApiError('bad response code', response);
  };

  return sslFetch(url, { ...defaultOptions, ...sslOptions })
    .then(onFetchSuccess)
    .catch(onFetchFail) as Promise<Response<JsonData>>;
}


type FetchApiBaseQueryArgs = {
  url: string;
  options?: ApiOptions | Record<string, never>;
  apiVersion?: 'v1' | 'v2';
};

type FetchApiBaseQueryResponseSuccess = {
  data: any;
  error?: undefined;
  meta?: { request: Request; response: Response };
};

type FetchApiBaseQueryResponseError = {
  error: {
    status: number;
    data: any;
  };
  data?: undefined;
  meta?: { request: Request; response: Response };
};

type FetchApiBaseQueryResponse = FetchApiBaseQueryResponseSuccess | FetchApiBaseQueryResponseError;

export async function fetchApiBaseQuery(
  args: FetchApiBaseQueryArgs = {
    url: '',
    options: {},
  },
): Promise<FetchApiBaseQueryResponse> {
  try {
    console.log({ args });
    const response = await fetchApi(args.url, args.options, args.apiVersion);
    const data = await response.json();
    return { data };
  } catch (error) {
    if (error instanceof ApiError) {
      const errorData = await error.response.json();
      return { error: { status: error.response.status, data: errorData } };
    }
    return { error: { status: 500, data: error } };
  }
}
