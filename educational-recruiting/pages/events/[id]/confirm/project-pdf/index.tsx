'use client'
import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'

import { createTw } from 'react-pdf-tailwind'
import { EventProject } from '@/models'
import { format } from 'date-fns'
import { objectToDate } from '@/utils/common'
import { ja } from 'date-fns/locale'
import { Timestamp } from 'firebase/firestore'

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
    width: 20,
    height: 20,
    borderRadius: '100%',
    backgroundColor: 'dimgrey',
  },
})

const EventPdfPage = ({ data, prefectureName }: { data: EventProject; prefectureName: string }) => {
  return (
    <Document>
      <Page size="A4" style={[styles.page]}>
        <View style={{ ...tw(`flex flex-col items-center gap-10 text-[#3D3D3D]`) }}>
          <View>
            <Text style={{ ...tw(`text-[24px] font-bold`) }}>募集依頼詳細</Text>
          </View>

          <View style={{ ...tw(`flex flex-col border rounded-[10px] bg-[#FDFDFD] border-[#D8D8D8] w-full`) }}>
            <View style={{ ...tw(`flex flex-row items-center w-full gap-5 px-5 py-3 bg-[#E5F4FF] rounded-t-[10px]`) }}>
              <Text style={{ ...tw(`text-[14px] text-[#307DC1]`) }}>イベント情報</Text>
            </View>
            {/* info section  */}
            <View style={{ ...tw(`flex flex-col px-10`) }}>
              <View style={{ ...tw(`flex flex-col items-start py-5 gap-[2px] border-b border-[#D8D8D8]`) }}>
                <Text style={{ ...tw(`text-[20px]`) }}>{data?.title ? data.title : ''}</Text>
                <View style={{ ...tw(`flex flex-row items-center gap-[10px] text-[14px]`) }}>
                  <Text>主催団体</Text>
                  <Text>:</Text>
                  <Text>{data?.organizer ? data.organizer : ''}</Text>
                </View>
                <View style={{ ...tw(`flex flex-row items-center gap-[10px] text-[14px]`) }}>
                  <Text>募集を申請する学校</Text>
                  <Text>:</Text>
                  <Text>{data?.schoolName && data.schoolName.length > 0 && data.schoolName.join(' / ')}</Text>
                  {/* <Text>/</Text>
                  <Text>{school2}</Text> */}
                </View>
                <View style={{ ...tw(`flex flex-row items-center gap-[10px] text-[14px]`) }}>
                  <Text>募集人数</Text>
                  <Text>:</Text>
                  <Text>{data?.numberOfApplicants ? data.numberOfApplicants : ''}名</Text>
                </View>
              </View>

              <View style={{ ...tw(`flex py-5 border-b gap-5 items-center flex-row border-[#D8D8D8]`) }}>
                <Text style={{ ...tw(`text-[14px]`) }}>主な勤務地</Text>
                {/* <Label
                  text="主な勤務地"
                  style={{ ...tw(`w-[180px]"
                /> */}
                <Text style={{ ...tw(`text-[14px]`) }}>{`${data?.workplace?.prefecture ? data?.workplace?.prefecture : ''}${
                  data?.workplace?.city ? data?.workplace?.city : ''
                }${data?.workplace?.address2 ? data?.workplace?.address2 : ''}`}</Text>
                {/* <View style={{ ...tw(`text-[16px]`) }}>{location}</View> */}
              </View>

              <View style={{ ...tw(`flex py-5 border-b gap-5 items-center flex-row border-[#D8D8D8]`) }}>
                <Text style={{ ...tw(`text-[14px]`) }}>勤務時間</Text>
                {/* <Label text="勤務時間" style={{ ...tw(`w-[180px]" /> */}
                <View style={{ ...tw(`flex flex-col items-start gap-[1px] text-[14px]`) }}>
                  {data?.officeHours.map((item, index) => (
                    <Text key={index} style={{ ...tw(`text-[14px]`) }}>
                      {format(new Date(objectToDate(item.date as Timestamp)), 'yyyy/MM/dd (E)', { locale: ja }) +
                        ' ' +
                        item.start.hour +
                        ':' +
                        item.start.min +
                        '～' +
                        item.end.hour +
                        ':' +
                        item.end.min}
                    </Text>
                  ))}
                  <Text>{data?.officeHoursNote ? data.officeHoursNote : ''}</Text>
                </View>
              </View>

              <View style={{ ...tw(`flex py-5 gap-5 items-center flex-row`) }}>
                <Text style={{ ...tw(`text-[14px]`) }}>業務の内容</Text>
                {/* <Label
                  text="業務の内容"
                  style={{ ...tw(`w-[180px]"
                /> */}
                <Text style={{ ...tw(`text-[14px]`) }}>
                  {data?.jobDescription ? data.jobDescription : ''}
                  {/* {businessContent.map((item, index) => (
                    <View key={index} style={{ ...tw(`flex flex-row items-center`) }}>
                      <View style={{ ...tw(`w-1 h-1 mr-1 rounded-full bg-gray-black`) }}></View>
                      <View>{item}</View>
                    </View>
                  ))} */}
                </Text>
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
                  <Text style={{ ...tw(`text-[14px]`) }}>性別</Text>
                  {/* <Label text="性別" /> */}
                  <Image src="/images/icons/lock.png" style={styles.lockImage} />
                </View>
                <Text style={{ ...tw(`text-[14px]`) }}>{data?.gender ? data.gender : ''}</Text>
              </View>

              <View style={{ ...tw(`flex py-5 border-b gap-5 items-center flex-row border-[#D8D8D8]`) }}>
                <View style={{ ...tw(`flex flex-row gap-[6px] items-center w-[180px]`) }}>
                  {/* <View style={{ ...tw(`text-[20px]`) }}>
                  求める人材
                  </View> */}
                  <View style={{ ...tw(`flex flex-row justify-between items-center gap-5 w-[180px]`) }}>
                    <Text style={{ ...tw(`flex items-center text-[14px] text-[#3D3D3D]`) }}>求める人材</Text>
                    <Text style={{ ...tw(`rounded-[3px] py-[2px] px-[6px] h-full text-[10px] text-[#FDFDFD] bg-[#AFAFAF]`) }}>任意</Text>
                  </View>
                </View>
                <Text style={{ ...tw(`text-[16px]`) }}>{data?.people ? data.people : ''}</Text>
              </View>

              <View style={{ ...tw(`flex py-5 border-b gap-5 items-center flex-row border-[#D8D8D8]`) }}>
                <View style={{ ...tw(`flex flex-row justify-between items-center gap-5 w-[180px]`) }}>
                  <Text style={{ ...tw(`flex items-center text-[14px] text-[#3D3D3D]`) }}>給与・報酬</Text>
                </View>
                <Text style={{ ...tw(`flex flex-col text-[16px]`) }}>
                  {/* {salary.map((item, index) => (
                    <View key={index}> {item}</View>
                  ))} */}
                  {data?.salary ? data.salary : ''}
                </Text>
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
                <Text style={{ ...tw(`text-[14px]`) }}>{data?.note ? data.note : ''}</Text>
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

              <View style={{ ...tw(`flex gap-5 py-5 items-center border-b flex-row border-[#D8D8D8]`) }}>
                <View style={{ ...tw(`flex flex-row gap-[6px] items-center w-[180px]`) }}>
                  <View style={{ ...tw(`flex flex-row justify-between items-center gap-5 w-[180px]`) }}>
                    <View style={{ ...tw(`flex flex-row gap-[6px] items-center text-[14px] text-[#3D3D3D]`) }}>
                      <Text>役職</Text>
                      <Image src="/images/icons/lock.png" style={styles.lockImage} />
                    </View>
                    <Text style={{ ...tw(`rounded-[3px] py-[2px] px-[6px] h-full text-[10px] text-[#FDFDFD] bg-[#AFAFAF]`) }}>任意</Text>
                  </View>
                </View>
                <Text style={{ ...tw(`text-[14px]`) }}>{data?.position ? data.position : ''}</Text>
              </View>

              <View style={{ ...tw(`flex py-5 border-b gap-5 items-center flex-row border-[#D8D8D8]`) }}>
                <View style={{ ...tw(`flex flex-row gap-[6px] items-center w-[180px]`) }}>
                  <View style={{ ...tw(`flex flex-row gap-[6px] items-center w-[180px]`) }}>
                    <View style={{ ...tw(`flex flex-row gap-[6px] items-center w-[180px]`) }}>
                      <Text style={{ ...tw(`flex items-center text-[14px] text-[#3D3D3D]`) }}>住所</Text>
                      <Image src="/images/icons/lock.png" style={styles.lockImage} />
                    </View>
                  </View>
                </View>
                <View style={{ ...tw(`flex-col items-start text-[14px]`) }}>
                  <Text>{data?.workplace.zip ? '〒 ' + data.workplace.zip : ''}</Text>
                  <Text>{prefectureName}</Text>
                  <Text>{data?.workplace.city ? data.workplace.city : ''}</Text>
                  <Text>{data?.workplace.address1 ? data.workplace.address1 : ''}</Text>
                  <Text>{data?.workplace.address2 ? data.workplace.address2 : ''}</Text>

                  {/* {address.map((item, index) => (
                    <View key={index}>{item}</View>
                  ))} */}
                </View>
              </View>

              <View style={{ ...tw(`flex py-5 border-b gap-5 items-center flex-row border-[#D8D8D8]`) }}>
                <View style={{ ...tw(`flex flex-row gap-[6px] items-center w-[180px]`) }}>
                  <View style={{ ...tw(`flex flex-row gap-[6px] items-center w-[180px]`) }}>
                    <View style={{ ...tw(`flex flex-row gap-[6px] items-center w-[180px]`) }}>
                      <Text style={{ ...tw(`flex items-center text-[14px] text-[#3D3D3D]`) }}>電話番号</Text>
                      <Image src="/images/icons/lock.png" style={styles.lockImage} />
                    </View>
                  </View>
                </View>
                <Text style={{ ...tw(`text-[14px]`) }}>{data?.phoneNumber ? data.phoneNumber : ''}</Text>
              </View>

              <View style={{ ...tw(`flex py-5 gap-5 items-center flex-row`) }}>
                <View style={{ ...tw(`flex flex-row gap-[6px] items-center w-[180px]`) }}>
                  <View style={{ ...tw(`flex flex-row gap-[6px] items-center w-[180px]`) }}>
                    <View style={{ ...tw(`flex flex-row gap-[6px] items-center w-[180px]`) }}>
                      <Text style={{ ...tw(`flex items-center text-[14px] text-[#3D3D3D]`) }}>メールアドレス</Text>
                      <Image src="/images/icons/lock.png" style={styles.lockImage} />
                    </View>
                  </View>
                </View>
                <Text style={{ ...tw(`text-[14px]`) }}>{data?.email ? data.email : ''}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default EventPdfPage
