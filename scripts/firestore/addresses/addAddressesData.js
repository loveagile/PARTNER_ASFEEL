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

// （）と()で囲まれた部分を削除する関数
function removeParentheses(str) {
  return str.replace(/（[^）]*）/g, '').replace(/\([^)]*\)/g, '').trim();
}

// (）と()で囲まれた部分を抽出する関数
function extractParenthesesContents(str) {
  const matches = str.match(/（[^）]*）|\([^)]*\)/g);
  if (!matches) return '';

  // () と （） の括弧を削除して結果を返す
  return matches.map(match => match.slice(1, -1)).join(' ');
}

// 文字列をSHA256でハッシュ化する関数
function createHash(str) {
  return crypto.createHash('sha256').update(str, 'utf8').digest('hex');
}

const MAX_OPERATIONS_PER_BATCH = 500; // Firestore's limit is 500 operations per batch
const MAX_BATCH_ARRAY_LENGTH = 10
async function generateMasterAddresses() {
  const limit = rows.length;
  // const limit = 5; // 5件のみアップロードする場合
  const timestamp = admin.firestore.Timestamp.now();

  // バッチのリスト
  const allBatches = [];
  let currentBatch = db.batch();
  let count = 0;

  console.time("Firestore Upload Time");  // 処理時間の計測開始

  for (let i = 0; i < limit; i++) {
    try {
      const row = rows[i];

      const zip = row[0];
      const prefectureCode = row[1];
      const prefecture = row[2];
      const prefectureId = createHash(prefecture);

      const area = removeParentheses(row[3]);
      const areaFull = row[3];
      const areaId = createHash(`${prefecture}${area}`);

      const cityCode = row[4];
      const city = row[5];
      const cityId = createHash(`${prefecture}${area}${city}`);

      const address1 = removeParentheses(row[6]);
      const address1Full = row[6];
      const address1Id = createHash(`${zip}${prefecture}${area}${city}${address1Full}`);


      const address1Data = {
        zip: zip,
        order: i + 1,
        prefectureCode: prefectureCode,
        prefecture: prefectureId,
        prefectureText: prefecture,

        area: areaId,
        areaText: area,
        areaTextFull: areaFull,

        cityCode: cityCode,
        city: cityId,
        cityText: city,

        address1: address1,
        address1Full: address1Full,
        address2: extractParenthesesContents(address1Full),

        createdAt: timestamp,
        updatedAt: timestamp
      };

      const address1DocRef = db.collection('addresses').doc(address1Id);
      currentBatch.set(address1DocRef, address1Data);
      count++;

      if (count === MAX_OPERATIONS_PER_BATCH) {
        allBatches.push(currentBatch);
        currentBatch = db.batch();
        count = 0;

        if (allBatches.length === MAX_BATCH_ARRAY_LENGTH) {
          try {
            const commitPromises = allBatches.map(batch => batch.commit());
            await Promise.all(commitPromises);
            allBatches.length = 0;
            console.log("Committed 5000 documents to Firestore");
          } catch (error) {
            console.error("Error committing batch:", error);
          }
        }
      }

    } catch (error) {
      console.log(`Error: ${error}, index: ${i}`);
      throw new Error(`index: ${i}`);
    }
  }

  if (count > 0 || allBatches.length > 0) {
    const remainingPromises = [...allBatches, currentBatch].map(batch => batch.commit());
    await Promise.all(remainingPromises);
  }

  console.timeEnd("Firestore Upload Time");  // 処理時間の計測終了
  console.log("Data uploaded successfully!");
}

generateMasterAddresses().catch(error => {
  console.error("Error uploading data:", error);
});