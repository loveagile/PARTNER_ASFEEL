import { logger } from 'firebase-functions/v1'

export class Logger {
  static success(message: any, ...args: any[]) {
    logger.log(`✅Success: ${message}\n${args}`)
  }
  static error(message: unknown, ...args: any[]) {
    logger.error(`🔴Error: ${message}\n${args}`)
  }
  static warn(message: any, ...args: any[]) {
    logger.warn(`⚠️Warn: ${message}\n${args}`)
  }
  static log(message: any, ...args: any[]) {
    logger.log(`⚙️Log: ${message}\n${args}`)
  }
}
