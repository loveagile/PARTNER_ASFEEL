import { NextRequest, NextResponse } from 'next/server'

import { ErrorValidation } from '@/constants/error'
import { handleError, parseQueryParam } from '@/utils/common'

import { documentId, getDoc, getDocs, query, where } from 'firebase/firestore'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params
    const isShowName = parseQueryParam(
      request.nextUrl.searchParams.get('isShowName'),
    )

    if (!id) {
      throw new Error(ErrorValidation.VALIDATE_ERROR.message)
    }

    const RegistrantSnapshot = await getDocs(
      query(ColRef.privateUsers, where(documentId(), '==', id)),
    )

    const detailRegistrant = getDocIdWithData(RegistrantSnapshot.docs[0])

    if (detailRegistrant?.clubs && detailRegistrant?.clubs?.length) {
      const clubs = await Promise.all(
        detailRegistrant?.clubs?.map(async (clubId: string) => {
          const snapshot = await getDoc(DocRef.category(clubId))
          if (snapshot?.exists()) {
            let category = getDocIdWithData(snapshot) as any

            if (isShowName) {
              const snapshot = await getDoc(
                DocRef.largeCategory(category?.largeCategory),
              )

              if (snapshot?.exists()) {
                const largeCategory = getDocIdWithData(snapshot)
                category = {
                  ...category,
                  largeCategory: largeCategory.name,
                }
              }
            }

            return category
          }
          return null
        }),
      )
      detailRegistrant.clubs = clubs
    }

    if (
      detailRegistrant?.areasOfActivity &&
      detailRegistrant?.areasOfActivity?.length
    ) {
      const areasOfActivity = await Promise.all(
        detailRegistrant?.areasOfActivity?.map(async (cityId: string) => {
          const snapshot = await getDoc(DocRef.city(cityId))
          if (snapshot?.exists()) {
            const city = getDocIdWithData(snapshot) as any

            if (isShowName) {
              const snapshot = await getDoc(DocRef.prefecture(city?.prefecture))

              if (snapshot?.exists()) {
                const prefecture = getDocIdWithData(snapshot)
                city.prefectureName = prefecture.prefecture
              }
            }

            return city
          }
          return null
        }),
      )
      detailRegistrant.areasOfActivity = areasOfActivity
    }

    if (isShowName && detailRegistrant?.address?.prefecture) {
      const snapshot = await getDoc(
        DocRef.prefecture(detailRegistrant?.address?.prefecture),
      )

      if (snapshot?.exists()) {
        const prefecture = getDocIdWithData(snapshot)
        detailRegistrant.address.prefectureName = prefecture.prefecture
      }
    }

    return NextResponse.json(detailRegistrant)
  } catch (error) {
    return handleError(error)
  }
}
