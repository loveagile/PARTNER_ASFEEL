import { CaretRightOutlined } from '@ant-design/icons'
import {
  Button,
  Checkbox,
  Collapse,
  CollapseProps,
  Form,
  Modal,
  ModalProps,
  Skeleton,
} from 'antd'
import * as lodash from 'lodash'
import React from 'react'
import { MasterDataType } from '.'

type AddressModalProps = {
  value?: any[]
  onChange?: (value: any) => void
  isLoading: boolean
  masterData: MasterDataType[]
  collapseProps?: CollapseProps
  handleCancel?: () => void
} & ModalProps

const AddressModal = ({
  value,
  onChange,
  isLoading,
  masterData = [],
  collapseProps,
  handleCancel,
  ...rest
}: AddressModalProps) => {
  const [form] = Form.useForm()
  const allValues = Form.useWatch([], form)

  React.useEffect(() => {
    if (value) {
      const formValue = masterData.reduce(
        (curr: any, prefecture) => ({
          ...curr,
          [prefecture.id]: prefecture.areas.reduce(
            (curr: any, area) => ({
              ...curr,
              [area.id]: area.cities
                ?.filter((city) => value.includes(city.id))
                ?.map((city) => city.id),
            }),
            {},
          ),
        }),
        {},
      )

      form.setFieldsValue(formValue)
    }
  }, [value, masterData])

  return (
    <Modal
      footer={null}
      title="指導できる種目"
      destroyOnClose
      onCancel={handleCancel}
      {...rest}
    >
      <Skeleton loading={isLoading} active>
        <Form
          form={form}
          onFinish={(values) => {
            const cities = Object.values(values).reduce(
              (curr: string[], prefecture: any = {}) => {
                const prefectureCities = Object.values(prefecture).reduce(
                  (curr: string[], cities: any = []) => [...curr, ...cities],
                  [],
                )

                return [...curr, ...prefectureCities]
              },
              [],
            )

            onChange?.(cities)
            handleCancel?.()
          }}
        >
          <Collapse
            className="hidden_scroll max-h-[600px] overflow-y-scroll bg-transparent"
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? -90 : 90} />
            )}
            {...collapseProps}
            items={masterData.map((prefecture) => {
              const countAllCheckedCities = prefecture.areas.reduce(
                (curr, area) =>
                  (curr += lodash.get(
                    allValues,
                    [prefecture.id, area.id],
                    [],
                  ).length),
                0,
              )

              const countAllCities = prefecture.areas.reduce(
                (curr, area) => (curr += area.cities.length),
                0,
              )

              return {
                key: prefecture.id,
                // collapsible: 'icon',
                label: (
                  <span>
                    <Checkbox
                      className="mr-2"
                      checked={countAllCheckedCities === countAllCities}
                      onChange={(e) => {
                        const areasValue = prefecture.areas.reduce(
                          (cur, area) => ({
                            ...cur,
                            [area.id]: e.target.checked
                              ? area.cities.map((city) => city.id)
                              : [],
                          }),
                          {},
                        )

                        form.setFieldValue([prefecture.id], areasValue)
                      }}
                    />
                    <span>{prefecture.prefecture}</span>
                  </span>
                ),
                children: (
                  <div className="-m-4">
                    {prefecture.areas.map((area, index) => (
                      <div key={area.id}>
                        <span
                          className="flex border-gray-gray_dark bg-light-blue_light py-1"
                          style={{
                            borderBottomWidth: '1px',
                            ...(index && {
                              borderTopWidth: '1px',
                            }),
                          }}
                        >
                          <Checkbox
                            className="pl-4"
                            checked={
                              lodash.get(
                                allValues,
                                [prefecture.id, area.id],
                                [],
                              ).length === area.cities.length
                            }
                            onChange={(e) => {
                              form.setFieldValue(
                                [prefecture.id, area.id],
                                e.target.checked
                                  ? area.cities.map((city) => city.id)
                                  : [],
                              )
                            }}
                          />
                          <span className="mr-8 flex-1 text-center">
                            {area.area}
                          </span>
                        </span>
                        <div className="px-4">
                          <Form.Item name={[prefecture.id, area.id]} noStyle>
                            <Checkbox.Group className="flex flex-col">
                              {area.cities.map((city, idx) => (
                                <div
                                  key={city.id}
                                  className="flex justify-center border-gray-gray_dark py-1"
                                  style={{
                                    ...(idx && {
                                      borderTopWidth: '1px',
                                    }),
                                  }}
                                >
                                  <Checkbox
                                    value={city.id}
                                    rootClassName="flex w-full"
                                  >
                                    {city.city}
                                  </Checkbox>
                                </div>
                              ))}
                            </Checkbox.Group>
                          </Form.Item>
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              }
            })}
          />
          <div className="mt-8 flex gap-5">
            <Button
              onClick={handleCancel}
              className="h-9 flex-1 rounded-2xl !border-gray-gray_dark bg-gray-gray_dark !text-white"
            >
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
      </Skeleton>
    </Modal>
  )
}

export default AddressModal
