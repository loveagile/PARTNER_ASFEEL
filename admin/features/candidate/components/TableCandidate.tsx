import SubCustomTable from '@/components/SubCustomTable'
import Overall from '@/components/atoms/OverallTable'
import {
  API_ROUTES,
  DEFAULT_PAGE_SIZE,
  MESSAGE_TYPE,
  PROJECT_TYPE,
  SCOUT_STATUS,
} from '@/constants/common'
import {
  AGE_OPTIONS,
  OTHER_OPTIONS,
} from '@/features/registrant/components/ListRegistrantPage/Filter'
import { customFetchUtils } from '@/utils/common'
import { Button, Checkbox, Form } from 'antd'
import * as lodash from 'lodash'
import React from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import ModalDetailCandidate from '@/components/ModalDetailCandidate'
import ModalSelectUsers from './ModalSelectUsers'
import { column } from './column'
import styles from './index.module.scss'
import { auth } from '@/libs/firebase/firebase'

const LICENSE_OPTIONS = [
  {
    label: '教員免許あり',
    value: 'teacherLicenseStatus',
  },
  {
    label: '教員免許取得予定',
    value: 'teacherLicenseNote',
  },
  {
    label: '教員免許以外の指導者資格あり',
    value: 'otherLicense',
  },
  {
    label: '自動車運転免許あり',
    value: 'hasDriverLicense',
  },
]

const GENDER_OPTIONS = [
  { label: '男性', value: '男性' },
  { label: '女性', value: '女性' },
  { label: '無回答', value: '無回答' },
]

type TableCandidateProps = {
  candidateList: any[]
  setCandidateList: (candidateList: any[]) => void
  pagination: any
  isLoadingTable: boolean
  detailRecruitment: any
  handleChangePage: (page: number, perPage: number) => void
  setIsLoading: (isLoading: boolean) => void
}

