'use client'
import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'

import { createTw } from 'react-pdf-tailwind'
import { LeadersWantedProject } from '@/models'

Font.register({
  family: 'Noto Sans JP, sans-serif;',
  src: '/fonts/notosan/static/NotoSansJP-Regular.ttf',
})

const tw = createTw({
  theme: {
    extend: {
      colors: {
        primary: 'cornflowerblue',
      },
      fontFamily: {
        notojp: ['Noto Sans', 'sans-serif'],
      },
    },
  },
})

const styles = StyleSheet.create({
  page: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    maxWidth: '800px',
    fontFamily: 'Noto Sans JP, sans-serif;',
  },
  headerContent: {
    marginBottom: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    columnGap: 16,
    rowGap: 16,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableCell: {
    width: '50%',
    paddingRight: 10,
  },
  image: {
    width: 15,
    height: 15,
  },
  lockImage: {
    width: 15,
    height: 15,
    marginTop: 3,
  },
  gap1: {
    gap: 4,
  },
  gap2: {
    gap: 8,
  },
  gap3: {
    gap: 12,
  },
  rowGap1: {
    rowGap: 4,
  },
  rowGap2: {
    rowGap: 8,
  },
  rowGap3: {
    rowGap: 12,
  },
  colGap1: {
    columnGap: 4,
  },
  colGap2: {
    columnGap: 8,
  },
  colGap3: {
    columnGap: 12,
  },
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
  colorGray: {
    color: 'gray',
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: '100%',
    backgroundColor: 'dimgrey',
  },
})

const japaneseDays = ['', '月', '火', '水', '木', '金', '土', '日']

