interface CounterProps {
  className?: string
  label: string
  count: number
}

const Counter: React.FC<CounterProps> = ({ className = '', label, count }) => {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <span className="text-timestamp mr-3">{label}</span>
      <span className="text-h4">{count}</span>
    </div>
  )
}

export default Counter