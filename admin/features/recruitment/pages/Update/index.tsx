'use client'

import LoadingView from '@/components/LoadingView'
import { API_ROUTES, COMMON_STATUS, HTTP_METHOD } from '@/constants/common'
import PATH from '@/constants/path'
import useModal from '@/hooks/useModal'
import { ColRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { customFetchUtils } from '@/utils/common'
import { getDocs, query, where } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import React from 'react'
import EditRecruitmentPage from '../../components/EditRecruitmentPage'

const UpdateRecruitmentFeature = ({ id }: { id: string }) => {
  const [detailRecruitment, setDetailRecruitment] = React.useState<any>(null)
  const [clubTypeLargeOption, setClubTypeLargeOption] =
    React.useState<any>(null)
  const [clubTypeOption, setClubTypeOption] = React.useState<any>(null)
  const [eventProjects, setEventProjects] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const router = useRouter()
  const { showSuccess, showConfirm } = useModal()

  const fetchClubType = async () => {
    const res = await customFetchUtils(API_ROUTES.CATEGORY.type())
    const resData = await res.json()

    const data = resData.map((item: any) => ({
      value: item.name,
      label: item.name,
    }))

    setClubTypeOption(data)
  }

  const fetchClubTypeLarge = async () => {
    const res = await customFetchUtils(API_ROUTES.CATEGORY.type('large'))
    const resData = await res.json()

    const data = resData.map((item: any) => ({
      value: item.name,
      label: item.name,
    }))

    setClubTypeLargeOption(data)
  }

  const fetchEventProjects = async () => {
    try {
      const snapshot = await getDocs(
        query(
          ColRef.eventProjects,
          where('status', '==', COMMON_STATUS.IN_PUBLIC),
        ),
      )

      const resData = snapshot.docs.map((doc) => getDocIdWithData(doc))

      const data = resData.map((item: any) => ({
        value: item.id,
        label: item.title,
      }))

      setEventProjects(data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchDetailRecruitment = async () => {
    try {
      const res = await customFetchUtils(API_ROUTES.RECRUITMENT.detail(id))
      const data = await res.json()

      if (data?.status !== COMMON_STATUS.IN_PREPARATION) {
        router.push(PATH.recruitment.list.prepare)
      }

      setDetailRecruitment(data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (values: any) => {
    setIsLoading(true)
    try {
      const res = await customFetchUtils(API_ROUTES.RECRUITMENT.update, {
        method: HTTP_METHOD.PUT,
        body: JSON.stringify({
          id,
          ...values,
          status: COMMON_STATUS.IN_PREPARATION,
        }),
      })

      if (res.ok) {
        showSuccess({
          title: '募集を編集しました',
          onOk: () => router.push(PATH.recruitment.detail.prepare(id)),
        })
      }
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }

  React.useEffect(() => {
    setIsLoading(true)
    Promise.all([
      fetchDetailRecruitment(),
      fetchEventProjects(),
      fetchClubTypeLarge(),
      fetchClubType(),
    ]).then(() => {
      setIsLoading(false)
    })
  }, [id])

  return (
    <>
      <LoadingView spinning={isLoading} />
      <EditRecruitmentPage
        handleSubmit={handleSubmit}
        detailRecruitment={detailRecruitment}
        clubTypeLargeOption={clubTypeLargeOption}
        clubTypeOption={clubTypeOption}
        eventProjects={eventProjects}
      />
    </>
  )
}

export default UpdateRecruitmentFeature
