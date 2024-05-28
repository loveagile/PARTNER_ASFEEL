const admin = require('firebase-admin');

// Firebaseの初期化
admin.initializeApp();

const db = admin.firestore();

async function updateOccupationField() {
  const privateUsersCollection = db.collection('privateUsers');
  const snapshot = await privateUsersCollection.get();

  const batch = db.batch();

  snapshot.docs.forEach(doc => {
    const data = doc.data();

    let updates = {};

    if (data.experience !== undefined) {
      if (data.experience === '') {
        updates.experience = null;
      } else {
        updates.experience = data.experience === 'あり';
      }
    }
    if (data.hasDriverLicense !== undefined) {
      if (data.hasDriverLicense === '') {
        updates.hasDriverLicense = null;
      } else {
        updates.hasDriverLicense = data.hasDriverLicense === 'あり';
      }
    }
    if (data.otherLicense !== undefined) {
      if (data.otherLicense === '') {
        updates.otherLicense = null;
      } else {
        updates.otherLicense = data.otherLicense === 'あり';
      }
    }
    if (data.gender) {
      updates.gender = data.gender === '男性' ? 'male' : data.gender === '女性' ? 'female' : 'notAnswer'
    }
    if (data.isExpeditionPossible) {
      updates.isExpeditionPossible = data.isExpeditionPossible === '可' ? 'possible' : data.isExpeditionPossible === '不可' ? 'notPossible' : 'negotiable'
    } else {
      updates.isExpeditionPossible = null
    }
    if (data.teacherLicenseStatus) {
      updates.teacherLicenseStatus = data.teacherLicenseStatus === 'あり' ? 'having' : data.teacherLicenseStatus === 'なし' ? 'nothing' : 'scheduledAcquisition'
    } else {
      updates.teacherLicenseStatus = null
    }
    if (data.subscribeEmail) {
      updates.subscribeEmail = data.subscribeEmail === '受け取る' ? true : data.subscribeEmail === '受け取らない' ? false : null
    } else {
      updates.subscribeEmail = null
    }

    batch.update(doc.ref, updates);
  });

  // バッチ処理でFirestoreに書き戻す
  await batch.commit();
}

updateOccupationField().catch(error => {
  console.error('Failed to update occupation fields:', error);
});
