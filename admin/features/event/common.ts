import { Event } from './model/event.model'

export const IS_PUBLISH_OPTIONS = [
  {
    label: '掲載中',
    value: true,
  },
  {
    label: '非掲載',
    value: false,
  },
]

export const GENDER_LIST_OPTIONS = [
  {
    label: '男性',
    value: '男性',
  },
  {
    label: '女性',
    value: '女性',
  },
  {
    label: 'どちらでも',
    value: 'どちらでも',
  },
]

export const REQUIRED_FIELDS: (keyof Event)[] = ['gender', 'email', 'workplace']
