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
import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store'
import VerificationInput from 'react-verification-input'
import { useAuthUserStateProvider } from '@/hooks/useAuthUserStateProvider'
import { DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { getDoc } from 'firebase/firestore'
import { setStoreLoading, setStoreLoginUserData } from '@/store/reducers/global'
import DontSendCodeQuestion from '@/components/atoms/DontSendCodeQuestion'
import useSystemName from '@/hooks/useSystemName'
import { API_URL } from '@/utils/constants/apiUrls'

export default function Page() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { loginWithToken } = useAuthUserStateProvider()
  const { loginUserEmail } = useAppSelector((state) => state.login_user)
  const { systemName } = useSystemName()

  const [code, setCode] = useState<string>('')
  const [isCodeRight, setIsCodeRight] = useState(true)
  const [button_disable, setButtonDisable] = useState(true)

  useEffect(() => {
    if (!loginUserEmail) router.push('/')
  }, [])

  const sendVerifyCode = async () => {
    try {
      dispatch(setStoreLoading(true))
      const response = await fetch(API_URL.requestVerification, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginUserEmail,
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
    setCode(code.toLowerCase())
    setButtonDisable(code.length !== 4)
  }

  const checkActionCode = async () => {
    try {
      dispatch(setStoreLoading(true))

      // 認証コードの認証
      const res = await fetch(API_URL.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginUserEmail,
          code,
        }),
      })
      if (res.status !== 200) {
        setIsCodeRight(false)
        throw new Error('認証コードの認証に失敗しました。')
      }

      // ログイン
      const { token } = await res.json()
      const { result: user, error } = await loginWithToken(token)
      if (!user || error) {
        throw new Error('ログインに失敗しました。')
      }

      // ユーザーデータ取得 and ローカルストレージから削除
      const privateUserDoc = await getDoc(DocRef.privateUser(user.uid))
      const data = getDocIdWithData(privateUserDoc)
      dispatch(setStoreLoginUserData(data))
      localStorage.removeItem('signup_data')
      localStorage.removeItem('organization_name')
      localStorage.removeItem('organization_grade')
      router.push('/')
    } catch (error: any) {
      alert(error.message)
      return
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
                router.push('/login')
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

              <p className="py-[40px] text-[12px] font-bold">{loginUserEmail}</p>
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
                  checkActionCode()
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
            <p className="pb-[40px] pt-[10px] text-[12px]">
              「@spocul-bank.jp」からのメールを受信できるように設定をお願いします。
              <br />
              スカウトのお知らせなど重要なメールをお送りします。
            </p>

            <p className="cursor-pointer text-[12px] font-bold text-core-blue" onClick={() => sendVerifyCode()}>
              <u>もう一度送信する</u>
            </p>

            <DontSendCodeQuestion />
          </div>
        </div>
      </SignUpLayout>
    </div>
  )
}
