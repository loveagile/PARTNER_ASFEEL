import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'
import { transformTimestampToDate } from '@/utils/firestore'
import {
  QueryConstraint,
  and,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  try {
    const params = request.nextUrl.searchParams
    const projectId = params.get('projectId')
    const userId = params.get('userId')
    const adminId = params.get('adminId')
    const cursorMessageId = params.get('cursorMessageId')

    if (!projectId || !userId || !adminId) {
      throw 'Invalid parameters'
    }

    const messageRoom = await getDocs(
      query(
        ColRef.messageRooms,
        and(
          where('projectId', '==', projectId),
          where('userId', '==', userId),
          where('memberIds', 'array-contains', adminId),
        ),
      ),
    )

    if (messageRoom.empty) {
      return NextResponse.json({
        messageRoom: null,
        messages: [],
        isNewMessageRoom: true,
      })
    }

    const messageRoomId = messageRoom.docs[0].id

    const clauseMessage: QueryConstraint[] = [
      orderBy('createdAt', 'desc'),
      limit(200),
    ]

    if (cursorMessageId) {
      const messageSnap = await getDoc(
        DocRef.message(messageRoomId, cursorMessageId),
      )

      if (!messageSnap.exists()) {
        throw 'No message found'
      }

      clauseMessage.push(startAfter(messageSnap))
    }

    const messages = await getDocs(
      query(ColRef.messages(messageRoomId), ...clauseMessage),
    )

    return NextResponse.json({
      messageRoom: transformTimestampToDate(
        getDocIdWithData(messageRoom.docs[0]),
      ),
      messages: messages.docs.map((doc) =>
        transformTimestampToDate(getDocIdWithData(doc)),
      ),
    })
  } catch (error) {
    return handleError(error)
  }
}
