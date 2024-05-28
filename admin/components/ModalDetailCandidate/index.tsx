import {
  API_ROUTES,
  PROJECT_TYPE,
  REPORT_LINK_GOOGLE_FORM,
} from '@/constants/common'
import {
  customFetchUtils,
  transformDetailCandidateData,
  transformDetainCandidatePdf,
} from '@/utils/common'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Button, Checkbox, Col, Modal, Row, Skeleton, Tabs } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import React, { forwardRef } from 'react'
import { BiSolidDownload } from 'react-icons/bi'
import { BsPersonCircle } from 'react-icons/bs'
import { PiWarningFill } from 'react-icons/pi'
import UserPDF from '../UserPDF'
import History from './History'
import Information from './Information'
import styles from './index.module.scss'
import MessageFeature from '@/features/message/components'

type ModalDetailCandidateProps = {
  detailRecruitment?: any
  selectedUsers: any[]
  handleSelectUser: (
    selectedUserIds?: string[],
    deselectedUserIds?: string[],
  ) => void
  projectType?: PROJECT_TYPE
  isShowChat?: boolean
}

const ModalDetailCandidate = forwardRef(
  (
    {
      detailRecruitment,
      handleSelectUser,
      selectedUsers = [],
      projectType,
      isShowChat,
    }: ModalDetailCandidateProps,
    ref: React.Ref<{ show: (record: any) => void }>,
  ) => {
    const [isShow, setIsShow] = React.useState<boolean>(false)
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [detailCandidate, setDetailCandidate] = React.useState<any>({})
    const [historyCandidate, setHistoryCandidate] = React.useState<any>([])
    const {
      avatar,
      id,
      name,
      gender,
      birthday,
      precautions,
      createdAt,
      updatedAt,
    } = detailCandidate || {}

    const age = React.useMemo(() => {
      if (!birthday) return ''
      const date = dayjs(birthday?.seconds * 1000)
      const now = dayjs()
      return now.diff(date, 'year')
    }, [birthday])

    const [fullName, fullNameKana] = React.useMemo(() => {
      if (!name) return ''
      return [`${name.sei} ${name.mei}`, `${name.seiKana} ${name.meiKana}`]
    }, [name])

    const fetchDetailCandidate = async (id: string) => {
      const res = await customFetchUtils(
        `${API_ROUTES.REGISTRANT.detail(id)}?isShowName=true`,
      )

      const data = await res.json()
      setDetailCandidate(data)
    }

    const fetchHistoryCandidate = async (id: string) => {
      const res = await customFetchUtils(`${API_ROUTES.REGISTRANT.history(id)}`)

      const data = await res.json()

      setHistoryCandidate(data)
    }

    const handleChangeSelect = (e: CheckboxChangeEvent) => {
      if (e.target.checked) {
        handleSelectUser([id])
      } else {
        handleSelectUser([], [id])
      }
    }

    const displayCreatedAt = createdAt
      ? dayjs(createdAt?.seconds * 1000).format('YYYY/MM/DD HH:mm')
      : ''
    const displayUpdatedAt = updatedAt
      ? dayjs(updatedAt?.seconds * 1000).format('YYYY/MM/DD HH:mm')
      : ''

    React.useImperativeHandle(
      ref,
      () => ({
        show: (record: any) => {
          setIsShow(true)
          setIsLoading(true)
          Promise.all([
            fetchDetailCandidate(record.id),
            fetchHistoryCandidate(record.id),
          ]).finally(() => {
            setIsLoading(false)
          })
        },
      }),
      [],
    )

    const transformData = transformDetailCandidateData(detailCandidate)

    const {
      clubsDisplay,
      areasOfActivityDisplay,
      questionsForPrefectureDisplay,
      careerDisplay,
    } = transformData

    const dataPdf = transformDetainCandidatePdf(detailCandidate)

    return (
      <Modal
        className={styles.modal_detail_candidate}
        open={isShow}
        onCancel={() => {
          setIsShow(false)
        }}
        footer={null}
        closeIcon={null}
        mask={false}
        // rootClassName='h-full flex flex-col'
      >
        <Skeleton loading={isLoading} active className="p-5">
          <Row gutter={8} className="gap-2 p-5">
            <Col className="h-10 w-10 rounded-full">
              {avatar ? (
                <Image
                  src={avatar}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="h-10 min-h-[40px] w-10 min-w-[40px] rounded-full object-cover"
                />
              ) : (
                <BsPersonCircle fontSize={40} className="text-gray-gray_dark" />
              )}
            </Col>
            <Col className="flex flex-col gap-1 text-body_sp">
              <span>
                <span className="mr-2 text-h3">{fullName}</span>
                <span className="text-small">{fullNameKana}</span>
              </span>
              <span>
                <span className="mr-2">{gender}</span>
                <span>{age}歳</span>
              </span>
              {precautions && (
                <span className="flex items-center gap-1 text-core-red">
                  <PiWarningFill fontSize={14} />
                  {precautions}
                </span>
              )}
            </Col>
            <Col flex="auto">
              <div className="flex flex-col text-end text-mini">
                <span className="text-gray-gray_dark">
                  登録日 : {displayCreatedAt}
                </span>
                <span className="text-gray-gray_dark">
                  プロフィール更新日 : {displayUpdatedAt}
                </span>
                <span className="mt-4 flex items-center justify-end gap-2">
                  <PDFDownloadLink
                    document={<UserPDF data={dataPdf} />}
                    fileName={`${id}.pdf`}
                  >
                    <Button className="flex h-5 items-center border-core-blue_dark px-2 py-1 text-core-blue_dark">
                      <BiSolidDownload />
                      <span className="text-mini">PDF出力</span>
                    </Button>
                  </PDFDownloadLink>
                  <Link href={REPORT_LINK_GOOGLE_FORM} target="_blank">
                    <span className="cursor-pointer underline">報告する</span>
                  </Link>
                </span>
              </div>
            </Col>
          </Row>

          <div className="relative mt-5 flex flex-1">
            <Tabs
              defaultActiveKey="1"
              rootClassName="flex flex-col flex-1"
              items={[
                {
                  key: '1',
                  label: 'プロフィール',
                  children: (
                    <Information
                      data={{
                        ...detailCandidate,
                        clubsDisplay,
                        areasOfActivityDisplay,
                        questionsForPrefectureDisplay,
                        careerDisplay,
                      }}
                    />
                  ),
                  className: 'py-5 px-8',
                },
                {
                  key: '2',
                  label: '選考履歴',
                  children: <History historyCandidate={historyCandidate} />,
                },
                ...[
                  isShowChat
                    ? {
                        key: '3',
                        label: 'メッセージ',
                        children: (
                          <MessageFeature
                            detailCandidate={detailCandidate}
                            detailProject={detailRecruitment}
                            projectType={projectType}
                          />
                        ),
                        className: 'flex flex-col flex-1',
                      }
                    : ([] as any),
                ],
              ]}
              className={styles.tab}
              tabBarGutter={0}
            />
            <span className="absolute right-0 top-2">
              <Checkbox
                checked={selectedUsers.includes(id)}
                onChange={handleChangeSelect}
                className="pr-4"
              >
                チェック
              </Checkbox>
            </span>
          </div>
        </Skeleton>
      </Modal>
    )
  },
)

ModalDetailCandidate.displayName = 'ModalDetailCandidate'

export default ModalDetailCandidate
