import PATH from '@/constants/path'
import { convertUtcToJapanTime } from '@/utils/common'
import { Col, Row } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { IoChevronForwardOutline } from 'react-icons/io5'

type HistoryProps = {
  historyCandidate: any[]
}

const History = ({ historyCandidate }: HistoryProps) => {
  return historyCandidate.map((item, index) => (
    <HistoryItem
      key={index}
      projectStatus={item?.projectStatus}
      project={item?.project}
      scouter={item?.scouter}
    />
  ))
}

type HistoryItemProps = {
  projectStatus: string
  project: any
  scouter: any
}

const HistoryItem = ({
  projectStatus = '',
  project = {},
  scouter = {},
}: HistoryItemProps) => {
  const router = useRouter()
  const workplaceDisplay = React.useMemo(() => {
    if (!project?.workplace) return ''
    return `${project?.workplace?.prefecture} ${project?.workplace?.city} ${project?.workplace?.address1}`
  }, [project])

  return (
    <div>
      <Row align="middle" className="border px-4 py-[12px]">
        <Col>
          <div className="mr-4 w-[52px] rounded-[20px] bg-gray-gray py-[2px] text-center text-mini">
            {projectStatus}
          </div>
        </Col>
        <Col flex={1}>
          <Row>
            <span className="text-h5">{workplaceDisplay}</span>
            <span className="text-h5">{project?.eventName}</span>
            <span className="text-h5">{project?.gender}</span>
          </Row>
          <Row gutter={18} className="mt-2">
            <Col>
              <div className="text-mini">ステータス</div>
              <div className="text-timestamp">{scouter?.status}</div>
            </Col>
            <Col>
              <div className="text-mini">面談日時</div>
              <div className="text-timestamp">-</div>
            </Col>
            <Col>
              <div className="text-mini">最終更新日</div>
              <div className="text-timestamp">
                {convertUtcToJapanTime(scouter?.updatedAt?.seconds * 1000)}
              </div>
            </Col>
          </Row>
        </Col>
        <Col>
          <Link href={PATH.recruitment.detail.public(project?.id)}>
            <div className="cursor-pointer">
              <IoChevronForwardOutline
                className="text-gray-gray_dark"
                fontSize={18}
              />
            </div>
          </Link>
        </Col>
      </Row>
    </div>
  )
}

export default History
