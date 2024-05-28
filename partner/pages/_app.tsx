import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import ReduxWrapper, { useAppSelector } from '../store'
import { useEffect } from 'react'
import { getOrganizationTypeList } from '@/firebase/organizationType'
import {
  setStoreCheckedNotiList,
  setStoreCityPopulateList,
  setStoreClubPopulateList,
  setStoreMediumCategoryList,
  setStoreMessageList,
  setStoreModifyMessageList,
  setStoreNotiList,
  setStoreOrganizationTypeList,
  setStorePrefectureList,
  setStorePrefectureOptionList,
} from '@/store/reducers/global'
import { useAppDispatch } from '@/store'
import { getPrefectureList } from '@/firebase/prefecture'
import { IconTypeSelectBox, SelectBoxSize } from '@/components/atoms'
import { EventProject, LeadersWantedProject, MessageRoom } from '@/models'
import { getClubTypeCategoryPopulateList } from '@/firebase/clubTypeCategory'
import { getCityPopulateList } from '@/firebase/city'
import Loading from '@/components/organisms/Loading'
import NavbarBackground from '@/components/organisms/NavbarBackground'
import { getClubTypeMediumCategoryList } from '@/firebase/clubTypeMediumCategory'
import { customizePrefectureList } from '@/utils/common'
import { useAuthUserStateProvider } from '@/hooks/useAuthUserStateProvider'
import { onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { ColRef, DocRef, SubColRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { getLeadersWantedProject } from '@/firebase/leadersWantedProject'
import { getEventProject } from '@/firebase/eventProject'
import { setStoreUserInfo } from '@/store/reducers/profile'
import useSystemName from '@/hooks/useSystemName'
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  useSystemName()
  useAuthUserStateProvider()
  const dispatch = useAppDispatch()
  const { loading, authUser, isNavbarOpen, prefectureList, subDomainPref, notiList } = useAppSelector(
    (state) => state.global,
  )

  useEffect(() => {
    const fetchData = async () => {
      const [prefectureList, cityList, mediumCategoryList, clubList, organizationTypeList] = await Promise.all([
        getPrefectureList(),
        getCityPopulateList(),
        getClubTypeMediumCategoryList(),
        getClubTypeCategoryPopulateList(),
        getOrganizationTypeList(),
      ])
      dispatch(setStorePrefectureList(prefectureList))
      dispatch(setStoreCityPopulateList(cityList))
      dispatch(
        setStorePrefectureOptionList([
          {
            value: '',
            placeholder: true,
            text: '都道府県を選択',
            icon: IconTypeSelectBox.OFF,
            size: SelectBoxSize.PC,
          },
          ...customizePrefectureList(prefectureList),
        ]),
      )

      dispatch(setStoreOrganizationTypeList(organizationTypeList))
      dispatch(setStoreMediumCategoryList(mediumCategoryList))
      dispatch(setStoreClubPopulateList(clubList))
    }

    fetchData()
  }, [])

  // お知らせとメッセージの監視
  useEffect(() => {
    if (!authUser) return

    // ユーザー情報
    const unsubPrivateUser = onSnapshot(DocRef.privateUser(authUser.uid), (doc) => {
      if (doc.exists()) {
        dispatch(setStoreUserInfo(getDocIdWithData(doc)))
      }
    })

    //　お知らせ
    // 一時的に取得する時間でフィルターをかけるが、cloud tasksで予約投稿できるのであれば、そちらを使う
    const now = new Date()
    const unsubCheckedNotification = onSnapshot(query(SubColRef.checkedNotifications(authUser.uid), where('sentAt', '<=', now)), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          dispatch(setStoreCheckedNotiList(getDocIdWithData(change.doc)))
        }
      })
    })

    // メッセージ
    const createProjectData = async ({ projectType, projectId }: MessageRoom) => {
      return projectType === 'leader' ? await getLeadersWantedProject(projectId) : await getEventProject(projectId)
    }
    const unsubMessageRoom = onSnapshot(
      query(
        ColRef.messageRooms,
        where('memberIds', 'array-contains-any', [authUser.uid]),
        orderBy('updatedAt', 'desc'),
      ),
      (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          const data = getDocIdWithData(change.doc)
          const projectData = (await createProjectData(data)) as EventProject & LeadersWantedProject
          if (change.type === 'added') {
            dispatch(
              setStoreMessageList({
                ...data,
                projectData,
              }),
            )
          }
          if (change.type === 'modified') {
            dispatch(
              setStoreModifyMessageList({
                ...data,
                projectData,
              }),
            )
          }
        })
      },
    )

    return () => {
      unsubPrivateUser()
      unsubCheckedNotification()
      unsubMessageRoom()
    }
  }, [authUser])

  useEffect(() => {
    if (!authUser || !prefectureList || !subDomainPref) return

    const prefectureId = prefectureList.find((pref) => pref.prefecture === subDomainPref)?.id
    if (!prefectureId) return

    const unsubNotification = onSnapshot(
      query(
        ColRef.notifications,
        where('status', '==', 'published'),
        where('prefecture', '==', prefectureId),
        orderBy('createdAt', 'desc'),
      ),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            if (!notiList.some((noti) => noti.id === change.doc.id)) {
              dispatch(setStoreNotiList(getDocIdWithData(change.doc)))
            }
          }
        })
      },
    )

    return () => {
      unsubNotification()
    }
  }, [authUser, prefectureList, subDomainPref])

  const getLayout = Component.getLayout ?? ((page) => page)
  return getLayout(
    <>
      {loading && <Loading />}
      {isNavbarOpen && <NavbarBackground />}
      <Component {...pageProps} />
    </>,
  )
}

export default ReduxWrapper.withRedux(App)
