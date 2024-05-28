import {
  Document,
  Font,
  Image,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  View,
} from '@react-pdf/renderer'
import { createTw } from 'react-pdf-tailwind'
import { WorkingHoursProps } from '../WorkHours'
import Question from './Question'
import WorkingHours from './WorkingHours'

Font.register({
  family: 'Noto Sans JP, sans-serif;',
  fonts: [
    {
      src: '/fonts/notosan/static/NotoSansJP-Light.ttf',
      fontWeight: 400,
    },
    {
      src: '/fonts/notosan/static/NotoSansJP-Bold.ttf',
      fontWeight: 700,
    },
  ],
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
  image: {
    width: 60,
    height: 60,
    objectFit: 'cover',
  },
  flex_col: {
    display: 'flex',
    flexDirection: 'column',
  },
})

export type UserPDFProps = {
  data: {
    avatar: string
    fullName: string
    gender: string
    createdAt: string
    updatedAt: string
    occupation: {
      type: string
      organization: string
      faculty: string
      grade: string
    }
    birthday: string
    age: string
    phoneNumber: string
    email: string
    eventsTeach: string
    areaTeach: string
    workingHours: WorkingHoursProps
    isExpeditionPossible: string
    experienceText: string
    teacherLicenseText: string
    questionsForPrefectureDisplay: {
      [key: string]: {
        question: string
        answer: string
      }
    }
    pr: string
    otherLicense: string
    hasDriverLicense: string
    careerDisplay: {
      termOfStart: string
      termOfEnd: string
      organizationName: string
    }[]
    precautions: string
  }
}

