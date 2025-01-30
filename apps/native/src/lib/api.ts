import { Prettify } from "@/types/prettify";

import { APIError } from "./api-error";
import { useUserStore } from "./store/user";

type FetchOptions = Omit<RequestInit, "method">;

type Options = {
  data?: unknown;
  options?: FetchOptions;
  query?: Record<string, string>;
  responseType?: "json" | "text" | "none";
};

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export const API = {
  get,
  post,
  patch,
  delete: deleteAPI
};

function get<Data>(url: URL | RequestInfo, options?: Prettify<Options>) {
  return getData<Data>(url, options);
}

function post<Data>(url: URL | RequestInfo, options?: Prettify<Options>) {
  return getData<Data>(url, options, "POST");
}

function patch<Data>(url: URL | RequestInfo, options?: Prettify<Options>) {
  return getData<Data>(url, options, "PATCH");
}

function deleteAPI<Data>(url: URL | RequestInfo, options?: Prettify<Options>) {
  return getData<Data>(url, options, "DELETE");
}

async function getData<T>(
  url: URL | RequestInfo,
  options?: Options,
  method: Method = "GET"
): Promise<T> {
  const token = useUserStore.getState().user?.sessionToken;

  const queryOptions = new URLSearchParams(options?.query).toString();

  const fetchUrl = `${process.env.EXPO_PUBLIC_API_URL}${url}${
    queryOptions ? "?" + queryOptions : ""
  }`;

  if (typeof __DEV__ !== "undefined" && __DEV__) {
    console.log("🚀 ~ fetchUrl:", fetchUrl);
  }

  const fetchOptions: RequestInit = {
    headers: {
      ...(token
        ? {
            Authorization: "Bearer " + token
          }
        : {}),
      ...(method === "POST" || method === "PATCH" || method === "PUT"
        ? {
            "Content-Type": "application/json"
          }
        : {})
    },
    method,
    body: options?.data ? JSON.stringify(options?.data) : undefined,
    ...options?.options
  };

  const res = await fetch(fetchUrl, fetchOptions);

  if (!res.ok) {
    const text = await res.text();
    throw new APIError(text, res.status, fetchUrl);
  }

  try {
    if (options?.responseType === "none") return null as T;
    const resData =
      options?.responseType === "text" ? await res.text() : await res.json();
    return resData;
  } catch (error) {
    throw new APIError(res.statusText, res.status, fetchUrl);
  }
}
