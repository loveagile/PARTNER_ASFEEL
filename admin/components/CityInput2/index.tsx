'use client'

import { Area, City, Prefecture } from '@/constants/model'
import { ColRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { TextAreaProps } from 'antd/lib/input'
import { getDocs, orderBy, query } from 'firebase/firestore'
import React, { forwardRef } from 'react'
import AddressModal from './AddressModal'
import * as lodash from 'lodash'

type CityInputProps = {
  textAreaProp?: TextAreaProps
  onChange?: (value: any) => void
  value?: any[]
  children?: React.ReactElement
  prefectureParam: string
}

type MasterDataCitiesType = City & {
  id: string
}

type MasterDataAreasType = Area & {
  id: string
  cities: MasterDataCitiesType[]
}

export type MasterDataType = {
  id: string
  areas: MasterDataAreasType[]
} & Prefecture

const CityInput = forwardRef(
  ({ onChange, value, children, prefectureParam }: CityInputProps, ref) => {
    const [isOpenCityModal, setIsOpenCityModal] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [textValue, setTextValue] = React.useState('')

    const [masterData, setMasterData] = React.useState<MasterDataType[]>([])

    React.useImperativeHandle(ref, () => ({
      showCityModal: () => {
        setIsOpenCityModal(true)
      },
    }))

    const fetchMasterData = async () => {
      setIsLoading(true)
      try {
        const [prefecturesSnap, areasSnap, citiesSnap] = await Promise.all([
          getDocs(query(ColRef.prefectures, orderBy('index'))),
          getDocs(query(ColRef.areas)),
          getDocs(query(ColRef.cities)),
        ])

        const prefectures = prefecturesSnap.docs.map((doc) =>
          getDocIdWithData(doc),
        )
        const areas = areasSnap.docs.map((doc) => getDocIdWithData(doc))
        const cities = citiesSnap.docs.map((doc) => getDocIdWithData(doc))

        const createMasterData = prefectures.map((prefecture) => {
          const areasOfPrefecture = areas.filter(
            (area) => area.prefecture === prefecture.id,
          )

          const areasOfPrefectureWithCities = areasOfPrefecture.map((area) => {
            const citiesOfArea = cities.filter((city) => city.area === area.id)

            return {
              ...area,
              cities: citiesOfArea,
            }
          })

          return {
            ...prefecture,
            areas: areasOfPrefectureWithCities,
          }
        })

        setMasterData(createMasterData)
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }

    React.useEffect(() => {
      fetchMasterData()
    }, [])

    React.useEffect(() => {
      let cityLabel: string[] = []

      if (value?.length) {
        Object.values(masterData).forEach((prefecture) => {
          Object.values(prefecture.areas).forEach((area) => {
            Object.values(area.cities).forEach((city) => {
              if (value?.includes(city.id)) {
                cityLabel = [...cityLabel, city.city]
              }
            })
          })
        })
      }

      setTextValue(cityLabel.join(', '))
    }, [value, masterData])

    const currentMasterData = prefectureParam
      ? masterData.filter((item) => item.id === prefectureParam)
      : masterData

    return (
      <>
        {children &&
          React.cloneElement(children, {
            value: textValue,
          })}
        <AddressModal
          masterData={currentMasterData}
          open={isOpenCityModal}
          isLoading={isLoading}
          handleCancel={() => setIsOpenCityModal(false)}
          value={value}
          onChange={onChange}
          collapseProps={{
            activeKey: lodash.get(currentMasterData, '0.id'),
          }}
        />
      </>
    )
  },
)

CityInput.displayName = 'CityInput'

export default CityInput
