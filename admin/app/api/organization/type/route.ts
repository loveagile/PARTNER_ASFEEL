import { ColRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { handleError } from '@/utils/common'
import { getDocs, orderBy, query } from 'firebase/firestore'
import { NextResponse } from 'next/server'
import { createOrganizationTypeIfNotExist } from '../common'

export async function GET() {
  try {
    await createOrganizationTypeIfNotExist()
    const organizationTypeSnapshot = await getDocs(
      query(ColRef.organizationType, orderBy('createdAt')),
    )

    const organizationType = organizationTypeSnapshot.docs.map((doc) => {
      return getDocIdWithData(doc)
    })

    return NextResponse.json(organizationType)
  } catch (error) {
    return handleError(error)
  }
}
