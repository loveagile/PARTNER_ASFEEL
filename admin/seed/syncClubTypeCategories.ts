import { addressMappings } from '@/app/api/address/common'
import { categoryMappings } from '@/app/api/category/common'
import { ELASTIC_INDEX } from '@/constants/common'
import { ColRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { addFieldsCreate } from '@/utils/firestore'
import { Client } from '@elastic/elasticsearch'
import {
  QueryConstraint,
  documentId,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore'
import * as lodash from 'lodash'

export const syncClubTypeCategories = async (elastic: Client) => {
  const indexExists = await elastic.indices.exists({
    index: ELASTIC_INDEX.categories,
  })

  if (indexExists) {
    await elastic.indices.delete({
      index: ELASTIC_INDEX.categories,
    })
  }

  await elastic.indices.create({
    index: ELASTIC_INDEX.categories,
    mappings: {
      properties: categoryMappings as any,
    },
  })

  const countSnap = await getCountFromServer(ColRef.categories)

  let countData = countSnap.data().count
  let lastDoc: any = null

  while (countData > 0) {
    const queryClause: QueryConstraint[] = [limit(6000), orderBy(documentId())]

    if (lastDoc) {
      queryClause.push(startAfter(lastDoc))
    }

    const snap = await getDocs(query(ColRef.categories, ...queryClause))

    const data = snap.docs.map((doc) =>
      addFieldsCreate(getDocIdWithData(doc), true),
    )

    const body = data.flatMap((doc) => [
      { index: { _index: ELASTIC_INDEX.categories, _id: doc.id } },
      doc,
    ])

    await elastic.bulk({
      refresh: true,
      body,
    })

    countData -= snap.docs.length

    lastDoc = snap.docs[snap.docs.length - 1]

    console.log('countData', countData)
  }
}
