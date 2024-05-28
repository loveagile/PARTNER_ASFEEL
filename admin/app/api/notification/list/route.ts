import { ELASTIC_INDEX } from '@/constants/common'
import { Exception } from '@/constants/model'
import { ListNotificationsResponse } from '@/features/notification/model/notification.model'
import { DocRef, getDocData } from '@/libs/firebase/firestore'
import { handleError, parsePageNumber, parseQueryParam } from '@/utils/common'
import { getElasticClient } from '@/utils/elastic'
import { QueryDslBoolQuery } from '@elastic/elasticsearch/lib/api/types'
import { getDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'
import { createIndexIfNotExists } from '../common'

export async function GET(
  request: NextRequest,
): Promise<NextResponse<ListNotificationsResponse | Exception>> {
  try {
    const params = request.nextUrl.searchParams

    const elastic = await getElasticClient()

    await createIndexIfNotExists(elastic)

    let mustClause: QueryDslBoolQuery['must'] = []
    let mustNotClause: QueryDslBoolQuery['must_not'] = []

    const perPageParam = params.get('perPage')
    const pageParam = params.get('page')

    const { page, perPage, from, size } = parsePageNumber(
      pageParam,
      perPageParam,
    )

    let status = []
    let cities = []
    for (const [key, valueParam] of params.entries()) {
      const value = parseQueryParam(valueParam)

      if (value === undefined || value === null || value === '') continue

      switch (key) {
        case 'prefecture':
          mustClause.push({
            match: {
              prefecture: value,
            },
          })
          break
        case 'cities':
          cities.push(value)
          mustClause = [
            ...mustClause,
            {
              terms: {
                'cities.keyword': cities,
              },
            },
          ]
          break
        case 'status':
          status.push(value)
          mustClause = [
            ...mustClause,
            {
              terms: {
                'status.keyword': status,
              },
            },
          ]
          break
        case 'keyword':
          if (value === '') break

          mustClause.push({
            match: {
              title: decodeURIComponent(value),
            },
          })
          break
        default:
          break
      }
    }

    await elastic.indices.refresh({
      index: ELASTIC_INDEX.notifications,
    })

    const [data, { count: total }, { count: allTotal }] = await Promise.all([
      elastic.search({
        index: ELASTIC_INDEX.notifications,
        from,
        size,
        query: {
          bool: {
            must: mustClause,
            must_not: mustNotClause,
          },
        },
        sort: [
          {
            createdAt: {
              order: 'desc',
            },
          },
        ],
      }),

      elastic.count({
        index: ELASTIC_INDEX.notifications,
        query: {
          bool: {
            must: mustClause,
            must_not: mustNotClause,
          },
        },
      }),

      elastic.count({
        index: ELASTIC_INDEX.notifications,
        query: {
          bool: {
            must_not: mustNotClause,
          },
        },
      }),
    ])

    const notificationsList = await Promise.all(
      data.hits.hits.map(async (item) => {
        const data = item._source as any

        if (data?.prefecture) {
          const prefectureSnapshot = await getDoc(
            DocRef.prefecture(data.prefecture),
          )
          data.prefecture = getDocData(prefectureSnapshot).prefecture
        }

        return {
          ...data,
          id: item._id,
        }
      }),
    )

    return NextResponse.json({
      data: notificationsList as any,
      pagination: {
        page,
        perPage,
        total,
        allTotal,
      },
    })
  } catch (error) {
    return handleError(error)
  }
}