const TableCandidate = ({
  candidateList = [],
  setCandidateList,
  pagination = {},
  isLoadingTable,
  detailRecruitment = {},
  handleChangePage,
  setIsLoading,
}: TableCandidateProps) => {
  const [isShowFilter, setIsShowFilter] = React.useState<boolean>(false)
  const [selectedUsers, setSelectedUsers] = React.useState<any[]>([])
  const [isShowSelectUsersModal, setIsShowSelectUsersModal] =
    React.useState<boolean>(false)
  const [selectedStatus, setSelectedStatus] = React.useState<SCOUT_STATUS>(
    SCOUT_STATUS.ng,
  )
  const isDisableScoutButton = selectedUsers.length === 0
  const candidateRef = React.useRef<any>(null)

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

  const handleChangeStatus = async (status: SCOUT_STATUS) => {
    setIsLoading(true)
    try {
      const res = await customFetchUtils(API_ROUTES.RECRUITMENT.scout, {
        method: 'POST',
        body: JSON.stringify({
          scoutIds: selectedUsers,
          status,
          projectId: detailRecruitment?.id,
        }),
      })

      if (res.ok) {
        const adminId = auth.currentUser?.uid
        const projectId = detailRecruitment?.id

        await Promise.all(
          selectedUsers.map(async (userId) => {
            const newRoomRes = await customFetchUtils(
              API_ROUTES.MESSAGE.createMessageRoom,
              {
                method: 'POST',
                body: JSON.stringify({
                  projectId,
                  userId,
                  projectType: PROJECT_TYPE.LEADER,
                  memberIds: [adminId, userId],
                }),
              },
            )

            const newRoom = await newRoomRes.json()

            await customFetchUtils(API_ROUTES.MESSAGE.sendMessage, {
              method: 'POST',
              body: JSON.stringify({
                messageRoomId: newRoom?.id,
                messages: [
                  {
                    type: MESSAGE_TYPE.application,
                    text: `スカウトを送信しました。`,
                    senderId: adminId,
                    projectId,
                  },
                ],
              }),
            })
          }),
        )

        await handleChangePage(
          pagination?.page || 1,
          pagination?.perPage || DEFAULT_PAGE_SIZE,
        )

        handleSelectUser([], selectedUsers)
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  const disabledScoutBtnClassName = `${styles.scout_btn} ${
    isDisableScoutButton ? '!bg-opacity-40' : ''
  }`

  const workplaceDisplay = `${detailRecruitment?.workplace?.prefecture || ''}${
    detailRecruitment?.workplace?.city || ''
  }${detailRecruitment?.workplace?.address1 || ''}`

  return (
    <>
      <div className="flex items-end gap-5">
        <Overall
          total={pagination?.total || 0}
          allTotal={pagination?.allTotal || 0}
        />
        <span className="text-small leading-5">候補選出条件</span>
        <span className="text-small leading-5">
          種目 : {detailRecruitment?.eventName}
        </span>
        <span className="text-small leading-5">
          指導可能地域 : {workplaceDisplay}
        </span>
        <Button
          type="link"
          className="mb-1 flex items-center rounded-none p-0 text-small"
          style={{
            borderWidth: 1.5,
            borderBottomColor: '#307DC1',
            height: 'auto',
            lineHeight: 'initial',
          }}
          onClick={() => setIsShowFilter(!isShowFilter)}
        >
          <AiOutlineSearch fontSize={18} className="mr-2" />
          <span className={isShowFilter ? styles.filter_text : ''}>
            絞り込み
          </span>
        </Button>
      </div>
      {isShowFilter && (
        <div className="mt-3 rounded-xl bg-gray-gray_light px-8 py-3 text-small">
          <Form.Item label="性別" className="mb-2" name="gender">
            <Checkbox.Group options={GENDER_OPTIONS} />
          </Form.Item>
          <Form.Item label="年齢" className="mb-2" name="age">
            <Checkbox.Group options={AGE_OPTIONS} />
          </Form.Item>
          <Form.Item label="資格" className="mb-2" name="license">
            <Checkbox.Group options={LICENSE_OPTIONS} />
          </Form.Item>
          <Form.Item label="その他" className="mb-2" name="other">
            <Checkbox.Group options={OTHER_OPTIONS} />
          </Form.Item>
        </div>
      )}
      <div className="mr-4 mt-4 flex items-center justify-end gap-3">
        <span className="text-mini">一括操作 :</span>
        <Button
          type="primary"
          className={disabledScoutBtnClassName}
          disabled={isDisableScoutButton}
          // onClick={() => handleChangeStatus(SCOUT_STATUS.ng)}
          onClick={() => {
            setIsShowSelectUsersModal(true)
            setSelectedStatus(SCOUT_STATUS.ng)
          }}
        >
          NG
        </Button>
        <Button
          type="primary"
          className={disabledScoutBtnClassName}
          disabled={isDisableScoutButton}
          // onClick={() => handleChangeStatus(SCOUT_STATUS.scouted)}
          onClick={() => {
            setIsShowSelectUsersModal(true)
            setSelectedStatus(SCOUT_STATUS.scouted)
          }}
        >
          スカウト
        </Button>
      </div>
      <SubCustomTable
        loading={isLoadingTable}
        columns={column({
          handleSelectUser,
          allCandidateIds: candidateList?.map((item) => item?.id),
          selectedUserIds: selectedUsers,
        })}
        scroll={{ x: 1000 }}
        dataSource={candidateList}
        pagination={{
          onChange: handleChangePage,
          current: pagination?.page || 1,
          pageSize: DEFAULT_PAGE_SIZE,
          total: pagination?.total || 0,
        }}
        rowClassName="cursor-pointer"
        onRow={(record) => {
          return {
            onClick: () => {
              candidateRef.current?.show(record)
            },
          }
        }}
      />
      <ModalSelectUsers
        selectUsers={candidateList?.filter(
          (item) => selectedUsers?.includes(item?.id),
        )}
        modalProps={{
          open: isShowSelectUsersModal,
          onCancel: () => setIsShowSelectUsersModal(false),
          onOk: () => {
            handleChangeStatus(selectedStatus)
            setIsShowSelectUsersModal(false)
          },
          title: (
            <div className="text-center">
              {selectedStatus === SCOUT_STATUS.ng
                ? `選択中の${selectedUsers?.length || 0}名をNGにしますか？`
                : `選択中の${
                    selectedUsers?.length || 0
                  }名にスカウトを送信しますか？`}
            </div>
          ),
        }}
      />
      <ModalDetailCandidate
        ref={candidateRef}
        handleSelectUser={handleSelectUser}
        selectedUsers={selectedUsers}
      />
    </>
  )
}

export default TableCandidate
