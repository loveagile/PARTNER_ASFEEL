const admin = require('firebase-admin');
const fs = require('fs');  // Node.jsの組み込みのファイルシステムモジュールをインポート

// Firebaseの初期化
admin.initializeApp();
const db = admin.firestore();
const collectionName = 'organizations';

const fetchFirestoreData = async () => {
  const snapshot = await db.collection(collectionName).get();
  const data = [];

  snapshot.forEach(doc => {
    const {
      createdAt,
      updatedAt,
      deletedAt,
      address,
      isSuspended,
      name,
      nameKana,
      organizationId,
      organizationType,
      organizationTypeText,
      phoneNumber,
      prefecture,
    } = doc.data();
    data.push({
      id: doc.id,
      createdAt: createdAt.toMillis(),
      updatedAt: updatedAt.toMillis(),
      deletedAt: deletedAt ? deletedAt.toMillis() : null,
      address,
      isSuspended,
      name,
      nameKana,
      organizationId,
      organizationType,
      organizationTypeText,
      phoneNumber,
      prefecture,
    });
  });

  return data;
};

const createJSONFile = (data) => {
  const filename = `../master_${collectionName}.json`;
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));  // JSON形式でファイルに書き込む

  console.log(`${filename} が作成されました！`);
};

const main = async () => {
  const data = await fetchFirestoreData();
  createJSONFile(data);
};

main();
