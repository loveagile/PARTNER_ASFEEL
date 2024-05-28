'use client'

import { auth } from '@/libs/firebase/firebase'
import { ActionCodeSettings, sendPasswordResetEmail } from 'firebase/auth'
import { useState } from 'react'

import PATH from '@/constants/path'
import { yupResolver } from '@hookform/resolvers/yup'
import { FirebaseError } from 'firebase/app'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

export const useForgotPasswordProvider = () => {
  interface FormValues {
    email: string
  }

  const schema = yup.object().shape({
    email: yup.string().email('メールアドレスを正しく入力してください'),
  })

  const [isLoading, setIsLoading] = useState(false)
  const [errorEmail, setErrorEmail] = useState('')
  const router = useRouter()

  const methods = useForm<FormValues>({
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(schema) as any,
  })

  const onSubmit = async (formData: FormValues) => {
    console.log(formData)

    setIsLoading(true)
    setErrorEmail('')

    const { email } = formData

    const baseUrl = window.location.origin

    const { result, error } = await sendLink(email, {
      url: `${baseUrl}${PATH.auth.login}`,
    })

    if (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-email':
            setErrorEmail('メールアドレスを正しく入力してください')
            console.log('invalid email')
            break
          case 'auth/user-not-found':
            setErrorEmail('このアドレスは登録されていません')
            console.log('user-not-found')
            break
          default:
            setErrorEmail('パスワード再設定に失敗しました')
            console.error(error)
            break
        }
      } else {
        setErrorEmail('パスワード再設定に失敗しました')
        console.error(error)
      }
      setIsLoading(false)
      return
    }

    // else successful
    router.push(`${PATH.auth.sendLinkConfirm}/?email=${email}`)
  }
  return {
    isLoading,
    errorEmail,
    methods,
    onSubmit,
    sendLink,
  }
}

export async function sendLink(email: string, settings?: ActionCodeSettings) {
  let result = null,
    error = null
  try {
    result = await sendPasswordResetEmail(auth, email, settings)
  } catch (e) {
    error = e
  }

  return { result, error }
}
