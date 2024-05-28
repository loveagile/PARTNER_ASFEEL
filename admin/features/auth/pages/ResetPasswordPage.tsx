'use client'

import { FormProvider } from 'react-hook-form'
import ClipLoader from 'react-spinners/ClipLoader'

import { InputStatus } from '@/components/atoms'
import Button, {
  ButtonColor,
  ButtonShape,
} from '@/components/atoms/Button/Button'
import { FormField } from '@/components/molecules'
import { useResetPasswordProvider } from '../providers/useResetPasswordProvider'

function ResetPasswordPage() {
  const { methods, isLoading, errorPassword, confirmErrorPassword, onSubmit } =
    useResetPasswordProvider()

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, dirtyFields },
  } = methods

  return (
    <>
      <h1 className="text-h2 text-gray-black pc:text-h1">パスワード再設定</h1>
      <FormProvider {...methods}>
        <form className="mt-7 pc:mt-10" onSubmit={handleSubmit(onSubmit)}>
          <div className="m-auto w-[240px] pc:w-[279px]">
            <label className="mb-2 block text-h4 text-gray-black pc:text-h3">
              新しいパスワード
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
            <label className="mb-2 mt-[14px] block text-h4 text-gray-black pc:text-h3">
              パスワードの確認
            </label>
            <FormField
              control={control}
              input={{
                name: 'confirmPassword',
                status: InputStatus.PASSWORD,
              }}
              attention={{ text: '' }}
              error={
                errors.confirmPassword
                  ? errors.confirmPassword.message
                  : confirmErrorPassword
              }
            />
            <Button
              disabled={
                !isDirty ||
                Object.keys(errors).length > 0 ||
                !dirtyFields.password ||
                !dirtyFields.confirmPassword ||
                isLoading
              }
              text={
                isLoading ? (
                  <ClipLoader size={'1.5em'} color="inherit" />
                ) : (
                  '設定する'
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

export default ResetPasswordPage
