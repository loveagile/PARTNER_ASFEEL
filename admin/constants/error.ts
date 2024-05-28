export const ErrorValidation = {
  FORBIDDEN: {
    message: 'アクセス権限がありません',
  },
  UNAUTHORIZED: {
    code: 401,
    message: 'ログインしてください',
  },
  UNKNOWN_ERROR: {
    message: 'ネットワークエラー：後で再試行してください',
  },
  VALIDATE_ERROR: {
    message: '無効な値が入力されています',
  },
  INVALID_EMAIL: {
    message: 'メールアドレスが正しくありません',
    regex: /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/g,
  },
  // characters is kana
  KANA_ONLY: {
    message: 'カタカナで入力してください',
    regex: /^[\u30A0-\u30FFー]+$/g,
  },
  // All character should be number
  NUMBER_ONLY: {
    message: '電話番号を正しく入力してください',
    regex: /^[0-9]+$/g,
  },
  // This field is required
  REQUIRED: {
    message: '必須項目です',
  },
  // Can not find zip code
  ZIP_CODE_NOT_FOUND: {
    message: '郵便番号が見つかりませんでした',
  },
  // organization already exists
  ORGANIZATION_ALREADY_EXISTS: {
    code: 'ORGANIZATION_ALREADY_EXISTS',
    message: '組織が既に存在しています',
  },
  NUMBER_LENGTH_INVALID: {
    message: (length?: number) => `${length}桁の数字で入力してください`,
  },
  CHARACTER_LENGTH_INVALID: {
    message: (length?: number) => `${length}字以内で入力してください`,
  },
  EMOJI_NOT_ALLOWED: {
    regex:
      /[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g,
    message: '絵文字は入力できません',
  },
  EMAIL: {
    message: 'メールアドレスを正しく入力してください',
  },
  PASSWORD: {
    regex: /^(?=.*[A-Za-z])(?=.*\d{2,}).{8,}$/g,
    message: '英数字8文字以上で入力してください',
  },
  PASSWORD_NOT_MATCH: {
    message: 'パスワードが一致しません',
  },
  EMAIL_ALREADY_EXISTS: {
    code: 'auth/email-already-exists',
    message: 'メールアドレスが既に存在しています',
  },
  WRONG_PASSWORD: {
    code: 'auth/wrong-password',
    message: 'パスワードが間違っています',
  },
  VALIDATE_NUMBER_HOUR: {
    message: '電話番号を正しく入力してください',
    regex: /^(0?\d|1\d|2[0-3])$/g,
  },
  VALIDATE_NUMBER_MINUTE: {
    message: '電話番号を正しく入力してください',
    regex: /^([0-5]\d|\d)$/g,
  },
  CSV_REQUIRE_INFO: {
    message: '必須な項目を入力してください',
  },
}
