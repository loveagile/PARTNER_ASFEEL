const admin = require('firebase-admin');
const XLSX = require('xlsx');
const crypto = require('crypto');

// Firebaseのサービスアカウント情報を使用して初期化
admin.initializeApp();

const db = admin.firestore();

function createHash(str) {
  return crypto.createHash('sha256').update(str, 'utf8').digest('hex');
}

function extractPrefecture(address) {
  const prefectures = [
    "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県", "茨城県",
    "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県", "新潟県", "富山県",
    "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県", "三重県",
    "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県", "鳥取県", "島根県",
    "岡山県", "広島県", "山口県", "徳島県", "香川県", "愛媛県", "高知県", "福岡県",
    "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
  ];

  for (let pref of prefectures) {
    if (address.includes(pref)) {
      return pref;
    }
  }
  return ''; // 何も見つからない場合は空文字を返す
}

async function processSchool(school) {
  const organizationId = String(school['学校ID']);
  const schoolName = school['学校名'];
  const zip = school['郵便番号'];
  const address = school['住所'];
  const schoolNameKana = school['校名読み'] || '';
  const tel = school['TEL'] || '';
  const schoolType = school['学校区分'];

  if (!zip || !address || !schoolNameKana || !tel) {
    console.log(`School ID: ${organizationId}, School Name: ${schoolName}, ZIP: ${zip}`);
    return {
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
      deletedAt: null,
      name: schoolName,
      nameKana: schoolNameKana || '',
      address: {
        zip: zip || '',
        prefecture: address ? extractPrefecture(address) : '',
        city: '',
        address1: ''
      },
      organizationId: organizationId,
      organizationType: createHash(schoolType),
      organizationTypeText: schoolType,
      phoneNumber: tel ? tel.replace(/-/g, '') : '',
      isSuspended: false
    };
  }

  const addressDoc = await db.collection('addresses').where('zip', '==', zip).get();

  if (addressDoc.empty) {
    console.log('アドレスがない')
    console.log(`School ID: ${organizationId}, School Name: ${schoolName}, ZIP: ${zip}`);

    return {
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
      deletedAt: null,
      name: schoolName,
      nameKana: schoolNameKana || '',
      address: {
        zip: zip || '',
        prefecture: address ? extractPrefecture(address) : '',
        city: '',
        address1: ''
      },
      organizationId: organizationId,
      organizationType: createHash(schoolType),
      organizationTypeText: schoolType,
      phoneNumber: tel ? tel.replace(/-/g, '') : '',
      isSuspended: false
    };
  }

  const prefecture = addressDoc.docs[0].data().prefectureText;
  const city = addressDoc.docs[0].data().cityText;
  const address1 = school['住所'].split(prefecture + city)[1];

  return {
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    deletedAt: null,
    name: schoolName,
    nameKana: schoolNameKana || '',
    address: {
      zip: zip,
      prefecture: prefecture,
      city: city,
      address1: address1 || ''
    },
    organizationId: organizationId,
    organizationType: createHash(schoolType),
    organizationTypeText: schoolType,
    phoneNumber: tel ? tel.replace(/-/g, '') : '',
    isSuspended: false
  };
}

const MAX_BATCH_SIZE = 500;
const CONCURRENT_BATCHES = 10;





async function createBatches(data) {
  const totalBatches = Math.ceil(data.length / MAX_BATCH_SIZE);

  let currentBatch = 0;
  while (currentBatch < totalBatches) {
    const promises = [];

    // CONCURRENT_BATCHESの数だけ平行でバッチ処理を行う
    for (let i = 0; i < CONCURRENT_BATCHES && currentBatch < totalBatches; i++) {
      const batchData = data.slice(currentBatch * MAX_BATCH_SIZE, (currentBatch + 1) * MAX_BATCH_SIZE);
      promises.push(createSingleBatch(batchData, currentBatch));
      currentBatch++;
    }

    // すべての平行処理を待つ
    await Promise.all(promises);
  }
}

async function createSingleBatch(batchData, batchNumber) {
  const batch = db.batch();

  for (const school of batchData) {
    const organization = await processSchool(school);
    if (organization) {
      const orgRef = db.collection('organizations').doc(String(school['学校ID']));
      batch.set(orgRef, organization);
    }
  }

  await batch.commit();
  console.log(`Uploaded batch ${batchNumber + 1}...`);
}

async function main() {
  const workbook = XLSX.readFile('./master_school.xlsx');
  const sheet_name_list = workbook.SheetNames;
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

  await createBatches(data);

  console.log("Data uploaded to Firestore successfully!");
}

main();
