const admin = require('firebase-admin');
const fs = require('fs');

// Firebaseの初期化
admin.initializeApp();
const db = admin.firestore();
const collectionName = 'clubTypeMediumCategories';

const convertToTimestamp = (milliseconds) => {
  if (milliseconds === null) {
    return null;
  }
  return admin.firestore.Timestamp.fromMillis(milliseconds);
};

const saveDataToFirestore = async (data) => {
  const collection = db.collection(collectionName);

  for (let item of data) {
    const docId = item.id;
    delete item.id;  // FirestoreのドキュメントIDとして使用するため、元のデータからidを削除

    // ミリ秒をTimestampオブジェクトに変換
    item.createdAt = convertToTimestamp(item.createdAt);
    item.updatedAt = convertToTimestamp(item.updatedAt);
    if (item.hasOwnProperty('deletedAt')) {
      item.deletedAt = convertToTimestamp(item.deletedAt);
    }

    await collection.doc(docId).set(item);  // ドキュメントを保存
  }

  console.log('Data saved to Firestore successfully!');
};

const main = async () => {
  const fileData = fs.readFileSync(`./master_${collectionName}.json`, 'utf-8');  // JSONファイルのパスを指定
  const jsonData = JSON.parse(fileData);  // ファイルの内容をJSONとしてパース

  await saveDataToFirestore(jsonData);
};

main();
