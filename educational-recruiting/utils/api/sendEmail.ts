const dayMapping: { [key: string]: string } = {
  monday: '月曜日',
  tuesday: '火曜日',
  wednesday: '水曜日',
  thursday: '木曜日',
  friday: '金曜日',
  saturday: '土曜日',
  sunday: '日曜日',
}

const timeMapping: { [key: string]: string } = {
  am: '午前',
  pm: '午後',
}

/**
 * 働く時間を文字列に変換する
 */
export const workingHoursStr = (workingHoursData: { [key: string]: string[] }) => {
  let workingHoursHTML = '<div>'
  let daysHTML: string[] = []

  for (let day of Object.keys(workingHoursData)) {
    const times = workingHoursData[day].map((time) => timeMapping[time]).join('/')
    if (times) {
      daysHTML.push(`${dayMapping[day]}（${times}）`)
    }
  }

  for (let i = 0; i < daysHTML.length; i++) {
    const day1HTML = daysHTML[i]
    const day2HTML = daysHTML[i + 1] || ''
    if (day2HTML) {
      workingHoursHTML += `<p>${day1HTML}, ${day2HTML}</p>`
      i++ // skip the next day because it's already processed
    } else {
      workingHoursHTML += `<p>${day1HTML}</p>`
    }
  }

  workingHoursHTML += '</div>'
  return workingHoursHTML
}

/**
 * 指導者募集用のメールHTMLを作成する
 */
