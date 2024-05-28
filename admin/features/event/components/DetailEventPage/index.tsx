import React from 'react'
import { Col, DropDownProps, Dropdown, Input, Row, Tabs } from 'antd'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

import { IoMdMail } from 'react-icons/io'
import { HiPhone } from 'react-icons/hi'
import {
  API_ROUTES,
  COMMON_STATUS,
  COMMON_STATUS_OBJECT,
} from '@/constants/common'
import RecruitmentCounter from '@/components/atoms/RecruitmentCounter'
import { MdOutlineStickyNote2 } from 'react-icons/md'
import { AiOutlineClose } from 'react-icons/ai'
import { Event } from '@/features/event/model/event.model'

import styles from './index.module.scss'
import { REQUIRED_FIELDS } from '../../common'
import EventDetail from './EventDetail'
import ListCandidateFeature from './ListCandidate'
import ListSelectionFeature from './ListSelection'

type DetailEventPageProps = {
  detailEvent: Event
  handlePublic: () => void
  handlePrepare: () => void
  handleFinish: () => void
  handleDelete: () => void
}

const DetailEventPage = ({
  detailEvent,
  handlePublic,
  handlePrepare,
  handleFinish,
  handleDelete,
}: DetailEventPageProps) => {
  const [memoValue, setMemoValue] = React.useState<string>(
    detailEvent?.memo || '',
  )

  const isStartButtonDisabled = REQUIRED_FIELDS.some((key) => {
    if (!Object.keys(detailEvent).includes(key)) return true

    let isValueFalsy = !detailEvent[key]

    if (key === 'workplace') {
      isValueFalsy = Object.values(detailEvent[key]).some((item) => !item)
    }

    // if (key === 'workingHours') {
    //   const { note, ...hours } = detailEvent[key] || {}
    //   isValueFalsy = Object.entries(hours).every(
    //     ([key, hour]: any) => hour?.length === 0,
    //   )
    // }

    return (
      isValueFalsy &&
      REQUIRED_FIELDS.includes(key) &&
      detailEvent?.status === COMMON_STATUS.IN_PREPARATION
    )
  })

  const handleChangeMemo = (value: string) => {
    setMemoValue(value)
  }

  const handleAddMemo = async (open: boolean) => {
    if (open || memoValue === detailEvent?.memo) return
    await fetch(API_ROUTES.EVENT.addMemo, {
      method: 'PUT',
      body: JSON.stringify({
        id: detailEvent.id,
        memo: memoValue || '',
      }),
    })
  }

  React.useEffect(() => {
    setMemoValue(detailEvent?.memo)
  }, [detailEvent?.memo])

  return (
    <div>
      <Row justify="space-between">
        <Col>
          <span className="text-h2">
            {detailEvent?.schoolName
              ? Array.isArray(detailEvent.schoolName)
                ? detailEvent.schoolName.join('、')
                : detailEvent.schoolName
              : ''}
            /{detailEvent.title || ''}
          </span>
          <span className="ml-2 text-h2">{detailEvent.gender}</span>
        </Col>
        <Col className="text-gray-gray_dark">{`登録日 : ${
          detailEvent?.createdAt?.seconds
            ? dayjs
                .unix(detailEvent?.createdAt?.seconds)
                .utc()
                .format('YYYY/MM/DD HH:mm:ss')
            : ''
        }`}</Col>
      </Row>
      <Row justify="space-between" className="mt-2">
        <Col>
          <Row>{`学校担当者 : ${detailEvent?.name?.sei || ''} ${
            detailEvent?.name?.mei || ''
          }/ ${detailEvent?.name?.seiKana || ''} ${
            detailEvent?.name?.meiKana || ''
          }`}</Row>
          <Row gutter={8}>
            <Col className="flex items-center gap-1">
              <IoMdMail fontSize={16} />
              <span>{detailEvent?.email || ''}</span>
            </Col>
            <Col className="flex items-center gap-1">
              <HiPhone fontSize={16} />
              <span>{detailEvent?.phoneNumber || ''}</span>
            </Col>
          </Row>
        </Col>
        <Col>
          <div className="flex">
            <button className="mr-5 border border-gray-black px-3 py-2 text-xs">
              {COMMON_STATUS_OBJECT[detailEvent?.status as COMMON_STATUS]}
            </button>
            <RecruitmentCounter record={detailEvent} />
          </div>
        </Col>
      </Row>
      <div className="relative mt-10">
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: '募集内容',
              children: (
                <EventDetail
                  detailEvent={detailEvent}
                  handleDelete={handleDelete}
                  handleFinish={handleFinish}
                  handlePrepare={handlePrepare}
                  handlePublic={handlePublic}
                  isStartButtonDisabled={isStartButtonDisabled}
                />
              ),
            },
            {
              key: '2',
              label: '候補',
              children: <ListCandidateFeature detailEvent={detailEvent} />,
            },
            {
              key: '3',
              label: '選考',
              children: <ListSelectionFeature detailEvent={detailEvent} />,
            },
          ]}
          className={styles.tab}
          tabBarGutter={0}
        />

        <span className="absolute right-0 top-2">
          <DropdownNote
            value={memoValue}
            onChange={handleChangeMemo}
            onOpenChange={handleAddMemo}
          >
            <div className="flex cursor-pointer">
              <MdOutlineStickyNote2 fontSize={24} className="text-core-blue" />
              <span className="text-h5 text-core-blue">メモを入力</span>
            </div>
          </DropdownNote>
        </span>
      </div>
    </div>
  )
}

type DropdownNoteProps = DropDownProps & {
  value: string
  onChange?: (value: string) => void
}

const DropdownNote = ({ value, onChange, ...props }: DropdownNoteProps) => {
  return (
    <Dropdown
      rootClassName="z-[100]"
      menu={{
        className: `px-10 text-center !rounded !w-[300px] !bg-light-yellow_light ${styles.dropdown_note}`,
        items: [
          {
            key: 0,
            className: '!p-0',
            label: (
              <span className="mr-2 flex justify-end">
                <AiOutlineClose className="text-xl text-gray-gray_dark" />
              </span>
            ),
          },
          {
            key: 1,
            className: '!p-0 text-left',
            label: (
              <span
                className={`mt-5 inline-block cursor-default ${styles.dropdown_note_content}`}
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <Input.TextArea
                  value={value}
                  onChange={(e) => onChange?.(e.target.value)}
                  className="!min-h-[250px] !border-transparent !bg-transparent p-0 !shadow-none"
                />
              </span>
            ),
          },
        ],
      }}
      placement="bottomRight"
      trigger={['click']}
      {...props}
    />
  )
}

export default DetailEventPage
