const admin = require('firebase-admin');

admin.initializeApp();

const auth = admin.auth();

// すべてのユーザーアカウント情報の取得
async function getAllUsers(nextPageToken) {
  const users = [];
  const result = await auth.listUsers(1000, nextPageToken);
  users.push(...result.users);

  if (result.pageToken) {
    users.push(...await getAllUsers(result.pageToken));
  }

  return users;
}

// 各ユーザーのcustomClaimsを確認
async function displayCustomClaims() {
  const users = await getAllUsers();

  for (let user of users) {
    if (user.customClaims === undefined) {
      // customClaimsがないユーザーを削除
      await auth.deleteUser(user.uid);
      console.log(`UID: ${user.uid} has been deleted.`);
    } else {
      console.log(`UID: ${user.uid}, Custom Claims:`, user.customClaims);
    }
  }
}

displayCustomClaims();
