import dotenv from 'dotenv'

dotenv.config({
  path: `.env.local`,
})

import { ELASTIC_INDEX } from '../constants/common'
import {
  ColRef,
  DocRef,
  generateDocId,
  getDocIdWithData,
} from '../libs/firebase/firestore'
import { addFieldsCreate } from '../utils/firestore'
import { getDocs, setDoc } from 'firebase/firestore'
import { readFileSync } from 'fs'
import * as XLSX from 'xlsx'
import { createOrganizationRequestSchema } from '@/app/api/organization/schema'
// @ts-ignore
import Kuroshiro from 'kuroshiro'
// @ts-ignore
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'
import * as lodash from 'lodash'
import path from 'path'
import fse from 'fs-extra'
import { organizationMapping } from '@/app/api/organization/common'
import { Client } from '@elastic/elasticsearch'

const seedOrganizationWithType = async (
  elasticMasterData: Client,
  index: number,
  typeId: string,
  typeName: string,
) => {
  const prefecturesFireStoreSnap = await getDocs(ColRef.prefectures)
  const prefecturesFireStore = prefecturesFireStoreSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))

  const citiesFireStoreSnap = await getDocs(ColRef.cities)
  const citiesFireStore = citiesFireStoreSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))

  const filePath = './public/seed/organization.xlsx'
  const organizationType = typeId

  const workbook = XLSX.read(readFileSync(filePath))

  const sheetName = workbook.SheetNames.find((name) => name === typeName)

  if (!sheetName) {
    console.log('sheetName not found')
    return
  }

  const worksheet = workbook.Sheets[sheetName]

  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
  let result = [] as any[]
  let exceptionData = [] as any[]

  const writeFile = (data: any, fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, fileName)
  }

  let createPromise = [] as any[]

  const kuroshiro = new Kuroshiro()
  const analyzer = new KuromojiAnalyzer({
    dictPath: './public/dict',
  })
  await kuroshiro.init(analyzer)

  for (let i = 1; i < jsonData.length; i++) {
    const data: any = jsonData[i]

    let organizationId = data[0]
    let organizationName = data[1]?.replace(/\s/g, '') as string
    let zip = data[3]?.replace(/[^0-9]/g, '')
    let address = data[4] as string
    let phoneNumber = data[5]?.replace(/[^0-9]/g, '')

    if (!organizationName) {
      exceptionData = [...exceptionData, data]
      continue
    }

    const organizationNameKana = await kuroshiro.convert(organizationName, {
      to: 'katakana',
    })

    let prefectureId = ''
    let prefecture = ''
    let city = ''

    for (let i = 0; i < prefecturesFireStore.length; i++) {
      const element = prefecturesFireStore[i]

      if (address.includes(element.prefecture)) {
        prefectureId = element.id
        prefecture = element.prefecture
        address = address.replace(element.prefecture, '')
        break
      }
    }

    if (!prefectureId) {
      exceptionData = [
        ...exceptionData,
        { ...data, error: 'prefecture not found in database' },
      ]
      continue
    }

    let address1 = address
    for (let i = 0; i < citiesFireStore.length; i++) {
      const element = citiesFireStore[i]

      if (address.includes(element.city)) {
        city = element.city
        address1 = address.replace(element.city, '')
        break
      }
    }

    if (!city) {
      exceptionData = [
        ...exceptionData,
        { ...data, error: 'city not found in database' },
      ]
      continue
    }

    const createOrganizationId = await generateDocId()

    await elasticMasterData.indices.create({
      index: ELASTIC_INDEX.organizations,
      mappings: {
        properties: organizationMapping as any,
      },
    })

    try {
      const createData = (await createOrganizationRequestSchema.validate({
        organizationId,
        prefecture: prefectureId,
        organizationType: organizationType,
        organizationTypeText: typeName,
        name: organizationName,
        nameKana: organizationNameKana,
        address: {
          prefecture,
          city,
          address1,
          zip,
        },
        phoneNumber,
        isSuspended: false,
      })) as any

      createPromise.push(
        setDoc(
          DocRef.organization(createOrganizationId),
          addFieldsCreate(createData),
        ),
        elasticMasterData.index({
          index: ELASTIC_INDEX.organizations,
          id: createOrganizationId,
          document: addFieldsCreate(createData, true),
        }),
      )

      result = [...result, createData]
    } catch (error: any) {
      exceptionData = [...exceptionData, { ...data, error: error?.message }]
      continue
    }
  }

  writeFile(exceptionData, `./public/seed/error_organization_${typeName}.xlsx`)

  const chunk = lodash.chunk(createPromise, 100)
  console.log('chunk', chunk.length)
  console.log('createPromise', createPromise.length)

  for (let i = 0; i < chunk.length; i++) {
    console.log('index', i, index, chunk.length)
    const element = chunk[i]
    await Promise.all(element)
  }
}

export const seedOrganizations = async (elasticMasterData: Client) => {
  // Copy folder dict from admin\node_modules\kuromoji\dict to public\dict
  const dictPath = path.resolve(
    __dirname,
    '..',
    'node_modules',
    'kuromoji',
    'dict',
  )

  const dictPathPublic = path.resolve(__dirname, '..', 'public', 'dict')

  fse.copySync(dictPath, dictPathPublic)

  const organizationTypeSnap = await getDocs(ColRef.organizationTypes)

  const organizationType = organizationTypeSnap.docs.map((doc) =>
    getDocIdWithData(doc),
  )

  for (let i = 0; i < organizationType.length; i++) {
    const element = organizationType[i]
    await seedOrganizationWithType(
      elasticMasterData,
      i,
      element.id,
      element.name,
    )
  }
}
