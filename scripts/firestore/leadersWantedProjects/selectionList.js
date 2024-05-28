const admin = require('firebase-admin');

// Firebaseの初期化
admin.initializeApp();

const db = admin.firestore();

async function moveSubCol() {
  // 指導者
  // const oldCollectionName = 'leadersWantedProjectSelectionLists';
  // const newCollectionName = 'leadersWantedProjectsSelectionList';

  // イベント
  const oldCollectionName = 'eventProjectSelectionList';
  const newCollectionName = 'eventProjectsSelectionList';

  // ドキュメントを全て取得します
  const documentsSnapshot = await db.collectionGroup(oldCollectionName).get();

  const batch = db.batch();

  // 各ドキュメントに対して、新しいサブコレクションにデータを追加し、古いサブコレクションからデータを削除します
  documentsSnapshot.forEach(doc => {
    const oldDocRef = doc.ref;
    const parentRef = oldDocRef.parent.parent;
    if (parentRef) {
      const newDocRef = parentRef.collection(newCollectionName).doc(doc.id);
      console.log(parentRef.path)
      console.log(newDocRef.path);
      // batch.set(newDocRef, doc.data());
    }
  });

  // バッチ処理をコミットします
  // await batch.commit();
  // console.log('Data migration completed.');
}

moveSubCol().catch(error => {
  console.error('Failed to update occupation fields:', error);
});
