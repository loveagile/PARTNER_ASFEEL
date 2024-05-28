import firebase_app from './config'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  confirmPasswordReset,
  EmailAuthProvider,
  updateEmail,
  deleteUser,
  signOut,
} from 'firebase/auth'

const auth = getAuth(firebase_app)

export async function signIn(email: string, password: string) {
  let result = null,
    error = null
  try {
    result = await signInWithEmailAndPassword(auth, email, 'password')
  } catch (e) {
    error = e
  }

  return { result, error }
}

export async function signUp(email: string) {
  let result = null,
    error = null

  try {
    result = await createUserWithEmailAndPassword(auth, email, 'password')
  } catch (e) {
    error = e
  }

  return { result, error }
}

export async function closeAccount(user_id: string) {
  const user = auth.currentUser
  if (user && user.email) {
    const credential = EmailAuthProvider.credential(
      user.email,
      'password', // Replace with the user's current password
    )

    reauthenticateWithCredential(user, credential)
      .then(async () => {
        // User has been successfully reauthenticated
        // await deletePrivateUser(user_id)
        deleteUser(user)
      })
      .catch((error) => {
        console.log(error)
        // An error occurred during reauthentication
        // ...
      })
  }
}

export async function logOut() {
  let result = null,
    error = null

  try {
    result = await signOut(auth)
  } catch (e) {
    error = e
  }

  return { result, error }
}

export async function updateAuthEmail(newEmail: string, password: string) {
  const user = auth.currentUser
  console.log('user----------', user)
  let result = null,
    error = null

  if (user) {
    try {
      const credential = EmailAuthProvider.credential(user.email!, 'password')

      await reauthenticateWithCredential(user, credential)

      result = await updateEmail(user, newEmail)
    } catch (e) {
      error = e
    }

    return { result, error }
  }
}

export async function sendLink(email: string) {
  let result = null,
    error = null
  try {
    result = await sendPasswordResetEmail(auth, email)
  } catch (e) {
    error = e
  }

  return { result, error }
}

export async function passwordReset(oobCode: string, newPassword: string) {
  let result = null,
    error = null
  try {
    result = await confirmPasswordReset(auth, oobCode, newPassword)
  } catch (e) {
    error = e
  }

  return { result, error }
}
