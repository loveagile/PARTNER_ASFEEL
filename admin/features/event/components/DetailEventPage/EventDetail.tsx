import React from 'react'
import { useRouter } from 'next/navigation'
import { Button, Col, Row } from 'antd'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

import { COMMON_STATUS } from '@/constants/common'
import { daysOfWeekInJapanese } from '@/constants/datetime'
import PATH from '@/constants/path'
import { Event } from '../../model/event.model'
import TextAreaRenderBox from '@/components/TextAreaRenderBox'

type EventDetailProps = {
  detailEvent: Event
  handlePublic: () => void
  isStartButtonDisabled: boolean
  handleDelete: () => void
  handlePrepare: () => void
  handleFinish: () => void
}

const EventDetail = ({
  detailEvent,
  isStartButtonDisabled,
  handleDelete,
  handleFinish,
  handlePrepare,
  handlePublic,
}: EventDetailProps) => {
  const router = useRouter()

  const address = `${detailEvent?.workplace?.prefecture || ''}${
    detailEvent?.workplace?.city || ''
  }${detailEvent?.workplace?.address1 || ''}`

  const eventFooter = (status: COMMON_STATUS) => {
    switch (status) {
      case COMMON_STATUS.IN_PREPARATION:
        return (
          <>
            <div className="mt-10 text-center">
              給与・報酬面など内容を確認のうえ, 募集を開始してください
            </div>
            <div className="mt-8 flex justify-center gap-5">
              <Button
                className="h-14 w-48 rounded-[30px] border-core-blue text-core-blue"
                onClick={() =>
                  router.push(PATH.event.edit.prepare(detailEvent?.id))
                }
              >
                編集する
              </Button>
              <Button
                type="primary"
                className="h-14 w-48 rounded-[30px]"
                onClick={handlePublic}
                disabled={isStartButtonDisabled}
              >
                募集を開始する
              </Button>
            </div>
            <div className="mb-[2.5rem] mt-8 text-center">
              <button
                type="button"
                className="text-core-red underline"
                onClick={handleDelete}
              >
                この募集を削除する
              </button>
            </div>
          </>
        )

      case COMMON_STATUS.IN_PUBLIC:
        return (
          <>
            <div className="mt-10 text-center">
              内容を編集する場合は準備中にしてください
            </div>
            <div className="mt-8 flex justify-center gap-5">
              <Button
                className="text- h-14 w-48 rounded-[30px] !border-transparent bg-gray-gray_dark !text-gray-white"
                onClick={handlePrepare}
              >
                準備中にする
              </Button>
              <Button
                type="primary"
                className="h-14 w-48 rounded-[30px] !bg-core-blue"
                onClick={handleFinish}
              >
                募集を終了する
              </Button>
            </div>
          </>
        )
      default:
        return <></>
    }
  }

  return (
    <div>
      <EventDetailItem label="主な勤務地" value={address} />
      <EventDetailItem
        label="勤務時間"
        value={
          <>
            <Row className="flex-col">
              {detailEvent?.officeHours?.length ? (
                detailEvent.officeHours.map((officeHour, index) => (
                  <Col key={index}>
                    {dayjs
                      .unix(officeHour?.date?.seconds)
                      .utc()
                      .format('YYYY/MM/DD')}
                    (
                    {
                      daysOfWeekInJapanese[
                        dayjs
                          .unix(officeHour?.date?.seconds)
                          .utc()
                          .day()
                      ]
                    }
                    ) {officeHour?.start?.hour}:{officeHour?.start?.min}～
                    {officeHour?.end?.hour}:{officeHour?.end?.min}
                  </Col>
                ))
              ) : (
                <></>
              )}
            </Row>
            {detailEvent?.officeHoursNote ? (
              <Row>{detailEvent?.officeHoursNote}</Row>
            ) : (
              <></>
            )}
          </>
        }
      />
      <EventDetailItem label="業務の内容" value={detailEvent?.jobDescription} />
      <EventDetailItem label="給与・報酬" value={detailEvent?.salary} />
      <EventDetailItem label="性別" value={detailEvent?.gender} />
      <EventDetailItem label="求める人材" value={detailEvent.people} />
      <EventDetailItem label="備考" value={detailEvent?.note} />

      {eventFooter(detailEvent?.status as COMMON_STATUS)}
    </div>
  )
}

const EventDetailItem = ({
  label,
  value,
}: {
  label: string
  value: React.ReactNode | string
}) => {
  return (
    <Row align="middle" className="border-b py-5">
      <Col span={5}>
        <span className="text-h4">{label}</span>
      </Col>
      {typeof value === 'string' ? <TextAreaRenderBox text={value} /> : value}
    </Row>
  )
}

export default EventDetail
