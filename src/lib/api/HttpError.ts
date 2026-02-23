// HttpError 클래스 정의
import type { ApiErrorCode } from "./errorCodes";

export type ApiErrorBody = {
  error: {
    code?: string;
    message?: string;
    details?: unknown;
    requestId?: string;
  };
};

export class HttpError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly url: string;

  public readonly requestId?: string;
  public readonly errorCode?: ApiErrorCode | string;

  public readonly responseBodyText?: string;
  public readonly responseBody?: unknown;

  constructor(params: {
    status: number;
    statusText: string;
    url: string;
    requestId?: string;
    errorCode?: ApiErrorCode | string;
    responseBodyText?: string;
    responseBody?: unknown;
    cause?: unknown;
  }) {
    super(`HTTP ${params.status} ${params.statusText} (${params.url})`, {
      cause: params.cause,
    });

    this.name = "HttpError";
    this.status = params.status;
    this.statusText = params.statusText;
    this.url = params.url;
    this.requestId = params.requestId;
    this.errorCode = params.errorCode;
    this.responseBodyText = params.responseBodyText;
    this.responseBody = params.responseBody;
  }
}

/**
 * API 에러 응답 바디 타입 가드
 * error 필드를 필수로 검증합니다.
 */
export function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (typeof value !== "object" || value === null) return false;

  const record = value as Record<string, unknown>;

  // error 필드가 없으면 유효하지 않은 ApiErrorBody
  if (!("error" in record)) return false;

  const errorValue = record.error;

  // error 필드가 객체가 아니면 유효하지 않음
  if (typeof errorValue !== "object" || errorValue === null) return false;

  return true;
}
