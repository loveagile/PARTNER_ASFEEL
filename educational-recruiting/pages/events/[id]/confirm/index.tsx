import { Label, RequiredLabelType } from '@/components/atoms'
import BackButton from '@/components/atoms/Button/BackButton'
import Button, { ButtonColor, ButtonShape, ButtonType } from '@/components/atoms/Button/Button'
import SchoolLayout from '@/components/layouts/SchoolLayout'
import { setEventProject } from '@/firebase/eventProject'
import { EventProject } from '@/models'
import { useAppSelector } from '@/store'
import { getSubDomain, objectToDate } from '@/utils/common'
import { createEmptyRegisterEventProjectToken, decrypt } from '@/utils/token'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import Link from 'next/link'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import EventPdfPage from './project-pdf'
import { generateDocId } from '@/libs/firebase/firestore'
import { Timestamp, serverTimestamp } from 'firebase/firestore'
import useSystemName from '@/hooks/useSystemName'

const FormSection = ({
  children,
  title,
  subTitle,
  isSymbol,
}: {
  children: React.ReactNode
  title: string
  subTitle?: string | React.ReactNode
  isSymbol?: boolean
}) => {
  return (
    <div className="flex flex-col border rounded-[10px] bg-gray-white border-gray-gray w-full">
      <div className="flex pc:flex-row sp:flex-col pc:items-center w-full pc:gap-5 sp:gap-[4px] pc:px-5 sp:px-[6px] py-3 bg-light-blue_light rounded-t-[10px]">
        <p className="whitespace-nowrap pc:text-h4 sp:text-[12px] sp:font-bold text-core-blue">{title}</p>
        <div className="text-mini flex gap-[2px]">
          {isSymbol && (
            <>
              <p>※</p>
              <p className="">
                <FontAwesomeIcon icon={faLock} />
              </p>
            </>
          )}
          <p>{subTitle}</p>
        </div>
      </div>
      {/* info section  */}
      <div className="flex flex-col pc:px-10 sp:px-3">{children}</div>
    </div>
  )
}

