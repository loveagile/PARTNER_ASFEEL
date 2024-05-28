'use client'

import React, { useEffect } from 'react'
import { Modal, Form, Collapse, Checkbox, Button } from 'antd'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
import { CaretRightOutlined } from '@ant-design/icons'

import { IClubTypes } from '../../models/registrant.model'

interface InClubType {
  label: string
  value: any
}

interface InClubTypeMedium {
  label: string
  value: string
  index: number
  children: InClubType[]
}

interface InClubTypeLarge {
  label: string
  value: string
  children: InClubTypeMedium[]
}

interface ModalClubTypesProps {
  open: boolean
  onCancel: () => void
  handleOk: (values: IClubTypes[], show: Record<string, string[]>) => void
  clubTypesLarge: any[]
  clubTypesMedium: any[]
  clubTypes: any[]
  currentClubTypes: IClubTypes[]
}

const ModelClubTypes = ({
  open,
  onCancel,
  clubTypes,
  clubTypesLarge,
  clubTypesMedium,
  currentClubTypes,
  handleOk,
}: ModalClubTypesProps) => {
  const [form] = Form.useForm()

  const masterClubType = React.useMemo<InClubTypeLarge[]>(() => {
    const results: InClubTypeLarge[] = []
    clubTypesLarge.forEach((ctLarge) => {
      const childMedium: InClubTypeMedium[] = []
      clubTypesMedium.forEach((ctMedium) => {
        if (ctMedium.largeCategory === ctLarge.id) {
          const childClubType: InClubType[] = []
          clubTypes.forEach((ct) => {
            if (
              ct.mediumCategory === ctMedium.id &&
              ct.largeCategory === ctLarge.id
            ) {
              childClubType.push({
                label: ct.name,
                value: ct.id,
              })
            }
          })

          if (childClubType.length) {
            childMedium.push({
              label: ctMedium.name,
              value: ctMedium.id,
              index: ctMedium.index || 0,
              children: childClubType,
            })
          }
        }
      })

      if (childMedium.length) {
        results.push({
          label: ctLarge.name,
          value: ctLarge.id,
          children: childMedium.sort(
            (firstValue, secondValue) => firstValue?.index - secondValue?.index,
          ),
        })
      }
    })

    return results
  }, [clubTypes, clubTypesLarge, clubTypesMedium])

  useEffect(() => {
    const formValues: Record<string, string[]> = {}
    currentClubTypes.forEach((clubType) => {
      if (
        formValues[clubType.largeCategory] &&
        Array.isArray(formValues[clubType.largeCategory])
      ) {
        formValues[clubType.largeCategory].push(clubType.id)
      } else {
        formValues[clubType.largeCategory] = [clubType.id]
      }
    })

    form.setFieldsValue(formValues)
  }, [currentClubTypes])

  const handleFinish = (values: any) => {
    const clubs: IClubTypes[] = []
    const clubShow: Record<string, string[]> = {}

    clubTypesLarge.forEach((large) => {
      if (values[large.id]?.length) {
        clubShow[large.name] = []
        clubTypes.forEach((ct) => {
          if (values[large.id].includes(ct.id)) {
            clubShow[large.name].push(ct.name)
            clubs.push(ct)
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
          items={masterClubType.map((clubTypeLarge) => {
            return {
              key: clubTypeLarge.value,
              label: clubTypeLarge.label,
              children: (
                <div className="-m-4">
                  <Form.Item name={[clubTypeLarge.value]} colon={false}>
                    <Checkbox.Group className="flex flex-col">
                      {clubTypeLarge.children.map((clubTypeMedium, index) => (
                        <div key={clubTypeMedium.value}>
                          <span
                            className="flex justify-center border-gray-gray_dark bg-light-blue_light py-1"
                            style={{
                              borderBottomWidth: '1px',
                              ...(index && {
                                borderTopWidth: '1px',
                              }),
                            }}
                          >
                            {clubTypeMedium.label}
                          </span>
                          <div className="px-4">
                            {clubTypeMedium.children.map((clubType, idx) => (
                              <div
                                key={clubType.value}
                                className="flex justify-center border-gray-gray_dark py-1"
                                style={{
                                  ...(idx && {
                                    borderTopWidth: '1px',
                                  }),
                                }}
                              >
                                <Checkbox
                                  value={clubType.value}
                                  rootClassName="flex w-full"
                                >
                                  {clubType.label}
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

export default ModelClubTypes
