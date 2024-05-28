import { organizationMapping } from '@/app/api/organization/common'
import { ELASTIC_INDEX } from '@/constants/common'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
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
// // @ts-ignore
// import Kuroshiro from 'kuroshiro'
// // @ts-ignore
// import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'

export const syncOrganizations = async (elastic: Client) => {
  const indexExists = await elastic.indices.exists({
    index: ELASTIC_INDEX.organizations,
  })

  if (indexExists) {
    await elastic.indices.delete({
      index: ELASTIC_INDEX.organizations,
    })
  }

  await elastic.indices.create({
    index: ELASTIC_INDEX.organizations,
    mappings: {
      properties: organizationMapping as any,
    },
  })

  const countSnap = await getCountFromServer(ColRef.organizations)

  let countData = countSnap.data().count
  let lastDoc: any = null

  console.log('sumCountData', countData)

  // const kuroshiro = new Kuroshiro()
  // const analyzer = new KuromojiAnalyzer({
  //   dictPath: './public/dict',
  // })
  // await kuroshiro.init(analyzer)

  while (countData > 0) {
    const queryClause: QueryConstraint[] = [limit(6000), orderBy(documentId())]

    if (lastDoc) {
      queryClause.push(startAfter(lastDoc))
    }

    const snap = await getDocs(query(ColRef.organizations, ...queryClause))

    const data = await Promise.all(
      snap.docs.map(async (doc) => {
        const dataWithId = getDocIdWithData(doc)

        // Enable this to convert nameKana
        // const nameKana = await kuroshiro.convert(dataWithId.name, {
        //   to: 'katakana',
        // })

        // await updateDoc(DocRef.organization(dataWithId.id), {
        //   nameKana,
        // })

        return addFieldsCreate({ ...dataWithId }, true)
      }),
    )

    const body = data.flatMap((doc) => [
      { index: { _index: ELASTIC_INDEX.organizations, _id: doc.id } },
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
