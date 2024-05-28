export enum Gender {
  male = '男性',
  female = '女性',
  other = '回答しない',
}
export enum ExpeditionPossible {
  possible = '可能',
  notPossible = '不可',
  negotiable = '要相談',
}
export enum TeacherLicenseStatus {
  having = 'あり',
  nothing = 'なし',
  scheduledAcquisition = '取得予定',
}
export enum AnswerType {
  yes = 'true',
  no = 'false',
}
export enum SubscriptMailType {
  receive = '受け取る',
  not_receive = '受け取らない',
}
export enum ProjectScoutType {
  unsend = '未送信',
  scouted = 'スカウト済',
  notInterested = '興味なし',
  ng = 'NG',
}
export enum ProjectSelectionType {
  notStarted = '未対応',
  inProgress = '対応中',
  interview = '面談',
  adopted = '採用',
  change = '一括変更',
  notAdopted = '不採用',
  cancel = '辞退',
}
export enum ApplyOrScout {
  apply = '応募',
  scout = 'スカウト',
}
export enum MessageType {
  application = 'application',
  scout = 'scout',
  file = 'file',
  text = 'text',
}

export const genderEnum = {
  male: '男性',
  female: '女性',
  other: '回答しない',
} as const
export type GenderEnumKeys = keyof typeof genderEnum
export const expeditionPossibleEnum = {
  possible: '可',
  notPossible: '不可',
  negotiable: '要相談',
} as const
export type ExpeditionPossibleEnumKeys = keyof typeof expeditionPossibleEnum
export const teacherLicenseStatusEnum = {
  having: 'あり',
  nothing: 'なし',
  scheduledAcquisition: '取得予定',
} as const
export type TeacherLicenseStatusEnumKeys = keyof typeof teacherLicenseStatusEnum
export const subscriptMailEnum = {
  receive: '受け取る',
  not_receive: '受け取らない',
} as const
export type SubscriptMailEnumKeys = keyof typeof subscriptMailEnum
export const ProjectStatusEnum = {
  inpreparation: '準備中',
  inpublic: '公開中',
  finished: '終了',
} as const
export type ProjectStatusEnumKeys = keyof typeof ProjectStatusEnum
