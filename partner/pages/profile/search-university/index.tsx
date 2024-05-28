import SelectBox, { SelectBoxSize, SelectBoxType } from '@/components/atoms/Input/SelectBox'
import { Input, InputStatus } from '@/components/atoms'

import { useSearchUniversity } from '@/hooks/useSearchUniversity'
import Link from 'next/link'

export default function Page() {
  const { control, prefectureOptionList, organizationList, selectPrefecture, selectOrganization } =
    useSearchUniversity()

  return (
    <div className="h-full bg-gray-white">
      <div className="fixed z-40 flex h-[60px] w-full items-center justify-center bg-core-blue_dark text-white">
        <div className="relative flex h-[60px] w-full max-w-[800px] items-center justify-center">
          <p className="text-[16px] font-bold">学校検索</p>
          <Link href="/profile" className="absolute right-5 top-5 text-[14px] font-bold">
            完了
          </Link>
        </div>
      </div>

      {prefectureOptionList && prefectureOptionList.length > 0 && (
        <div className="relative top-[60px] mx-auto max-w-[800px]">
          <div>
            <div className="p-5">
              <SelectBox
                setValue={(value) => selectPrefecture(value.toString())}
                size={SelectBoxSize.PC}
                status={SelectBoxType.DEFAULT}
                options={prefectureOptionList}
                className="w-[100%]"
              />
            </div>
            <Input
              status={InputStatus.SEARCH}
              placeholder="検索"
              control={control}
              name="searchValue"
              className="w-full rounded-none border-x-0 border-y-[1px] border-gray-gray_dark bg-gray-gray_lighter"
            />
          </div>

          <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-5">
            {organizationList.map((data, index) => (
              <div
                className="cursor-pointer border-b border-b-gray-gray py-[14px]"
                key={index}
                onClick={() => {
                  selectOrganization(data)
                }}
              >
                <p className="text-[14px]">{data.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
