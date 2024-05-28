import AfterLoginLayout from '@/components/layouts/AfterLoginLayout'
import BackButton from '@/components/atoms/Button/BackButton'
import { useRouter } from 'next/router'
import { FormField } from '@/components/molecules'
import { useForm } from 'react-hook-form'
import { InputStatus } from '@/components/atoms'
import Button, {
  ButtonArrow,
  ButtonColor,
  ButtonIcon,
  ButtonShape,
  ButtonSize,
  ButtonType,
} from '@/components/atoms/Button/Button'
import { IoSend } from 'react-icons/io5'
import { useAppDispatch } from '@/store'
import { userExists } from '@/firebase/privateUser'
import { useEffect, useState } from 'react'
import { setValidationError } from '@/utils/common'
import { setStoreLoading } from '@/store/reducers/global'
import useSystemName from '@/hooks/useSystemName'
import { API_URL } from '@/utils/constants/apiUrls'
var validator = require('validator')

export default function Page() {
  const { control, watch } = useForm({})
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { systemName } = useSystemName()

  const [emailError, setEmailError] = useState<string>('')
  const newEmail = watch('newEmail') || ''

  useEffect(() => {
    setValidationError(
      newEmail,
      (value: string) => !validator.isEmail(value),
      setEmailError,
      'メールアドレスを正しく入力してください',
    )
  }, [newEmail])

  const confirmChangedMail = async () => {
    if (await userExists(newEmail)) {
      setEmailError('入力したメールアドレスが既に存在します。')
      return
    }

    try {
      dispatch(setStoreLoading(true))

      const response = await fetch(API_URL.requestVerification, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail,
          systemName,
        }),
      })

      if (response.ok) {
        localStorage.setItem('newEmail', newEmail)
        router.push('/profile/email/code')
      }
    } catch (error) {
      console.error(error)
      alert('エラーが発生しました。もう一度お試しください。')
    } finally {
      dispatch(setStoreLoading(false))
    }
  }

  return (
    <div className="h-full bg-gray-white">
      <AfterLoginLayout>
        <div className="relative">
          <div className="mx-auto max-w-[360px]">
            <div className="absolute left-[10px] top-[10px]">
              <BackButton
                onClick={() => {
                  router.push('/profile')
                }}
              />
            </div>

            <div className="px-[24px] pb-[130px] pt-[20px]">
              <div className="grid gap-[40px] text-center">
                <p className="text-[14px] font-bold">
                  新しいメールアドレスを入力して
                  <br />
                  認証メールを送信してください
                </p>

                <div className="text-start">
                  <p className="pb-[4px] text-[14px] font-bold text-core-blue">新しいメールアドレス</p>
                  <FormField
                    control={control}
                    input={{
                      name: 'newEmail',
                      placeholder: '',
                      status: InputStatus.DEFAULT,
                    }}
                    attention={{ text: '入力したアドレス宛に認証メールを送信します' }}
                    error={emailError}
                  />
                </div>

                <div className="flex items-center justify-center">
                  <Button
                    size={ButtonSize.SP}
                    color={ButtonColor.SUB}
                    type={ButtonType.DEFAULT}
                    shape={ButtonShape.ELLIPSE}
                    disabled={false}
                    icon={ButtonIcon.FRONT}
                    arrow={ButtonArrow.OFF}
                    text="認証メールを送信する"
                    iconComponent={<IoSend className="mr-[4px] h-[16px] w-[16px]" />}
                    onclick={() => {
                      confirmChangedMail()
                    }}
                    className="h-[34px] w-[240px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AfterLoginLayout>
    </div>
  )
}
