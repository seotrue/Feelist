import { HttpError, isApiErrorBody } from "./HttpError";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiRequestConfig {
  url: string;
  method: HttpMethod;
  body?: unknown;
  signal?: AbortSignal;
}

export async function apiRequest<T>({
  url,
  method,
  body,
  signal,
}: ApiRequestConfig): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, {
      method,
      signal,
      headers: {
        "Content-Type": "application/json",
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    throw new HttpError({
      status: 0,
      statusText: "NETWORK_ERROR",
      url,
      cause: networkError,
    });
  }

  if (!response.ok) {
    const responseBodyText = await response.text().catch(() => undefined);

    let responseBody: unknown;
    let requestId: string | undefined;
    let errorCode: string | undefined;

    // JSON 파싱 시도
    if (responseBodyText) {
      try {
        responseBody = JSON.parse(responseBodyText);

        if (isApiErrorBody(responseBody)) {
          requestId = responseBody.error.requestId;
          errorCode = responseBody.error.code;
        }
      } catch {
        // JSON 파싱 실패 시 무시
      }
    }

    throw new HttpError({
      status: response.status,
      statusText: response.statusText,
      url,
      requestId,
      errorCode,
      responseBody,
      responseBodyText,
    });
  }

  return response.json() as Promise<T>;
}

// HttpError를 re-export하여 편의성 제공
export { HttpError } from "./HttpError";
