import { onDocumentWritten } from 'firebase-functions/v2/firestore'
import { setGlobalOptions } from 'firebase-functions/v2/options'
import {
  getDocIdWithData,
  shouldIdempotentFunction,
} from '../../libs/firebase/firestore'
import { Logger } from '../../utils/logger'
import { PrivateUser } from './privateUsers.model'
// import { privateUsersService } from './privateUsers.service'

setGlobalOptions({
  region: 'asia-northeast1',
  secrets: ['www-asfeel'],
})
export const onWrittenPrivateUsers = onDocumentWritten(
  'privateUsers/{userId}',
  async (event) => {
    if (!(await shouldIdempotentFunction(event.id))) {
      Logger.warn('Function has already been executed')
      return
    }

    const eventData = event.data
    if (!eventData) {
      Logger.error('No data associated with the event')
      return
    }

    const beforeData = getDocIdWithData(eventData.before) as
      | PrivateUser
      | undefined
    const afterData = getDocIdWithData(eventData.after) as
      | PrivateUser
      | undefined

    if (!beforeData && afterData) {
      // ドキュメントが作成された場合
      // await privateUsersService.createUser(afterData)
    }
    if (beforeData && afterData) {
      // ドキュメントが更新された場合
      // await privateUsersService.updateUser(afterData)
    }
    if (beforeData && !afterData) {
      // ドキュメントが削除された場合
      // await privateUsersService.deleteUser(beforeData)
    }
    return
  }
)
