import admin from 'firebase-admin'

if (admin.apps.length === 0) {
  admin.initializeApp()
}

// export * from './features/elasticSearch/elasticSearch.controller'
// export * from './features/privateUsers/privateUsers.trigger'
// export * from './features/backup/backup.pubsub'
export * from './features/elasticSearch/elasticSearch.trigger'
