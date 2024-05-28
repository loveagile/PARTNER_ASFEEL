import { PrivateUser } from '@/models'
import crypto from 'crypto'

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
    const source_data: PrivateUser = JSON.parse(decrypt(token))
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
