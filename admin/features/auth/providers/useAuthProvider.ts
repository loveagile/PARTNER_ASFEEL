'use client'

import { useState } from 'react'
import { auth } from '@/libs/firebase/firebase'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useRouter } from 'next/navigation'
import { FirebaseError } from 'firebase/app'
import PATH from '@/constants/path'
import { API_ROUTES } from '@/constants/common'
import { ErrorValidation } from '@/constants/error'

interface FormValues {
  email: string
  password: string
}

export const useAuthUserStateProvider = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorEmail, setErrorEmail] = useState('')
  const [errorPassword, setErrorPassword] = useState('')

  const schema = yup.object().shape({
    email: yup.string().email('メールアドレスを正しく入力してください'),
    password: yup.string(),
  })

  const methods = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(schema) as any,
  })

  const handleLogin = async (formData: FormValues) => {
    setIsLoading(true)

    setErrorEmail('')
    setErrorPassword('')

    const { email, password } = formData

    const { result, error } = await login({ email, password })

    if (error) {
      if (error instanceof FirebaseError) {
        // if (error?.code) {
        switch (error.code) {
          case 'auth/invalid-email':
            setErrorEmail('メールアドレスを正しく入力してください')
            console.log('invalid email')
            break
          case 'auth/wrong-password':
            setErrorPassword('パスワードが間違っています')
            console.log('Incorrect password')
            break
          case 'auth/user-not-found':
            setErrorEmail('入力されたメールアドレスは登録されていません')
            console.log('user-not-found')
            break
          default:
            setErrorPassword('ログインに失敗しました')
            console.error(error)
            break
        }
      } else {
        setErrorEmail(error?.message || ErrorValidation.UNKNOWN_ERROR.message)
      }
      setIsLoading(false)
      return
    }

    // else successful

    return router.push(PATH.root)
  }

  return {
    errorEmail,
    errorPassword,
    isLoading,
    handleLogin,
    methods,
    login,
    logout,
  }
}

export async function login({
  email,
  password,
}: {
  email: string
  password: string
}) {
  let result = null,
    error: any = null

  try {
    result = await signInWithEmailAndPassword(auth, email, password)
    const idToken = await result.user.getIdToken()

    const res = await fetch(API_ROUTES.AUTH.createSession, {
      method: 'POST',
      body: JSON.stringify({
        idToken,
      }),
    })

    if (res.status !== 200) {
      const data = await res.json()
      throw new Error(data?.error?.message)
    }
  } catch (e: any) {
    error = e
  }

  return { result, error }
}

export async function logout() {
  await signOut(auth)
  return
}
