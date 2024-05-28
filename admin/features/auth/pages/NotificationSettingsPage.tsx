'use client'

import ClipLoader from 'react-spinners/ClipLoader'
import { InputStatus } from '@/components/atoms'
import Button, {
  ButtonColor,
  ButtonShape,
} from '@/components/atoms/Button/Button'
import { FormField } from '@/components/molecules'
import { useNotificationSettingsProvider } from '../providers/useNotificationSettingsProvider'
import { FormProvider } from 'react-hook-form'

function NotificationSettingsPage() {
  const { methods, isLoading, errorEmail, onSubmit } =
    useNotificationSettingsProvider()

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, dirtyFields },
  } = methods

  return (
    <div className="w-full bg-gray-white p-10">
      <div className="mx-auto flex w-[90%] max-w-[300px] flex-col gap-7 text-left pc:w-[480px] pc:max-w-full pc:gap-10 pc:px-[60px] pc:py-10">
        <div className="flex flex-col gap-5">
          <h1 className="text-center text-h2 pc:text-h1">通知メール設定</h1>
          <p className="text-timestamp">
            設定したメールアドレスに新規募集やメッセージの通知が届きます
          </p>
        </div>
        <FormProvider {...methods}>
          <form className="" onSubmit={handleSubmit(onSubmit)}>
            <div className="m-auto flex flex-col gap-7 pc:gap-10">
              <FormField
                control={control}
                input={{
                  name: 'email1',
                  status: InputStatus.DEFAULT,
                }}
                attention={{ text: '' }}
                error={errors.email1 ? errors.email1.message : errorEmail}
              />
              <FormField
                control={control}
                input={{
                  name: 'email2',
                  status: InputStatus.DEFAULT,
                }}
                attention={{ text: '' }}
                error={errors.email2 ? errors.email2.message : errorEmail}
              />
              <FormField
                control={control}
                input={{
                  name: 'email3',
                  status: InputStatus.DEFAULT,
                }}
                attention={{ text: '' }}
                error={errors.email3 ? errors.email3.message : errorEmail}
              />
              <FormField
                control={control}
                input={{
                  name: 'email4',
                  status: InputStatus.DEFAULT,
                }}
                attention={{ text: '' }}
                error={errors.email4 ? errors.email4.message : errorEmail}
              />
              <FormField
                control={control}
                input={{
                  name: 'email5',
                  status: InputStatus.DEFAULT,
                }}
                attention={{ text: '' }}
                error={errors.email5 ? errors.email5.message : errorEmail}
              />
              <Button
                disabled={Object.keys(errors).length > 0 || isLoading}
                text={
                  isLoading ? (
                    <ClipLoader size={'1.5em'} color="inherit" />
                  ) : (
                    '更新する'
                  )
                }
                color={ButtonColor.SUB}
                shape={ButtonShape.ELLIPSE}
                onclick={(e) => e.stopPropagation}
                className="mx-auto w-[140px] py-3 pc:w-[156px] pc:py-[16.5px]"
              />
              <button
                type="submit"
                className="text-body_sp text-core-blue underline"
              >
                ログアウト
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}

export default NotificationSettingsPage
