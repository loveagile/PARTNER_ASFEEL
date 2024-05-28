import { useRouter } from 'next/router'
import List from '@/components/organisms/List'
import { setStoreUserInfo } from '@/store/reducers/profile'
import { useAppSelector, useAppDispatch } from '@/store'
import { useClubs } from '@/hooks/useClubs'

export default function Page() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { userInfo } = useAppSelector((state) => state.profile)
  const { clubs } = useClubs()

  const onChangeClubs = (value: string) => {
    const { clubs } = userInfo
    const newClubs = clubs.includes(value) ? clubs.filter((club) => club !== value) : [...clubs, value]
    dispatch(
      setStoreUserInfo({
        ...userInfo,
        clubs: newClubs,
      }),
    )
  }

  return (
    <div className="h-full bg-gray-white">
      <div className="fixed z-40 flex h-[60px] w-full items-center justify-center bg-core-blue_dark text-white">
        <p className="text-[16px] font-bold">指導できる種目</p>
        <p
          className="absolute right-[20px] top-[20px] cursor-pointer text-[14px] font-bold"
          onClick={() => {
            router.push('/profile')
          }}
        >
          完了
        </p>
      </div>

      <List items={clubs} onChange={onChangeClubs} selectedValue={userInfo.clubs} />
    </div>
  )
}
