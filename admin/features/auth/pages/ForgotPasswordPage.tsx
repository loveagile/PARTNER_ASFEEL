'use client'

import ClipLoader from 'react-spinners/ClipLoader'

import { InputStatus } from '@/components/atoms'
import Button, {
  ButtonColor,
  ButtonShape,
} from '@/components/atoms/Button/Button'
import { FormField } from '@/components/molecules'
import { FormProvider } from 'react-hook-form'
import { useForgotPasswordProvider } from '../providers/useForgotPasswordProvider'

function ForgotPasswordPage() {
  const { methods, isLoading, errorEmail, onSubmit } =
    useForgotPasswordProvider()

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = methods

  return (
    <>
      <h1 className="text-h2 text-gray-black pc:text-h1">パスワード再設定</h1>
      <p className="mt-7 text-center text-timestamp text-gray-black pc:mt-10 pc:text-body_pc">
        パスワード再設定のご案内をお送りいたします
        <br />
        ご登録のメールアドレスを入力してください
      </p>
      <FormProvider {...methods}>
        <form className="mt-7 pc:mt-10" onSubmit={handleSubmit(onSubmit)}>
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
            <Button
              disabled={!isDirty || Object.keys(errors).length > 0 || isLoading}
              text={
                isLoading ? (
                  <ClipLoader size={'1.5em'} color="inherit" />
                ) : (
                  '送信する'
                )
              }
              type="submit"
              color={ButtonColor.SUB}
              shape={ButtonShape.ELLIPSE}
              onclick={(e) => e.stopPropagation}
              className="mx-auto mt-7 w-[160px] py-3 pc:mt-10 pc:w-[184px] pc:py-[16.5px]"
            />
          </div>
        </form>
      </FormProvider>
    </>
  )
}

export default ForgotPasswordPage
