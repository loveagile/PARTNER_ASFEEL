import { DAY_OF_WEEK } from '@/constants/common'
import { Col, Row } from 'antd'

export type WorkingHoursProps = {
  [key: string]: any
} & {
  note?: string
}

const WorkHours = ({
  workingHours = {},
  wrapperProps = {},
}: {
  workingHours: WorkingHoursProps
  wrapperProps?: JSX.IntrinsicElements['div']
}) => {
  return (
    <div {...wrapperProps}>
      <Row>
        {[{ label: '' }, ...DAY_OF_WEEK].map(({ label }, index) => (
          <Col
            span={3}
            key={index}
            className={` border bg-gray-gray_lighter text-center`}
          >
            {label}
          </Col>
        ))}
      </Row>
      <Row>
        <Col span={3}>
          <Col
            className={` flex h-8 items-center justify-center border bg-gray-gray_lighter`}
          >
            午前
          </Col>
          <Col
            className={` flex h-8 items-center justify-center border bg-gray-gray_lighter`}
          >
            午後
          </Col>
        </Col>
        <WorkHourItem time={workingHours?.monday} />
        <WorkHourItem time={workingHours?.tuesday} />
        <WorkHourItem time={workingHours?.wednesday} />
        <WorkHourItem time={workingHours?.thursday} />
        <WorkHourItem time={workingHours?.friday} />
        <WorkHourItem time={workingHours?.saturday} />
        <WorkHourItem time={workingHours?.sunday} />
      </Row>
      {workingHours?.note?.split('\n').map((item: string, index: number) => (
        <span key={index}>
          {item}
          <br />
        </span>
      ))}
    </div>
  )
}

const WorkHourItem = ({ time }: { time?: ('am' | 'pm')[] }) => {
  return (
    <Col span={3}>
      <Col className={` flex h-8 items-center justify-center border`}>
        {time?.includes('am') && (
          <div className="h-5 w-5 rounded-full bg-gray-black"></div>
        )}
      </Col>
      <Col className={` flex h-8 items-center justify-center border`}>
        {time?.includes('pm') && (
          <div className="h-5 w-5 rounded-full bg-gray-black"></div>
        )}
      </Col>
    </Col>
  )
}

export default WorkHours
