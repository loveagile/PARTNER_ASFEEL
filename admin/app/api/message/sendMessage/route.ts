import { MESSAGE_TYPE } from '@/constants/common'
import { ColRef, DocRef, getDocData } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'
import { addFieldsCreate, addFieldsUpdate } from '@/utils/firestore'
import { addDoc, getDoc, updateDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'
import { sendMessageSchema } from '../common'

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json()

    const { messageRoomId, messages } = sendMessageSchema.validateSync(body)

    if (messages.length === 0) {
      return NextResponse.json([])
    }

    const messageRoomSnap = await getDoc(DocRef.messageRoom(messageRoomId))

    if (!messageRoomSnap.exists()) {
      throw 'No message room found'
    }

    const messageRoom = getDocData(messageRoomSnap)

    const textMessages = messages.filter(
      (message) => message.type === MESSAGE_TYPE.text,
    )

    await Promise.all(
      textMessages.map((message) =>
        addDoc(
          ColRef.messages(messageRoomId),
          addFieldsCreate({
            ...message,
            fileUrl: null,
          }),
        ),
      ),
    )

    const otherMessages = messages.filter(
      (message) => message.type !== MESSAGE_TYPE.text,
    )

    await Promise.all(
      otherMessages.map((message) =>
        addDoc(ColRef.messages(messageRoomId), addFieldsCreate(message)),
      ),
    )

    const lastMessage = messages[0].text || ''

    const updateMembers = messageRoom.members.map((member: any) => {
      if (member.userId === messages[0].senderId) {
        return member
      } else {
        return {
          ...member,
          unreadCount: member.unreadCount + messages.length,
        }
      }
    })

    await updateDoc(
      DocRef.messageRoom(messageRoomId),
      addFieldsUpdate({
        ...messageRoom,
        lastMessage,
        members: updateMembers,
      }),
    )

    return NextResponse.json(true)
  } catch (error) {
    return handleError(error)
  }
}
