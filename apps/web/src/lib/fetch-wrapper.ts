import { SESSION_TOKEN_KEY } from "@/constant/auth";
import { Prettify } from "@/types/prettify";

import { APIError } from "./api-error";

type FetchOptions = Omit<RequestInit, "method">;

type Options = {
  data?: unknown;
  options?: FetchOptions;
  query?: Record<string, string>;
  responseType?: "json" | "text" | "none";
};

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export const fetchAPI = {
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
  const token = localStorage.getItem(SESSION_TOKEN_KEY);
  const queryOptions = new URLSearchParams(options?.query).toString();

  const fetchUrl = `${import.meta.env.VITE_API_BASE_URL}${url}${queryOptions ? "?" + queryOptions : ""}`;
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
    method: method,
    body: options?.data ? JSON.stringify(options?.data) : undefined,
    ...options?.options
  };

  const res = await fetch(fetchUrl, fetchOptions);

  if (!res.ok) {
    const text = await res.text();
    throw new APIError(text, res.status);
  }

  try {
    if (options?.responseType === "none") {
      return null as T;
    }
    const resData =
      options?.responseType === "text" ? await res.text() : await res.json();
    return resData;
  } catch (error) {
    throw new APIError(res.statusText, res.status);
  }
}
