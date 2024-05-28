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
const StepCard = ({ title, imgUrl, subTitle, button1Text, button2Text, button1Click, button2Click, className, isModalOpen }: stepCardType) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-black_clear">
      <div className={`pc:w-[45%] bg-white rounded pc:h-min-[274px] py-[30px] sp:w-[280px] sp:h-min-[274px]`}>
        <p className="font-bold text-center pc:text-[20px] sp:text-[16px]">{title}</p>
        <Image alt={title} src={`/images/icons/${imgUrl}.svg`} width={66} height={60} className="py-[20px] mx-auto" />
        <p className="text-center mx-auto pc:text-[16px] sp:text-[12px]">
          {subTitle.split(' ').length > 1 ? (
            <>
              {subTitle.split(' ')[0]}
              <br />
              {subTitle.split(' ')[1]}
              <br />
              {subTitle.split(' ')[2]}
              {subTitle.split(' ')[3] && `<br/>${subTitle.split(' ')[3]}`}
            </>
          ) : (
            subTitle
          )}
        </p>
        <div className="flex translate-y-5 pb-4">
          <div className="gap-[20px] mx-auto flex">
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
                className="pc:w-[190px] sp:w-[100px] pc:h-[56px] sp:h-[34px] py-1.5 pc:px-6 sp:px-3 border-2"
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
                className="pc:w-[190px] sp:w-[100px] pc:h-[56px] sp:h-[34px] py-1.5 pc:px-6 sp:px-3 border-2"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default StepCard
