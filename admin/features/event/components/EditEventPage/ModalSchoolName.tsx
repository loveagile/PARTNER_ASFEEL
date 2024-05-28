import { API_ROUTES, HTTP_METHOD } from '@/constants/common'
import { convertUrlSearchParams } from '@/utils/common'
import { Modal, Checkbox, Button, Form, Spin } from 'antd'
import React from 'react'
import useLoadMore from './useLoadmore'

interface ModalSchoolNameProps {
  open: boolean
  onCancel: () => void
  handleOk: (values: string[]) => void
  currentSchoolName: string[]
}
const LIMIT = 100

const ModalSchoolName = ({
  open,
  onCancel,
  handleOk,
  currentSchoolName,
}: ModalSchoolNameProps) => {
  const [form] = Form.useForm()
  const keyword = Form.useWatch('keyword', form)
  const [page, setPage] = React.useState(1)
  const [checkedValues, setCheckedValues] = React.useState<string[]>([])

  const handleCheckboxChange = (value: string) => {
    const newCheckedValues = [...checkedValues]

    if (newCheckedValues.includes(value)) {
      newCheckedValues.splice(newCheckedValues.indexOf(value), 1)
    } else {
      newCheckedValues.push(value)
    }

    setCheckedValues(newCheckedValues)
  }

  const handleFetchData = async (keyword: string, page: number) => {
    const urlSearchParams = convertUrlSearchParams(
      { keyword, page, perPage: LIMIT } || {},
    )

    const res = await fetch(
      `${API_ROUTES.ORGANIZATION.list}?${urlSearchParams || ''}`,
      {
        method: HTTP_METHOD.GET,
      },
    )
    const response = await res.json()
    return response.data
  }

  const {
    data: organization,
    hasMore,
    loading,
  } = useLoadMore(keyword, page, handleFetchData)

  const observer = React.useRef<any>()

  const lastElementRef = React.useCallback(
    (node: any) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore],
  )

  const handleFinish = () => {
    const schoolNames = checkedValues || []
    handleOk(schoolNames)
  }

  React.useEffect(() => {
    setPage(1)
  }, [keyword])

  React.useEffect(() => {
    if (!currentSchoolName) return

    setCheckedValues(currentSchoolName)
  }, [currentSchoolName])

  return (
    <Modal
      open={open}
      onCancel={() => onCancel()}
      footer={null}
      title="学校検索"
    >
      <div className="h-96 overflow-y-scroll">
        <div className="flex flex-col gap-1">
          {organization?.map((org, index) =>
            organization.length === index + 1 ? (
              <div ref={lastElementRef} key={org.id}>
                <Checkbox
                  defaultChecked={checkedValues.includes(org.name)}
                  onChange={() => handleCheckboxChange(org.name)}
                >
                  {org.name}
                </Checkbox>
              </div>
            ) : (
              <div key={org.id}>
                <Checkbox
                  defaultChecked={checkedValues.includes(org.name)}
                  onChange={() => handleCheckboxChange(org.name)}
                >
                  {org.name}
                </Checkbox>
              </div>
            ),
          )}
          {loading ? (
            <div className="text-center">
              <Spin spinning={loading} />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <Button
          type="primary"
          className="h-9 flex-1 rounded-2xl bg-core-sky"
          onClick={handleFinish}
        >
          完 了
        </Button>
      </div>
    </Modal>
  )
}

export default ModalSchoolName
