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
import ConfirmCard from '@/components/organisms/modal/ConfirmCard'
import SimpleCard from '@/components/organisms/modal/SimpleCard'
import { PrivateUser } from '@/models'
import { decrypt } from '@/utils/token'
import VerificationInput from 'react-verification-input'
import { useAppDispatch } from '@/store'
import { setStoreLoading } from '@/store/reducers/global'
import DontSendCodeQuestion from '@/components/atoms/DontSendCodeQuestion'
import useSystemName from '@/hooks/useSystemName'
import { EMAIL_TEMPLATE } from '@/utils/emailTemplate'
import { API_URL } from '@/utils/constants/apiUrls'
import { useAuthUserStateProvider } from '@/hooks/useAuthUserStateProvider'

export default function Page() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { systemName } = useSystemName()
  const { loginWithToken } = useAuthUserStateProvider()

  const [showEmail, setShowEmail] = useState('')
  const [code, setCode] = useState<string>('')
  const [isCodeRight, setIsCodeRight] = useState(true)
  const [button_disable, setButtonDisable] = useState(true)
  const [isModal1Open, setIsModal1Open] = useState(false)
  const [isModal2Open, setIsModal2Open] = useState(false)
  const [isModal3Open, setIsModal3Open] = useState(false)
  const [isModal4Open, setIsModal4Open] = useState(false)
  const [registerUser, setRegisterUser] = useState<PrivateUser | null>(null)

  useEffect(() => {
    const signUpData = localStorage.getItem('signup_data')
    if (!signUpData) {
      router.push('/signup/profile')
      return
    }

    const _registerUser = JSON.parse(decrypt(signUpData))
    setRegisterUser(_registerUser)
    setShowEmail(_registerUser.email)
  }, [])

  const completeCode = (code: string) => {
    setCode(code.toLowerCase())
    setButtonDisable(code.length !== 4)
  }

  const sendVerifyCode = async () => {
    try {
      dispatch(setStoreLoading(true))
      const response = await fetch(API_URL.requestVerification, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerUser!.email,
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

  const checkActionCode = async () => {
    if (!registerUser) return
    const { email } = registerUser

    try {
      dispatch(setStoreLoading(true))

      // 認証コードの認証
      const verifyCodeRes = await fetch(API_URL.verifyCode, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code,
        }),
      })
      if (verifyCodeRes.status !== 201) {
        const { message } = await verifyCodeRes.json()
        console.error(message)
        throw new Error(message || '認証コードの認証に失敗しました。')
      }

      // アカウント作成
      const registerRes = await fetch(API_URL.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInfo: registerUser,
        }),
      })
      if (registerRes.status !== 201) {
        const { message, error } = await registerRes.json()
        console.error(message)
        console.error(error)
        throw new Error(message || '認証コードの認証に失敗しました。')
      }

      // ログイン
      const { token } = await registerRes.json()
      const { result: user, error } = await loginWithToken(token)
      if (!user || error) {
        throw new Error('アカウントの作成に失敗しました。')
      }

      // アカウント作成完了メール送信
      await fetch(API_URL.sendEMail, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: `アカウント登録が完了しました【${systemName}】`,
          content: EMAIL_TEMPLATE.createAccount({
            name: `${registerUser.name.sei} ${registerUser.name.mei} 様`,
            profileLink: `${window.location.origin}/profile`,
            topLink: `${window.location.origin}`,
            systemName,
          }),
          systemName,
        }),
      })

      localStorage.removeItem('signup_data')
      localStorage.removeItem('organization_name')
      localStorage.removeItem('organization_grade')
      setIsModal1Open(true)
    } catch (error: any) {
      await fetch(API_URL.resetRegister, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
        }),
      })
      setIsCodeRight(false)
      alert(error.message)
      return
    } finally {
      dispatch(setStoreLoading(false))
    }
  }

  function click_button2() {
    setIsModal2Open(true)
  }

  const click_button3 = () => {
    setIsModal3Open(true)
  }

  function click_button4() {
    setIsModal4Open(true)
  }

  function click_button5() {
    window.location.href = '/profile'
  }

  return (
    <div className="h-full bg-gray-white">
      <SignUpLayout>
        <div className="relative">
          <div className="absolute left-[10px] top-[10px]">
            <BackButton
              onClick={() => {
                router.push('/signup/profile')
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

              <p className="py-[40px] text-[12px] font-bold">{showEmail}</p>
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

            <p className="cursor-pointer text-[12px] font-bold text-core-blue" onClick={() => sendVerifyCode()}>
              <u>もう一度送信する</u>
            </p>

            <DontSendCodeQuestion />
          </div>
        </div>

        {isModal1Open && (
          <ConfirmCard
            title={'登録完了'}
            imgUrl="perform"
            openModal={click_button2}
            className="border border-gray-400 bg-gray-400 text-white "
          />
        )}

        {isModal2Open && (
          <SimpleCard
            title={'様々な求人を チェックしてみましょう'}
            imgUrl="balls"
            subTitle="あなたが培ったスポーツや 芸術・文化の経験を活かせる 求人をご紹介しています"
            button1Text="次へ"
            button1Click={click_button3}
            isIconButton={true}
            className="border border-gray-400 bg-gray-400 text-white "
          />
        )}

        {isModal3Open && (
          <SimpleCard
            title={'気になる求人に 応募してみましょう'}
            imgUrl="hands"
            subTitle="求人にはスカウトを待たずに ご応募いただくのも大歓迎！ ぜひ積極的に応募してみましょう"
            button1Text="次へ"
            button1Click={click_button4}
            isIconButton={true}
            className="border border-gray-400 bg-gray-400 text-white "
          />
        )}

        {isModal4Open && (
          <SimpleCard
            title={'プロフィールを完成させて スカウトを待ちましょう'}
            imgUrl="broadcast"
            subTitle="あなたのスキルにぴったりの 求人があればスカウトが来ます あなたの希望をしっかり伝えるために まずはプロフィールを完成させましょう"
            button1Text="はじめる"
            button1Click={click_button5}
            isIconButton={false}
            className="border border-gray-400 bg-gray-400 text-white "
          />
        )}
      </SignUpLayout>
    </div>
  )
}
