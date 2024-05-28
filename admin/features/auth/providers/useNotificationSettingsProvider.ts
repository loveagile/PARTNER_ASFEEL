'use client'

import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

export const useNotificationSettingsProvider = () => {
  interface FormValues {
    email1: string
    email2: string
    email3: string
    email4: string
    email5: string
  }

  const schema = yup.object().shape({
    email1: yup.string().email('メールアドレスを正しく入力してください'),
    email2: yup.string().email('メールアドレスを正しく入力してください'),
    email3: yup.string().email('メールアドレスを正しく入力してください'),
    email4: yup.string().email('メールアドレスを正しく入力してください'),
    email5: yup.string().email('メールアドレスを正しく入力してください'),
  })

  const [isLoading, setIsLoading] = useState(false)
  const [errorEmail, setErrorEmail] = useState('')

  const methods = useForm<FormValues>({
    defaultValues: {
      email1: 'info@mail.com',
      email2: 'suzuki@mail.com',
      email3: '',
      email4: '',
      email5: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(schema) as any,
  })

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    console.log(formData)

    setIsLoading(true)
    setErrorEmail('')

    const { email1, email2, email3, email4, email5 } = formData
  }

  return {
    isLoading,
    methods,
    errorEmail,
    onSubmit,
  }
}
