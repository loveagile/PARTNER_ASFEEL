interface DateLabelProps {
  className?: string
  label: string
}

const DateLabel: React.FC<DateLabelProps> = ({ className = '', label }) => {
  return (
    <div
      className={`inline-block rounded-[20px] border border-gray-gray bg-gray-white px-[9px] py-[6px] text-center text-mini text-gray-black ${className}`}
    >
      <span>{label}</span>
    </div>
  )
}

export default DateLabel
