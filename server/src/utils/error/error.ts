import express from "express";

import { Logger } from "../logger";

import { AppErrorCode, AppErrorCodeType } from "./error_app_status_code";
import { ErrorHttpStatusCode } from "./error_http_status_code";

export const appSendError = ({
  res,
  error,
}: {
  res: express.Response;
  error: BaseError | Error | unknown;
}) => {
  if (error instanceof BaseError) {
    res.status(error.httpCode).send(error.responseToClient);
    return;
  }

  appSendError({
    res,
    error: new HTTP500Error({
      message: "An unexpected error has occurred.",
      error,
    }),
  });
};

/**
 * null or undefinedが入っている場合は確実にエラーの場合に使用する
 */
export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new HTTP500Error({
      message: "unexpected",
      error: `Expected 'val' to be defined, but received ${val}`,
    });
  }
}

interface BaseErrorArg {
  code: AppErrorCodeType;
  httpCode: ErrorHttpStatusCode;
  message: string;
  error?: unknown;
}

type ClientErrorArg = Omit<BaseErrorArg, "httpCode">;
type ServerErrorArg = {
  code?: AppErrorCodeType;
  httpCode?: ErrorHttpStatusCode;
  message?: string;
  error: unknown;
};

export class BaseError extends Error {
  public readonly code: AppErrorCodeType;
  public readonly httpCode: ErrorHttpStatusCode;
  public readonly error: unknown;

  constructor({ code, httpCode, message, error }: BaseErrorArg) {
    super(message);
    this.code = code;
    this.httpCode = httpCode;
    this.error = error;

    Logger.error(`${error}`);
  }

  get responseToClient() {
    return {
      code: this.code,
      message: this.message,
    };
  }
}

/**
 * クライアントエラーと認識される何か(例えば、不正なリクエスト構文、無効なリクエストメッセージフレーム、または不正なリクエストルーティング)のために、サーバーがリクエストを処理できないか、または処理しようとしないことです。
 */
export class HTTP400Error extends BaseError {
  constructor(args: ClientErrorArg) {
    super({ ...args, httpCode: ErrorHttpStatusCode.BAD_REQUEST });
  }
}
/**
 * クライアントは要求されたレスポンスを得るために自分自身を認証する必要があります。
 */
export class HTTP401Error extends BaseError {
  constructor(args: ClientErrorArg) {
    super({ ...args, httpCode: ErrorHttpStatusCode.UNAUTHORIZED });
  }
}
/**
 * クライアントにはコンテンツへのアクセス権がありません。つまり、許可されていないため、サーバーは要求されたリソースの提供を拒否しています。 401 Unauthorized とは異なり、クライアントの ID はサーバーに知られています。
 */
export class HTTP403Error extends BaseError {
  constructor(args: ClientErrorArg) {
    super({ ...args, httpCode: ErrorHttpStatusCode.FORBIDDEN });
  }
}
/**
 * サーバーは要求されたリソースを見つけることができません。
 */
export class HTTP404Error extends BaseError {
  constructor(args: ClientErrorArg) {
    super({ ...args, httpCode: ErrorHttpStatusCode.NOT_FOUND });
  }
}
/**
 * サーバーはこのリクエストメソッドを知っているが、対象となるリソースがサポートしていない。
 */
export class HTTP405Error extends BaseError {
  constructor(args: ClientErrorArg) {
    super({ ...args, httpCode: ErrorHttpStatusCode.METHOD_NOT_ALLOWED });
  }
}
/**
 * ユーザーが一定時間内に送信したリクエストの数が多すぎる
 */
export class HTTP429Error extends BaseError {
  constructor(args: ClientErrorArg) {
    super({ ...args, httpCode: ErrorHttpStatusCode.TOO_MANY_REQUESTS });
  }
}
/**
 * サーバーが処理方法を知らない状況に遭遇しました。
 */
export class HTTP500Error extends BaseError {
  constructor({
    code = AppErrorCode.Server.unexpected,
    message = AppErrorCode.Server.unexpected,
    ...args
  }: ServerErrorArg) {
    super({
      ...args,
      code,
      message,
      httpCode: ErrorHttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
}
/**
 * リクエストメソッドはサーバーでサポートされていないため、処理することができません。
 */
export class HTTP501Error extends BaseError {
  constructor({
    code = AppErrorCode.Server.unexpected,
    message = AppErrorCode.Server.unexpected,
    ...args
  }: ServerErrorArg) {
    super({
      ...args,
      code,
      message,
      httpCode: ErrorHttpStatusCode.NOT_IMPLEMENTED,
    });
  }
}
/**
 * サーバーがリクエストの処理に必要な応答を得るためにゲートウェイとして動作している間に、無効な応答を得たことを意味します。
 */
export class HTTP502Error extends BaseError {
  constructor({
    code = AppErrorCode.Server.unexpected,
    message = AppErrorCode.Server.unexpected,
    ...args
  }: ServerErrorArg) {
    super({
      ...args,
      code,
      message,
      httpCode: ErrorHttpStatusCode.BAD_GATEWAY,
    });
  }
}
/**
 * サーバーがリクエストを処理する準備ができていない。一般的な原因は、サーバーがメンテナンスのために停止しているか、過負荷になっていることです
 */
export class HTTP503Error extends BaseError {
  constructor({
    code = AppErrorCode.Server.unexpected,
    message = AppErrorCode.Server.unexpected,
    ...args
  }: ServerErrorArg) {
    super({
      ...args,
      code,
      message,
      httpCode: ErrorHttpStatusCode.SERVICE_UNAVAILABLE,
    });
  }
}
/**
 * このエラー応答は、サーバーがゲートウェイとして動作しており、時間内に応答を得ることができない場合に返されます。
 */
export class HTTP504Error extends BaseError {
  constructor({
    code = AppErrorCode.Server.unexpected,
    message = AppErrorCode.Server.unexpected,
    ...args
  }: ServerErrorArg) {
    super({
      ...args,
      code,
      message,
      httpCode: ErrorHttpStatusCode.GATEWAY_TIMEOUT,
    });
  }
}
/**
 * リクエストに使用された HTTP のバージョンは、サーバーによってサポートされていません。
 */
export class HTTP505Error extends BaseError {
  constructor({
    code = AppErrorCode.Server.unexpected,
    message = AppErrorCode.Server.unexpected,
    ...args
  }: ServerErrorArg) {
    super({
      ...args,
      code,
      message,
      httpCode: ErrorHttpStatusCode.HTTP_VERSION_NOT_SUPPORTED,
    });
  }
}
