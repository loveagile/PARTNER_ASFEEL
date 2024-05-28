import { useRouter } from 'next/router'
import List from '@/components/organisms/List'
import { useEffect, useState } from 'react'
import { decrypt, encrypt } from '@/utils/token'
import { createEmptySignUpToken } from '@/utils/common'
import { useClubs } from '@/hooks/useClubs'
import { LOCAL_STORAGE } from '@/utils/constants/localStorage'

export default function Page() {
  const router = useRouter()
  const { clubs } = useClubs()
  const [registerUser, setRegisterUser] = useState<any>()

  useEffect(() => {
    setRegisterUser(JSON.parse(decrypt(localStorage.getItem(LOCAL_STORAGE.signUpData) || createEmptySignUpToken())))
  }, [])

  const setClub = (value: string) => {
    const { clubs } = registerUser
    if (clubs.includes(value)) {
      clubs.splice(clubs.indexOf(value), 1)
    } else {
      clubs.push(value)
    }

    localStorage.setItem(LOCAL_STORAGE.signUpData, encrypt(JSON.stringify(registerUser)))
  }

  return (
    <div className="h-full bg-gray-white">
      <div className="fixed z-40 flex h-[60px] w-full items-center justify-center bg-core-blue_dark text-white">
        <div className="relative flex h-[60px] w-full max-w-[800px] items-center justify-center">
          <p className="text-[16px] font-bold">指導できる種目</p>
          <p
            className="absolute right-[20px] top-[20px] cursor-pointer text-[14px] font-bold"
            onClick={() => {
              router.push('/signup/skills')
            }}
          >
            完了
          </p>
        </div>
      </div>

      <List
        items={clubs}
        onChange={(value) => {
          setClub(value)
        }}
        selectedValue={registerUser?.clubs}
      />
    </div>
  )
}
