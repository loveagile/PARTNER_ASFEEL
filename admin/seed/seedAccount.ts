import { ROLE_NAME } from '@/constants/common'
import { appAdmin } from '@/libs/firebase/firebaseAdmin'

const ACCOUNTS = [
  {
    email: 'nozawa+admin1@tifana.com',
    pass: 'nozawa123',
  },
  {
    email: 't-ishizuka+admin1@tifana.com',
    pass: 'tishizuka123',
  },
  {
    email: 'yoshizoe+admin1@tifana.com',
    pass: 'yoshizoe123',
  },
  {
    email: 'retu1118+admin1@gmail.com',
    pass: '12345678a',
  },
]

export const seedAccount = async () => {
  const auth = appAdmin.auth()

  const promises = ACCOUNTS.map(async ({ email, pass }) => {
    try {
      await auth.getUserByEmail(email)
    } catch (error) {
      const acc = await auth.createUser({
        email,
        password: pass,
      })

      await auth.setCustomUserClaims(acc.uid, {
        role: ROLE_NAME.ADMIN,
        isPublish: true,
        updatedAt: new Date().getTime(),
        createdAt: new Date(acc.metadata.creationTime).getTime(),
      })

      return acc.email
    }
  })

  const res = await Promise.all(promises)

  console.log('res', res)
}
