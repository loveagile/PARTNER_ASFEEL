import React from 'react'
import { PersonIcon } from '../Button'
import { RequiredLabel, RequiredLabelType } from './RequiredLabel'
import { twMerge } from 'tailwind-merge'

export enum IconTypeLabel {
  OFF,
  ON,
}

export interface LabelProps {
  text: string
  requiredLabelText?: string
  status?: RequiredLabelType
  icon?: IconTypeLabel
  className?: string
  iconComponent?: React.ReactNode
}

export const Label = ({
  text,
  requiredLabelText,
  status = RequiredLabelType.REQUIRED,
  icon = IconTypeLabel.OFF,
  className,
  iconComponent,
}: LabelProps) => {
  const iconStyle = 'ml-[5.5px] w-[9px] h-[10px]'
  return (
    <div className={twMerge('flex flex-row items-center justify-between gap-5', className)}>
      <div className="flex items-center text-gray-black sp:text-[14px] sp:font-bold pc:text-h4">
        {text}
        {icon == IconTypeLabel.ON && <PersonIcon fill=" fill-gray-black " iconStyle={iconStyle} />}
        {iconComponent}
      </div>
      {requiredLabelText && <RequiredLabel label={requiredLabelText} status={status} />}
    </div>
  )
}