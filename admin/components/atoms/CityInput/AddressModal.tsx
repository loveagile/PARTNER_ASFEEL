'use client'

import {
  Checkbox,
  CheckboxOptionType,
  Modal,
  ModalProps,
  Spin,
  Typography,
} from 'antd'

type AddressModalProps = {
  value?: any[]
  prefecture?: CheckboxOptionType | null
  area: CheckboxOptionType | null
  data: { label: string; value: any }[]
  isOpenCityModal: boolean
  handleSelectPrefectureArea: (item: any) => void
  isLoading: boolean
  handleSelectCities: (cities: any) => void
  isCheckPrefectureAll: boolean
  isCheckAreaAll: boolean
  handleCheckPrefectureAll: (prefecture: any, isChecked: boolean) => void
  handleCheckAreaAll: (area: any, isChecked: boolean) => void
  handleCancel: () => void
} & ModalProps

const AddressModal = ({
  value,
  isOpenCityModal,
  prefecture,
  area,
  data,
  handleSelectPrefectureArea,
  isLoading,
  handleCancel,
  handleSelectCities,
  handleCheckAreaAll,
  isCheckAreaAll,
  handleCheckPrefectureAll,
  isCheckPrefectureAll,
  ...rest
}: AddressModalProps) => {
  return (
    <Modal
      open={isOpenCityModal}
      onCancel={handleCancel}
      closeIcon={null}
      footer={null}
      destroyOnClose
      {...rest}
    >
      <div className="px-4 py-5">
        <Typography.Title level={3} className="text-center">
          市区町村選択
        </Typography.Title>
      </div>
      <div>
        <Typography.Title
          level={5}
          className="!m-0 border-y 
      border-gray-gray_dark bg-gray-gray_lighter p-5 text-left"
        >
          {prefecture && (
            <>
              <Checkbox
                className="mr-2"
                checked={isCheckPrefectureAll}
                onChange={(e) => {
                  handleCheckPrefectureAll(prefecture, e.target.checked)
                }}
              />
              {prefecture.label}
            </>
          )}
        </Typography.Title>

        <span
          className="flex min-h-[2.5rem] 
    border-b border-gray-gray bg-light-blue_light px-5 py-2 text-center font-bold"
        >
          {area && (
            <>
              <Checkbox
                checked={isCheckAreaAll}
                onChange={(e) => {
                  handleCheckAreaAll(area, e.target.checked)
                }}
              />
              <span className="mr-[22px] flex-1">{area.label}</span>
            </>
          )}
        </span>

        <Checkbox.Group
          className="hidden_scroll h-60 w-full flex-col flex-nowrap overflow-auto px-5"
          onChange={handleSelectCities}
          defaultValue={[]}
          value={value}
        >
          <>
            <div
              className={`${
                isLoading ? '' : 'hidden'
              } absolute left-0 top-0 z-10 flex h-full w-full cursor-pointer items-center justify-center bg-black bg-opacity-20 `}
            >
              <Spin spinning={isLoading} />
            </div>
            {data.map((item, index) => {
              return (
                <div className="flex gap-2 border-b py-3" key={index}>
                  {prefecture && area ? (
                    <Checkbox
                      key={item.value}
                      value={item.value}
                      className="flex-1"
                    >
                      <span>{item.label}</span>
                    </Checkbox>
                  ) : (
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => handleSelectPrefectureArea(item)}
                    >
                      <span>{item.label}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </>
        </Checkbox.Group>
      </div>
    </Modal>
  )
}

export default AddressModal
