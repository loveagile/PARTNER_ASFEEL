import { atom } from 'recoil'

export const projectUserKey = atom({
  key: 'projectUserKey',
  default: {
    keyword: '',
    event: '',
  },
})
