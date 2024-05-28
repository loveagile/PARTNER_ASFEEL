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
import Router from 'next/router'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { useEffect, useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import ProjectPdfPage from '../project-pdf'
import { format } from 'date-fns'
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
      {/* info section  */}
      <div className="flex flex-col pc:px-10 sp:px-3">{children}</div>
    </div>
  )
}

export default function Page() {
  const [registerLeadersEventProjectData, setRegisterLeadersEventProjectData] = useState<LeadersWantedProject | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      let tmpRegisterData = localStorage.getItem(LOCAL_STORAGE_KEY.leadersProject)
      if (!tmpRegisterData) {
        tmpRegisterData = createEmptyRegisterLeadersWantedProjectToken()
      }

      const decryptedData = decrypt(tmpRegisterData)
      const parsedData = JSON.parse(decryptedData) as LeadersWantedProject
      setRegisterLeadersEventProjectData(parsedData)
    }
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

  const view = useView()

  const downloadPDF = async () => {
    // Convert HTML element to canvas
    const html = document.getElementById('pdf_part')!
    // Retrieve the innerHTML data
    const innerHTML = html.innerHTML

    // Remove SVG tags using a regular expression
    let sanitizedHTML = innerHTML.replace(/<svg\b[^>]*>(.*?)<\/svg>/gi, '')
    // sanitizedHTML = sanitizedHTML.replace(/rounded-[3px] py-[2px] px-[6px] h-full text-mini text-gray-white whitespace-nowrap  bg-gray-gray_dark /g, '')
    sanitizedHTML = sanitizedHTML.replace(/<div\b[^>]*>任意<\/div>/gi, '')
    html.innerHTML = sanitizedHTML

    const thElements = html.querySelectorAll('th.h-5')

    // Iterate over each <th> element and update the class attribute
    thElements.forEach((thElement) => {
      thElement.classList.remove('h-5')
      thElement.classList.add('h-8')
    })

    console.log('html here', html)

    const canvas = await html2canvas(html)

    html.innerHTML = innerHTML

    // Create a new PDF document
    const pdf = new jsPDF()

    // Add the canvas to the PDF
    const imgData = canvas.toDataURL('image/jpeg', 1.0)

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height

    let width = pdfWidth
    let height = (imgHeight * pdfWidth) / imgWidth

    if (height > pdfHeight) {
      height = pdfHeight
      width = (imgWidth * pdfHeight) / imgHeight
    }

    pdf.addImage({
      imageData: imgData,
      format: 'JPEG',
      x: (pdfWidth - width) / 2,
      y: (pdfHeight - height) / 2,
      width: width,
      height: canvas.height / (canvas.width / width) - 15,
    })

    pdf.save('your-file.pdf')
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
                    {/* <p>牛目市立大森学園</p> */}
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
                      {/* 週2日程度 / 授業がある平日(月・水・金のシフト制)
                      <br />
                      ※月に2回は土日祝日の練習および試合あり */}
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
                    {/* {eligibilityPreferences.map((item, index) => (
                      <div key={index} className="flex flex-row items-center">
                        <div className="w-1 h-1 mr-1 rounded-full bg-gray-black"></div>
                        <div>{item}</div>
                      </div>
                    ))} */}
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
                    <div>{registerLeadersEventProjectData?.name?.sei ? registerLeadersEventProjectData?.name?.sei : ''}</div>
                    <div>{registerLeadersEventProjectData?.name?.mei ? registerLeadersEventProjectData?.name?.mei : ''}</div>
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
            </div>
          </div>
        </div>
      </SchoolLayout>
    </div>
  )
}
