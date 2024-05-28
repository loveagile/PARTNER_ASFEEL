import { NextRequest, NextResponse } from 'next/server'
import { handleError, parseQueryParam } from '@/utils/common'
import { ErrorValidation } from '@/constants/error'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { getDoc, getDocs } from 'firebase/firestore'

enum PROJECT_STATUS {
  APPLIED = '応募',
  SCOUT = 'スカウト',
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id: userId } = params
    const isEventProjects = parseQueryParam(
      request.nextUrl.searchParams.get('isEventProjects'),
    )

    console.log('userId', userId)

    if (!userId) {
      throw new Error(ErrorValidation.VALIDATE_ERROR.message)
    }

    const scoutSnap = await getDocs(ColRef.scoutedProjects(userId))
    const scoutedProjects = scoutSnap.docs.map((doc) => getDocIdWithData(doc))
    const scoutedProjectIds = scoutedProjects.map((item) => item?.projectId)

    const appliedSnap = await getDocs(ColRef.appliedProjects(userId))
    const appliedProjects = appliedSnap.docs.map((doc) => getDocIdWithData(doc))

    const appliedPromise = appliedProjects.map(async (item) => {
      const projectId = item?.projectId

      if (!projectId) return

      console.log('projectId', projectId)

      const snap = await getDoc(DocRef.leadersWantedProject(projectId))

      if (!snap.exists()) {
        console.log('No such appliedProjects: ', projectId)
        return
      }

      const project = getDocIdWithData(snap)

      console.log('project', project?.id)

      const snapScouter = await getDoc(
        DocRef.leadersWantedProjectsScoutList(userId, projectId),
      )

      if (!snapScouter.exists()) {
        return
      }

      const scouter = getDocIdWithData(snapScouter)

      console.log('scoutList', scouter)

      return {
        projectStatus: PROJECT_STATUS.APPLIED,
        project,
        scouter,
      }
    })

    const appliedProject = await Promise.all([...appliedPromise])

    const result = appliedProject.reduce((prev: any[], cur: any) => {
      if (!cur) return prev
      if (scoutedProjectIds.includes(cur.project.id)) {
        return [
          ...prev,
          {
            ...cur,
            projectStatus: PROJECT_STATUS.SCOUT,
          },
        ]
      }

      return [...prev, cur]
    }, [])

    return NextResponse.json(result)
  } catch (error) {
    handleError(error)
  }
}
