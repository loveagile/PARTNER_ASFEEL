import PATH from '@/constants/path'
import { auth } from '@/libs/firebase/firebase'
import { yupResolver } from '@hookform/resolvers/yup'
import { FirebaseError } from 'firebase/app'
import { confirmPasswordReset } from 'firebase/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

export const useResetPasswordProvider = () => {
  interface FormValues {
    password: string
    confirmPassword: string
  }

  const schema = yup.object().shape({
    password: yup
      .string()
      .min(8, '英数字8文字以上で入力してください')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d{2,}).{8,}$/g,
        '英数字8文字以上で入力してください',
      ),
    confirmPassword: yup.string(),
  })

  const [errorPassword, setErrorPassword] = useState('')
  const [confirmErrorPassword, setConfirmErrorPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const methods = useForm<FormValues>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(schema) as any,
  })

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    console.log(formData)

    setIsLoading(true)

    setErrorPassword('')
    setConfirmErrorPassword('')

    const { password, confirmPassword } = formData

    if (password !== confirmPassword) {
      setConfirmErrorPassword('パスワードが一致しません')
      setIsLoading(false)
      return
    }

    const oobCode = searchParams.get('oobCode')
    const continueUrl = searchParams.get('continueUrl')

    const actionCode = oobCode as string

    const { result, error } = await passwordReset(actionCode, password)

    if (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-action-code':
            setErrorPassword('無効なリンクです')
            console.log('Invalid action code')
            break
          case 'auth/expired-action-code':
            setErrorPassword('リンクの有効期限が切れました')
            console.log('Expired action code')
            break
          default:
            setErrorPassword('パスワード再設定に失敗しました')
            console.error(error)
            break
        }
      } else {
        setErrorPassword('パスワード再設定に失敗しました')
        console.error(error)
      }
      setIsLoading(false)
      return
    }

    // else successful
    console.log(result)
    return router.push(continueUrl || PATH.auth.login)
  }

  return {
    methods,
    errorPassword,
    confirmErrorPassword,
    isLoading,
    onSubmit,
  }
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