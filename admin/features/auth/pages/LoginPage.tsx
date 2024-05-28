'use client'

import Link from 'next/link'

import { InputStatus } from '@/components/atoms'
import Button, {
  ButtonColor,
  ButtonShape,
} from '@/components/atoms/Button/Button'
import { FormField } from '@/components/molecules'
import { useAuthUserStateProvider } from '../providers/useAuthProvider'
import { FormProvider } from 'react-hook-form'
import LoadingView from '@/components/LoadingView'
import React from 'react'
import PATH from '@/constants/path'

function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false)

  const { methods, errorEmail, errorPassword, handleLogin } =
    useAuthUserStateProvider()

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, dirtyFields },
  } = methods

  return (
    <>
      <LoadingView spinning={isLoading} />
      <h1 className="text-h2 text-gray-black pc:text-h1">ログイン</h1>
      <FormProvider {...methods}>
        <form
          className="mt-7 pc:mt-10"
          onSubmit={handleSubmit(async (values) => {
            setIsLoading(true)
            await handleLogin(values)
            setIsLoading(false)
          })}
        >
          <div className="m-auto w-[240px] pc:w-[279px]">
            <label className="mb-2 block text-h4 text-gray-black pc:text-h3">
              メールアドレス
            </label>
            <FormField
              control={control}
              input={{
                name: 'email',
                status: InputStatus.DEFAULT,
              }}
              attention={{ text: '' }}
              error={errors.email ? errors.email.message : errorEmail}
            />
            <label className="mb-2 mt-4 block text-h4 text-gray-black pc:text-h3">
              パスワード
            </label>
            <FormField
              control={control}
              input={{
                name: 'password',
                status: InputStatus.PASSWORD,
              }}
              attention={{ text: '' }}
              error={errors.password ? errors.password.message : errorPassword}
            />
            <Button
              disabled={
                !isDirty ||
                Object.keys(errors).length > 0 ||
                !dirtyFields.email ||
                !dirtyFields.password
              }
              text={'ログインする'}
              type="submit"
              color={ButtonColor.SUB}
              shape={ButtonShape.ELLIPSE}
              onclick={(e) => e.stopPropagation}
              className="mx-auto mt-7 w-[180px] py-3 pc:mt-10 pc:w-[216px] pc:py-[16.5px]"
            />
            <p className="mt-7 text-center pc:mt-10">
              <Link
                href={PATH.auth.forgotPassword}
                className="text-timestamp text-core-blue underline"
              >
                パスワードをお忘れの方はこちら
              </Link>
            </p>
          </div>
        </form>
      </FormProvider>
    </>
  )
}

export default LoginPage
