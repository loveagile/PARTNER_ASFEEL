export interface ButtonProp {
  buttonText: string
  clickHandler?: () => void
  className: string
}
const Custombutton = ({ buttonText, clickHandler, className }: ButtonProp) => {
  return (
    <button className={`w-[40%] rounded-xl py-2 ${className}`} onClick={clickHandler}>
      {buttonText}
    </button>
  )
}
export default Custombutton
