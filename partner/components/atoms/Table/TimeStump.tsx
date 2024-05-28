interface TimeStumpProps {
  date: string
  time: string
}

const TimeStump: React.FC<TimeStumpProps> = ({ date, time }) => {
  return (
    <div className="text-timestamp text-gray-gray_dark">
      <span>{date}</span>
      <br />
      <span>{time}</span>
    </div>
  )
}

export default TimeStump
