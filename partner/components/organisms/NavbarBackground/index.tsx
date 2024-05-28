import { useAppDispatch } from '@/store'
import { setStoreIsNavbarOpen } from '@/store/reducers/global'
import { useEffect, useState } from 'react'

function NavbarBackground() {
  const dispatch = useAppDispatch()
  const [isTop, setIsTop] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      setIsTop(scrollTop === 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      onClick={() => {
        dispatch(setStoreIsNavbarOpen(false))
      }}
      className={`${isTop && 'mt-16'} fixed z-20 h-screen w-screen bg-black opacity-60`}
    ></div>
  )
}

export default NavbarBackground
