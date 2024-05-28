const admin = require('firebase-admin');

// Firebaseの初期化
admin.initializeApp();

const db = admin.firestore();

async function selectionListUserId() {
  const selectionListQuery = db.collectionGroup('leadersWantedProjectsSelectionList');
  const selectionListSnapshot = await selectionListQuery.get();

  for (const selectionDoc of selectionListSnapshot.docs) {
    const data = selectionDoc.data();
    const docId = selectionDoc.id;
    const userId = data.userId;

    if (docId !== userId) {
      const docParent = selectionDoc.ref.parent;

      // // 新しいドキュメントID（userId）で新しいドキュメントを作成
      await docParent.doc(userId).set(data);

      // // 古いドキュメントを削除
      await docParent.doc(docId).delete();
      console.log(`Document with ID: ${docId} has been replaced with ID: ${userId}`);
    }
  }

  console.log('Operation completed!');
}

selectionListUserId().catch(error => {
  console.error('Failed to update occupation fields:', error);
});
