const admin = require('firebase-admin');

// Firebaseの初期化
admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

async function syncUserDocumentIds() {
  const privateUsersSnapshot = await db.collection('privateUsers').get();

  let count = 0; // 異なるドキュメントの件数をカウントするための変数

  for (const userDoc of privateUsersSnapshot.docs) {
    const userEmail = userDoc.data().email;

    try {
      const userRecord = await auth.getUserByEmail(userEmail);
      const authUid = userRecord.uid;

      // FirestoreのドキュメントIDとFirebase AuthのUIDが異なる場合
      if (authUid !== userDoc.id) {
        console.log(`docId: ${userDoc.id}, authUid: ${authUid}`);
        count++; // 件数をインクリメント

        // 新しいドキュメントを作成
        await db.collection('privateUsers').doc(authUid).set(userDoc.data());

        // 古いドキュメントを削除する場合（必要に応じて）
        // await userDoc.ref.delete();
      }
    } catch (error) {
      console.error(`Error fetching user with email ${userEmail}: ${error}`);
    }
  }

  console.log(`Total number of mismatched documents: ${count}`);
}

syncUserDocumentIds().then(() => {
  console.log('Syncing completed.');
}).catch((error) => {
  console.error('Error syncing user document IDs:', error);
});
