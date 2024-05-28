import { Icon } from '@/components/atoms'
import { formatDate } from '@/libs/dayjs/dayjs'
import { PrivateUser } from '@/models/privateUsers.model'
import { jobTypeList } from '@/utils/constants'
import React from 'react'
import { MdImage } from 'react-icons/md'

export enum TopProfileType {
  DEFAULT,
  EDIT,
}

export interface TopProfileProps {
  userInfo: PrivateUser
  avatar: string
  status: TopProfileType
  fileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const TopProfile = ({ userInfo, avatar, status, fileUpload }: TopProfileProps) => {
  const lastUpdatedDate = `最終更新日：${formatDate(userInfo.updatedAt.toDate())('slashYYYYMMDDHHMM')}`
  const imageUrl = avatar || '/images/avatar/no_avatar.png'
  const firstName = `${userInfo.name.sei} ${userInfo.name.mei}`
  const secondName = `${userInfo.name.seiKana} ${userInfo.name.meiKana}`
  const typeOfUniversity = jobTypeList[parseInt(userInfo.occupation.type)]?.text
  const grade = userInfo.occupation.grade ? `${userInfo.occupation.grade}年生` : ''

  return (
    <div className="flex w-full flex-col px-5 pb-4 pt-2.5">
      <div className="flex flex-row items-end justify-end text-mini text-gray-gray_dark">
        <span>{lastUpdatedDate}</span>
      </div>
      <div className="flex flex-row space-x-5 text-gray-black pc:justify-center">
        <Icon src={imageUrl} alt="profile picture" size={60} />
        <div className="flex flex-col gap-1 self-center">
          <div className="flex flex-row items-end gap-[2px]">
            <div className="text-h4">{firstName}</div>
            <div className="text-xl leading-5"> /</div>
            <div className="text-small">{secondName}</div>
          </div>
          <div className="flex flex-row gap-1 text-timestamp">
            <div>{userInfo.occupation.organization}</div>
            <div>{typeOfUniversity}</div>
            <div>{grade}</div>
          </div>
          {status === TopProfileType.EDIT && (
            <div className="flex flex-row gap-[2px] text-mini text-core-blue hover:cursor-pointer">
              <MdImage size={14} color="307DC1" />

              <label htmlFor="inputFile">プロフィール画像を変更</label>
              <input autoCapitalize="none" id="inputFile" type="file" hidden multiple onChange={(e) => fileUpload(e)} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
