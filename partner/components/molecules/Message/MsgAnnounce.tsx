import { AlreadyReadLabel } from '@/components/parts/Message/AlreadyReadLabel'
import { BsCheckCircle } from 'react-icons/bs'
import Schedule from '../Table/Schedule'
import { EventProject, LeadersWantedProject } from '@/models'
import { HiOutlineSpeakerphone } from 'react-icons/hi'
import { format } from 'date-fns'
import { messageRoomDateFormat, objectToDate } from '@/utils/common'
import { ja } from 'date-fns/locale'
import Link from 'next/link'
import { TimeStamp } from '@/components/parts/Message/TimeStamp'

interface MsgAnnounceProps {
  projectId: string
  className?: string
  readStatus: boolean
  project: EventProject & LeadersWantedProject
  type: string
  roomProjectType: string
}

const MsgAnnounce: React.FC<MsgAnnounceProps> = ({
  projectId,
  className = '',
  readStatus,
  project,
  type,
  roomProjectType,
}) => {
  return (
    <div className={`${className} inline-flex items-end gap-1`}>
      <div className={`${className} inline-block w-[255px] rounded-[10px] bg-light-yellow_light p-[14px]`}>
        <div className="flex items-end justify-center gap-[5.5px] text-small text-core-red">
          {type == 'application' ? (
            <>
              <BsCheckCircle size={15} />
              <span>応募が完了しました！</span>
            </>
          ) : (
            <>
              <HiOutlineSpeakerphone size={15} />
              <span>スカウトが届きました！</span>
            </>
          )}
        </div>
        <div className="my-2 border-y border-dashed border-gray-black pb-2 pt-[10px] text-gray-black">
          <div className="text-center">
            <img src="/images/icons/ball.svg" className="mx-auto" alt="" />
          </div>
          {roomProjectType == 'leader' ? (
            <h2 className="mt-[10px] text-center text-body_sp">
              {project?.organizationName} {project?.target && project?.target.join(', ')}
              <br />
              {project?.eventName} / {project?.gender}
            </h2>
          ) : (
            roomProjectType == 'event' && (
              <h2 className="mt-[10px] text-center text-body_sp">
                {project?.title} {project?.schoolName}
                <br />
                {project?.subTitle} / {project?.gender}
              </h2>
            )
          )}

          <p className="mt-2 text-mini">【チームからの勤務希望】</p>
          {roomProjectType == 'leader' ? (
            <Schedule className="mt-1" schedule={project.workingHours} size="mini" />
          ) : (
            roomProjectType == 'event' &&
            project?.officeHours.map((item, index) => (
              <div key={index} className="sp:text-[11px] pc:text-body_pc">
                {format(new Date(objectToDate(item.date)), 'yyyy/MM/dd (E)', { locale: ja }) +
                  ' ' +
                  item.start.hour +
                  ':' +
                  item.start.min +
                  '～' +
                  item.end.hour +
                  ':' +
                  item.end.min}
              </div>
            ))
          )}
          <div>{project?.officeHoursNote}</div>
        </div>
        {type != 'application' && (
          <p className="mb-2 text-center text-body_sp text-gray-black">詳細を確認して回答してください</p>
        )}
        <div className="text-center">
          <Link
            href={`/jobList/${roomProjectType}-${projectId}`}
            className="mx-auto inline-block rounded-full bg-core-blue px-[26px] py-[7px] text-body_sp text-gray-white"
          >
            募集詳細をみる
          </Link>
        </div>
      </div>

      <TimeStamp label={messageRoomDateFormat(project.createdAt)} />
      <div>{readStatus && <AlreadyReadLabel />}</div>
    </div>
  )
}

export default MsgAnnounce