export const dataToProjectEmailHTML = (fromEmail: string, data: any) => {
  const {
    organizationName,
    applyForProject,
    gender,
    recruitment,
    workplace,
    workingHours,
    workingHoursNote,
    activityDescription,

    desiredGender,
    desiredAge,
    desiredQualifications,
    desiredTalent,
    desiredSalary,
    desiredNote,

    name,
    position,
    phoneNumber,
    email,
  } = data.projectData

  const { prefecture, city, address2 } = workplace
  const workingHoursHTML = workingHoursStr(workingHours)

  const emailHtml = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>スポカル 募集依頼</title>
        <style>
            h4 {
              margin-bottom: 0;
            }
            p {
                margin: 0.5em 0;
            }
        </style>
    </head>
    <body style="font-family: 'Noto Sans', Arial, sans-serif; padding: 20px;">        
        <hr>
        <p>このメールはスポカルから配信されています</p>
        <hr>

        <br>
        <p>このたびはスポカルをご利用いただきありがとうございます。</p>
        <p>以下の内容で募集依頼を送信しました。</p>

        <h4>＜募集内容＞</h4>
        <p>団体名：${organizationName}</p>
        <p>募集申請先：${applyForProject}</p>
        <p>男女区分：${gender}</p>
        <p>募集人数：${recruitment}</p>
        <p>勤務地：${prefecture}${city}${address2}</p>
        <p>勤務時間：</p>
        ${workingHoursHTML}
        <p>勤務時間の補足：${workingHoursNote}</p>
        <p>活動内容：${activityDescription}</p>
        
        <h4>＜希望条件＞</h4> 
        <p>性別：${desiredGender}</p>
        <p>年齢：${desiredAge.join(', ')}</p>
        <p>資格に関する希望：${desiredQualifications}</p>
        <p>求める人材：${desiredTalent}</p>
        <p>給与・報酬：${desiredSalary}</p>
        <p>備考：${desiredNote}</p>

        <h4>＜基本情報＞ (※掲載されません)</h4>
        <p>担当者名: ${name.sei} ${name.mei}（${name.seiKana} ${name.meiKana}）</p>
        <p>役職: ${position}</p>
        <p>電話番号: ${phoneNumber}</p>
        <p>メールアドレス: ${email}</p>

        <br>
        <p>掲載が完了しましたらメールでご連絡いたします。</p>
        <p>不備等がありましたらコーディネーターよりご連絡を差し上げます。</p>
        <br>

        <hr>
        <h4>お問い合わせ</h4>
        <p>${applyForProject}</p>
        <p>${fromEmail}</p>
        <hr>

        <br>
        <p>このメールは送信専用メールアドレスから配信されています。</p>
        <p>このメールにご返信いただくことはできませんのでご了承ください。</p>
        <br>
    </body>
    </html>
  `

  return emailHtml
}

type TimeSlot = {
  date: {
    seconds: number
    nanoseconds: number
  }
  start: {
    hour: string
    min: string
  }
  end: {
    hour: string
    min: string
  }
}

/**
 * 働く時間を文字列に変換する
 */
const formatTimeSlots = (timeSlots: TimeSlot[]): string => {
  let formattedOutput = ''

  for (const timeSlot of timeSlots) {
    // Convert the UNIX timestamp to a Date object
    const date = new Date(timeSlot.date.seconds * 1000)

    // Convert the Date object to the specified string format
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]

    // Create the start and end time strings
    const startTime = `${timeSlot.start.hour}:${timeSlot.start.min}`
    const endTime = `${timeSlot.end.hour}:${timeSlot.end.min}`

    formattedOutput += `<p>${year}/${month}/${day} (${dayOfWeek}) ${startTime}～${endTime}</p>`
  }

  return formattedOutput
}

/**
 * イベント募集用のメールHTMLを作成する
 */
export const dataToEventEmailHTML = (fromEmail: string, data: any) => {
  const {
    title,
    subTitle,
    organizer,
    schoolName,
    numberOfApplicants,
    workplace,
    officeHours,
    officeHoursNote,
    jobDescription,
    gender,
    people,
    salary,
    note,
    name,
    position,
    address,
    phoneNumber,
    email,
  } = data.projectData

  const { prefecture, city, address2 } = workplace
  const workingHoursHTML = formatTimeSlots(officeHours)
  console.log(JSON.stringify(officeHours))

  const emailHtml = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>スポカル 募集依頼</title>
        <style>
            h4 {
              margin-bottom: 0;
            }
            p {
                margin: 0.5em 0;
            }
        </style>
    </head>
    <body style="font-family: 'Noto Sans', Arial, sans-serif; padding: 20px;">        
        <hr>
        <p>このメールはスポカルから配信されています</p>
        <hr>

        <br>
        <p>このたびはスポカルをご利用いただきありがとうございます。</p>
        <p>以下の内容で募集依頼を送信しました。</p>

        <h4>＜募集内容＞</h4>
        <p>イベント：${title}</p>
        <p>主催団体：${organizer}</p>
        <p>募集を申請する学校：${schoolName.join(', ')}</p>
        <p>募集人数：${numberOfApplicants}</p>
        <p>勤務地：${prefecture}${city}${address2}</p>
        <p>勤務時間：</p>
        ${workingHoursHTML}
        <p>業務内容：${jobDescription}</p>
        
        <h4>＜希望条件＞</h4> 
        <p>性別：${gender}</p>
        <p>求める人材：${people}</p>
        <p>給与・報酬：${salary}</p>
        <p>備考：${note}</p>

        <h4>＜基本情報＞ (※掲載されません)</h4>
        <p>担当者名: ${name.sei} ${name.mei}（${name.seiKana} ${name.meiKana}）</p>
        <p>役職: ${position}</p>
        <p>住所: ${address.prefecture}${address.city}${address.address2}</p>
        <p>電話番号: ${phoneNumber}</p>
        <p>メールアドレス: ${email}</p>

        <br>
        <p>掲載が完了しましたらメールでご連絡いたします。</p>
        <p>不備等がありましたらコーディネーターよりご連絡を差し上げます。</p>
        <br>

        <hr>
        <h4>お問い合わせ</h4>
        <p>${fromEmail}</p>
        <hr>

        <br>
        <p>このメールは送信専用メールアドレスから配信されています。</p>
        <p>このメールにご返信いただくことはできませんのでご了承ください。</p>
        <br>
    </body>
    </html>
  `

  return emailHtml
}
