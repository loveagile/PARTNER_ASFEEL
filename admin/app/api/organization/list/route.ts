import { ELASTIC_INDEX } from '@/constants/common'
import { Exception } from '@/constants/model'
import {
  ListOrganizationsResponse,
  Organization,
} from '@/features/organization/model/organization.model'
import { handleError, parsePageNumber, parseQueryParam } from '@/utils/common'
import { getElasticClient } from '@/utils/elastic'
import { QueryDslBoolQuery } from '@elastic/elasticsearch/lib/api/types'
import { NextRequest, NextResponse } from 'next/server'
import { createIndexIfNotExists } from '../common'

export async function GET(
  request: NextRequest,
): Promise<NextResponse<ListOrganizationsResponse | Exception>> {
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

    let organizationTypes = []
    let isSuspended = []
    for (const [key, valueParam] of params.entries()) {
      const value = parseQueryParam(valueParam)

      if (value === undefined || value === null) continue

      switch (key) {
        case 'prefecture':
          mustClause.push({
            match: {
              'address.prefecture': {
                query: decodeURIComponent(valueParam),
                operator: 'and',
              },
            },
          })
          break
        case 'organizationType':
          organizationTypes.push(value)
          mustClause = [
            ...mustClause,
            {
              terms: {
                'organizationType.keyword': organizationTypes,
              },
            },
          ]
          break
        case 'isSuspended':
          isSuspended.push(!!value)
          mustClause = [
            ...mustClause,
            {
              terms: {
                isSuspended,
              },
            },
          ]
          break
        case 'keyword':
          const keyword = decodeURIComponent(value)
          if (keyword === '') break

          mustClause.push({
            bool: {
              should: [
                {
                  multi_match: {
                    query: keyword,
                    fields: ['name', 'organizationId'],
                    operator: 'and',
                  },
                },
                // {
                //   wildcard: {
                //     name: {
                //       value: `*${keyword}*`,
                //     },
                //   },
                // },
                // {
                //   wildcard: {
                //     organizationId: {
                //       value: `*${keyword}*`,
                //     },
                //   },
                // },
              ],
            },
          })
          break
        default:
          break
      }
    }

    await elastic.indices.refresh({
      index: ELASTIC_INDEX.organizations,
    })

    const [data, { count: total }, { count: allTotal }] = await Promise.all([
      elastic.search({
        index: ELASTIC_INDEX.organizations,
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
        index: ELASTIC_INDEX.organizations,
        query: {
          bool: {
            must: mustClause,
            must_not: mustNotClause,
          },
        },
      }),

      elastic.count({
        index: ELASTIC_INDEX.organizations,
        query: {
          bool: {
            must_not: mustNotClause,
          },
        },
      }),
    ])

    const organizationsList = await Promise.all(
      data.hits.hits.map(async (item) => {
        const data = item._source as any

        return {
          ...data,
          id: item._id,
        } as Organization
      }),
    )

    return NextResponse.json({
      data: organizationsList,
      pagination: {
        page,
        perPage,
        total,
        allTotal,
      },
    })
  } catch (error: any) {
    return handleError(error)
  }
}
