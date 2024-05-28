import admin from 'firebase-admin'

let appAdmin: admin.app.App

if (admin.apps.length === 0) {
  appAdmin = admin.initializeApp()
} else {
  appAdmin = admin.app()
}

export { appAdmin }
