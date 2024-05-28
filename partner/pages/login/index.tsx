import Button, {
  ButtonArrow,
  ButtonColor,
  ButtonIcon,
  ButtonShape,
  ButtonSize,
  ButtonType,
} from '@/components/atoms/Button/Button'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import SignUpLayout from '@/components/layouts/SignUpLayout'
import BackButton from '@/components/atoms/Button/BackButton'
import { useForm } from 'react-hook-form'
import { FormField } from '@/components/molecules'
import { InputStatus, InputType } from '@/components/atoms'
var validator = require('validator')
import { useAppDispatch } from '@/store'
import { setStoreLoginUserEmail } from '@/store/reducers/login_user'
import { userExists } from '@/firebase/privateUser'
import { setStoreLoading } from '@/store/reducers/global'
import useSystemName from '@/hooks/useSystemName'
import { API_URL } from '@/utils/constants/apiUrls'

export default function Page() {
  const router = useRouter()
  const { control, watch } = useForm({})
  const dispatch = useAppDispatch()
  const { systemName } = useSystemName()

  const [emailError, setEmailError] = useState<string>('')
  const email = watch('email') || ''

  useEffect(() => {
    if (email && !validator.isEmail(email)) {
      setEmailError('メールアドレスを正しく入力してください')
    } else {
      setEmailError('')
    }
  }, [email])

  const loginUser = async () => {
    try {
      dispatch(setStoreLoading(true))
      dispatch(setStoreLoginUserEmail(email))

      if (await userExists(email)) {
        const response = await fetch(API_URL.requestVerification, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            systemName,
          }),
        })

        if (response.ok) {
          console.log('Email sent successfully')
        } else {
          console.log('Email sent failed')
        }

        router.push('/login/code')
      } else {
        setEmailError('入力されたメールアドレスは登録されていません')
        return
      }
    } catch (error) {
      console.error(error)
      alert('処理の途中でエラーが発生しました。もう一度お試しください。')
    } finally {
      dispatch(setStoreLoading(false))
    }
  }

  return (
    <div className="h-full bg-gray-white">
      <SignUpLayout>
        <div className="relative">
          <div className="absolute left-[10px] top-[10px]">
            <BackButton
              onClick={() => {
                router.push('/')
              }}
            />
          </div>

          <div className="px-[24px] pb-[312px] pt-[20px] text-center">
            <div className="mx-auto max-w-[300px]">
              <p className="font-bold sp:text-[14px] pc:text-[18px]">ログイン</p>

              <div className="py-[40px]">
                <FormField
                  control={control}
                  input={{
                    name: 'email',
                    type: InputType.BOX,
                    status: InputStatus.DEFAULT,
                  }}
                  attention={{ text: '登録したメールアドレスを入力してください' }}
                  error={emailError}
                />
              </div>

              <div className="flex items-center justify-center">
                <Button
                  size={ButtonSize.SP}
                  color={ButtonColor.SUB}
                  type={ButtonType.DEFAULT}
                  shape={ButtonShape.ELLIPSE}
                  disabled={!(email && validator.isEmail(email))}
                  icon={ButtonIcon.OFF}
                  arrow={ButtonArrow.RIGHT}
                  text="次へ進む"
                  onclick={() => {
                    loginUser()
                  }}
                  className="h-[34px] w-[240px]"
                />
              </div>
            </div>
          </div>
        </div>
      </SignUpLayout>
    </div>
  )
}
