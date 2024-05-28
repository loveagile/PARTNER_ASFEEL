const admin = require('firebase-admin');

// Firebaseの初期設定。この部分はあなたのFirebaseプロジェクト設定に合わせて変更してください。
admin.initializeApp();

const db = admin.firestore();

async function convertAndUpdateTimestamps() {
  const collectionRef = db.collection('eventProjects');
  const snapshot = await collectionRef.get();

  for (let doc of snapshot.docs) {
    const data = doc.data();

    // createdAtフィールドをTimestamp型に変換
    if (data.createdAt && typeof data.createdAt === 'object' && data.createdAt.seconds !== undefined && data.createdAt.nanoseconds !== undefined) {
      const timestampCreatedAt = new admin.firestore.Timestamp(data.createdAt.seconds, data.createdAt.nanoseconds);
      data.createdAt = timestampCreatedAt;
    }

    // updatedAtフィールドをTimestamp型に変換
    if (data.updatedAt && typeof data.updatedAt === 'object' && data.updatedAt.seconds !== undefined && data.updatedAt.nanoseconds !== undefined) {
      const timestampUpdatedAt = new admin.firestore.Timestamp(data.updatedAt.seconds, data.updatedAt.nanoseconds);
      data.updatedAt = timestampUpdatedAt;
    }

    // officeHoursのdateをTimestamp型に変換
    if (data.officeHours && Array.isArray(data.officeHours)) {
      data.officeHours = data.officeHours.map(item => {
        if (item.date && typeof item.date === 'object' && item.date.seconds !== undefined && item.date.nanoseconds !== undefined) {
          item.date = new admin.firestore.Timestamp(item.date.seconds, item.date.nanoseconds);
        }
        return item;
      });
    }

    // タイムスタンプを更新
    await collectionRef.doc(doc.id).set(data, { merge: true });
  }
}

convertAndUpdateTimestamps().catch(error => {
  console.error('Error updating timestamps:', error);
});