const admin = require('firebase-admin');
const crypto = require('crypto');

// Firebaseのサービスアカウント情報を使用して初期化
admin.initializeApp();

const db = admin.firestore();

// 学校区分データ
const schoolTypes = {
  '小学校': 6,
  '中学校': 3,
  '高等学校': 3,
  '中等教育学校': 6,
  '高等専門学校': 4,
  '短期大学': 2,
  '大学': 4,
  '特別支援学校': 12,
  '専修学校': 3
};

async function saveToFirestore() {
  for (const [name, grade] of Object.entries(schoolTypes)) {
    // ハッシュ化してdocumentIdを生成
    const hash = crypto.createHash('sha256').update(name).digest('hex');

    // データを保存
    await db.collection('organizationTypes').doc(hash).set({
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
      grade: grade,
      name: name
    });
  }

  console.log("Data saved to Firestore successfully!");
}

saveToFirestore();
