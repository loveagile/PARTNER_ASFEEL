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
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { createEmptySignUpToken } from '@/utils/common'
import { EXTERNAL_URLS } from '@/utils/constants/externalUrls'
import { LOCAL_STORAGE } from '@/utils/constants/localStorage'

const Content = () => {
  const router = useRouter()

  const [anti_social, setAntiSocial] = useState<boolean>(false)
  const [criminal, setCriminal] = useState<boolean>(false)
  const [privacy, setPrivacy] = useState<boolean>(false)
  const [disableStatus, setConfirmStatus] = useState<boolean>(false)

  useEffect(() => {
    const confirm_status: boolean = anti_social && criminal && privacy ? false : true

    setConfirmStatus(confirm_status)
  }, [anti_social, criminal, privacy])

  useEffect(() => {
    const signup_data = localStorage.getItem(LOCAL_STORAGE.signUpData)
    if (!signup_data) {
      createEmptySignUpToken()
    }
  }, [])

  return (
    <div className="relative">
      <div className="absolute left-[10px] top-[10px]">
        <BackButton
          onClick={() => {
            router.push('/')
          }}
        />
      </div>

      <div className="px-[24px] py-[30px]">
        <div className="mx-auto max-w-[800px] text-center">
          <div className="">
            <p className="text-[18px] font-bold">新規登録</p>
            <img src={`/images/icons/handshark.svg`} className="mx-auto my-[30px] h-[80px] w-[80px]" alt="" />
          </div>

          <p className="text-[12px]">
            本システムは
            <br />
            人材を募集する学校・チームと皆様をつなぐ
            <br />
            マッチングサービスです
          </p>

          <div className="border-slate-10 my-[30px] rounded-2xl border border-gray-gray_dark bg-gray-gray_light py-[20px] pl-[20px]">
            <p className="text-[12px] font-bold">以下をご確認のうえ次へお進みください</p>

            <div className="mt-[16px] text-start">
              <p className="flex cursor-pointer gap-[6px] text-[12px]" onClick={() => setAntiSocial(!anti_social)}>
                {anti_social ? (
                  <FaCheckCircle className="h-[15px] w-[15px]" />
                ) : (
                  <FaRegCircle className="h-[15px] w-[15px]" />
                )}
                反社会的勢力と関わりがありません
              </p>
              <p
                className="my-[10.5px] flex cursor-pointer gap-[6px] text-[12px]"
                onClick={() => setCriminal(!criminal)}
              >
                {criminal ? (
                  <FaCheckCircle className="h-[15px] w-[15px]" />
                ) : (
                  <FaRegCircle className="h-[15px] w-[15px]" />
                )}
                犯罪歴(補導歴)はありません
              </p>
              <div className="flex cursor-pointer gap-[6px] text-[12px]" onClick={() => setPrivacy(!privacy)}>
                {privacy ? (
                  <FaCheckCircle className="h-[15px] w-[15px]" />
                ) : (
                  <FaRegCircle className="h-[15px] w-[15px]" />
                )}
                <div className="gap-[6px]">
                  <a href={EXTERNAL_URLS.termsOfUse} target="_blank" className="text-core-blue">
                    <u>利用規約</u>
                  </a>{' '}
                  /{' '}
                  <a href={EXTERNAL_URLS.handlingPersonalInformation} target="_blank" className="text-core-blue">
                    <u>個人情報の取り扱い</u>
                  </a>{' '}
                  に同意します
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Button
              size={ButtonSize.SP}
              color={ButtonColor.SUB}
              type={ButtonType.DEFAULT}
              shape={ButtonShape.ELLIPSE}
              disabled={disableStatus}
              icon={ButtonIcon.OFF}
              arrow={ButtonArrow.RIGHT}
              text="次へ進む"
              onclick={() => {
                router.push('/signup/skills')
              }}
              className="h-[34px] w-[240px]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <div className="h-full bg-gray-white">
      <SignUpLayout>
        <Content />
      </SignUpLayout>
    </div>
  )
}
