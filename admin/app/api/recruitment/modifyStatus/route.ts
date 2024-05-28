import { COMMON_STATUS, ELASTIC_INDEX } from '@/constants/common'
import { DocRef } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'
import { getElasticClient } from '@/utils/elastic'
import { Timestamp, updateDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'
import { checkExistsId, modifyStatusSchema } from '../common'

export async function PUT(request: NextRequest) {
  try {
    const [body, elastic] = await Promise.all([
      request.json(),
      getElasticClient(),
    ])

    const { id, status: modifyStatus } = await modifyStatusSchema.validateSync(
      body,
    )

    const recruitmentData = await checkExistsId(id)

    if (recruitmentData.status === modifyStatus) {
      return NextResponse.json({})
    }

    let elasticData = {
      status: modifyStatus,
    } as any

    if (modifyStatus === COMMON_STATUS.IN_PUBLIC) {
      elasticData = {
        ...elasticData,
        startedAt: Timestamp.now(),
      }
    } else if (modifyStatus === COMMON_STATUS.FINISH) {
      elasticData = {
        ...elasticData,
        finishedAt: Timestamp.now(),
      }
    }

    await Promise.all([
      updateDoc(DocRef.leadersWantedProject(id), {
        status: modifyStatus as string,
      }),
      elastic.update({
        index: ELASTIC_INDEX.leadersWantedProjects,
        id,
        doc: elasticData,
      }),
    ])

    return NextResponse.json({})
  } catch (error) {
    return handleError(error)
  }
}
