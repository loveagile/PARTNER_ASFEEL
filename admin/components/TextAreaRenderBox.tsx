type TextAreaRenderBoxProps = {
  text: string
}

const TextAreaRenderBox = ({ text }: TextAreaRenderBoxProps) => {
  return (
    <span>
      {text.split('\n').map((str, index) => (
        <span key={index}>
          {str}
          <br />
        </span>
      ))}
    </span>
  )
}

export default TextAreaRenderBox
