import { ROLE_NAME } from '@/constants/common'
import { PaginationInfo, UserCustomClaims } from '@/constants/model'
import { appAdmin } from '@/libs/firebase/firebaseAdmin'
import { handleError, parseQueryParam } from '@/utils/common'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams

    const listUsers = await appAdmin.auth().listUsers()

    let isPublish = [] as any[]
    let keyword = ''
    let role = [] as any[]
    for (const [key, valueParam] of params.entries()) {
      const value = parseQueryParam(valueParam)

      if (value === undefined || value === null) continue

      switch (key) {
        case 'keyword':
          keyword = decodeURIComponent(value)
          break
        case 'role':
          role.push(value)
          break
        case 'isPublish':
          isPublish.push(value)
          break
      }
    }

    let allUsersCount = 0

    const filterUsers = listUsers.users.filter((user) => {
      const customClaims = user?.customClaims as UserCustomClaims

      if (
        customClaims?.role !== ROLE_NAME.ADMIN &&
        customClaims?.role !== ROLE_NAME.GENERAL
      )
        return false

      allUsersCount = allUsersCount + 1

      let isMatchKeyword = true
      let isMatchRole = true
      let isMatchIsPublish = true

      if (keyword) {
        isMatchKeyword =
          (customClaims?.nameSei + customClaims?.nameMei)?.includes(keyword) ||
          // customClaims?.nameSeiKana?.includes(keyword) ||
          // customClaims?.nameMeiKana?.includes(keyword) ||
          user?.email?.includes(keyword) ||
          user?.uid?.includes(keyword)
      }

      if (role.length) {
        isMatchRole = role.includes(customClaims?.role as any)
      }

      if (isPublish.length) {
        isMatchIsPublish = isPublish.includes(customClaims?.isPublish)
      }

      return isMatchKeyword && isMatchRole && isMatchIsPublish
    })

    const data = filterUsers
      .map((user) => {
        const customClaims = user?.customClaims as UserCustomClaims

        const createdAt =
          customClaims?.createdAt ||
          new Date(user.metadata.creationTime).getTime()
        const updatedAt = customClaims?.updatedAt || createdAt

        return {
          // createdAt: customClaims?.createdAt,
          // updatedAt: customClaims?.updatedAt,
          // role: customClaims?.role,
          ...customClaims,
          id: user.uid,
          email: user.email,
          fullName: customClaims?.nameSei + customClaims?.nameMei,
          createdAt,
          updatedAt,
        }
      })
      .sort((a, b) => b.createdAt - a.createdAt)

    return NextResponse.json({
      data,
      pagination: {
        total: data.length,
        allTotal: allUsersCount,
      } as PaginationInfo,
    })
  } catch (error) {
    return handleError(error)
  }
}
