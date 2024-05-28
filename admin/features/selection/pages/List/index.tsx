'use client'

import LoadingView from '@/components/LoadingView'
import UserPDF from '@/components/UserPDF'
import {
  API_ROUTES,
  DEBOUNCE_TIME,
  DEFAULT_PAGE_SIZE,
  HTTP_METHOD,
  INTERVIEW_STATUS,
  SELECTED_CANDIDATE_STATUS,
} from '@/constants/common'
import { PaginationInfo } from '@/constants/model'
import {
  convertUrlSearchParams,
  customFetchUtils,
  transformDetainCandidatePdf,
} from '@/utils/common'
import { pdf } from '@react-pdf/renderer'
import { Form } from 'antd'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import * as lodash from 'lodash'
import { useRouter } from 'next/navigation'
import React from 'react'
import ListSelection from '../../components/ListSelection'

type UserData = {
  id: string
  interviewDate: number | string | null
  status: SELECTED_CANDIDATE_STATUS
}

type ListSelectionFeatureProps = {
  detailRecruitment: any
}

const ListSelectionFeature = ({
  detailRecruitment,
}: ListSelectionFeatureProps) => {
  const router = useRouter()
  const [form] = Form.useForm()
  const [selectionList, setSelectionList] = React.useState<any[]>([])
  const [pagination, setPagination] = React.useState<PaginationInfo>({})
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isLoadingTable, setIsLoadingTable] = React.useState<boolean>(false)
  const [selectedUsers, setSelectedUsers] = React.useState<any[]>([])

  const handleBulkDownloadPdf = async (usersId: string[]) => {
    setIsLoading(true)
    if (selectedUsers.length === 0) {
      return
    }

    try {
      const usersRes = await Promise.all(
        usersId.map((userId) =>
          customFetchUtils(
            `${API_ROUTES.REGISTRANT.detail(userId)}?isShowName=true`,
          ),
        ),
      )

      const usersData = await Promise.all(usersRes.map((item) => item.json()))

      const zip = new JSZip()

      usersData.forEach((data) => {
        zip.file(
          `${data?.id}.pdf`,
          pdf(<UserPDF data={transformDetainCandidatePdf(data)} />).toBlob(),
        )
      })

      zip.generateAsync({ type: 'blob' }).then((blob) => {
        saveAs(blob, '選考.zip')
      })
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  const handleSelectUser = (
    selectedUserIds: string[] = [],
    deselectedUserIds: string[] = [],
  ) => {
    if (selectedUserIds.length > 0) {
      const newIds = lodash.union(selectedUsers, selectedUserIds)
      setSelectedUsers(newIds)
    }

    if (deselectedUserIds.length > 0) {
      const newIds = lodash.difference(selectedUsers, deselectedUserIds)
      setSelectedUsers(newIds)
    }
  }

  const modifySelectionList = async (data: UserData[]) => {
    try {
      const res = await customFetchUtils(
        API_ROUTES.RECRUITMENT.modifySelection,
        {
          method: HTTP_METHOD.PUT,
          body: JSON.stringify({
            projectId: detailRecruitment?.id,
            usersData: data,
          }),
        },
      )

      const response = await res.json()

      return response
    } catch (error) {
      console.log(error)
    }
  }

  const handleChangeBulkStatus = async (
    status: SELECTED_CANDIDATE_STATUS,
    userId: string[],
  ) => {
    setIsLoading(true)
    try {
      await Promise.all(
        userId.map((id) =>
          handleChangeList(
            {
              selectedCandidateStatus: status,
            },
            id,
          ),
        ),
      )
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  const handleChangeList = async (
    changeValues: { [key: string]: any } = {},
    userId: string,
  ) => {
    try {
      let currentUser = selectionList.find((item) => item.id === userId)

      const candidateStatus =
        changeValues?.selectedCandidateStatus ||
        currentUser?.selectedCandidateStatus

      const interviewDate =
        changeValues?.interviewDate || currentUser?.interviewDate

      const isInterview = INTERVIEW_STATUS.includes(candidateStatus)

      let changedUser = {
        ...currentUser,
        ...changeValues,
        interviewDate: isInterview ? interviewDate : null,
      }

      // Handle case delete interviewDate
      if (changeValues?.interviewDate === null) {
        changedUser = {
          ...currentUser,
          ...changeValues,
          interviewDate: null,
        }
      }

      const newSelectionList = selectionList.map((item: any) => {
        if (item.id === userId) {
          return changedUser
        }
        return item
      })

      setSelectionList(newSelectionList)

      await modifySelectionList([
        {
          id: userId,
          interviewDate: changedUser?.interviewDate,
          status: changedUser?.selectedCandidateStatus,
        },
      ])
    } catch (error) {
      console.log(error)
    }
  }

  const handleFetchData = async (searchParams?: { [key: string]: any }) => {
    setIsLoadingTable(true)

    const params = {
      ...searchParams,
    } as any

    const urlSearchParams = convertUrlSearchParams(params || {})

    try {
      const res = await customFetchUtils(
        `${API_ROUTES.RECRUITMENT.getSelection}?${urlSearchParams || ''}`,
        {
          method: HTTP_METHOD.GET,
        },
      )

      const response = await res.json()

      setSelectionList(response.data)
      setPagination(response.pagination)
    } catch (error) {
      console.log(error)
    }
    handleSelectUser(
      [],
      selectionList.map((item) => item?.id),
    )
    setIsLoadingTable(false)
  }

  const handleDebounceFetchData = React.useCallback(
    lodash.debounce(handleFetchData, DEBOUNCE_TIME),
    [],
  )

  const handleChangePage = async (page: number, perPage: number) => {
    const values = form.getFieldsValue()
    await handleFetchData({
      ...values,
      page,
      perPage,
      projectId: detailRecruitment?.id,
    })
  }

  const handleValuesChange = async (changedValues: any, values: any = {}) => {
    handleDebounceFetchData({
      ...values,
      page: 1,
      perPage: DEFAULT_PAGE_SIZE,
      projectId: detailRecruitment?.id,
    })
  }

  React.useEffect(() => {
    if (!detailRecruitment?.id) {
      return
    }

    setIsLoading(true)
    handleFetchData({
      projectId: detailRecruitment?.id,
    }).finally(() => {
      setIsLoading(false)
    })
  }, [detailRecruitment])

  return (
    <>
      <LoadingView spinning={isLoading} />
      <ListSelection
        selectedUsers={selectedUsers}
        handleSelectUser={handleSelectUser}
        form={form}
        selectionList={selectionList}
        // pagination={pagination}
        isLoadingTable={isLoadingTable}
        handleValuesChange={handleValuesChange}
        handleChangeList={handleChangeList}
        handleChangePage={handleChangePage}
        pagination={pagination}
        detailRecruitment={detailRecruitment}
        // setIsLoading={setIsLoading}
        handleBulkDownloadPdf={handleBulkDownloadPdf}
        handleChangeBulkStatus={handleChangeBulkStatus}
      />
    </>
  )
}

export default ListSelectionFeature
