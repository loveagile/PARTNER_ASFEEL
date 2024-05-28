import * as functions from 'firebase-functions'
import { v1 } from 'firebase-admin/firestore'

const client = new v1.FirestoreAdminClient()

// Replace BUCKET_NAME
const bucket: string = 'gs://asfeel_backup_test_1'

export const scheduledFirestoreExport = functions.pubsub
  .schedule('0 9 * * *')
  .timeZone('Asia/Tokyo')
  .onRun((context: functions.EventContext) => {
    const projectId: string = 'www-asfeel'
    const databaseName: string = client.databasePath(projectId, '(default)')

    return client
      .exportDocuments({
        name: databaseName,
        outputUriPrefix: bucket,
        // TEST: collectionIds: ['organizationTypes'],
        collectionIds: [],
      })
      .then((responses: any[]) => {
        const response = responses[0]
        console.log(`Operation Name: ${response['name']}`)
      })
      .catch((err: Error) => {
        console.error(err)
        throw new Error('Export operation failed')
      })
  })