const UserPDF = ({ data }: UserPDFProps) => {
  return (
    <Document>
      <Page wrap={false} style={[styles.page, tw('text-sm')]}>
        <View
          style={{ ...tw(`flex flex-row justify-between items-center mb-5`) }}
        >
          <View style={{ ...tw(`flex flex-row justify-start gap-x-2`) }}>
            <View style={{ ...tw(`w-20 h-20 overflow-hidden rounded-full`) }}>
              {data.avatar ? (
                <Image src={data.avatar} style={styles.image} />
              ) : (
                <Image
                  src="/images/avatar/no_avatar.png"
                  style={styles.image}
                />
              )}
            </View>
            <View style={{ ...tw(`flex flex-col justify-center gap-x-4`) }}>
              <View>
                <Text style={{ ...tw(`text-xl`) }}>{data.fullName}</Text>
              </View>
              <View style={{ ...tw(`flex flex-row justify-start gap-x-2`) }}>
                <Text>{data.gender}</Text>
                <Text>{data.age}歳</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 4,
                }}
              >
                {data.precautions ? (
                  <>
                    <Svg width="14" height="14" viewBox="0 0 14 14">
                      <Path
                        d="M2.60887 11.9605H11.3939C12.2922 11.9605 12.8522 10.9864 12.403 10.2105L8.01054 2.62136C7.56137 1.84553 6.44137 1.84553 5.99221 2.62136L1.59971 10.2105C1.15054 10.9864 1.71054 11.9605 2.60887 11.9605ZM7.00137 7.8772C6.68054 7.8772 6.41804 7.6147 6.41804 7.29386V6.1272C6.41804 5.80636 6.68054 5.54386 7.00137 5.54386C7.32221 5.54386 7.58471 5.80636 7.58471 6.1272V7.29386C7.58471 7.6147 7.32221 7.8772 7.00137 7.8772ZM7.58471 10.2105H6.41804V9.04386H7.58471V10.2105Z"
                        fill="#3D3D3D"
                      />
                    </Svg>
                    <Text>{data.precautions}</Text>
                  </>
                ) : (
                  ''
                )}
              </View>
            </View>
          </View>
          <View style={{ ...tw(`flex flex-col ml-auto text-right gap-2`) }}>
            <Text>登録日 : {data.createdAt} </Text>
            <Text>プロフィール更新日 : {data.updatedAt}</Text>
          </View>
        </View>

        <SectionWrapper title="基本情報">
          <ItemWrapper title="職業">
            <View style={styles.flex_col}>
              <Text>大学生</Text>
              <Text>山梨学院大学&nbsp;&nbsp;教育学部&nbsp;&nbsp;2年生</Text>
            </View>
          </ItemWrapper>

          <ItemWrapper title="生年月日">
            <Text>
              {data.birthday}(満{data.age}歳)
            </Text>
          </ItemWrapper>
          <ItemWrapper title="電話番号">
            <Text>{data.phoneNumber}</Text>
          </ItemWrapper>

          <ItemWrapper title="住所">
            <View style={styles.flex_col}>
              <Text>〒400-0072</Text>
              <Text>山梨県甲府市大和町</Text>
            </View>
          </ItemWrapper>

          <ItemWrapper title="メールアドレス" isLastChild>
            <Text>{data.email}</Text>
          </ItemWrapper>
        </SectionWrapper>

        <SectionWrapper title="スキル・条件">
          <ItemWrapper title="指導できる種目">
            <Text>{data.eventsTeach}</Text>
          </ItemWrapper>
          <ItemWrapper title="指導できる地域">
            <Text>{data.areaTeach}</Text>
          </ItemWrapper>
          <ItemWrapper title="指導できる日時">
            <WorkingHours workingHours={data.workingHours} />
          </ItemWrapper>
          <ItemWrapper title="遠征への同行可否">
            <Text>{data.isExpeditionPossible}</Text>
          </ItemWrapper>
          <ItemWrapper title="指導経験">
            <Text>{data.experienceText}</Text>
          </ItemWrapper>
          <ItemWrapper title="教員免許">
            <Text>{data.teacherLicenseText}</Text>
          </ItemWrapper>
          <ItemWrapper title="指導者資格">
            <Text>{data.otherLicense}</Text>
          </ItemWrapper>
          <ItemWrapper title="自動車運転免許">
            <Text>{data.hasDriverLicense}</Text>
          </ItemWrapper>
          <ItemWrapper title="自己アピール">
            <Text>{data.pr}</Text>
          </ItemWrapper>
          <ItemWrapper title="地域項目">
            <Question
              questionsForPrefectureDisplay={data.questionsForPrefectureDisplay}
            />
          </ItemWrapper>
          <ItemWrapper title="経歴" isLastChild>
            <View style={styles.flex_col}>
              {data.careerDisplay.map((item, index) => (
                <Text key={index}>
                  {item.termOfStart} ~ {item.termOfEnd} {item.organizationName}
                </Text>
              ))}
            </View>
          </ItemWrapper>
        </SectionWrapper>
      </Page>
    </Document>
  )
}

const SectionWrapper = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => {
  const styles = StyleSheet.create({
    wrapper: {
      borderRadius: 10,
      overflow: 'hidden',
      border: '1px solid #D8D8D8',
      marginBottom: 24,
    },
    header: {
      padding: '8px 16px',
      backgroundColor: '#D8D8D8',
    },
    title: {
      fontSize: 14,
      fontWeight: 700,
    },
    children: {},
  })

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.children}>{children}</View>
    </View>
  )
}

const ItemWrapper = ({
  title,
  children,
  isLastChild,
}: {
  title: string
  children: React.ReactNode
  isLastChild?: boolean
}) => {
  const styles = StyleSheet.create({
    wrapper: {
      paddingBottom: 12,
      paddingTop: 12,
      marginLeft: 16,
      marginRight: 16,
      borderBottom: isLastChild ? 'none' : '1px solid #D8D8D8',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    title_wrapper: {
      minWidth: 124,
    },
    title: {
      fontSize: 14,
      fontWeight: 700,
    },
  })

  return (
    <View style={styles.wrapper}>
      <View style={styles.title_wrapper}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View
        style={{
          width: 375,
        }}
      >
        {children}
      </View>
    </View>
  )
}

export default UserPDF
