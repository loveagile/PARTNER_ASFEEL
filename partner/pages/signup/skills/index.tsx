import Button, {
  ButtonArrow,
  ButtonColor,
  ButtonIcon,
  ButtonShape,
  ButtonSize,
  ButtonType,
} from '@/components/atoms/Button/Button'
import { HiPlus } from 'react-icons/hi'
import { useRouter } from 'next/router'
import SignUpLayout from '@/components/layouts/SignUpLayout'
import BackButton from '@/components/atoms/Button/BackButton'
import { useEffect, useState } from 'react'
import { createEmptySignUpToken, getAreasData, getClubsData } from '@/utils/common'
import { decrypt } from '@/utils/token'
import { LOCAL_STORAGE } from '@/utils/constants/localStorage'
var groupArray = require('group-array')

export default function Page() {
  const router = useRouter()

  const [clubStringList, setClubStringList] = useState<string[]>([])
  const [areaStringList, setAreaStringList] = useState<string[]>([])
  const [registerUser, setRegisterUser] = useState<any>()
  const [btn_disable, setBtnDisable] = useState<boolean>(true)

  useEffect(() => {
    setRegisterUser(JSON.parse(decrypt(localStorage.getItem(LOCAL_STORAGE.signUpData) || createEmptySignUpToken())))
  }, [])

  useEffect(() => {
    if (!registerUser) return

    const init = async () => {
      const { clubs, areasOfActivity } = registerUser
      if (clubs && clubs.length > 0) {
        const docs = await getClubsData(clubs)
        setClubStringList(
          Object.entries(groupArray(docs, 'largeCategoryName')).map(([key, value]: [string, unknown]) => {
            const content = (value as any[]).map((data) => data.name).join(', ')
            return `${key} : ${content}`
          }),
        )
      }

      if (areasOfActivity && areasOfActivity.length > 0) {
        const result = await getAreasData(areasOfActivity)
        setAreaStringList(
          Object.entries(groupArray(result, 'prefectureName')).map(([key, value]: [string, unknown]) => {
            const content = (value as any[]).map((data) => data.city).join(', ')
            return `${key} : ${content}`
          }),
        )
      }

      setBtnDisable(!(clubs && clubs.length > 0 && areasOfActivity && areasOfActivity.length > 0))
    }

    init()
  }, [registerUser])

  return (
    <div className="h-full bg-gray-white">
      <SignUpLayout>
        <div className="relative">
          <div className="absolute left-[10px] top-[10px]">
            <BackButton
              onClick={() => {
                router.push('/signup')
              }}
            />
          </div>

          <div className="px-[24px] py-[30px]">
            <div className="mx-auto max-w-[800px] text-center">
              <div className="">
                <p className="text-[18px] font-bold">スキル・条件</p>
                <img src={`/images/icons/balls.svg`} className="mx-auto my-[30px] h-[80px] w-[80px]" alt="" />
              </div>

              <div className="grid gap-[10px] text-start">
                <p className="text-[14px] font-bold text-core-blue">指導できる種目</p>
                <p className="text-[12px] font-bold">運動系・文化系で可能な種目をすべて登録してください</p>

                {clubStringList && clubStringList.length > 0 && (
                  <div className="border-slate-10 rounded-[10px] border border-gray-gray_dark bg-gray-gray_light py-[10px] pl-[20px]">
                    <div className="gap-[10px] text-[12px]">
                      {clubStringList.map((data, index) => (
                        <p className="" key={index}>
                          {data}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  size={ButtonSize.SP}
                  color={ButtonColor.SUB}
                  type={ButtonType.SECONDARY}
                  shape={ButtonShape.RECTANGLE}
                  disabled={false}
                  icon={ButtonIcon.FRONT}
                  arrow={ButtonArrow.OFF}
                  text="種目を選択"
                  onclick={() => {
                    router.push('/signup/clubs')
                  }}
                  className="h-[34px] w-full"
                  iconComponent={<HiPlus className="mr-[6px] h-[16px] w-[16px]" />}
                />
              </div>

              <div className="grid gap-[10px] py-[30px] text-start">
                <p className="text-[14px] font-bold text-core-blue">指導できる地域</p>
                <p className="text-[12px] font-bold">都道府県をまたいで複数登録できます</p>

                {areaStringList && areaStringList.length > 0 && (
                  <div className="border-slate-10 rounded-[10px] border border-gray-gray_dark bg-gray-gray_light py-[10px] pl-[20px]">
                    <div className="gap-[10px] text-[12px]">
                      {areaStringList.map((data, index) => (
                        <p className="" key={index}>
                          {data}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  size={ButtonSize.SP}
                  color={ButtonColor.SUB}
                  type={ButtonType.SECONDARY}
                  shape={ButtonShape.RECTANGLE}
                  disabled={false}
                  icon={ButtonIcon.FRONT}
                  arrow={ButtonArrow.OFF}
                  text="地域を選択 "
                  onclick={() => {
                    router.push('/signup/areas')
                  }}
                  className="h-[34px] w-full"
                  iconComponent={<HiPlus className="mr-[6px] h-[16px] w-[16px]" />}
                />
              </div>

              <div className="flex items-center justify-center">
                <Button
                  size={ButtonSize.SP}
                  color={ButtonColor.SUB}
                  type={ButtonType.DEFAULT}
                  shape={ButtonShape.ELLIPSE}
                  disabled={btn_disable}
                  icon={ButtonIcon.OFF}
                  arrow={ButtonArrow.RIGHT}
                  text="次へ進む"
                  onclick={() => {
                    router.push('/signup/profile')
                  }}
                  className="h-[34px] w-[240px]"
                />
              </div>
            </div>
          </div>
        </div>
      </SignUpLayout>
    </div>
  )
}
