import { Client } from '@elastic/elasticsearch'
import { Logger } from '../../utils/logger'
import { isProd } from '../../utils/common'
import dotenv from 'dotenv'
import {
  getDocIdWithData,
  shouldIdempotentFunction,
} from '../../libs/firebase/firestore'

type ProcessDocument<T> = (data: T) => Promise<T> | T

const createClient = () => {
  const buf = Buffer.from(process.env['www-asfeel'] as string)
  const config = dotenv.parse(buf)
  return new Client({
    cloud: {
      id: isProd
        ? config['ELASTIC_CLOUD_ID']
        : (process.env.ELASTIC_CLOUD_ID as string),
    },
    auth: {
      username: isProd
        ? config['ELASTIC_USERNAME']
        : (process.env.ELASTIC_USERNAME as string),
      password: isProd
        ? config['ELASTIC_PASSWORD']
        : (process.env.ELASTIC_PASSWORD as string),
    },
  })
}

export const elasticSearchService = {
  async createIndex(data: { id: string; index: string; body: any }) {
    const client = createClient()
    const response = await client.index(data)
    Logger.success(JSON.stringify(response))
    return response
  },
  async updateIndex(data: { id: string; index: string; body: any }) {
    const client = createClient()
    const response = await client.index(data)
    Logger.success(JSON.stringify(response))
    return response
  },
  async deleteIndex(data: { id: string; index: string }) {
    const client = createClient()
    const response = await client.delete(data)
    Logger.success(JSON.stringify(response))
    return response
  },
  async handleDocumentChange<T>(
    event: any, // イベントの型を適切に定義してください
    indexName: string,
    processDocument?: ProcessDocument<T>
  ) {
    if (!(await shouldIdempotentFunction(event.id))) {
      Logger.warn('Function has already been executed')
      return
    }

    const eventData = event.data
    if (!eventData) {
      Logger.error('No data associated with the event')
      return
    }

    const docId = event.params.docId
    let beforeData: T | undefined = getDocIdWithData<T>(eventData.before)
    let afterData: T | undefined = getDocIdWithData<T>(eventData.after)

    // データ加工関数が提供されている場合は、それを適用する
    if (processDocument) {
      if (afterData) afterData = await processDocument(afterData)
      if (beforeData) beforeData = await processDocument(beforeData)
    }

    if (!beforeData && afterData) {
      // Document created
      elasticSearchService.createIndex({
        id: docId,
        index: indexName,
        body: afterData,
      })
    } else if (beforeData && afterData) {
      // Document updated
      elasticSearchService.updateIndex({
        id: docId,
        index: indexName,
        body: afterData,
      })
    } else if (beforeData && !afterData) {
      // Document deleted
      elasticSearchService.deleteIndex({
        id: docId,
        index: indexName,
      })
    }
  },
}
