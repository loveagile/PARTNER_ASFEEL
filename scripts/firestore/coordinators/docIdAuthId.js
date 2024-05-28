const admin = require('firebase-admin');

// Firebaseの初期化
admin.initializeApp();

const db = admin.firestore();
const coordinatorsRef = db.collection('coordinators');


async function updateDocuments() {
  const snapshot = await coordinatorsRef.get();
  const batch = db.batch();

  snapshot.forEach(doc => {
    const docId = doc.id;
    const authId = doc.data().authId;

    // authIdの値とドキュメントIDが異なる場合、新しいドキュメントを作成
    if (docId !== authId) {

      console.log(`docId: ${docId}, authId: ${authId}`)
      const newDocRef = coordinatorsRef.doc(authId);
      batch.set(newDocRef, doc.data());

    }
  });

  // バッチをコミットして変更を適用
  await batch.commit();
}

updateDocuments().then(() => {
  console.log('Documents updated successfully');
}).catch(error => {
  console.error('Error updating documents:', error);
});