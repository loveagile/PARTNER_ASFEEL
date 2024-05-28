'use client'

import React, { useEffect } from 'react'
import { Modal, Form, Collapse, Checkbox, Button } from 'antd'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
import { CaretRightOutlined } from '@ant-design/icons'

import { IArea, ICity } from '../../models/registrant.model'
import { Prefecture } from '@/constants/model'

interface InCity {
  label: string
  value: any
}

interface InArea {
  label: string
  value: string
  children: InCity[]
}

interface InPrefecture {
  label: string
  value: string
  children: InArea[]
  index: number
}

interface ModalClubTypesProps {
  open: boolean
  onCancel: () => void
  handleOk: (values: ICity[], show: Record<string, string[]>) => void
  prefectures: Prefecture[]
  areas: IArea[]
  cities: ICity[]
  areasOfActivity: ICity[]
}

const ModalAreas = ({
  open,
  onCancel,
  cities,
  prefectures,
  areas,
  areasOfActivity,
  handleOk,
}: ModalClubTypesProps) => {
  const [form] = Form.useForm()

  const masterPrefectureData = React.useMemo<InPrefecture[]>(() => {
    const results: InPrefecture[] = []
    prefectures.forEach((prefectures) => {
      const childAreas: InArea[] = []
      areas.forEach((areas) => {
        if (areas.prefecture === prefectures.id) {
          const childCities: InCity[] = []
          cities.forEach((city) => {
            if (city.area === areas.id && city.prefecture === prefectures.id) {
              childCities.push({
                label: city.city,
                value: city.id,
              })
            }
          })

          if (childCities.length) {
            childAreas.push({
              label: areas.area,
              value: areas.id,
              children: childCities,
            })
          }
        }
      })

      if (childAreas.length) {
        results.push({
          label: prefectures.prefecture,
          value: prefectures.id!,
          index: prefectures.index,
          children: childAreas,
        })
      }
    })

    return results.sort(
      (firstValue, secondValue) => firstValue?.index - secondValue?.index,
    )
  }, [cities, prefectures, areas])

  useEffect(() => {
    const formValues: Record<string, string[]> = {}
    areasOfActivity.forEach((city) => {
      if (
        formValues[city.prefecture] &&
        Array.isArray(formValues[city.prefecture])
      ) {
        formValues[city.prefecture].push(city.id)
      } else {
        formValues[city.prefecture] = [city.id]
      }
    })

    form.setFieldsValue(formValues)
  }, [areasOfActivity])

  const handleFinish = (values: any) => {
    const clubs: ICity[] = []
    const clubShow: Record<string, string[]> = {}

    prefectures.forEach((prefecture) => {
      if (values[prefecture.id!]?.length) {
        clubShow[prefecture.prefecture] = []
        cities.forEach((city) => {
          if (values[prefecture.id!].includes(city.id)) {
            clubShow[prefecture.prefecture].push(city.city)
            clubs.push(city)
          }
        })
      }
    })

    handleOk(clubs, clubShow)
    onCancel()
  }

  return (
    <Modal
      open={open}
      onCancel={() => onCancel()}
      footer={null}
      title="指導できる種目"
    >
      <Form form={form} onFinish={handleFinish} className="mt-8">
        <Collapse
          className="bg-transparent"
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? -90 : 90} />
          )}
          items={masterPrefectureData.map((prefecture) => {
            return {
              key: prefecture.value,
              label: prefecture.label,
              children: (
                <div className="-m-4">
                  <Form.Item name={[prefecture.value]} colon={false}>
                    <Checkbox.Group className="flex flex-col">
                      {prefecture.children.map((area, index) => (
                        <div key={area.value}>
                          <span
                            className="flex justify-center border-gray-gray_dark bg-light-blue_light py-1"
                            style={{
                              borderBottomWidth: '1px',
                              ...(index && {
                                borderTopWidth: '1px',
                              }),
                            }}
                          >
                            {area.label}
                          </span>
                          <div className="px-4">
                            {area.children.map((city, idx) => (
                              <div
                                key={city.value}
                                className="flex justify-center border-gray-gray_dark py-1"
                                style={{
                                  ...(idx && {
                                    borderTopWidth: '1px',
                                  }),
                                }}
                              >
                                <Checkbox
                                  value={city.value}
                                  rootClassName="flex w-full"
                                >
                                  {city.label}
                                </Checkbox>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </Checkbox.Group>
                  </Form.Item>
                </div>
              ),
            }
          })}
        />
        <div className="mt-8 flex gap-5">
          <Button className="h-9 flex-1 rounded-2xl bg-gray-gray_dark text-white">
            キャンセル
          </Button>
          <Button
            type="primary"
            className="h-9 flex-1 rounded-2xl bg-core-sky"
            htmlType="submit"
          >
            実行する
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default ModalAreas
