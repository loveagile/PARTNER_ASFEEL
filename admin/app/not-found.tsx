import MainLayout from '@/components/layouts/MainLayout'

const NotFound = () => {
  return (
    <MainLayout>
      <div className="flex h-full flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800">404</h1>
        <p className="text-gray-800">Page not found</p>
      </div>
    </MainLayout>
  )
}

export default NotFound
