import { handleError } from '@/utils/common'
import { NextRequest, NextResponse } from 'next/server'
import { createMessageRoomSchema } from '../common'
import { Timestamp, addDoc, getDoc } from 'firebase/firestore'
import { ColRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { addFieldsCreate } from '@/utils/firestore'

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json()

    const { memberIds, projectType, projectId, userId } =
      createMessageRoomSchema.validateSync(body)

    if (memberIds.length === 0) {
      throw 'Invalid parameters'
    }

    const newMessageRoomRef = await addDoc(
      ColRef.messageRooms,
      addFieldsCreate({
        memberIds,
        projectType,
        projectId,
        userId,
        members: memberIds.map((memberId) => ({
          lastAccessedAt: Timestamp.now(),
          userId: memberId,
          unreadCount: 0,
        })),
      }),
    )

    const newMessageRoomSnap = await getDoc(newMessageRoomRef)

    return NextResponse.json(getDocIdWithData(newMessageRoomSnap))
  } catch (error) {
    return handleError(error)
  }
}
