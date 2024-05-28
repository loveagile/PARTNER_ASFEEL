import { ErrorValidation } from '@/constants/error'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'
import { documentId, getDoc, getDocs, query, where } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params

    if (!id) {
      throw new Error(ErrorValidation.VALIDATE_ERROR.message)
    }

    const recruitmentSnapshot = await getDocs(
      query(ColRef.leadersWantedProjects, where(documentId(), '==', id)),
    )

    const detailRecruitment = getDocIdWithData(recruitmentSnapshot.docs[0])

    let data = {
      ...detailRecruitment,
      confirmEmail: detailRecruitment?.email,
    } as any

    if (data?.applyForProject) {
      const snapshot = await getDoc(DocRef.eventProject(data.applyForProject))

      if (snapshot.exists()) {
        data = {
          ...data,
          applyForProjectData: getDocIdWithData(snapshot),
        }
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    return handleError(error)
  }
}
