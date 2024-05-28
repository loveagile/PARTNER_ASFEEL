import { useForm } from 'react-hook-form'
import { Input, InputStatus, InputType } from '@/components/atoms'
import List, { Size } from '@/components/molecules/Message/List'
import MessageLayout from '@/components/layouts/MessageLayout'
import React, { useMemo } from 'react'
import { messageRoomDateFormat } from '@/utils/common'
import { useAppSelector } from '@/store'

export default function Page() {
  const { control, watch } = useForm({})
  const { authUser, messageList } = useAppSelector((state) => state.global)
  const search = watch('search') || ''

  const sortedMessageRoomList = useMemo(() => {
    return [...messageList].sort((a, b) => b.updatedAt.toMillis() - a.updatedAt.toMillis())
  }, [messageList])

  const searchedMessageRoomList = useMemo(() => {
    return sortedMessageRoomList.filter((data) => {
      return (
        data.projectType == 'leader' &&
        (data.projectData?.organizationName?.includes(search) ||
          data.projectData?.eventName?.includes(search) ||
          data.lastMessage?.includes(search))
      )
    })
  }, [search, sortedMessageRoomList])

  return (
    <div className="h-full bg-gray-white">
      <MessageLayout isFooter={false}>
        <>
          {!authUser ? null : (
            <div className="relative h-[calc(100vh-64px)]">
              <div className="mx-auto max-w-[800px]">
                <div className="flex justify-between px-[10px] py-[20px]">
                  <div className="flex items-center gap-[8px]">
                    <img src={`/images/icons/questionAnswer.svg`} className="w-17 h-17" alt="" />
                    <p className="font-bold sp:text-[14px] pc:text-[16px]">メッセージ</p>
                  </div>
                  <div>
                    <Input
                      type={InputType.BOX}
                      name="search"
                      control={control}
                      className="h-[34px] rounded-full sp:w-[170px] pc:w-[190px]"
                      status={InputStatus.SEARCH}
                      placeholder="検索"
                    />
                  </div>
                </div>

                <div className="grid">
                  {searchedMessageRoomList.map((data, index) =>
                    data.projectType == 'leader' ? (
                      <List
                        key={index}
                        size={Size.SP}
                        school={(data.projectData?.organizationName && data.projectData.organizationName) || 'N/A'}
                        major={data.projectData?.eventName}
                        sex={data.projectData?.gender || ''}
                        selected={false}
                        unreadStatus={true}
                        unreadCount={
                          data.members.findIndex((member) => member.userId == authUser.uid) != -1
                            ? data.members[data.members.findIndex((member) => member.userId == authUser.uid)]
                                .unreadCount
                            : 0
                        }
                        date={messageRoomDateFormat(data.updatedAt)}
                        text={data.projectData?.status == 'finished' ? '募集終了' : data.lastMessage}
                        msgType="common"
                        projectId={data.projectData?.id || ''}
                      />
                    ) : (
                      data.projectType == 'event' && (
                        <List
                          key={index}
                          size={Size.SP}
                          school={data.projectData?.title || 'N/A'}
                          major={data.projectData?.subTitle}
                          sex={data.projectData?.gender || ''}
                          selected={false}
                          unreadStatus={true}
                          unreadCount={
                            data.members.findIndex((member) => member.userId == authUser.uid) != -1
                              ? data.members[data.members.findIndex((member) => member.userId == authUser.uid)]
                                  .unreadCount
                              : 0
                          }
                          date={messageRoomDateFormat(data.updatedAt)}
                          text={data.projectData?.status == 'finished' ? '募集終了' : data.lastMessage}
                          msgType="common"
                          projectId={data.projectData?.id || ''}
                        />
                      )
                    ),
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      </MessageLayout>
    </div>
  )
}
