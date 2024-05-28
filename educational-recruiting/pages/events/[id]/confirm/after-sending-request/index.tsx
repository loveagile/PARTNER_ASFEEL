import { Label, RequiredLabelType } from '@/components/atoms'
import BackButton from '@/components/atoms/Button/BackButton'
import Button, { ButtonColor, ButtonShape, ButtonType } from '@/components/atoms/Button/Button'
import SchoolLayout from '@/components/layouts/SchoolLayout'
import { EventProject } from '@/models'
import { useAppSelector } from '@/store'
import { objectToDate } from '@/utils/common'
import { createEmptyRegisterEventProjectToken, decrypt } from '@/utils/token'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import EventPdfPage from '../project-pdf'
import { Timestamp } from 'firebase/firestore'

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
  const [registerEventProjectData, setRegisterEventProjectData] = useState<EventProject | null>(null)
  const { prefectureList } = useAppSelector((state) => state.global)
  const [prefectureName, setPrefectureName] = useState<string>('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      let tmpRegisterData = localStorage.getItem('reg_event_project')
      if (!tmpRegisterData) {
        tmpRegisterData = createEmptyRegisterEventProjectToken()
      }

      const decryptedData = decrypt(tmpRegisterData)
      const parsedData = JSON.parse(decryptedData) as EventProject
      setRegisterEventProjectData(parsedData)

      const index = prefectureList.findIndex((element) => element.id == parsedData.workplace.prefecture)
      if (index != -1) setPrefectureName(prefectureList[index].prefecture)
    }
  }, [])

  // change this to dynamic variables
  const organizer = '○○市民マラソン大会実行委員会'
  const school1 = '山有学院大学'
  const school2 = '鶴科学大学'
  const numberOfPeople = 20
  const location = '弥生県牛目市梅雨田区'
  const workHours = [
    {
      date: '2023/3/18(土)',
      startHour: '9',
      startMinute: '00',
      endHour: '17',
      endMinute: '00',
    },
    {
      date: '2023/3/18(土)',
      startHour: '9',
      startMinute: '00',
      endHour: '17',
      endMinute: '00',
    },
  ]
  const businessContent = ['来場者の誘導', '受付', '検温　など']
  const gender = 'どちらでも'
  const personnelSought = '屋外イベントになりますので、体力に自信のある方が望ましいです'
  const salary = ['時給1,100円', '交通費全額支給']
  const remarks = '体力が必要ですので、運動部系の学生が望ましいです'
  const firstName = '斉藤　真吾'
  const secondName = 'サイトウ　シンゴ'
  const post = '大会長'
  const address = ['〒 123-4567', '弥生県', '牛目市梅雨田区', '1丁目2-3', '恩田マンション123']
  const phone = '0312345678'
  const mail = 'example@mail.com'

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
                  <div className="pc:text-h2 sp:text-[14px] sp:font-bold">主な勤務地</div>
                  {/* <Label
                    text="主な勤務地"
                    className="pc:w-[180px] sp:w-[120px]"
                  /> */}
                  <div className="text-body_sp">{`${
                    registerEventProjectData?.workplace?.prefecture ? registerEventProjectData?.workplace?.prefecture : ''
                  }${registerEventProjectData?.workplace?.city ? registerEventProjectData?.workplace?.city : ''}${
                    registerEventProjectData?.workplace?.address1 ? registerEventProjectData?.workplace?.address1 : ''
                  }`}</div>
                  {/* <div className="pc:text-body_pc sp:text-[11px]">{location}</div> */}
                </div>

                <div className="flex py-5 border-b pc:gap-5 sp:gap-1 pc:items-center pc:flex-row border-gray-gray sp:flex-col sp:items-start">
                  <div className="pc:text-h2 sp:text-[14px] sp:font-bold">勤務時間</div>
                  {/* <Label text="勤務時間" className="pc:w-[180px] sp:w-[120px]" /> */}
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
                  <div className="pc:text-h2 sp:text-[14px] sp:font-bold">業務の内容</div>
                  {/* <Label
                    text="業務の内容"
                    className="pc:w-[180px] sp:w-[120px]"
                  /> */}
                  <div className="pc:text-body_pc sp:text-[11px]">
                    {registerEventProjectData?.jobDescription ? registerEventProjectData.jobDescription : ''}
                    {/* {businessContent.map((item, index) => (
                      <div key={index} className="flex flex-row items-center">
                        <div className="w-1 h-1 mr-1 rounded-full bg-gray-black"></div>
                        <div>{item}</div>
                      </div>
                    ))} */}
                  </div>
                </div>
              </FormSection>

              <FormSection title="希望条件" subTitle="がついている項目は募集者に公開されません" isSymbol={true}>
                <div className="flex flex-row items-center gap-5 py-5 border-b border-gray-gray">
                  <div className="flex flex-row gap-[6px] items-center pc:w-[180px] sp:w-auto">
                    <div className="pc:text-h2 sp:text-[14px] sp:font-bold">性別</div>
                    {/* <Label text="性別" /> */}
                    <div>
                      <FontAwesomeIcon icon={faLock} className="w-2 -mt-[2px]" />
                    </div>
                  </div>
                  <div className="pc:text-body_pc sp:text-[11px]">{registerEventProjectData?.gender ? registerEventProjectData.gender : ''}</div>
                </div>

                <div className="flex py-5 border-b pc:gap-5 pc:items-center pc:flex-row sp:flex-col sp:items-start sp:gap-1 border-gray-gray">
                  <div className="flex flex-row gap-[6px] items-center pc:w-[180px] sp:w-auto">
                    {/* <div className="pc:text-h2 sp:text-[14px] sp:font-bold">
                    求める人材
                    </div> */}
                    <Label text="求める人材" requiredLabelText="任意" status={RequiredLabelType.OPTIONAL} className="pc:w-[180px] sp:w-auto" />
                  </div>
                  <div className="pc:text-body_pc sp:text-[11px]">{registerEventProjectData?.people ? registerEventProjectData.people : ''}</div>
                </div>

                <div className="flex py-5 border-b pc:gap-5 pc:items-center pc:flex-row sp:flex-col sp:items-start sp:gap-1 border-gray-gray">
                  <Label text="給与・報酬" className="pc:w-[180px] sp:w-auto" />
                  <div className="flex flex-col pc:text-body_pc sp:text-[11px]">
                    {/* {salary.map((item, index) => (
                      <div key={index}> {item}</div>
                    ))} */}
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
                    <div>{registerEventProjectData?.workplace.zip ? '〒 ' + registerEventProjectData.workplace.zip : ''}</div>
                    <div>{prefectureName}</div>
                    <div>{registerEventProjectData?.workplace.city ? registerEventProjectData.workplace.city : ''}</div>
                    <div>{registerEventProjectData?.workplace.address1 ? registerEventProjectData.workplace.address1 : ''}</div>
                    <div>{registerEventProjectData?.workplace.address2 ? registerEventProjectData.workplace.address2 : ''}</div>

                    {/* {address.map((item, index) => (
                      <div key={index}>{item}</div>
                    ))} */}
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
            </div>
          </div>
        </div>
      </SchoolLayout>
    </div>
  )
}
