const admin = require('firebase-admin');
const fs = require('fs');  // Node.jsの組み込みのファイルシステムモジュールをインポート

// Firebaseの初期化
admin.initializeApp();

const db = admin.firestore();
const collectionName = 'clubTypeLargeCategories';

const fetchFirestoreData = async () => {
  const snapshot = await db.collection(collectionName).get();
  const data = [];

  snapshot.forEach(doc => {
    const {
      createdAt,
      updatedAt,
      name,
      order
    } = doc.data();
    data.push({
      id: doc.id,
      createdAt: createdAt.toMillis(),
      updatedAt: updatedAt.toMillis(),
      name,
      order,
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
