import Image from 'next/image'
import { useEffect } from 'react'

export interface stepCardType {
  title: string
  imgUrl: string
  openModal: () => void
  className: string
  isModalOpen?: boolean
}
const ConfirmCard = ({ title, imgUrl, openModal, className, isModalOpen }: stepCardType) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // document.querySelector<HTMLElement>("#modal-card")
      const modal = document.querySelector<HTMLElement>('.modal-card')
      if (modal && event.target === modal) {
        modal.style.setProperty('display', 'none', 'important')
        openModal()
      }
    }

    window.addEventListener('click', handleClickOutside)

    return () => window.removeEventListener('click', handleClickOutside)
  }, []) // Run this effect only once, when the component mounts

  return (
    <div
      onClick={() => {
        openModal()
      }}
      id="modal-card"
      className="modal-card fixed inset-0 z-50 flex items-center justify-center bg-gray-black_clear"
    >
      <div className={` pc:h-min-[274px] sp:h-min-[274px] rounded bg-white py-[30px] sp:w-[280px]`}>
        <p className="mb-[10px] text-center text-[16px] font-bold">{title}</p>
        <Image alt={title} src={`/images/icons/${imgUrl}.svg`} width={66} height={66} className="mx-auto" />
      </div>
    </div>
  )
}
export default ConfirmCard
