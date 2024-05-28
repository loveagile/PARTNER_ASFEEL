import { useRouter } from 'next/router'
import List, { ListItem } from '@/components/organisms/List'
import { useEffect, useState } from 'react'
import { City } from '@/models'
var groupArray = require('group-array')
import { createEmptySignUpToken } from '@/utils/common'
import { decrypt, encrypt } from '@/utils/token'
import { useAppSelector } from '@/store'
import { prefectureList } from '@/utils/constants'

export default function Page() {
  const router = useRouter()

  const [listItems, setListItems] = useState<ListItem[]>([])
  const [register_user, setRegisterUser] = useState<any>()
  const { cityList } = useAppSelector((state) => state.global)

  type InputObject = {
    [key: string]: any
  }

  type TreeNode = {
    title: string
    key: string
    value?: string | number | null
    children?: TreeNode[]
  }

  useEffect(() => {
    setRegisterUser(JSON.parse(decrypt(localStorage.getItem('signup_data') || createEmptySignUpToken())))

    const groupedCityList = groupArray(cityList, 'index', 'areaName')
    const updatedList = getNodes(groupedCityList)
    const sortedList = updatedList.sort((a, b) => parseInt(a.key) - parseInt(b.key))

    setListItems(sortedList)
  }, [cityList])

  const getNodes = (object: InputObject): TreeNode[] => {
    return Object.entries(object).map(([key, value]) => {
      if (value && typeof value === 'object') {
        if (value.length > 0) {
          return { title: key, key, children: customizeValue(value) }
        } else {
          return { title: prefectureList[parseInt(key) - 1], key, children: getNodes(value) }
        }
      } else {
        return { title: prefectureList[parseInt(key) - 1], key, value }
      }
    })
  }

  const customizeValue = (cities: City[]): TreeNode[] => {
    return cities.map((city) => ({
      title: city.city,
      key: city.id || '',
      order: city.order,
    }))
  }

  const setArea = (value: string) => {
    const { areasOfActivity, areaNotes } = register_user
    areasOfActivity.includes(value)
      ? (areasOfActivity.splice(areasOfActivity.indexOf(value), 1),
        areaNotes?.splice(areasOfActivity.indexOf(value), 1))
      : (areasOfActivity.push(value), areaNotes?.push({ area: value, note: '' }))

    localStorage.setItem('signup_data', encrypt(JSON.stringify(register_user)))
  }

  return (
    <div className="h-full bg-gray-white">
      <div className="fixed z-40 flex h-[60px] w-full items-center justify-center bg-core-blue_dark text-white">
        <div className="relative flex h-[60px] w-full max-w-[800px] items-center justify-center">
          <p className="text-[16px] font-bold">指導できる地域</p>
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
        items={listItems}
        onChange={(value) => {
          setArea(value)
        }}
        selectedValue={register_user?.areasOfActivity}
      />
    </div>
  )
}
