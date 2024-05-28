const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="mx-auto inline-flex w-[90%] max-w-[400px] flex-col items-center rounded-[10px] border border-gray-gray bg-gray-gray_lighter py-10 pc:w-[480px] pc:max-w-full">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
