export const EMAIL_TEMPLATE = {
  sendVerificationCode: ({ code, systemName }: { code: string; systemName: string }) => {
    return `
    <!DOCTYPE html>
    <html lang="ja">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
          <div style="font-family: Arial, sans-serif;">
              <p>本人確認のため、以下の認証コードを画面に入力してください。</p>

              <p style="padding: 20px 0;">【認証コード】 ${code}</p>

              <p>認証コードの有効期限は<strong>${10}分間</strong>です。</p>
              <p>無効になった場合はコードを再送して認証を行ってください。</p>

              <hr style="border: none; border-top: 1px dashed #ccc; margin: 20px 0;">

              <p>本メールは送信専用メールアドレスから配信されています。<br>
              ご返信頂いても対応できませんので、あらかじめご了承ください。</p>

              <hr style="border: none; border-top: 1px dashed #ccc; margin: 20px 0;">

              <p>${systemName}</p>
          </div>
      </body>
    </html>
    `
  },
  createAccount: ({
    name,
    profileLink,
    topLink,
    systemName,
  }: {
    name: string
    profileLink: string
    topLink: string
    systemName: string
  }) => {
    return `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        p {
          margin: 0;
          padding: 0;
        }
      </style>
    </head>
    <body>
      <div style="font-family: Arial, sans-serif;">
      <p style="margin-bottom: 32px;">${name}</p>
      
      
      <p>アカウントの登録が完了しました！</p>
      <p>プロフィールを入力するとマッチング可能性が高くなります。</p>
      <p style="margin-bottom: 20px;"><a href="${profileLink}" style="color: #007BFF; text-decoration: none;">${profileLink}</a></p>
      
      
      <p>プロフィールを入力したら、自分に合う募集を探してみましょう！</p>
      <p style="margin-bottom: 24px;"><a href="${topLink}" style="color: #007BFF; text-decoration: none;">${topLink}</a></p>
      
      
      <hr style="border: none; border-top: 1px dashed #ccc; margin: 20px 0;">
      <small style="color: #888888;">
      本メールは送信専用メールアドレスから配信されています。<br>
      ご返信頂いても対応できませんので、あらかじめご了承ください。
      </small>
      <hr style="border: none; border-top: 1px dashed #ccc; margin: 20px 0;">
      <p>${systemName}</p>
      </div>
    </body>
    </html>
  `
  },
}
