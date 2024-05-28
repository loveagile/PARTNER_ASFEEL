interface Props {
  className?: string
  label: string
}

export const TimeStamp = (props: Props) => {
  const { className, label } = props
  return (
    <div className={`${className} text-timestamp text-gray-gray_dark`}>
      <span>{label}</span>
    </div>
  )
}
