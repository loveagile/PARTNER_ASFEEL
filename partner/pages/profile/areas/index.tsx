import { useRouter } from 'next/router'
import List, { ListItem } from '@/components/organisms/List'
import { useEffect, useState } from 'react'
import { City } from '@/models'
import { setStoreUserInfo } from '@/store/reducers/profile'
var groupArray = require('group-array')
import { useAppSelector, useAppDispatch } from '@/store'
import { prefectureList } from '@/utils/constants'

type InputObject = {
  [key: string]: any
}

type TreeNode = {
  title: string
  key: string
  value?: string | number | null
  children?: TreeNode[]
}

export default function Page() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { userInfo } = useAppSelector((state) => state.profile)
  const { cityList } = useAppSelector((state) => state.global)
  const [listItems, setListItems] = useState<ListItem[]>([])

  useEffect(() => {
    const groupedCityList = groupArray(cityList, 'index', 'areaName')
    const updatedList = getNodes(groupedCityList)
    const sortedList = updatedList.sort((a, b) => parseInt(a.key) - parseInt(b.key))

    setListItems(sortedList)
  }, [cityList])

  const getNodes = (object: InputObject): TreeNode[] => {
    const customizeValue = (cities: City[]): TreeNode[] => {
      return cities.map((city) => ({
        title: city.city,
        key: city.id || '',
        order: city.order,
      }))
    }
    return Object.entries(object).map(([key, value]) => {
      if (value && typeof value === 'object') {
        return value?.length > 0
          ? { title: key, key, children: customizeValue(value) }
          : { title: prefectureList[parseInt(key) - 1], key, children: getNodes(value) }
      } else {
        return { title: prefectureList[parseInt(key) - 1], key, value }
      }
    })
  }

  const onChangeAreas = (value: string) => {
    const { areasOfActivity, areaNotes } = userInfo

    if (areasOfActivity.includes(value)) {
      const newAreasOfActivity = areasOfActivity.filter((area) => area !== value)
      const newAreaNotes = areaNotes?.filter((areaNote) => areaNote.area !== value)
      dispatch(
        setStoreUserInfo({
          ...userInfo,
          areasOfActivity: newAreasOfActivity,
          areaNotes: newAreaNotes,
        }),
      )
    } else {
      const newAreasOfActivity = [...areasOfActivity, value]
      const newAreaNotes = areaNotes ? [...areaNotes, { area: value, note: '' }] : [{ area: value, note: '' }]
      dispatch(
        setStoreUserInfo({
          ...userInfo,
          areasOfActivity: newAreasOfActivity,
          areaNotes: newAreaNotes,
        }),
      )
    }
  }

  return (
    <div className="h-full bg-gray-white">
      <div className="fixed z-40 flex h-[60px] w-full items-center justify-center bg-core-blue_dark text-white">
        <p className="text-[16px] font-bold">指導できる地域</p>
        <p
          className="absolute right-[20px] top-[20px] cursor-pointer text-[14px] font-bold"
          onClick={() => {
            router.push('/profile')
          }}
        >
          完了
        </p>
      </div>

      <List items={listItems} onChange={onChangeAreas} selectedValue={userInfo.areasOfActivity || []} />
    </div>
  )
}
