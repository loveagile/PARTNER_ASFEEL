const admin = require('firebase-admin');
const XLSX = require('xlsx');
const crypto = require('crypto');

// Firebaseの初期化
admin.initializeApp();

const db = admin.firestore();

// XLSXファイルの読み込み
const workbook = XLSX.readFile('./master_address.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// シートをJSON形式の配列に変換
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
rows.shift();

// 文字列をSHA256でハッシュ化する関数
function createHash(str) {
  return crypto.createHash('sha256').update(str, 'utf8').digest('hex');
}

const MAX_OPERATIONS_PER_BATCH = 500; // Firestore's limit is 500 operations per batch
async function generateMasterAddresses() {
  const timestamp = admin.firestore.Timestamp.now();

  // バッチのリスト
  const allBatches = [];
  let currentBatch = db.batch();
  let count = 0;

  const addedPrefectures = new Set();

  console.time("Firestore Upload Time");  // 処理時間の計測開始

  for (const row of rows) {
    try {
      const prefecture = row[2];
      const prefectureCode = row[1];
      const prefectureId = createHash(prefecture);

      // すでに追加された都道府県をスキップ
      if (addedPrefectures.has(prefectureId)) continue;

      const prefectureData = {
        index: prefectureCode,
        order: prefectureCode,
        prefecture: prefecture,
        prefectureCode: prefectureCode,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      const prefectureDocRef = db.collection('prefectures').doc(prefectureId);
      currentBatch.set(prefectureDocRef, prefectureData);
      addedPrefectures.add(prefectureId);

      count++;

      if (count === MAX_OPERATIONS_PER_BATCH) {
        allBatches.push(currentBatch);
        currentBatch = db.batch();
        count = 0;

        // Firestoreのバッチの上限に達した場合にコミット
        const commitPromises = allBatches.map(batch => batch.commit());
        await Promise.all(commitPromises);
        allBatches.length = 0;
        console.log("Committed to Firestore");
      }
    } catch (error) {
      console.error(`Error at row: ${JSON.stringify(row)}`, error);
    }
  }

  if (count > 0) {
    await currentBatch.commit();
  }

  console.timeEnd("Firestore Upload Time");  // 処理時間の計測終了
  console.log("Data uploaded successfully!");
}

generateMasterAddresses().catch(error => {
  console.error("Error uploading data:", error);
});
