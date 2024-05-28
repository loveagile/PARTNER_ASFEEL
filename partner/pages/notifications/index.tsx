import { useForm } from 'react-hook-form'
import { Input, InputStatus, InputType } from '@/components/atoms'
import MessageLayout from '@/components/layouts/MessageLayout'
import { AiFillBell } from 'react-icons/ai'
import NotiList, { Noti_From, Size } from '@/components/molecules/Notification/List'
import { useMemo, useState } from 'react'
import { CheckedNotification } from '@/models'
import { useAppSelector } from '@/store'
import { notiDateFormat } from '@/utils/common'
import { addCheckedNotification } from '@/firebase/privateUser'
import { Timestamp } from 'firebase/firestore'

export default function Page() {
  const { control, watch } = useForm({})
  const { authUser, notiList, userCheckedNotiList } = useAppSelector((state) => state.global)

  const search = watch('search') || ''
  const [checkedList, setCheckedList] = useState<CheckedNotification[]>([])

  const sortedNotiList = useMemo(() => {
    return [...notiList]
      .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
      .map((noti) => {
        return {
          ...noti,
          checked: userCheckedNotiList.findIndex((element) => element.noticeId == noti.id) != -1,
        }
      })
  }, [notiList, userCheckedNotiList])

  const searchedNotiList = useMemo(() => {
    return sortedNotiList.filter((data) => {
      return data.title.includes(search)
    })
  }, [search, sortedNotiList])

  const onClick = async (noticeId: string, url: string) => {
    if (!authUser) return

    const data: CheckedNotification = {
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      noticeId,
    }

    await addCheckedNotification(authUser.uid, data)
    setCheckedList([...checkedList, data])
    window.open(url, '_blank')
  }
  return (
    <div className="h-full bg-gray-white">
      <MessageLayout isFooter={false}>
        <div className="relative">
          <div className="mx-auto max-w-[800px]">
            <div className="flex justify-between px-[10px] py-[20px]">
              <div className="flex items-center gap-[8px]">
                <AiFillBell className="h-[20px] w-[20px]" />
                <p className="font-bold sp:text-[14px] pc:text-[16px]">お知らせ</p>
              </div>
              <div>
                <Input
                  type={InputType.BOX}
                  name="search"
                  control={control}
                  className="h-[34px] rounded-full sp:w-[190px] pc:w-[210px]"
                  status={InputStatus.SEARCH}
                  placeholder="検索"
                />
              </div>
            </div>

            <div className="grid">
              {searchedNotiList &&
                searchedNotiList.map((data, index) => (
                  <NotiList
                    key={index}
                    size={Size.SP}
                    school={data.title}
                    selected={false}
                    unreadStatus={!data.checked}
                    date={notiDateFormat(data.createdAt)}
                    from={Noti_From.Admin}
                    noti_id={data.id || ''}
                    url={data.url}
                    click={onClick}
                  />
                ))}
            </div>
          </div>
        </div>
      </MessageLayout>
    </div>
  )
}
