'use client'

import { useRef, useState } from 'react'
import { Modal, Select } from 'antd'
import { HiDocumentText } from 'react-icons/hi'
import Papa from 'papaparse'
import json2csv from 'json2csv'
import { saveAs } from 'file-saver'
import lodash from 'lodash'

import ButtonCustom, {
  ButtonColor,
  ButtonShape,
} from '@/components/atoms/Button/Button'
import { Prefecture } from '@/constants/model'
import { customFetchUtils } from '@/utils/common'
import { API_ROUTES, HTTP_METHOD } from '@/constants/common'
import useModal from '@/hooks/useModal'
import LoadingView from '@/components/LoadingView'

interface ModalImportCsvProps {
  open: boolean
  onCancel: () => void
  prefectures: Prefecture[]
}

const ModalImportCsv = ({
  open,
  onCancel,
  prefectures,
}: ModalImportCsvProps) => {
  const { showSuccess, showError } = useModal()
  const [isLoading, setIsLoading] = useState(false)
  const [csvData, setCsvData] = useState<any>(null)
  const inputCsvRef = useRef<HTMLInputElement>(null)
  const [currentPrefecture, setCurrentPrefecture] = useState<
    string | undefined
  >('')
  const [fileName, setFileName] = useState<string>('')

  const handleClickSelect = () => {
    if (inputCsvRef.current) inputCsvRef.current.value = ''
    setFileName('')
    setCsvData(null)
    inputCsvRef?.current?.click()
  }

  function handleFileSelect(event: any) {
    try {
      setIsLoading(true)
      const file = event.target.files[0]
      setFileName(file.name)

      Papa.parse(file, {
        complete: (result) => {
          const jsonData = result.data
          setCsvData(jsonData)
        },
      })
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const res = await customFetchUtils(API_ROUTES.REGISTRANT.importCsv, {
        method: HTTP_METHOD.POST,
        body: JSON.stringify({
          prefecture: prefectures.find(pref => pref.prefecture === currentPrefecture),
          csvData,
        }),
      })

      if (!res.ok) {
        const errors = await res.json()
        const message =
          lodash.get(errors, 'error.message') || lodash.get(errors, 'error')

        showError({
          content: (
            <div>
              {message ||
                `${lodash.get(res, 'status')} ${lodash.get(res, 'statusText')}`}
            </div>
          ),
        })
      }

      const { errors, ok } = await res.json()

      if (errors) {
        saveJson2Csv(errors)
        showError({
          content: <div>※インポート形式が正しくありません</div>,
        })
      }

      if (ok) {
        showSuccess({
          title: 'Import csv successfully!',
          onOk: () => {
            window.location.reload();
          }
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveJson2Csv = (jsonData: any, filename: string = 'error.csv') => {
    const csvError = json2csv.parse(jsonData)
    const blob = new Blob([csvError], { type: 'text/csv;charset=utf-8' })
    saveAs(blob, filename)
  }

  return (
    <>
      <Modal
        open={open}
        onCancel={() => onCancel()}
        footer={null}
        title="登録者をインポート"
      >
        <LoadingView spinning={isLoading} className="z-[1000]" />
        <div className="mt-4 flex flex-col gap-4">
          <div>
            <span className="text-black">CSVファイルを選択してください。</span>
          </div>
          <input
            ref={inputCsvRef}
            type="file"
            hidden
            className="hidden"
            accept=".csv"
            onChange={handleFileSelect}
          />
          <button
            className="flex w-fit items-center bg-gray-gray px-4 py-2"
            onClick={handleClickSelect}
          >
            <HiDocumentText className="text-4xl" />
            <span className="text-black">ファイルを選択</span>
          </button>
          <span>{fileName}</span>
          <div>
            <span className="mb-1">登録委託組織</span>
            <div>
              <Select
                showSearch
                className="w-80"
                allowClear
                options={prefectures.map((prefecture) => {
                  return {
                    label: prefecture.prefecture,
                    value: prefecture.prefecture,
                  }
                })}
                onChange={setCurrentPrefecture}
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pc:gap-5">
            <ButtonCustom
              disabled={isLoading}
              className="w-[140px] py-2 text-small pc:w-[200px] pc:py-[17.5px] pc:text-body_sp"
              color={ButtonColor.CANCEL}
              shape={ButtonShape.ELLIPSE}
              text="キャンセル"
              onclick={onCancel}
            />
            <ButtonCustom
              disabled={isLoading || !currentPrefecture || !csvData}
              className="w-[140px] py-2 text-small pc:w-[200px] pc:py-[17.5px] pc:text-body_sp"
              color={ButtonColor.SUB}
              shape={ButtonShape.ELLIPSE}
              text="実行する"
              onclick={handleSubmit}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ModalImportCsv
