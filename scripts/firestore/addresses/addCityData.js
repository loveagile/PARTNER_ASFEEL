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
async function generateMasterCities() {
  const limit = rows.length;
  const timestamp = admin.firestore.Timestamp.now();

  // 既に処理された都市のIDを保存するSetを作成
  const processedCityIds = new Set();

  // バッチのリスト
  const allBatches = [];
  let currentBatch = db.batch();
  let count = 0;

  console.time("Firestore Upload Time");

  for (let i = 0; i < limit; i++) {
    try {
      const row = rows[i];
      const prefecture = row[2];
      const area = removeParentheses(row[3]);
      const cityCode = row[4];
      const city = row[5];

      const prefectureId = createHash(prefecture);
      const areaId = createHash(`${prefecture}${area}`);
      const cityId = createHash(`${prefecture}${area}${city}`);

      // 既に処理された都市のIDかどうかを確認
      if (processedCityIds.has(cityId)) continue

      const cityData = {
        order: cityCode,
        prefecture: prefectureId,
        prefectureText: prefecture,
        area: areaId,
        areaText: area,
        city: city,
        cityCode: cityCode,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      const cityDocRef = db.collection('cities').doc(cityId);
      currentBatch.set(cityDocRef, cityData);
      processedCityIds.add(cityId);
      count++;

      if (count === MAX_OPERATIONS_PER_BATCH) {
        allBatches.push(currentBatch);
        currentBatch = db.batch();
        count = 0;
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

  console.timeEnd("Firestore Upload Time");
  console.log("Data uploaded successfully!");
}

generateMasterCities().catch(error => {
  console.error("Error uploading data:", error);
});