const ProjectPdfPage = ({ data }: { data: LeadersWantedProject }) => {
  const getStatus = (activity: string[]) => {
    const ans: number[] = [0, 0]
    for (let i = 0; i < activity.length; i++) {
      if (activity[i] === 'am') ans[0] = 1
      if (activity[i] === 'pm') ans[1] = 1
    }
    return ans
  }

  const hours = []
  if (data?.workingHours) {
    hours.push(getStatus(data?.workingHours?.monday))
    hours.push(getStatus(data?.workingHours?.tuesday))
    hours.push(getStatus(data?.workingHours?.wednesday))
    hours.push(getStatus(data?.workingHours?.thursday))
    hours.push(getStatus(data?.workingHours?.friday))
    hours.push(getStatus(data?.workingHours?.saturday))
    hours.push(getStatus(data?.workingHours?.sunday))
  }

  return (
    <Document>
      <Page size="A4" style={[styles.page]}>
        <View style={{ ...tw(`flex flex-col items-center gap-10 text-[#3D3D3D]`) }}>
          <View>
            <Text style={{ ...tw(`text-[24px] font-bold`) }}>募集依頼内容入力</Text>
          </View>

          <View style={{ ...tw(`flex flex-col border rounded-[10px] bg-[#FDFDFD] border-[#D8D8D8] w-full`) }}>
            <View style={{ ...tw(`flex flex-row items-center w-full gap-5 px-5 py-3 bg-[#E5F4FF] rounded-t-[10px]`) }}>
              <Text style={{ ...tw(`text-[14px] text-[#307DC1]`) }}>学校・チーム情報</Text>
              <Text style={{ ...tw(`text-sm flex gap-[2px]`) }}>※学校・チーム名はスカウトした候補者のみに提示されます</Text>
            </View>
            {/* info section  */}
            <View style={{ ...tw(`flex flex-col px-10`) }}>
              <View style={{ ...tw(`flex flex-col items-start py-5 gap-[6px] border-b border-[#D8D8D8]`) }}>
                <View style={{ ...tw(`flex flex-row items-center gap-[10px] text-[24px]`) }}>
                  {/* <Text>牛目市立大森学園</Text> */}
                  <Text>{data?.organizationName ? data?.organizationName : ''}</Text>
                  <Text>/</Text>
                  <Text>{data?.eventName ? data?.eventName : ''}</Text>
                  {/* <Text>サッカー</Text> */}
                  {/* <Text>男子</Text> */}
                  <Text>{data?.gender ? data?.gender : ''}</Text>
                </View>
                <View style={{ ...tw(`flex flex-row items-center gap-[10px] text-[20px]`) }}>
                  <Text>募集人数</Text>
                  <Text>:</Text>
                  <Text>{data?.recruitment ? data?.recruitment : ''}名</Text>
                </View>
              </View>

              <View style={{ ...tw(`flex py-5 border-b gap-5 items-center flex-row border-[#D8D8D8]`) }}>
                <View style={{ ...tw(`flex flex-row justify-between items-center gap-5 w-[180px]`) }}>
                  <Text style={{ ...tw(`flex items-center text-[14px] text-[#3D3D3D]`) }}>募集依頼先</Text>
                </View>
                <Text style={{ ...tw(`text-sm`) }}>{data?.applyForProject ? data?.applyForProject : ''}</Text>
              </View>

              <View style={{ ...tw(`flex py-5 border-b gap-5 items-center flex-row border-[#D8D8D8]`) }}>
                <View style={{ ...tw(`flex flex-row justify-between items-center gap-5 w-[180px]`) }}>
                  <Text style={{ ...tw(`flex items-center text-[14px] text-[#3D3D3D]`) }}>主な勤務地</Text>
                </View>
                <Text style={{ ...tw(`text-sm`) }}>{`${data?.workplace?.prefecture ? data?.workplace?.prefecture : ''}${
                  data?.workplace?.city ? data?.workplace?.city : ''
                }${data?.workplace?.address2 ? data?.workplace?.address2 : ''}`}</Text>
              </View>

              <View style={{ ...tw(`flex py-5 border-b gap-5 items-center flex-row border-[#D8D8D8]`) }}>
                <View style={{ ...tw(`flex flex-row justify-between items-center gap-5 w-[180px]`) }}>
                  <Text style={{ ...tw(`flex items-center text-[14px] text-[#3D3D3D]`) }}>勤務時間</Text>
                </View>
                <View style={{ ...tw(`flex flex-col items-start`) }}>
                  {/* <Schedule
                    schedule={data?.workingHours ? data?.workingHours : scheduleInfo}
                    size={view == "PC" ? "default" : "mini"}
                  /> */}
                  <View style={{ ...tw(`w-[79%] ml-auto mr-auto`) }}>
                    <View style={{ ...tw(`flex flex-row text-center`) }}>
                      {japaneseDays.map((day, index) => (
                        <View key={index} style={{ ...tw(`w-[12.5%] border text-[10px] border-black bg-gray-200 mr-[-1]`) }}>
                          <Text style={{ ...tw(`left-[-8px]`) }}>{day}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={{ ...tw(`flex flex-row text-center`) }}>
                      <View style={{ ...tw(`w-[12.5%] text-[#3D3D3D] border text-[10px] border-black text-center bg-gray-200 mt-[-1] mr-[-1]`) }}>
                        <Text style={{ ...tw(`left-[-8px]`) }}>午前</Text>
                      </View>

                      {hours.map((item, index) => (
                        <View
                          key={index}
                          style={{ ...tw('flex items-center text-[#3D3D3D] justify-center w-[12.5%] border border-black  mt-[-1] mr-[-1]') }}
                        >
                          {item[0] === 1 && <Text style={[styles.circle]}></Text>}
                        </View>
                      ))}
                    </View>
                    <View style={{ ...tw(`flex flex-row text-center`) }}>
                      <View style={{ ...tw(`w-[12.5%] text-[#3D3D3D] border text-[10px] border-black text-center bg-gray-200 mt-[-1] mr-[-1]`) }}>
                        <Text style={{ ...tw(`left-[-8px]`) }}>午後</Text>
                      </View>
                      {hours.map((item, index) => (
                        <View key={index} style={{ ...tw('flex items-center justify-center w-[12.5%] border border-black  mt-[-1] mr-[-1]') }}>
                          {item[1] === 1 && <Text style={[styles.circle]}></Text>}
                        </View>
                      ))}
                    </View>

                    <View style={{ ...tw(`pt-[10px]`) }}>
                      <Text style={{ ...tw(`text-sm`) }}>
                        {/* 週2日程度 / 授業がある平日(月・水・金のシフト制)
                        <br />
                        ※月に2回は土日祝日の練習および試合あり */}
                        {data?.workingHoursNote ? data?.workingHoursNote : ''}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={{ ...tw(`flex py-5 gap-5 items-center flex-row`) }}>
                <View style={{ ...tw(`flex flex-row justify-between items-center gap-5 w-[180px]`) }}>
                  <Text style={{ ...tw(`flex items-center text-[14px] text-[#3D3D3D]`) }}>活動の紹介</Text>
                </View>
                <Text style={{ ...tw(`text-sm`) }}>{data?.activityDescription ? data?.activityDescription : ''}</Text>
              </View>
            </View>
          </View>

          <View style={{ ...tw(`flex flex-col border rounded-[10px] bg-[#FDFDFD] border-[#D8D8D8] w-full`) }}>
            <View style={{ ...tw(`flex flex-row items-center w-full gap-5 px-5 py-3 bg-[#E5F4FF] rounded-t-[10px]`) }}>
              <Text style={{ ...tw(`text-[14px] text-[#307DC1]`) }}>希望条件</Text>
              <View style={{ ...tw(`text-[10px] flex flex-row gap-[2px]`) }}>
                <Text>※</Text>
                <Image src="/images/icons/lock.png" style={styles.image} />
                <Text style={{ ...tw(`text-sm flex gap-[2px]`) }}>がついている項目は募集者に公開されません</Text>
              </View>
            </View>
            {/* info section  */}
            <View style={{ ...tw(`flex flex-col px-10`) }}>
              <View style={{ ...tw(`flex flex-row items-center gap-5 py-5 border-b border-[#D8D8D8]`) }}>
                <View style={{ ...tw(`flex flex-row gap-[6px] items-center w-[180px]`) }}>
                  <View style={{ ...tw(`flex flex-row justify-between items-center gap-5`) }}>
                    <Text style={{ ...tw(`flex items-center text-[14px] text-[#3D3D3D]`) }}>性別</Text>
                  </View>
                  <Image src="/images/icons/lock.png" style={styles.lockImage} />
                </View>
                <Text style={{ ...tw(`text-[14px]`) }}>{data?.gender ? data?.gender : ''}</Text>
              </View>

              <View style={{ ...tw(`flex flex-row items-center gap-5 py-5 border-b border-[#D8D8D8]`) }}>
                <View style={{ ...tw(`flex flex-row gap-[6px] items-center w-[180px]`) }}>
                  <View style={{ ...tw(`flex flex-row justify-between items-center gap-5`) }}>
                    <Text style={{ ...tw(`flex items-center text-[14px] text-[#3D3D3D]`) }}>年齢</Text>
                  </View>
                  <Image src="/images/icons/lock.png" style={styles.lockImage} />
                </View>
                <Text style={{ ...tw(`text-[14px]`) }}>{data?.desiredAge ? data?.desiredAge.join(', ') : ''}</Text>
              </View>

              <View style={{ ...tw(`flex py-5 border-b gap-5 items-center flex-row border-[#D8D8D8]`) }}>
                <View style={{ ...tw(`flex flex-row justify-between items-center gap-5 w-[180px]`) }}>
                  <Text style={{ ...tw(`flex items-center text-[14px] text-[#3D3D3D]`) }}>資格に関する希望</Text>
                  <Text style={{ ...tw(`rounded-[3px] py-[2px] px-[6px] h-full text-[10px] text-[#FDFDFD] bg-[#AFAFAF]`) }}>任意</Text>
                </View>

                <Text style={{ ...tw(`text-[14px]`) }}>
                  {data?.desiredTalent ? data?.desiredTalent : ''}
                  {/* {eligibilityPreferences.map((item, index) => (
                    <View key={index} style={{ ...tw(`flex flex-row items-center`) }}>
                      <View style={{ ...tw(`w-1 h-1 mr-1 rounded-full bg-[#3D3D3D]`) }}></View>
                      <View>{item}</View>
                    </View>
                  ))} */}
                </Text>
              </View>

              <View style={{ ...tw(`flex py-5 border-b gap-5 items-center flex-row border-[#D8D8D8]`) }}>
                <View style={{ ...tw(`flex flex-row justify-between items-center gap-5 w-[180px]`) }}>
                  <Text style={{ ...tw(`flex items-center text-[14px] text-[#3D3D3D]`) }}>求める人材</Text>
                  <Text style={{ ...tw(`rounded-[3px] py-[2px] px-[6px] h-full text-[10px] text-[#FDFDFD] bg-[#AFAFAF]`) }}>任意</Text>
                </View>
                <Text style={{ ...tw(`text-[14px]`) }}>{data?.desiredQualifications ? data?.desiredQualifications : ''}</Text>
              </View>

              <View style={{ ...tw(`flex py-5 border-b gap-5 items-center flex-row border-[#D8D8D8]`) }}>
                <View style={{ ...tw(`flex flex-row justify-between items-center gap-5 w-[180px]`) }}>
                  <Text style={{ ...tw(`flex items-center text-[14px] text-[#3D3D3D]`) }}>給与・報酬</Text>
                  <Text style={{ ...tw(`rounded-[3px] py-[2px] px-[6px] h-full text-[10px] text-[#FDFDFD] bg-[#AFAFAF]`) }}>任意</Text>
                </View>
                <Text style={{ ...tw(`text-[14px]`) }}>{data?.desiredSalary ? data?.desiredSalary : ''}</Text>
              </View>

              <View style={{ ...tw(`flex gap-5 py-5 items-center flex-row`) }}>
                <View style={{ ...tw(`flex flex-row gap-[6px] items-center w-[180px]`) }}>
                  <View style={{ ...tw(`flex flex-row justify-between items-center gap-5 w-[180px]`) }}>
                    <View style={{ ...tw(`flex flex-row gap-[6px] items-center text-[14px] text-[#3D3D3D]`) }}>
                      <Text>備考</Text>
                      <Image src="/images/icons/lock.png" style={styles.lockImage} />
                    </View>
                    <Text style={{ ...tw(`rounded-[3px] py-[2px] px-[6px] h-full text-[10px] text-[#FDFDFD] bg-[#AFAFAF]`) }}>任意</Text>
                  </View>
                </View>
                <Text style={{ ...tw(`text-[14px]`) }}>{data?.desiredNote ? data?.desiredNote : ''}</Text>
              </View>
            </View>
          </View>

          <View style={{ ...tw(`flex flex-col border rounded-[10px] bg-[#FDFDFD] border-[#D8D8D8] w-full`) }}>
            <View style={{ ...tw(`flex flex-row items-center w-full gap-5 px-5 py-3 bg-[#E5F4FF] rounded-t-[10px]`) }}>
              <Text style={{ ...tw(`text-[14px] text-[#307DC1]`) }}>基本情報</Text>
              <View style={{ ...tw(`text-[10px] flex flex-row gap-[2px]`) }}>
                <Text>※</Text>
                <Image src="/images/icons/lock.png" style={styles.image} />
                <Text style={{ ...tw(`text-sm flex gap-[2px]`) }}>がついている項目は募集者に公開されません</Text>
              </View>
            </View>
            {/* info section  */}
            <View style={{ ...tw(`flex flex-col px-10`) }}>
              <View style={{ ...tw(`flex py-5 border-b gap-5 items-center flex-row border-[#D8D8D8]`) }}>
                <View style={{ ...tw(`flex flex-row gap-[6px] items-center w-[180px]`) }}>
                  <Text style={{ ...tw(`flex items-center text-[14px] text-[#3D3D3D]`) }}>担当者名</Text>
                  <Image src="/images/icons/lock.png" style={styles.lockImage} />
                </View>
                <View style={{ ...tw(`flex flex-col text-[14px]`) }}>
                  <Text>{data?.name?.sei ? data?.name?.sei : ''}</Text>
                  <Text>{data?.name?.mei ? data?.name?.mei : ''}</Text>
                </View>
              </View>

              <View style={{ ...tw(`flex flex-row items-center gap-5 py-5 border-b border-[#D8D8D8]`) }}>
                <View style={{ ...tw(`flex flex-row justify-between items-center gap-5 w-[180px]`) }}>
                  <Text style={{ ...tw(`flex items-center text-[14px] text-[#3D3D3D]`) }}>役職</Text>
                  <Text style={{ ...tw(`rounded-[3px] py-[2px] px-[6px] h-full text-[10px] text-[#FDFDFD] bg-[#AFAFAF]`) }}>任意</Text>
                </View>
                <Text style={{ ...tw(`text-[14px]`) }}>{data?.position ? data?.position : ''}</Text>
              </View>

              <View style={{ ...tw(`flex gap-5 py-5 items-center flex-row`) }}>
                <View style={{ ...tw(`flex flex-row gap-[6px] items-center w-[180px]`) }}>
                  <View style={{ ...tw(`flex flex-row justify-between items-center gap-5 w-[180px]`) }}>
                    <View style={{ ...tw(`flex flex-row gap-[6px] items-center text-[14px] text-[#3D3D3D]`) }}>
                      <Text>電話番号</Text>
                      <Image src="/images/icons/lock.png" style={styles.lockImage} />
                    </View>
                    <Text style={{ ...tw(`rounded-[3px] py-[2px] px-[6px] h-full text-[10px] text-[#FDFDFD] bg-[#AFAFAF]`) }}>任意</Text>
                  </View>
                </View>
                <Text style={{ ...tw(`text-[14px]`) }}>{data?.phoneNumber ? data?.phoneNumber : ''}</Text>
              </View>

              <View style={{ ...tw(`flex py-5 gap-5 items-center flex-row`) }}>
                <View style={{ ...tw(`flex flex-row gap-[6px] items-center w-[180px]`) }}>
                  <View style={{ ...tw(`flex flex-row justify-between items-center gap-5 w-[180px]`) }}>
                    <Text style={{ ...tw(`flex items-center text-[14px] text-[#3D3D3D]`) }}>メールアドレス</Text>
                    <Text style={{ ...tw(`rounded-[3px] py-[2px] px-[6px] h-full text-[10px] text-[#FDFDFD] bg-[#AFAFAF]`) }}>任意</Text>
                  </View>
                </View>
                <Text style={{ ...tw(`text-[14px]`) }}>{data?.email ? data?.email : ''}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default ProjectPdfPage
