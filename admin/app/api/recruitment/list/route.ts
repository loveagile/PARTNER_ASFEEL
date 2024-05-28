import { handleError, parsePageNumber, parseQueryParam } from '@/utils/common'
import { getElasticClient } from '@/utils/elastic'
import { NextRequest, NextResponse } from 'next/server'
import { createIndexIfNotExists } from '../common'
import {
  QueryDslBoolQuery,
  QueryDslQueryContainer,
} from '@elastic/elasticsearch/lib/api/types'
import { ELASTIC_INDEX, COMMON_STATUS } from '@/constants/common'

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams

    const elastic = await getElasticClient()

    await createIndexIfNotExists(elastic)

    let mustClause: QueryDslBoolQuery['must'] = []
    let mustNotClause: QueryDslBoolQuery['must_not'] = []

    const perPageParam = params.get('perPage')
    const pageParam = params.get('page')
    const status = params.get('status') || COMMON_STATUS.IN_PUBLIC

    const { page, perPage, from, size } = parsePageNumber(
      pageParam,
      perPageParam,
    )

    // let gender = []
    // let isPublish = []
    let genderClause: QueryDslQueryContainer[] = []
    let isPublishClause: QueryDslQueryContainer[] = []

    for (const [key, valueParam] of params.entries()) {
      const value = parseQueryParam(valueParam)

      if (value === undefined || value === null) continue

      switch (key) {
        case 'isOnly':
          if (!value) break
          const filterItems = ['candidate', 'message']
          const fieldQueries = filterItems.map((field) => ({
            term: { [field]: true },
          }))

          mustClause.push({
            bool: {
              should: fieldQueries,
            },
          })
          break
        case 'prefecture':
          mustClause.push({
            match: {
              workplace: {
                query: decodeURIComponent(value),
                operator: 'and',
              },
            },
          })
          break
        case 'eventType':
          mustClause.push({
            match: {
              eventType: {
                query: decodeURIComponent(value),
                operator: 'and',
              },
            },
          })
          break
        case 'eventName':
          mustClause.push({
            match: {
              eventName: {
                query: decodeURIComponent(value),
                operator: 'and',
              },
            },
          })
          break
        case 'gender':
          const genderValue = decodeURIComponent(value)
          genderClause.push({
            match: {
              gender: {
                query: genderValue,
                operator: 'and',
              },
            },
          })
          break
        case 'isPublish':
          isPublishClause.push({
            match: {
              isPublish: {
                query: value,
              },
            },
          })

          break
        case 'keyword':
          if (value === '') break
          mustClause.push({
            match: {
              organizationName: decodeURIComponent(value),
            },
          })
        default:
          break
      }
    }

    const statusClause: QueryDslQueryContainer = {
      match: {
        status: {
          query: status,
          operator: 'and',
        },
      },
    }

    mustClause = [
      ...mustClause,
      {
        bool: {
          should: genderClause,
        },
      },
      {
        bool: {
          should: isPublishClause,
        },
      },
      statusClause,
    ]

    await elastic.indices.refresh({
      index: ELASTIC_INDEX.leadersWantedProjects,
    })

    const [data, { count: total }, { count: allTotal }] = await Promise.all([
      elastic.search({
        index: ELASTIC_INDEX.leadersWantedProjects,
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
            'createdAt.seconds': {
              order: 'desc',
            },
          },
        ],
      }),

      elastic.count({
        index: ELASTIC_INDEX.leadersWantedProjects,
        query: {
          bool: {
            must: mustClause,
            must_not: mustNotClause,
          },
        },
      }),

      elastic.count({
        index: ELASTIC_INDEX.leadersWantedProjects,
        query: {
          bool: {
            must: statusClause,
            must_not: mustNotClause,
          },
        },
      }),
    ])

    const recruitmentList = data.hits.hits.map((item) => {
      let data = item._source as any

      data = {
        ...data,
        createdAt: data.createdAt.seconds * 1000,
        startedAt: data.startedAt.seconds * 1000,
        finishedAt: data.finishedAt.seconds * 1000,
        isChecked: data?.ischecked || false, // Name is wrong in the ES
      }

      return data
    })

    return NextResponse.json({
      data: recruitmentList,
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
