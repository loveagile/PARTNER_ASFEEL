const admin = require('firebase-admin');

// Firebaseの初期化
admin.initializeApp();

const db = admin.firestore();

// 英語を日本語に変換
const occupationMapping = {
  'universityStudent': '大学生',
  'companyEmployee': '会社員',
  'selfEmployed': '自営業/個人事業',
  'others': 'その他',
  'facultyMember': '教員',
  'publicServant': '公務員（教員以外）',
  'homemaker': '専業主婦(夫)'
};


async function updateOccupationField() {
  const privateUsersCollection = db.collection('privateUsers');
  const snapshot = await privateUsersCollection.get();

  const batch = db.batch();

  snapshot.forEach(doc => {
    const data = doc.data();

    if (data.occupation && occupationMapping[data.occupation.type]) {
      // 新しい occupation フィールドの値を設定
      const newOccupation = {
        ...data.occupation,
        type: occupationMapping[data.occupation.type]
      };
      console.log('type: ', data.occupation.type, ' -> ', newOccupation.type);
      console.log(newOccupation)
      batch.set(doc.ref, {
        ...data,
        occupation: newOccupation
      }, { merge: true });
    }
  });

  // バッチ処理でFirestoreに書き戻す
  await batch.commit();
}

updateOccupationField().catch(error => {
  console.error('Failed to update occupation fields:', error);
});
