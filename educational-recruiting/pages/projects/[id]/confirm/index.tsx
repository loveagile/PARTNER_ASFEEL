import { Label, RequiredLabelType } from '@/components/atoms'
import BackButton from '@/components/atoms/Button/BackButton'
import Button, { ButtonColor, ButtonShape, ButtonType } from '@/components/atoms/Button/Button'
import SchoolLayout from '@/components/layouts/SchoolLayout'
import Schedule from '@/components/molecules/Table/Schedule'
import { useView } from '@/hooks'
import { LeadersWantedProject } from '@/models'
import { createEmptyRegisterLeadersWantedProjectToken, decrypt } from '@/utils/token'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import ProjectPdfPage from './project-pdf'
import { format } from 'date-fns'
import { serverTimestamp } from 'firebase/firestore'
import { getSubDomain } from '@/utils/common'
import { generateDocId } from '@/libs/firebase/firestore'
import { setLeadersWantedProject } from '@/firebase/leadersWantedProject'
import useSystemName from '@/hooks/useSystemName'
import { LOCAL_STORAGE_KEY } from '@/constants/constant_text'

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
      <div className="flex flex-col pc:px-10 sp:px-3">{children}</div>
    </div>
  )
}

export default function Page() {
  const view = useView()
  const { logoWithoutNewLine } = useSystemName()
  const [isClient, setIsClient] = useState(false)
  const [registerLeadersEventProjectData, setRegisterLeadersEventProjectData] = useState<LeadersWantedProject | null>(null)

  useEffect(() => {
    setIsClient(true)
    const projectData = localStorage.getItem(LOCAL_STORAGE_KEY.leadersProject) || createEmptyRegisterLeadersWantedProjectToken()
    const decryptedProjectData = JSON.parse(decrypt(projectData)) as LeadersWantedProject
    setRegisterLeadersEventProjectData({
      ...decryptedProjectData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    console.log('decryptedProjectData', decryptedProjectData)
  }, [])

  const scheduleInfo = {
    monday: ['pm'],
    tuesday: [],
    wednesday: ['pm'],
    thursday: [],
    friday: ['pm'],
    saturday: ['am', 'pm'],
    sunday: ['am'],
  }

  const completeForm = async () => {
    if (!registerLeadersEventProjectData) return

    try {
      const docId = generateDocId()
      await setLeadersWantedProject(docId, registerLeadersEventProjectData)
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectData: registerLeadersEventProjectData,
          type: 'project',
          from: getSubDomain(),
          systemName: logoWithoutNewLine,
        }),
      })

      if (response.ok) {
        localStorage.setItem('project_completed', 'completed')
        Router.push('/projects/new/confirm/send-complete-popup')
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
                Router.push('/')
              }}
            />
          </div>
          <div className="flex flex-col items-center py-10 gap-10 sp:px-[20px] max-w-[880px] m-auto pc:px-0">
            <div id="pdf_part" className="flex flex-col items-center gap-10">
              <div className="text-h1">募集依頼内容入力</div>
              <FormSection title="学校・チーム情報" subTitle="※学校・チーム名はスカウトした候補者のみに提示されます" isSymbol={false}>
                <div className="flex flex-col items-start py-5 gap-[6px] border-b border-gray-gray">
                  <div className="flex flex-row items-center pc:gap-[10px] sp:gap-[2px] pc:text-h1 sp:text-[16px] sp:font-bold">
                    <p>{registerLeadersEventProjectData?.organizationName ? registerLeadersEventProjectData?.organizationName : ''}</p>
                    <p>/</p>
                    <p>{registerLeadersEventProjectData?.eventName ? registerLeadersEventProjectData?.eventName : ''}</p>
                    <p>{registerLeadersEventProjectData?.gender ? registerLeadersEventProjectData?.gender : ''}</p>
                  </div>
                  <div className="flex flex-row items-center gap-[10px] pc:text-h2 sp:text-[14px]">
                    <p>募集人数</p>
                    <p>:</p>
                    <p>{registerLeadersEventProjectData?.recruitment ? registerLeadersEventProjectData?.recruitment : ''}名</p>
                  </div>
                </div>

                <div className="flex py-5 border-b pc:gap-5 sp:gap-1 pc:items-center pc:flex-row border-gray-gray sp:flex-col sp:items-start">
                  <Label text="募集依頼先" className="pc:w-[180px] sp:w-[120px]" />
                  <div className="text-body_sp">
                    {registerLeadersEventProjectData?.applyForProject ? registerLeadersEventProjectData?.applyForProject : ''}
                  </div>
                </div>

                <div className="flex py-5 border-b pc:gap-5 sp:gap-1 pc:items-center pc:flex-row border-gray-gray sp:flex-col sp:items-start">
                  <Label text="主な勤務地" className="pc:w-[180px] sp:w-[120px]" />
                  <div className="text-body_sp">{`${
                    registerLeadersEventProjectData?.workplace?.prefecture ? registerLeadersEventProjectData?.workplace?.prefecture : ''
                  }${registerLeadersEventProjectData?.workplace?.city ? registerLeadersEventProjectData?.workplace?.city : ''}${
                    registerLeadersEventProjectData?.workplace?.address2 ? registerLeadersEventProjectData?.workplace?.address2 : ''
                  }`}</div>
                </div>

                <div className="flex py-5 border-b pc:gap-5 sp:gap-1 pc:items-center pc:flex-row border-gray-gray sp:flex-col sp:items-start">
                  <Label text="勤務時間" className="pc:w-[180px] sp:w-auto" />
                  <div className="flex flex-col gap-[10px] items-start">
                    <Schedule
                      schedule={registerLeadersEventProjectData?.workingHours ? registerLeadersEventProjectData?.workingHours : scheduleInfo}
                      size={view == 'PC' ? 'default' : 'mini'}
                    />
                    <div className="text-body_sp">
                      {registerLeadersEventProjectData?.workingHoursNote ? registerLeadersEventProjectData?.workingHoursNote : ''}
                    </div>
                  </div>
                </div>

                <div className="flex py-5 pc:gap-5 pc:items-center pc:flex-row sp:flex-col sp:items-start sp:gap-1 ">
                  <Label text="活動の紹介" className="pc:w-[180px] sp:w-[120px]" />
                  <div className="text-body_sp">
                    {registerLeadersEventProjectData?.activityDescription ? registerLeadersEventProjectData?.activityDescription : ''}
                  </div>
                </div>
              </FormSection>

              <FormSection title="希望条件" subTitle="がついている項目は募集者に公開されません" isSymbol={true}>
                <div className="flex flex-row items-center gap-5 py-5 border-b border-gray-gray">
                  <div className="flex flex-row gap-[6px] items-center pc:w-[180px] sp:w-auto">
                    <Label text="性別" />
                    <FontAwesomeIcon icon={faLock} className="w-2 -mt-[2px]" />
                  </div>
                  <div className="text-body_sp">{registerLeadersEventProjectData?.gender ? registerLeadersEventProjectData?.gender : ''}</div>
                </div>

                <div className="flex flex-row items-center gap-5 py-5 border-b border-gray-gray">
                  <div className="flex flex-row gap-[6px] items-center pc:w-[180px] sp:w-auto">
                    <Label text="年齢" />
                    <FontAwesomeIcon icon={faLock} className="w-2 -mt-[2px]" />
                  </div>
                  <div className="text-body_sp">
                    {registerLeadersEventProjectData?.desiredAge ? registerLeadersEventProjectData?.desiredAge.join(', ') : ''}
                  </div>
                </div>

                <div className="flex py-5 border-b pc:gap-5 pc:items-center pc:flex-row sp:flex-col sp:items-start sp:gap-1 border-gray-gray">
                  <Label text="資格に関する希望" requiredLabelText="任意" status={RequiredLabelType.OPTIONAL} className="pc:w-[180px] sp:w-auto" />
                  <div className="text-body_sp">
                    {registerLeadersEventProjectData?.desiredTalent ? registerLeadersEventProjectData?.desiredTalent : ''}
                  </div>
                </div>

                <div className="flex py-5 border-b pc:gap-5 pc:items-center pc:flex-row sp:flex-col sp:items-start sp:gap-1 border-gray-gray">
                  <Label text="求める人材" requiredLabelText="任意" status={RequiredLabelType.OPTIONAL} className="pc:w-[180px] sp:w-auto" />
                  <div className="text-body_sp">
                    {registerLeadersEventProjectData?.desiredQualifications ? registerLeadersEventProjectData?.desiredQualifications : ''}
                  </div>
                </div>

                <div className="flex py-5 border-b pc:gap-5 pc:items-center pc:flex-row sp:flex-col sp:items-start sp:gap-1 border-gray-gray">
                  <Label text="給与・報酬" requiredLabelText="任意" status={RequiredLabelType.OPTIONAL} className="pc:w-[180px] sp:w-auto" />
                  <div className="text-body_sp">
                    {registerLeadersEventProjectData?.desiredSalary ? registerLeadersEventProjectData?.desiredSalary : ''}
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
                  <div className="text-body_sp">
                    {registerLeadersEventProjectData?.desiredNote ? registerLeadersEventProjectData?.desiredNote : ''}
                  </div>
                </div>
              </FormSection>

              <FormSection title="基本情報" subTitle="がついている項目は募集者に公開されません" isSymbol={true}>
                <div className="flex py-5 border-b pc:gap-5 pc:items-center pc:flex-row sp:flex-col sp:items-start sp:gap-1 border-gray-gray">
                  <div className="flex flex-row gap-[6px] items-center pc:w-[180px] sp:w-[120px]">
                    <Label text="担当者名" />
                    <FontAwesomeIcon icon={faLock} className="w-2 -mt-[2px]" />
                  </div>
                  <div className="flex flex-col text-body_sp">
                    <div>
                      {registerLeadersEventProjectData?.name?.sei ? registerLeadersEventProjectData?.name?.sei : ''}　
                      {registerLeadersEventProjectData?.name?.mei ? registerLeadersEventProjectData?.name?.mei : ''}
                    </div>
                    <div>
                      {registerLeadersEventProjectData?.name?.seiKana ? registerLeadersEventProjectData?.name?.seiKana : ''}　
                      {registerLeadersEventProjectData?.name?.meiKana ? registerLeadersEventProjectData?.name?.meiKana : ''}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-center gap-5 py-5 border-b border-gray-gray">
                  <Label text="役職" requiredLabelText="任意" status={RequiredLabelType.OPTIONAL} className="pc:w-[180px] sp:w-auto" />
                  <div className="text-body_sp">{registerLeadersEventProjectData?.position ? registerLeadersEventProjectData?.position : ''}</div>
                </div>

                <div className="flex py-5 border-b pc:gap-5 pc:items-center pc:flex-row sp:flex-col sp:items-start sp:gap-1 border-gray-gray">
                  <div className="flex flex-row gap-[6px] items-center pc:w-[180px] sp:w-full">
                    <Label
                      text={'電話番号'}
                      requiredLabelText="任意"
                      status={RequiredLabelType.OPTIONAL}
                      className="pc:w-[180px] sp:w-auto"
                      iconComponent={<FontAwesomeIcon icon={faLock} className="w-2 -mt-[2px] ml-[6px]" />}
                    />
                  </div>
                  <div className="text-body_sp">
                    {registerLeadersEventProjectData?.phoneNumber ? registerLeadersEventProjectData?.phoneNumber : ''}
                  </div>
                </div>

                <div className="flex py-5 pc:gap-5 pc:items-center pc:flex-row sp:flex-col sp:items-start sp:gap-1">
                  <div className="flex flex-row gap-[6px] items-center pc:w-[180px] sp:w-full">
                    <Label
                      text={'メールアドレス'}
                      requiredLabelText="任意"
                      status={RequiredLabelType.OPTIONAL}
                      className="pc:w-[180px] sp:w-auto"
                      iconComponent={<FontAwesomeIcon icon={faLock} className="w-2 -mt-[2px] ml-[6px]" />}
                    />
                  </div>
                  <div className="text-body_sp">{registerLeadersEventProjectData?.email ? registerLeadersEventProjectData?.email : ''}</div>
                </div>
              </FormSection>
            </div>

            <div className="flex flex-col items-center gap-10">
              <div className="flex items-start pc:gap-10 pc:flex-row sp:flex-col sp:gap-3 sp:items-center">
                {isClient && (
                  <PDFDownloadLink
                    document={<ProjectPdfPage data={registerLeadersEventProjectData!} />}
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
              <div className="flex flex-col items-center gap-1 pc:text-body_pc sp:text-[14px]">
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
