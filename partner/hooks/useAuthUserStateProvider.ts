import { auth } from '@/libs/firebase/firebase'
import { DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { useAppDispatch, useAppSelector } from '@/store'
import { setAuthUser, setIsInit, setStoreLoading } from '@/store/reducers/global'
import { resetUserInfo, setStoreUserInfo } from '@/store/reducers/profile'
import { FirebaseError } from 'firebase/app'
import { deleteUser, onAuthStateChanged, signInWithCustomToken, signOut, updateEmail } from 'firebase/auth'
import { getDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const useAuthUserStateProvider = () => {
  const { authUser } = useAppSelector((state) => state.global)
  const dispatch = useAppDispatch()
  const router = useRouter()

  // ログイン
  const loginWithToken = async (token: string) => {
    try {
      const userCred = await signInWithCustomToken(auth, token)
      dispatch(setAuthUser(userCred.user))
      return { result: userCred.user, error: null }
    } catch (error) {
      console.error('Error: ', error)
      let errorMessage = 'ログインに失敗しました'

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-email':
            console.log('invalid email')
            errorMessage = 'メールアドレスを正しく入力してください'
            break
          case 'auth/wrong-password':
            console.log('wrong password')
            errorMessage = 'パスワードが間違っています'
            break
          case 'auth/user-not-found':
            console.log('user-not-found')
            errorMessage = '入力されたメールアドレスは登録されていません'
            break
          default:
            console.error(error)
            break
        }
      } else {
        console.error(error)
      }

      return { result: null, error: errorMessage }
    }
  }

  // ログアウト
  const logout = async () => {
    try {
      dispatch(setStoreLoading(true))
      await signOut(auth)
      router.push('/')
    } catch (error) {
      alert('ログアウトに失敗しました。もう一度お試しください。')
    } finally {
      dispatch(setStoreLoading(false))
    }
  }

  // ユーザーの削除
  const deleteAuthUser = async () => {
    const currentUser = auth.currentUser
    if (!currentUser || !authUser) return

    try {
      await deleteUser(currentUser)
    } catch (error) {
      throw error
    }
  }

  // メールアドレス変更
  const updateAuthEmail = async (token: string, newEmail: string) => {
    try {
      const { result: currentUser, error } = await loginWithToken(token)
      if (!currentUser) throw new Error(error)

      await updateEmail(currentUser, newEmail)
    } catch (error) {
      throw error
    }
  }

  const PUBLIC_PAGES = [
    '/login',
    '/login/code',
    '/signup',
    '/signup/skills',
    '/signup/clubs',
    '/signup/areas',
    '/signup/profile',
    '/signup/code',
    '/signup/profile/search-university',
    '/reset-password',
    '/jobList',
    '/jobList/[id]',
  ]

  // ユーザーの状態を監視
  useEffect(() => {
    if (authUser) return

    const authUserChangedFunction = () =>
      new Promise((resolve) => {
        return onAuthStateChanged(auth, async (user) => {
          if (!user) {
            dispatch(setAuthUser(null))
            dispatch(setIsInit(true))
            dispatch(resetUserInfo())

            // 許可されたページ以外にアクセスした場合はトップページにリダイレクト
            if (!PUBLIC_PAGES.includes(router.pathname)) {
              router.push('/')
            }

            resolve(null)
            return
          }
          dispatch(setAuthUser(user))

          const userDoc = await getDoc(DocRef.privateUser(user.uid))
          if (!userDoc.exists()) return
          dispatch(setStoreUserInfo(getDocIdWithData(userDoc)))
          dispatch(setIsInit(true))

          resolve(user)
        })
      })

    authUserChangedFunction()
  }, [setAuthUser])

  return {
    authUser,
    loginWithToken,
    logout,
    deleteAuthUser,
    updateAuthEmail,
  }
}
