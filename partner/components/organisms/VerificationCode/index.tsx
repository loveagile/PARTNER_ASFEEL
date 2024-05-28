import { useState, useRef } from 'react'

interface VerificationCodeInputProps {
  onComplete: (code: string) => void
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({ onComplete }) => {
  const [code, setCode] = useState<string[]>(['', '', '', ''])
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  const handleCodeChange = (index: number, value: string) => {
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
  }

  const handleCodeKeyPress = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode !== 8) {
      // move focus to next input field
      if (inputRefs[index + 1]) {
        inputRefs[index + 1].current?.focus()
      }
    } else {
      // move focus to previous input field
      if (inputRefs[index - 1]) {
        inputRefs[index - 1].current?.focus()
      }
    }

    // call onComplete if all fields are filled
    const filledCode = code.join('')
    // if (filledCode.length === 4) {
    onComplete(filledCode)
    // }
  }

  return (
    <div className="flex gap-[20px]">
      {code.map((value, index) => (
        <input
          autoCapitalize="none"
          key={index}
          type="text"
          pattern="[0-9]*"
          maxLength={1}
          className="h-[60px] w-[44px] border-b-2 border-b-core-blue bg-gray-gray_lighter text-center text-[30px]"
          value={value}
          onChange={(e) => handleCodeChange(index, e.target.value)}
          onKeyUp={(e) => handleCodeKeyPress(index, e)}
          ref={inputRefs[index]}
        />
      ))}
    </div>
  )
}

export default VerificationCodeInput
