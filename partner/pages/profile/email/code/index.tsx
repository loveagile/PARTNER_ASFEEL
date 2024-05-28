import Button, {
  ButtonArrow,
  ButtonColor,
  ButtonIcon,
  ButtonShape,
  ButtonSize,
  ButtonType,
} from '@/components/atoms/Button/Button'
import { useRouter } from 'next/router'
import SignUpLayout from '@/components/layouts/SignUpLayout'
import BackButton from '@/components/atoms/Button/BackButton'
import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store'
import { setPrivateUser } from '@/firebase/privateUser'
import { setStoreProfileActiveTab, setStoreProfileEditState } from '@/store/reducers/profile'
import VerificationInput from 'react-verification-input'
import { setStoreLoading } from '@/store/reducers/global'
import DontSendCodeQuestion from '@/components/atoms/DontSendCodeQuestion'
import useSystemName from '@/hooks/useSystemName'
import { API_URL } from '@/utils/constants/apiUrls'
import { useAuthUserStateProvider } from '@/hooks/useAuthUserStateProvider'

export default function Page() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { authUser } = useAppSelector((state) => state.global)
  const { userInfo } = useAppSelector((state) => state.profile)
  const { systemName } = useSystemName()
  const { updateAuthEmail } = useAuthUserStateProvider()

  const [code, setCode] = useState<string>('')
  const [isCodeRight, setIsCodeRight] = useState(true)
  const [button_disable, setButtonDisable] = useState(true)

  const reSendVerifyCode = async () => {
    const { email } = userInfo

    try {
      dispatch(setStoreLoading(true))

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
      }
    } catch (error) {
      console.error(error)
      alert('エラーが発生しました。もう一度お試しください。')
    } finally {
      dispatch(setStoreLoading(false))
    }
  }

  const completeCode = (code: string) => {
    setCode(code)
    setButtonDisable(code.length !== 4)
  }

  const updateEmail = async () => {
    if (!authUser) return

    const newEmail = localStorage.getItem('newEmail')
    if (!newEmail) {
      alert('もう一度メールアドレスを入力してください。')
      router.push('/profile/email')
      return
    }

    try {
      dispatch(setStoreLoading(true))

      const res = await fetch(API_URL.updateEmail, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentEmail: authUser.email,
          newEmail,
          code,
        }),
      })

      if (res.status !== 200) {
        setIsCodeRight(false)
        throw new Error('認証コードの確認に失敗しました。もう一度お試しください。')
      }

      if (res.status === 200) {
        const { token, message } = await res.json()
        if (!token) {
          throw new Error(message)
        }

        // メールアドレス変更
        setIsCodeRight(true)
        await updateAuthEmail(token, newEmail)
        await setPrivateUser(authUser.uid, {
          ...userInfo,
          email: newEmail,
        })

        dispatch(setStoreProfileEditState(false))
        dispatch(setStoreProfileActiveTab(1))
        router.push('/profile')
      }
    } catch (error: any) {
      dispatch(setStoreLoading(false))
      console.error(error)
      alert(error.message)
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
                router.push('/profile/email')
              }}
            />
          </div>

          <div className="px-[62px] pb-[60px] pt-[20px] text-center">
            <div className="mx-auto max-w-[800px]">
              <p className="font-bold sp:text-[11.5px] pc:text-[14px]">
                下のメールアドレスに送信された
                <br />
                認証コードを入力してください
              </p>

              <p className="py-[40px] text-[12px] font-bold">{userInfo.email}</p>
            </div>

            <div className="flex justify-center">
              <VerificationInput
                placeholder=""
                length={4}
                onChange={completeCode}
                classNames={{
                  container: '-ml-[20px]',
                  character:
                    'pt-[5px] ml-[20px] w-[44px] h-[60px] bg-gray-gray_lighter text-center text-[30px] border-t-0 border-x-0 border-b-2 border-b-core-blue',
                  characterInactive: 'character--inactive',
                  characterSelected: 'character--selected',
                }}
              />
            </div>

            <div className={`flex items-center justify-center ${isCodeRight ? 'py-[40px]' : 'pt-[40px]'}`}>
              <Button
                size={ButtonSize.SP}
                color={ButtonColor.SUB}
                type={ButtonType.DEFAULT}
                shape={ButtonShape.ELLIPSE}
                disabled={button_disable}
                icon={ButtonIcon.OFF}
                arrow={ButtonArrow.OFF}
                text="認証する"
                onclick={() => {
                  updateEmail()
                }}
                className="h-[34px] w-[240px]"
              />
            </div>

            {!isCodeRight && (
              <p className="pb-[40px] pt-[10px] text-[9.5px] text-core-red">
                コードが正しくないか、有効期限が切れている可能性
                <br />
                があります。再度お試しください。
              </p>
            )}

            <p className="cursor-pointer text-[12px] font-bold text-core-blue" onClick={() => reSendVerifyCode()}>
              <u>もう一度送信する</u>
            </p>

            <DontSendCodeQuestion />
          </div>
        </div>
      </SignUpLayout>
    </div>
  )
}
