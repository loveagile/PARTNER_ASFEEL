import express from 'express'

import { Logger } from './logger'
import { ErrorHttpStatusCode } from './error/error_http_status_code'
import { Timestamp } from 'firebase-admin/firestore'

export type ValuesOf<T> = T[keyof T]

export const unawaited = (promise: Promise<unknown>) => {
  promise.catch((error) => {
    Logger.error(`Error in unawaited: ${error}`)
  })
}

/**
 * APIの呼び出し元で導入必須 ex. xxx.controller.tsファイルなど。
 *
 * responseDataがある場合は、messageフィールドはresponseに含まれない
 *
 * @message 動詞 + 目的語 ex. Created user
 * @responseData クライアントに返したい値
 *
 * @example
 * // responseDataが無い場合
 *app.post(
 *  '/user/create',
 *  async (req: express.Request, res: express.Response) => {
 *    try {
 *      return appSendSuccess({
 *        res,
 *        message: 'Created user',
 *      })
 *    } catch (error) {
 *      return appSendError({
 *        res,
 *        error,
 *      })
 *    }
 *  },
 *)
 * // responseDataがある場合
 *app.post(
 *  '/update/settlement',
 *  async (req: express.Request, res: express.Response) => {
 *    try {
 *      return appSendSuccess({
 *        res,
 *        responseData: {
 *          test1: 'test',
 *          test2: {
 *            test2: 'test2',
 *          },
 *        },
 *      })
 *    } catch (error) {
 *      return appSendError({
 *        res,
 *        error,
 *      })
 *    }
 *  },
 *)
 */
export const appSendSuccess = ({
  res,
  statusCode = ErrorHttpStatusCode.OK,
  message,
  responseData,
}: {
  res: express.Response
  message?: string
  statusCode?: ValuesOf<typeof ErrorHttpStatusCode>
  responseData?: unknown
}) => {
  if (message) {
    Logger.success(`[${statusCode}] ${message}`)
  }
  const response = responseData ? responseData : { message: message ?? '' }

  res.status(statusCode).send(response)
  return
}

export const isProd = process.env.FUNCTIONS_EMULATOR !== 'true'
export const isDev = !isProd

export const calculateAge = (dob: Timestamp): number => {
  const current = new Date()
  const birthDate = dob.toDate() // Timestamp to Date object
  let age = current.getFullYear() - birthDate.getFullYear()
  const m = current.getMonth() - birthDate.getMonth()

  // 今年の誕生日を迎えていなければ、年齢から1を引く
  if (m < 0 || (m === 0 && current.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

export const getStatusToEnglish = (status: string) => {
  switch (status) {
    case '未対応':
      return 'notstarted'
    case '対応中':
      return 'inprogress'
    case '面談':
      return 'interview'
    case '採用':
      return 'adopted'
    case '不採用':
      return 'notadopted'
    case '辞退':
      return 'cancel'
    default:
      throw new Error(`Invalid status: ${status}`)
  }
}
