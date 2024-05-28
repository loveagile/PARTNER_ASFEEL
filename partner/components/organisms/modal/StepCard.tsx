import Button, { ButtonColor, ButtonIcon, ButtonShape, ButtonSize, ButtonType } from '@/components/atoms/Button/Button'
import Image from 'next/image'

export interface stepCardType {
  title: string
  imgUrl: string
  subTitle: string
  button1Text: string
  button2Text?: string
  button1Click: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  button2Click?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  className: string
  isModalOpen?: boolean
}
const StepCard = ({
  title,
  imgUrl,
  subTitle,
  button1Text,
  button2Text,
  button1Click,
  button2Click,
  className,
  isModalOpen,
}: stepCardType) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-black_clear">
      <div
        className={`pc:h-min-[274px] sp:h-min-[274px] rounded bg-white py-[30px] sp:w-[280px] pc:w-[45%] pc:min-w-[400px]`}
      >
        <p className="text-center font-bold sp:text-[16px] pc:text-[20px]">{title}</p>
        <Image alt={title} src={`/images/icons/${imgUrl}.svg`} width={66} height={60} className="mx-auto py-[20px]" />
        <p className="mx-auto whitespace-pre-line text-center sp:text-[12px] pc:text-[16px]">{subTitle}</p>
        <div className="flex translate-y-5 pb-4">
          <div className="mx-auto flex gap-[20px]">
            {button1Text && (
              <Button
                size={ButtonSize.PC}
                color={ButtonColor.SUB}
                type={ButtonType.SECONDARY}
                shape={ButtonShape.ELLIPSE}
                disabled={false}
                icon={ButtonIcon.OFF}
                text={button1Text}
                onclick={button1Click}
                className="border-2 py-1.5 sp:h-[34px] sp:w-[100px] sp:px-3 pc:h-[56px] pc:w-[190px] pc:px-6"
              />
            )}

            {button2Text && (
              <Button
                size={ButtonSize.PC}
                color={ButtonColor.SUB}
                type={ButtonType.DEFAULT}
                shape={ButtonShape.ELLIPSE}
                disabled={false}
                icon={ButtonIcon.OFF}
                text={button2Text}
                onclick={button2Click ? button2Click : () => {}}
                className="border-2 py-1.5 sp:h-[34px] sp:w-[100px] sp:px-3 pc:h-[56px] pc:w-[190px] pc:px-6"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default StepCard
