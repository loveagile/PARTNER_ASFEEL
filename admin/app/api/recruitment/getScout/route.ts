import { QueryDslBoolQuery } from '@elastic/elasticsearch/lib/api/types'
import { NextRequest, NextResponse } from 'next/server'

import { ELASTIC_INDEX } from '@/constants/common'
import { handleError, parsePageNumber, parseQueryParam } from '@/utils/common'
import { getElasticClient } from '@/utils/elastic'
import * as lodash from 'lodash'

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams
    const elastic = await getElasticClient()
    const isUnSendOnly = parseQueryParam(params.get('isUnSendOnly'))
    let projectId = params.get('projectId')

    if (!projectId) {
      throw 'ProjectId is required'
    }

    const defaultClause: QueryDslBoolQuery['must'] = [
      {
        match: {
          projectId: projectId,
        },
      },
    ]
    let mustClause: QueryDslBoolQuery['must'] = [...defaultClause]
    let mustNotClause: QueryDslBoolQuery['must_not'] = []

    const perPageParam = params.get('perPage')
    const pageParam = params.get('page')

    let { page, perPage, from, size } = parsePageNumber(pageParam, perPageParam)

    const genders = []
    const ages = []
    const licenses = []
    const other = []
    for (const [key, valueParam] of params.entries()) {
      let value = parseQueryParam(valueParam)

      if (!value) continue

      switch (key) {
        case 'keyword':
          mustClause.push({
            match: {
              organization: decodeURIComponent(value),
            },
          })
          break
        case 'isUnSendOnly':
          mustClause.push({
            terms: {
              status: ['unsend'],
            },
          })
          break
        case 'gender':
          genders.push(decodeURIComponent(value))
        case 'age':
          if (lodash.isNumber(+value) && !lodash.isNaN(+value)) {
            ages.push(+value)
          }
          break
        case 'license':
          licenses.push(value)
          break
        case 'other':
          other.push(value)
          break
        default:
          break
      }
    }

    if (genders.length) {
      mustClause.push({
        bool: {
          should: genders.map((gender) => {
            return {
              match: {
                gender: {
                  query: gender,
                  operator: 'and',
                },
              },
            }
          }),
        },
      })
    }

    if (ages.length) {
      mustClause.push({
        bool: {
          should: ages.map((age) => {
            return {
              range: {
                age: {
                  gte: age,
                  lt: age === 60 ? 1000 : age + 10,
                },
              },
            }
          }),
        },
      })
    }

    if (licenses.length > 0) {
      mustClause.push({
        bool: {
          should: licenses.map((license) => {
            return {
              term: {
                [license]: true,
              },
            }
          }),
        },
      })
    }

    if (other.length > 0) {
      mustClause.push({
        bool: {
          should: other.map((other) => {
            return {
              term: {
                [other]: true,
              },
            }
          }),
        },
      })
    }

    await elastic.indices.refresh({
      index: ELASTIC_INDEX.leadersWantedProjectsScoutList,
    })

    const [data, { count: total }, { count: allTotal }] = await Promise.all([
      elastic.search({
        index: ELASTIC_INDEX.leadersWantedProjectsScoutList,
        from,
        size,
        query: {
          bool: {
            must: mustClause,
            must_not: mustNotClause,
          },
        },
        sort: {
          'status.keyword': {
            order: 'desc',
          },
        },
      }),

      elastic.count({
        index: ELASTIC_INDEX.leadersWantedProjectsScoutList,
        query: {
          bool: {
            must: mustClause,
            must_not: mustNotClause,
          },
        },
      }),

      elastic.count({
        index: ELASTIC_INDEX.leadersWantedProjectsScoutList,
        query: {
          bool: {
            must: defaultClause,
            must_not: mustNotClause,
          },
        },
      }),
    ])

    const dataScout = data.hits.hits.map((item: any) => {
      const source = item._source
      return {
        ...source,
        id: source.userId,
        userName: `${source?.name?.sei || ''}${source?.name?.mei || ''}`,
        occupation: source?.type,
        createdAt: (Number(source?.createdAt?.seconds) || 0) * 1000,
        scoutSendDate: (Number(source?.scoutAt?.seconds) || 0) * 1000,
        scoutStatus: source?.status,
      }
    })

    return NextResponse.json({
      data: dataScout,
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
