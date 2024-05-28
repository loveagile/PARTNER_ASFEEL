const admin = require('firebase-admin');

// Firebaseの初期化
admin.initializeApp();

const db = admin.firestore();

async function addMemberIds() {
  const messageRoomsRef = db.collection('messageRooms');
  const snapshot = await messageRoomsRef.get();

  const batch = db.batch();

  snapshot.forEach(doc => {
    const data = doc.data();

    // membersフィールドからuserIdを取得して、memberIdsとして保存
    const memberIds = data.members.map(member => member.userId);

    console.log(memberIds);

    // バッチ更新にドキュメントを追加
    batch.set(doc.ref, { memberIds }, { merge: true });
  });

  // // バッチ更新を実行
  await batch.commit();
  console.log('Updated memberIds for all documents in messageRooms collection.');
}

addMemberIds().catch(error => {
  console.error('Failed to update occupation fields:', error);
});
