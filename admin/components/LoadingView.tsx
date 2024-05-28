import { Spin, SpinProps } from 'antd'

const LoadingView = (props: SpinProps) => {
  const classWrapper = `fixed bottom-0 left-0 right-0 top-0 z-[1000] flex h-screen cursor-pointer items-center justify-center bg-black bg-opacity-20 ${
    props.spinning ? 'block' : 'hidden'
  }`

  return (
    <div className={classWrapper}>
      <Spin {...props} />
    </div>
  )
}

export default LoadingView
