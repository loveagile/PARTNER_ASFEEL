import Button, {
  ButtonArrow,
  ButtonColor,
  ButtonIcon,
  ButtonShape,
  ButtonSize,
  ButtonType,
} from '@/components/atoms/Button/Button'
import Image from 'next/image'

export interface simpleCardType {
  title: string
  imgUrl: string
  subTitle: string
  button1Text: string
  button2Text?: string
  isIconButton?: boolean
  button1Click: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  button2Click?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  className: string
  isModalOpen?: boolean
}
const SimpleCard = ({
  title,
  imgUrl,
  subTitle,
  button1Text,
  button2Text,
  isIconButton,
  button1Click,
  button2Click,
  className,
  isModalOpen,
}: simpleCardType) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-black_clear">
      <div className={`pc:h-min-[274px] h-min-[325px] w-[280px] rounded bg-white py-[30px]`}>
        <p className="text-center text-[14px] font-bold">
          {title.split(' ').length > 1 ? (
            <>
              {title.split(' ')[0]}
              <br />
              {title.split(' ')[1]}
            </>
          ) : (
            title
          )}
        </p>
        <Image alt={title} src={`/images/icons/${imgUrl}.svg`} width={88} height={80} className="mx-auto py-[20px]" />
        <p className="mx-auto text-center text-[12px]">
          {subTitle.split(' ').length > 3 ? (
            <>
              {subTitle.split(' ')[0]}
              <br />
              {subTitle.split(' ')[1]}
              <br />
              {subTitle.split(' ')[2]}
              <br />
              {subTitle.split(' ')[3]}
            </>
          ) : (
            <>
              {subTitle.split(' ')[0]}
              <br />
              {subTitle.split(' ')[1]}
              <br />
              {subTitle.split(' ')[2]}
            </>
          )}
        </p>
        <div className="flex translate-y-5 pb-4">
          <div className="mx-auto flex gap-[20px]">
            {button1Text && (
              <Button
                size={ButtonSize.SP}
                color={ButtonColor.SUB}
                type={ButtonType.DEFAULT}
                shape={ButtonShape.ELLIPSE}
                disabled={false}
                icon={ButtonIcon.OFF}
                arrow={isIconButton ? ButtonArrow.RIGHT : ButtonArrow.OFF}
                text={button1Text}
                onclick={button1Click}
                textClassName="text-[14px] leading-[16px]"
                className="h-[34px] w-[200px] border-2 py-1.5 sp:px-3 pc:px-6"
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
                textClassName="text-[14px]"
                className="border-2 py-1.5 sp:h-[34px] sp:w-[100px] sp:px-3 pc:h-[56px] pc:w-[190px] pc:px-6"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default SimpleCard
