import AppLoader from '@/components/atoms/AppLoader'

function Loading() {
  return (
    <div className="fixed z-[10000] flex h-screen w-screen items-center justify-center bg-black opacity-60">
      <AppLoader />
    </div>
  )
}

export default Loading
