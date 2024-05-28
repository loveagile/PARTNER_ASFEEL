import WorkHours from '@/components/WorkHours'
import React from 'react'
import styles from './index.module.scss'

type InformationProps = {
  data: any
}

const Information = ({ data = {} }: InformationProps) => {
  const {
    occupation,
    address,
    phoneNumber,
    email,
    officeHours = [],
    isExpeditionPossible,
    experience,
    experienceNote,
    teacherLicenseStatus,
    teacherLicenseNote,
    hasDriverLicense,
    otherLicense,
    otherLicenseNote,
    pr,
    subscribeEmail,
    clubsDisplay = {},
    areasOfActivityDisplay = {},
    questionsForPrefectureDisplay = {},
    careerDisplay = [],
  } = data

  return (
    <div className={styles.scroll_bar}>
      <InformationItem label="職業">
        <span>{occupation?.organization}</span>
        <br />
        <span>{occupation?.type}</span>
        <span>{occupation?.grade}年生</span>
      </InformationItem>
      <InformationItem label="住所">
        <span>{address?.zip}</span>
        <br />
        <span>
          {address?.prefectureName}
          {address?.city}
          {address?.address1}
          {address?.address2}
        </span>
      </InformationItem>
      <InformationItem label="携帯番号">{phoneNumber}</InformationItem>
      <InformationItem label="メールアドレス">{email}</InformationItem>
      <InformationItem label="指導できる種目">
        {Object.entries(clubsDisplay).map(([key, value]: any) => (
          <span key={key}>
            <span>{key} : </span>
            <span>{value.join(', ')}</span>
            <br />
          </span>
        ))}
      </InformationItem>
      <InformationItem label="指導できる地域">
        {Object.entries(areasOfActivityDisplay).map(([key, value]: any) => (
          <span key={key}>
            <span>{key} : </span>
            <span>{value.join(', ')}</span>
            <br />
          </span>
        ))}
      </InformationItem>
      <InformationItem label="指導できる日時">
        <WorkHours workingHours={officeHours} />
      </InformationItem>
      <InformationItem label="遠征への同行可否">
        {isExpeditionPossible}
      </InformationItem>
      <InformationItem label="指導経験">
        {experience}
        {experienceNote}
      </InformationItem>
      <InformationItem label="教員免許">
        {teacherLicenseStatus}
        {teacherLicenseNote}
      </InformationItem>
      <InformationItem label="自動車運転免許">
        {hasDriverLicense}
      </InformationItem>
      <InformationItem label="指導者資格" subLabel="(教員免許以外)">
        {otherLicense}
        {otherLicenseNote}
      </InformationItem>
      <InformationItem label="自己アピール">{pr}</InformationItem>
      <InformationItem label="都道府県ごとの質問">
        {Object.entries(questionsForPrefectureDisplay).map(
          ([key, value]: any) => (
            <span key={key}>
              <span>{key}</span>
              <div className="mt-2 border">
                <div className="bg-gray-gray_light px-2 py-1">
                  {value?.question}
                </div>
                <div className="px-2 py-1">{value?.answer}</div>
              </div>
            </span>
          ),
        )}
      </InformationItem>
      <InformationItem label="経歴">
        {careerDisplay?.map((item: any, index: number) => (
          <div key={index}>
            <span>{item?.termOfStart}</span> ～ <span>{item?.termOfEnd}</span>
            <span className="ml-3">{item?.organizationName}</span>
          </div>
        ))}
      </InformationItem>
      <InformationItem
        label="メール受信設定"
        description="※「受け取らない」に設定しても個別メッセージなど大切なお知らせは届きます。"
      >
        {subscribeEmail}
      </InformationItem>
    </div>
  )
}

const InformationItem = ({
  label,
  subLabel = '',
  description = '',
  children,
}: {
  label: string
  subLabel?: string
  description?: string
  children: React.ReactNode
}) => {
  return (
    <div className="mb-5">
      <span className="text-small">
        {label}
        <span className="ml-1 text-mini">{subLabel}</span>
      </span>
      <div>{children}</div>
      <span className="text-mini text-gray-gray_dark">{description}</span>
    </div>
  )
}

export default Information
