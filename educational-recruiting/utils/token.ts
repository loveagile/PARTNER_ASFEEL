import { LOCAL_STORAGE_KEY } from '@/constants/constant_text'
import { EventProject, LeadersWantedProject } from '@/models'
import crypto from 'crypto'
import { Timestamp } from 'firebase/firestore'

const secret = process.env.SECRET_KEY
const algorithm = 'aes-256-cbc'

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16)
  const key = crypto.createHash('sha256').update(String(secret)).digest('base64').substr(0, 32)
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

export const decrypt = (hash: string): string => {
  const [ivHex, encryptedHex] = hash.split(':')
  const key = crypto.createHash('sha256').update(String(secret)).digest('base64').substr(0, 32)
  const iv = Buffer.from(ivHex, 'hex')
  const encrypted = Buffer.from(encryptedHex, 'hex')
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  return decipher.update(encrypted, undefined, 'utf8') + decipher.final('utf8')
}

export const checkValidToken = (): boolean => {
  const token = localStorage.getItem('token')
  if (token) {
    const source_data = JSON.parse(decrypt(token))
    if (source_data) {
      if (source_data.email) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  } else {
    return false
  }
}

export const createEmptyRegisterLeadersWantedProjectToken = () => {
  const register_leaders_event_project_data: LeadersWantedProject = {
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    type: '',
    target: [],
    organizationName: '',
    applyForProject: '',
    eventType: '',
    eventName: '',
    gender: '',
    recruitment: 0,
    workplace: {
      address1: '',
      address2: '',
      city: '',
      prefecture: '',
      zip: 0,
    },
    workingHours: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
    workingHoursNote: '',
    activityDescription: '',
    desiredGender: '',
    desiredAge: [],
    desiredQualifications: '',
    desiredTalent: '',
    desiredSalary: '',
    desiredNote: '',
    name: {
      sei: '',
      mei: '',
      seiKana: '',
      meiKana: '',
    },
    position: '',
    phoneNumber: 0,
    email: '',
    confirmEmail: '',
    status: 'inpreparation',
    memo: '',
  }

  localStorage.setItem(LOCAL_STORAGE_KEY.leadersProject, encrypt(JSON.stringify(register_leaders_event_project_data)))
  return encrypt(JSON.stringify(register_leaders_event_project_data))
}

export const createEmptyRegisterEventProjectToken = () => {
  const register_event_project_data: EventProject = {
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    title: '',
    subTitle: '',
    organizer: '',
    schoolName: [],
    numberOfApplicants: 0,
    workplace: {
      address1: '',
      address2: '',
      city: '',
      prefecture: '',
      zip: 0,
    },
    officeHours: [],
    officeHoursNote: '',
    jobDescription: '',
    gender: '',
    people: '',
    salary: '',
    note: '',
    name: {
      sei: '',
      mei: '',
      seiKana: '',
      meiKana: '',
    },
    position: '',
    address: {
      address1: '',
      address2: '',
      city: '',
      prefecture: '',
      zip: 0,
    },
    phoneNumber: 0,
    email: '',
    confirmEmail: '',
    status: 'inpreparation',
    memo: '',
    officeHourType: '',
  }

  localStorage.setItem('reg_event_project', encrypt(JSON.stringify(register_event_project_data)))
  return encrypt(JSON.stringify(register_event_project_data))
}
