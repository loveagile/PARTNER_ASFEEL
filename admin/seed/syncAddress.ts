import { addressMappings } from '@/app/api/address/common'
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

export const syncAddress = async (elastic: Client) => {
  const indexExists = await elastic.indices.exists({
    index: ELASTIC_INDEX.addresses,
  })

  if (indexExists) {
    await elastic.indices.delete({
      index: ELASTIC_INDEX.addresses,
    })
  }

  await elastic.indices.create({
    index: ELASTIC_INDEX.addresses,
    mappings: {
      properties: addressMappings as any,
    },
  })

  const countAddressSnap = await getCountFromServer(ColRef.addresses)

  let countAddress = countAddressSnap.data().count
  let lastDoc: any = null

  while (countAddress > 0) {
    const queryClause: QueryConstraint[] = [limit(6000), orderBy(documentId())]

    if (lastDoc) {
      queryClause.push(startAfter(lastDoc))
    }

    const snap = await getDocs(query(ColRef.addresses, ...queryClause))

    const data = snap.docs.map((doc) =>
      addFieldsCreate(getDocIdWithData(doc), true),
    )

    const body = data.flatMap((doc) => [
      { index: { _index: ELASTIC_INDEX.addresses, _id: doc.id } },
      doc,
    ])

    await elastic.bulk({
      refresh: true,
      body,
    })

    countAddress -= snap.docs.length

    lastDoc = snap.docs[snap.docs.length - 1]

    console.log('countAddress', countAddress)
  }
}
