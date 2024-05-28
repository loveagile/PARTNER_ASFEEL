import { SCOUT_STATUS } from '@/constants/common'
import { appAdmin } from '@/libs/firebase/firebaseAdmin'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore'
import * as lodash from 'lodash'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { checkEventExistsId, scoutCandidateSchema } from '../common'
import { addFieldsCreate } from '@/utils/firestore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const sessionCookie = cookies().get('session')

    const { projectId, scoutIds, status } =
      scoutCandidateSchema.validateSync(body)

    const [existsData, _] = await Promise.all([
      getDocs(
        query(
          ColRef.eventProjectsScoutList(projectId),
          where('userId', 'in', scoutIds),
        ),
      ),
      checkEventExistsId(projectId),
    ])

    if (existsData.docs.length !== scoutIds.length) {
      throw {
        data: {
          existsData: existsData.docs.map((doc) => doc.data()),
          scoutIds,
        },
        message: '存在しないユーザーが含まれています',
      }
    }

    let requestUser: DecodedIdToken | undefined
    if (sessionCookie?.value) {
      requestUser = await appAdmin
        .auth()
        .verifySessionCookie(sessionCookie.value, true)
    }

    const promiseArray: any[] = []

    const chunks = lodash.chunk(existsData.docs, 100)

    for (const chunk of chunks) {
      chunk.map((doc) => {
        const data = getDocIdWithData(doc)

        promiseArray.push(
          updateDoc(DocRef.eventProjectsScoutList(data.id, projectId), {
            status,
          }),
        )

        if (status === SCOUT_STATUS.scouted) {
          promiseArray.push(
            setDoc(
              DocRef.scoutedProject(projectId, data.userId),
              addFieldsCreate({
                projectId,
                isChecked: false,
                result: false,
                administratorId: requestUser?.uid,
              }),
            ),
          )
        }
      })

      await Promise.all(promiseArray)
    }

    return NextResponse.json(scoutIds)
  } catch (error) {
    return handleError(error)
  }
}
