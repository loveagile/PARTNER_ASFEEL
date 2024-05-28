import { SCOUT_STATUS } from '@/constants/common'
import { appAdmin } from '@/libs/firebase/firebaseAdmin'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import {
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import * as lodash from 'lodash'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { scoutCandidateSchema } from '../common'
import { addFieldsCreate } from '@/utils/firestore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const sessionCookie = cookies().get('session')

    const { projectId, scoutIds, status } =
      scoutCandidateSchema.validateSync(body)

    console.log('body', body)

    const [existsData, currentProjectSnap] = await Promise.all([
      getDocs(
        query(
          ColRef.leadersWantedProjectsScoutList(projectId),
          where('userId', 'in', scoutIds),
        ),
      ),
      getDoc(DocRef.leadersWantedProject(projectId)),
    ])

    const currentProject = getDocIdWithData(currentProjectSnap)

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
    existsData.docs.map((doc) => {
      const data = getDocIdWithData(doc)

      promiseArray.push(
        updateDoc(DocRef.leadersWantedProjectsScoutList(data.id, projectId), {
          status,
        }),
      )

      if (status === SCOUT_STATUS.scouted) {
        console.log('scouted', projectId, data.userId)
        console.log('requestUser?.uid', requestUser?.uid)
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

    const chunks = lodash.chunk(promiseArray, 100)
    for (const chunk of chunks) {
      await Promise.all(chunk)
    }

    return NextResponse.json(scoutIds)
  } catch (error) {
    return handleError(error)
  }
}
