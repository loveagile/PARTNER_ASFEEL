import { ColRef, DocRef } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'
import { Timestamp, getDocs, query, updateDoc, where } from 'firebase/firestore'
import * as lodash from 'lodash'
import { NextRequest, NextResponse } from 'next/server'
import { modifySelectionSchema } from '../common'

export const PUT = async (request: NextRequest) => {
  try {
    const body = await request.json()

    const { projectId, usersData } = modifySelectionSchema.validateSync(body)

    for (let i = 0; i < usersData.length; i++) {
      const user = usersData[i]

      const selectionCol = await getDocs(
        query(
          ColRef.leadersWantedProjectsSelectionList(projectId),
          where('userId', '==', user.id),
        ),
      )

      if (!selectionCol.empty) {
        const currentDoc = selectionCol.docs[0]
        let updatedData = lodash.omitBy(
          {
            status: user.status,
            interviewDate: user.interviewDate
              ? Timestamp.fromDate(new Date(user.interviewDate))
              : null,
          },
          lodash.isUndefined,
        )

        await updateDoc(
          DocRef.leadersWantedProjectsSelectionList(currentDoc.id, projectId),
          updatedData,
        )
      } else {
        throw 'Document not found'
      }
    }

    return NextResponse.json(true)
  } catch (error) {
    return handleError(error)
  }
}
