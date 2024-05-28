// pages/_error.tsx
import BackButton from '@/components/atoms/Button/BackButton'
import Button, {
  ButtonArrow,
  ButtonColor,
  ButtonIcon,
  ButtonShape,
  ButtonSize,
  ButtonType,
} from '@/components/atoms/Button/Button'
import AfterLoginLayout from '@/components/layouts/AfterLoginLayout'
import SignUpLayout from '@/components/layouts/SignUpLayout'
import { NextPageContext } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type ErrorProps = {
  statusCode: number
}

const ErrorPage = ({ statusCode }: ErrorProps) => {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState<Boolean>(false)

  let headerContent = 'Error'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  return (
    <div className="h-full bg-gray-white">
      {isLoggedIn ? (
        <AfterLoginLayout>
          <div className="absolute left-[10px] top-[10px]">
            <BackButton
              onClick={() => {
                router.push('/login')
              }}
            />
          </div>
          <div className="absolute flex h-full w-full flex-col items-center justify-center text-center">
            <p className="text-[32px] font-bold text-gray-gray_dark">{statusCode}</p>
            <p className="py-[20px] font-bold text-gray-black sp:text-[18px] pc:text-[20px]">
              {statusCode == 404 ? 'お探しのページが見つかりません' : statusCode == 500 && 'システム障害が発生しました'}
            </p>
            <div className="flex justify-center pt-[20px]">
              {statusCode == 404 && (
                <Button
                  size={ButtonSize.SP}
                  color={ButtonColor.SUB}
                  type={ButtonType.DEFAULT}
                  shape={ButtonShape.ELLIPSE}
                  icon={ButtonIcon.OFF}
                  arrow={ButtonArrow.LEFT}
                  onclick={() => {
                    router.push('/')
                  }}
                  text="トップページにもどる"
                  className="h-[34px] w-[240px]"
                />
              )}
            </div>
          </div>
        </AfterLoginLayout>
      ) : (
        <SignUpLayout>
          <div className="absolute left-[10px] top-[10px]">
            <BackButton
              onClick={() => {
                router.push('/login')
              }}
            />
          </div>
          <div className="absolute flex h-full w-full flex-col items-center justify-center text-center">
            <p className="text-[32px] font-bold text-gray-gray_dark">{statusCode}</p>
            <p className="py-[20px] font-bold text-gray-black sp:text-[18px] pc:text-[20px]">
              {statusCode == 404 ? 'お探しのページが見つかりません' : statusCode == 500 && 'システム障害が発生しました'}
            </p>
            <div className="flex justify-center pt-[20px]">
              {statusCode == 404 && (
                <Button
                  size={ButtonSize.SP}
                  color={ButtonColor.SUB}
                  type={ButtonType.DEFAULT}
                  shape={ButtonShape.ELLIPSE}
                  icon={ButtonIcon.OFF}
                  arrow={ButtonArrow.LEFT}
                  onclick={() => {
                    router.push('/')
                  }}
                  text="トップページにもどる"
                  className="h-[34px] w-[240px]"
                />
              )}
            </div>
          </div>
        </SignUpLayout>
      )}
    </div>
  )
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default ErrorPage
