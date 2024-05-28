'use client'

import { useState, useEffect } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { FormProvider, useForm } from "react-hook-form"
import axios from "axios"

import SelectBox from "@/components/atoms/Input/SelectBox";
import Input from "@/components/molecules/Input/Input"
import { CheckBoxGroup } from "@/components/molecules/Input/CheckBoxGroup"
import { projectListAtom } from "@/recoil/atom/projects/projectListAtom"
import Loading from "@/components/layouts/loading"
import { authUserState } from "@/recoil/atom/auth/authUserAtom"

interface ThisProps {
  caption: string
  eventOptions: { value: string; label: string }[]
}

interface FormValues {
  keyword: string
  event: { label: string, value: string }
  isShowRequiredOption: string[],
}

export const Top = ({
  caption,
  eventOptions,
}: ThisProps) => {

  const methods = useForm<FormValues>({
    defaultValues: {
      keyword: '',
      event: { value: '', label: 'すべての種目' },
      isShowRequiredOption: [],
    },
    mode: 'onChange'
  })
  const { control, watch, handleSubmit } = methods
  const keyword = watch('keyword') || ""
  const event = watch('event')['value'] || ""
  const isShowRequiredOption = watch('isShowRequiredOption')

  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [_, setProjectList] = useRecoilState(projectListAtom)

  const authUser = useRecoilValue(authUserState)
  const prefecture = authUser.prefecture

  useEffect(() => {
    if (!authUser.user) return
    const fetchProject = async ({
      keyword, event, isShowRequiredOption,
    }: {
      keyword: string | undefined,
      event: string | undefined,
      isShowRequiredOption: string[],
    }) => {
      setIsLoading(true)
      const result = await axios.post('/api/projects/project/search', {
        prefecture: prefecture || '',
        keyword: keyword || '',
        event: event || '',
        isOnly: isShowRequiredOption || '',
      })
      setProjectList(result.data)
      setCount(result.data.length)
      setIsLoading(false)
    }

    fetchProject({ keyword, event, isShowRequiredOption })
  }, [prefecture, keyword, event, isShowRequiredOption, setIsLoading, setProjectList])

  const onSubmit = async (data: FormValues) => {

  }

  return (
    <FormProvider {...methods}>
      {isLoading && <Loading />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-5 px-[10px] pt-[31.5px] pb-1">
          <div className="text-h1 text-gray-black">{caption}</div>
          <div className="flex gap-1">
            <div className="text-h2 text-core-blue">{count}</div>
            <div className="flex flex-col gap-[10px] pb-[3px]">
              <div></div>
              <div className="text-small text-core-blue">件</div>
            </div>
          </div>
          <Input
            control={control}
            name="keyword"
            type="searchbox"
            placeholder="キーワードで検索"
          />
          <SelectBox
            control={control}
            className="w-[200px]"
            name="event"
            options={eventOptions}
          />
          <CheckBoxGroup
            className="bg-gray-gray_lighter"
            name="isShowRequiredOption"
            isSmall
            options={[
              { label: '要対応のみ', value: 'isShowRequiredOption' }
            ]}
            onChange={handleSubmit(onSubmit)}
          />
        </div>
      </form>
    </FormProvider>
  )
}