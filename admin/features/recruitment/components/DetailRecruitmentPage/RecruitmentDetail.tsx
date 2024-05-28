import TextAreaRenderBox from '@/components/TextAreaRenderBox'
import WorkHours from '@/components/WorkHours'
import { COMMON_STATUS } from '@/constants/common'
import PATH from '@/constants/path'
import { Button, Col, Row } from 'antd'
import { useRouter } from 'next/navigation'
import React from 'react'

type RecruitmentDetailProps = {
  detailRecruitment: any
  handlePublic: () => void
  isDisabled: boolean
  handleDelete: () => void
  handlePrepare: () => void
  handleFinish: () => void
}

const RecruitmentDetail = ({
  detailRecruitment,
  handlePublic,
  isDisabled,
  handleDelete,
  handlePrepare,
  handleFinish,
}: RecruitmentDetailProps) => {
  const router = useRouter()

  const {
    id,
    applyForProject,
    workingHours,
    workplace,
    activityDescription,
    desiredSalary,
    desiredGender,
    desiredAge,
    desiredQualifications,
    desiredTalent,
    desiredNote,
    status,
  } = detailRecruitment || {}

  const recruitmentFooter = (status: COMMON_STATUS) => {
    if (status === COMMON_STATUS.IN_PREPARATION) {
      return (
        <>
          <div className="mt-10 text-center">
            給与・報酬面など内容を確認のうえ, 募集を開始してください
          </div>
          <div className="mt-8 flex justify-center gap-5">
            <Button
              className="h-14 w-48 rounded-[30px] border-core-blue text-core-blue"
              onClick={() => router.push(PATH.recruitment.edit.prepare(id))}
            >
              編集する
            </Button>
            <Button
              type="primary"
              className="h-14 w-48 rounded-[30px]"
              onClick={handlePublic}
              disabled={isDisabled}
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
    }

    if (status === COMMON_STATUS.IN_PUBLIC) {
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
    }

    return <></>
  }

  const address = `${workplace?.prefecture}${workplace?.city}${workplace?.address1}`

  return (
    <div>
      <RecruitmentDetailItem label="募集依頼先" value={applyForProject} />
      <RecruitmentDetailItem label="主な勤務地" value={address} />
      <RecruitmentDetailItem
        label="勤務時間"
        value={
          <WorkHours
            workingHours={workingHours}
            wrapperProps={{
              className: 'w-[544px]',
            }}
          />
        }
      />
      <RecruitmentDetailItem label="活動の紹介" value={activityDescription} />
      <RecruitmentDetailItem label="給与・報酬" value={desiredSalary} />
      <RecruitmentDetailItem label="性別" value={desiredGender} />
      <RecruitmentDetailItem label="年齢" value={desiredAge?.join('、')} />
      <RecruitmentDetailItem
        label="資格に関する希望"
        value={desiredQualifications}
      />
      <RecruitmentDetailItem label="求める人材" value={desiredTalent} />
      <RecruitmentDetailItem label="備考" value={desiredNote} />

      {recruitmentFooter(status)}
    </div>
  )
}

const RecruitmentDetailItem = ({
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
      <Col span={19}>
        {typeof value === 'string' ? <TextAreaRenderBox text={value} /> : value}
      </Col>
    </Row>
  )
}

export default RecruitmentDetail