export default function Event() {
  const { logoWithoutNewLine } = useSystemName()
  const [registerEventProjectData, setRegisterEventProjectData] = useState<EventProject | null>(null)
  const { prefectureList } = useAppSelector((state) => state.global)
  const [prefectureName, setPrefectureName] = useState<string>('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const tmpRegisterData = localStorage.getItem('reg_event_project') || createEmptyRegisterEventProjectToken()
    const decryptedData = decrypt(tmpRegisterData)
    const parsedData = JSON.parse(decryptedData) as EventProject

    // MEMO: createdAt, updatedAt, officeHoursのdateをtimestamp型に変換
    const officeHours = parsedData.officeHours.map((item) => {
      return {
        ...item,
        date: Timestamp.fromDate(objectToDate(item.date as Timestamp)),
      }
    })

    setRegisterEventProjectData({
      ...parsedData,
      officeHours,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    const index = prefectureList.findIndex((element) => element.id == parsedData.address.prefecture)
    if (index != -1) setPrefectureName(prefectureList[index].prefecture)
  }, [])

  const completeForm = async () => {
    if (!registerEventProjectData) return

    console.log(registerEventProjectData)
    try {
      const docId = generateDocId()
      const res = await setEventProject(docId, registerEventProjectData)
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectData: registerEventProjectData,
          type: 'event',
          from: getSubDomain(),
          systemName: logoWithoutNewLine,
        }),
      })

      if (response.ok) {
        localStorage.setItem('event_completed', 'completed')
        Router.push('/events/new/confirm/send-complete-popup')
      }
    } catch (error) {
      console.error(error)
      alert('募集依頼の送信に失敗しました。もう一度')
    }
  }

  return (
    <div className="h-full bg-gray-white">
      <SchoolLayout>
        <div className="relative">
          <div className="fixed pc:top-[104px] sp:top-[74px] pc:left-10 sp:left-[10px]">
            <BackButton
              onClick={() => {
                Router.push('/events')
              }}
            />
          </div>
          <div className="flex flex-col items-center py-10 gap-10 sp:px-[20px] max-w-[880px] m-auto pc:px-0">
            <div id="pdf_part" className="flex flex-col items-center gap-10 w-full">
              <div className="text-h1">募集依頼詳細</div>
              <FormSection title="イベント情報">
                <div className="flex flex-col items-start py-5 gap-[2px] border-b border-gray-gray">
                  <div className="pc:text-h2 sp:text-[14px] sp:font-bold">
                    {registerEventProjectData?.title ? registerEventProjectData.title : ''}
                  </div>
                  <div className="flex flex-row items-center pc:gap-[10px] sp:gap-[3px] pc:text-body_pc sp:text-[11px]">
                    <p>主催団体</p>
                    <p>:</p>
                    <p>{registerEventProjectData?.organizer ? registerEventProjectData.organizer : ''}</p>
                  </div>
                  <div className="flex flex-row items-center pc:gap-[10px] sp:gap-[3px] pc:text-body_pc sp:text-[11px]">
                    <p>募集を申請する学校</p>
                    <p>:</p>
                    <p>
                      {registerEventProjectData?.schoolName &&
                        registerEventProjectData.schoolName.length > 0 &&
                        registerEventProjectData.schoolName.join(' / ')}
                    </p>
                    {/* <p>/</p>
                    <p>{school2}</p> */}
                  </div>
                  <div className="flex flex-row items-center pc:gap-[10px] sp:gap-[3px] pc:text-body_pc sp:text-[11px]">
                    <p>募集人数</p>
                    <p>:</p>
                    <p>{registerEventProjectData?.numberOfApplicants ? registerEventProjectData.numberOfApplicants : ''}名</p>
                  </div>
                </div>

                <div className="flex py-5 border-b pc:gap-5 sp:gap-1 pc:items-center pc:flex-row border-gray-gray sp:flex-col sp:items-start">
                  <div className="pc:text-[16px] sp:text-[14px] sp:font-bold">主な勤務地</div>

                  <div className="text-body_sp">{`${
                    registerEventProjectData?.workplace?.prefecture ? registerEventProjectData?.workplace?.prefecture : ''
                  }${registerEventProjectData?.workplace?.city ? registerEventProjectData?.workplace?.city : ''}${
                    registerEventProjectData?.workplace?.address2 ? registerEventProjectData?.workplace?.address2 : ''
                  }`}</div>
                </div>

                <div className="flex py-5 border-b pc:gap-5 sp:gap-1 pc:items-center pc:flex-row border-gray-gray sp:flex-col sp:items-start">
                  <div className="pc:text-[16px] sp:text-[14px] sp:font-bold">勤務時間</div>
                  <div className="flex flex-col items-start gap-[1px] pc:text-body_pc sp:text-[11px]">
                    {registerEventProjectData?.officeHours.map((item, index) => (
                      <div key={index} className="pc:text-body_pc sp:text-[11px]">
                        {format(new Date(objectToDate(item.date as Timestamp)), 'yyyy/MM/dd (E)', { locale: ja }) +
                          ' ' +
                          item.start.hour +
                          ':' +
                          item.start.min +
                          '～' +
                          item.end.hour +
                          ':' +
                          item.end.min}
                      </div>
                    ))}
                    <div>{registerEventProjectData?.officeHoursNote ? registerEventProjectData.officeHoursNote : ''}</div>
                  </div>
                </div>

                <div className="flex py-5 pc:gap-5 pc:items-center pc:flex-row sp:flex-col sp:items-start sp:gap-1 ">
                  <div className="pc:text-[16px] sp:text-[14px] sp:font-bold">業務の内容</div>

                  <div className="pc:text-body_pc sp:text-[11px]">
                    {registerEventProjectData?.jobDescription ? registerEventProjectData.jobDescription : ''}
                  </div>
                </div>
              </FormSection>

              <FormSection title="希望条件" subTitle="がついている項目は募集者に公開されません" isSymbol={true}>
                <div className="flex flex-row items-center gap-5 py-5 border-b border-gray-gray">
                  <div className="flex flex-row gap-[6px] items-center pc:w-[180px] sp:w-auto">
                    <div className="pc:text-[16px] sp:text-[14px] sp:font-bold">性別</div>
                    <div>
                      <FontAwesomeIcon icon={faLock} className="w-2 -mt-[2px]" />
                    </div>
                  </div>
                  <div className="pc:text-body_pc sp:text-[11px]">{registerEventProjectData?.gender ? registerEventProjectData.gender : ''}</div>
                </div>

                <div className="flex py-5 border-b pc:gap-5 pc:items-center pc:flex-row sp:flex-col sp:items-start sp:gap-1 border-gray-gray">
                  <div className="flex flex-row gap-[6px] items-center pc:w-[180px] sp:w-auto">
                    <Label text="求める人材" requiredLabelText="任意" status={RequiredLabelType.OPTIONAL} className="pc:w-[180px] sp:w-auto" />
                  </div>
                  <div className="pc:text-body_pc sp:text-[11px]">{registerEventProjectData?.people ? registerEventProjectData.people : ''}</div>
                </div>

                <div className="flex py-5 border-b pc:gap-5 pc:items-center pc:flex-row sp:flex-col sp:items-start sp:gap-1 border-gray-gray">
                  <Label text="給与・報酬" className="pc:w-[180px] sp:w-auto" />
                  <div className="flex flex-col pc:text-body_pc sp:text-[11px]">
                    {registerEventProjectData?.salary ? registerEventProjectData.salary : ''}
                  </div>
                </div>

                <div className="flex gap-5 py-5 pc:items-center pc:flex-row sp:flex-col sp:items-start">
                  <div className="flex flex-row gap-[6px] items-center pc:w-[180px] sp:w-full">
                    <Label
                      text={'備考'}
                      requiredLabelText="任意"
                      status={RequiredLabelType.OPTIONAL}
                      className="pc:w-[180px] sp:w-auto"
                      iconComponent={<FontAwesomeIcon icon={faLock} className="w-2 -mt-[2px] ml-[6px]" />}
                    />
                  </div>
                  <div className="pc:text-body_pc sp:text-[11px]">{registerEventProjectData?.note ? registerEventProjectData.note : ''}</div>
                </div>
              </FormSection>

              <FormSection title="基本情報" subTitle="がついている項目は募集者に公開されません" isSymbol={true}>
                <div className="flex py-5 border-b pc:gap-5 pc:items-center pc:flex-row sp:flex-col sp:items-start sp:gap-1 border-gray-gray">
                  <div className="flex flex-row gap-[6px] items-center pc:w-[180px] sp:w-[120px]">
                    <Label text="担当者名" />
                    <FontAwesomeIcon icon={faLock} className="w-2 -mt-[2px]" />
                  </div>
                  <div className="flex flex-col pc:text-body_pc sp:text-[11px]">
                    <div>
                      {registerEventProjectData?.name?.sei ? registerEventProjectData?.name?.sei : ''}　
                      {registerEventProjectData?.name?.mei ? registerEventProjectData?.name?.mei : ''}
                    </div>
                    <div>
                      {registerEventProjectData?.name?.seiKana ? registerEventProjectData?.name?.seiKana : ''}　
                      {registerEventProjectData?.name?.meiKana ? registerEventProjectData?.name?.meiKana : ''}
                    </div>
                  </div>
                </div>

                <div className="flex py-5 border-b pc:gap-5 pc:items-center pc:flex-row sp:flex-col sp:items-start sp:gap-1 border-gray-gray">
                  <div className="flex flex-row gap-[6px] items-center pc:w-[180px] sp:w-full">
                    <Label
                      text={'役職'}
                      requiredLabelText="任意"
                      status={RequiredLabelType.OPTIONAL}
                      className="pc:w-[180px] sp:w-auto"
                      iconComponent={<FontAwesomeIcon icon={faLock} className="w-2 -mt-[2px] ml-[6px]" />}
                    />
                  </div>
                  <div className="pc:text-body_pc sp:text-[11px]">{registerEventProjectData?.position ? registerEventProjectData.position : ''}</div>
                </div>

                <div className="flex py-5 border-b pc:gap-5 pc:items-center pc:flex-row sp:flex-col sp:items-start sp:gap-1 border-gray-gray">
                  <div className="flex flex-row gap-[6px] items-center pc:w-[180px] sp:w-full">
                    <Label
                      text={'住所'}
                      className="pc:w-[180px] sp:w-auto"
                      iconComponent={<FontAwesomeIcon icon={faLock} className="w-2 -mt-[2px] ml-[6px]" />}
                    />
                  </div>
                  <div className="flex-col items-start pc:text-body_pc sp:text-[11px]">
                    <div>{registerEventProjectData?.address.zip ? '〒 ' + registerEventProjectData.address.zip : ''}</div>
                    <div>{registerEventProjectData?.address.prefecture ? registerEventProjectData.address.prefecture : ''}</div>
                    <div>{registerEventProjectData?.address.city ? registerEventProjectData.address.city : ''}</div>
                    <div>{registerEventProjectData?.address.address1 ? registerEventProjectData.address.address1 : ''}</div>
                    <div>{registerEventProjectData?.address.address2 ? registerEventProjectData.address.address2 : ''}</div>
                  </div>
                </div>

                <div className="flex py-5 border-b pc:gap-5 pc:items-center pc:flex-row sp:flex-col sp:items-start sp:gap-1 border-gray-gray">
                  <div className="flex flex-row gap-[6px] items-center pc:w-[180px] sp:w-full">
                    <Label
                      text={'電話番号'}
                      className="pc:w-[180px] sp:w-auto"
                      iconComponent={<FontAwesomeIcon icon={faLock} className="w-2 -mt-[2px] ml-[6px]" />}
                    />
                  </div>
                  <div className="pc:text-body_pc sp:text-[11px]">
                    {registerEventProjectData?.phoneNumber ? registerEventProjectData.phoneNumber : ''}
                  </div>
                </div>

                <div className="flex py-5 pc:gap-5 pc:items-center pc:flex-row sp:flex-col sp:items-start sp:gap-1">
                  <div className="flex flex-row gap-[6px] items-center pc:w-[180px] sp:w-full">
                    <Label
                      text={'メールアドレス'}
                      className="pc:w-[180px] sp:w-auto"
                      iconComponent={<FontAwesomeIcon icon={faLock} className="w-2 -mt-[2px] ml-[6px]" />}
                    />
                  </div>
                  <div className="pc:text-body_pc sp:text-[11px]">{registerEventProjectData?.email ? registerEventProjectData.email : ''}</div>
                </div>
              </FormSection>
            </div>

            <div className="flex flex-col items-center gap-10">
              <div className="flex items-start pc:gap-10 pc:flex-row sp:flex-col sp:gap-3 sp:items-center">
                {isClient && (
                  <PDFDownloadLink
                    document={<EventPdfPage data={registerEventProjectData!} prefectureName={prefectureName} />}
                    fileName={`bosyuirai_${format(new Date(), 'yyyyMMddHHmm')}.pdf`}
                  >
                    <Button
                      text="PDFダウンロード"
                      onclick={() => {}}
                      className=" px-[37px] py-[6.5px]"
                      shape={ButtonShape.RECTANGLE}
                      type={ButtonType.SECONDARY}
                      color={ButtonColor.SUB}
                    />
                  </PDFDownloadLink>
                )}
                <Button
                  text="編集する"
                  onclick={() => {
                    Router.back()
                  }}
                  className=" px-[65px] py-[6.5px]"
                  shape={ButtonShape.RECTANGLE}
                  type={ButtonType.SECONDARY}
                  color={ButtonColor.SUB}
                />
              </div>
              <div className="flex flex-col items-center gap-1 pc:text-body_pc sp:text-[12px]">
                <div className="whitespace-nowrap">内容をご確認のうえ送信してください。</div>
                <div className="flex pc:flex-row gap-[6px] pc:items-start sp:flex-col sp:items-center">
                  <div className="whitespace-nowrap">募集依頼を送信すると, </div>
                  <Link
                    href="https://www.notion.so/f239b86c1e2f4d9dbd2e4bb642f34377?pvs=4"
                    target="_blank"
                    className="border-b whitespace-nowrap text-core-blue border-core-blue"
                  >
                    個人情報の取り扱い
                  </Link>
                  <div className="whitespace-nowrap">について同意したものとみなされます。</div>
                </div>
              </div>
              <Button text="募集依頼を送信する" onclick={() => completeForm()} className=" px-[60px] py-[16.5px]" shape={ButtonShape.ELLIPSE} />
            </div>
          </div>
        </div>
      </SchoolLayout>
    </div>
  )
}
