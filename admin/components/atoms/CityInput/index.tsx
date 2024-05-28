'use client'

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

type CheckboxType = {
  label: string
  value: string
}

const CityInput = forwardRef(
  ({ onChange, value, children, prefectureParam }: CityInputProps, ref) => {
    const [isOpenCityModal, setIsOpenCityModal] = React.useState(false)
    const [prefecture, setPrefecture] = React.useState<CheckboxType | null>(
      null,
    )
    const currentPrefecture = React.useRef<any>(null)

    const [area, setArea] = React.useState<CheckboxType | null>(null)
    const [data, setData] = React.useState<CheckboxType[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [textValue, setTextValue] = React.useState('')

    const [prefecturesOption, setPrefecturesOption] = React.useState<any[]>([])
    const [areasOption, setAreasOption] = React.useState<any[]>([])
    const [citiesOption, setCitiesOption] = React.useState<any[]>([])

    const [isCheckPrefectureAll, setIsCheckPrefectureAll] =
      React.useState(false)

    const [isCheckAreaAll, setIsCheckAreaAll] = React.useState(false)

    React.useImperativeHandle(ref, () => ({
      showCityModal: () => {
        if (prefectureParam !== prefecture?.value) {
          const prefecture = prefecturesOption.find(
            (prefecture) => prefecture.value === prefectureParam,
          )
          setArea(null)
          handleSelectPrefectureArea(prefecture)
        }
        setIsOpenCityModal(true)
      },
    }))

    const handleSelectPrefectureArea = (item: any) => {
      if (prefecture) {
        setArea(item)
        const cities = citiesOption.filter((city) => city.areaId === item.value)
        setData(cities)
      } else {
        setPrefecture(item)
        currentPrefecture.current = item

        const areas = areasOption.filter(
          (area) => area.prefectureId === item.value,
        )
        setData(areas)
      }
    }

    const handleCheckPrefectureAll = (prefecture: any, isChecked: boolean) => {
      const selectedCities = citiesOption.filter(
        (city) => city.prefectureId === prefecture.value,
      )
      const selectedCitiesValue = selectedCities.map((item) => item.value)
      if (isChecked) {
        onChange?.(lodash.uniq([...(value || []), ...selectedCitiesValue]))
      } else {
        onChange?.(value?.filter((item) => !selectedCitiesValue.includes(item)))
      }
    }

    const handleCheckAreaAll = (area: any, isChecked: boolean) => {
      const selectedCities = citiesOption.filter(
        (city) => city.areaId === area.value,
      )
      const selectedCitiesValue = selectedCities.map((item) => item.value)
      if (isChecked) {
        onChange?.(lodash.uniq([...(value || []), ...selectedCitiesValue]))
      } else {
        onChange?.(value?.filter((item) => !selectedCitiesValue.includes(item)))
      }
    }

    const handleSelectCities = (cities: any) => {
      const allCitiesAreaValues = citiesOption
        .filter((city) => city.areaId === area?.value)
        .map((item) => item.value)

      // Remove all cities of area
      let newValue =
        value?.filter((item) => !allCitiesAreaValues.includes(item)) || []

      // Add new cities
      newValue = [...newValue, ...cities]

      onChange?.(newValue)
    }

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

        const data = prefectures.map((item) => ({
          label: item.prefecture,
          value: item.id,
        }))

        setData(data)

        setPrefecturesOption(data)

        setAreasOption(
          areas.map((item) => ({
            label: item.area,
            value: item.id,
            prefectureId: item.prefecture,
          })),
        )

        setCitiesOption(
          cities.map((item) => ({
            label: item.city,
            value: item.id,
            areaId: item.area,
            prefectureId: item.prefecture,
          })),
        )
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }

    const handleCancel = () => {
      setArea(null)
      setPrefecture(null)
      setData(prefecturesOption)
      setIsOpenCityModal(false)
    }

    React.useEffect(() => {
      fetchMasterData()
    }, [])

    React.useEffect(() => {
      const citiesValue = citiesOption.filter(
        (item) => value?.includes(item.value),
      )

      currentPrefecture.current = prefecturesOption.find(
        (item) => item.value === citiesValue?.[0]?.prefectureId,
      )

      setTextValue(citiesValue.map((item) => item.label).join(', '))
    }, [value, citiesOption])

    React.useEffect(() => {
      if (
        prefectureParam &&
        prefectureParam !== currentPrefecture.current?.value
      ) {
        onChange?.([])
      }
    }, [prefectureParam])

    React.useEffect(() => {
      const diffCitiesPrefecture = citiesOption.filter(
        (city) =>
          city.prefectureId === prefecture?.value &&
          !value?.includes(city.value),
      )

      const diffCitiesArea = citiesOption.filter(
        (city) => city.areaId === area?.value && !value?.includes(city.value),
      )

      setIsCheckPrefectureAll(
        Boolean(
          prefecture && value?.length && diffCitiesPrefecture.length === 0,
        ),
      )

      setIsCheckAreaAll(
        Boolean(area && value?.length && diffCitiesArea.length === 0),
      )
    }, [value, prefecture, area])

    return (
      <>
        {children &&
          React.cloneElement(children, {
            value: textValue,
          })}
        <AddressModal
          data={data}
          area={area}
          prefecture={prefecture}
          isOpenCityModal={isOpenCityModal}
          handleSelectPrefectureArea={handleSelectPrefectureArea}
          handleSelectCities={handleSelectCities}
          isCheckPrefectureAll={isCheckPrefectureAll}
          handleCheckPrefectureAll={handleCheckPrefectureAll}
          isCheckAreaAll={isCheckAreaAll}
          handleCheckAreaAll={handleCheckAreaAll}
          isLoading={isLoading}
          handleCancel={handleCancel}
          value={value}
        />
      </>
    )
  },
)

CityInput.displayName = 'CityInput'

export default CityInput
