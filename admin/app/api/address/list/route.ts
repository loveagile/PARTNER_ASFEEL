import { ELASTIC_INDEX } from '@/constants/common'
import { handleError, parsePageNumber, parseQueryParam } from '@/utils/common'
import { getElasticClient } from '@/utils/elastic'
import { QueryDslBoolQuery } from '@elastic/elasticsearch/lib/api/types'
import { NextRequest, NextResponse } from 'next/server'
import { createIndexIfNotExists } from '../common'

export async function GET(request: NextRequest) {
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

    for (const [key, valueParam] of params.entries()) {
      const value = parseQueryParam(valueParam)

      if (value === undefined || value === null) continue

      switch (key) {
        case 'prefecture':
          mustClause.push({
            match: {
              prefecture: {
                query: value,
                operator: 'and',
              },
            },
          })
          break
        case 'area':
          mustClause.push({
            match: {
              area: {
                query: value,
                operator: 'and',
              },
            },
          })
          break
        case 'keyword':
          if (!value) break
          mustClause.push({
            bool: {
              should: [
                {
                  match: {
                    zip: {
                      query: value,
                      operator: 'and',
                    },
                  },
                },
                {
                  match: {
                    address1Full: {
                      query: decodeURIComponent(value),
                      operator: 'and',
                    },
                  },
                },
                {
                  match: {
                    cityText: {
                      query: decodeURIComponent(value),
                      operator: 'and',
                    },
                  },
                },
                {
                  match: {
                    prefecture: {
                      query: decodeURIComponent(value),
                      operator: 'and',
                    },
                  },
                },
                {
                  match: {
                    areaTextFull: {
                      query: decodeURIComponent(value),
                      operator: 'and',
                    },
                  },
                },
              ],
            },
          })
          break
        default:
          break
      }
    }

    await elastic.indices.refresh({
      index: ELASTIC_INDEX.addresses,
    })

    const [data, { count: total }, { count: allTotal }] = await Promise.all([
      elastic.search({
        index: ELASTIC_INDEX.addresses,
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
        index: ELASTIC_INDEX.addresses,
        query: {
          bool: {
            must: mustClause,
            must_not: mustNotClause,
          },
        },
      }),

      elastic.count({
        index: ELASTIC_INDEX.addresses,
        query: {
          bool: {
            must_not: mustNotClause,
          },
        },
      }),
    ])

    const addressesList = await Promise.all(
      data.hits.hits.map(async (item) => {
        const data = item._source as any

        return {
          ...data,
          id: item._id,
        }
      }),
    )

    return NextResponse.json({
      data: addressesList as any,
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

// const handleSearchKeyword = async (keyword: string) => {
//   const mustClause: QueryDslBoolQuery['must'] = []
//   const [prefecturesSnapshot, areasSnapshot] = await Promise.all([
//     getDocs(ColRef.prefectures),
//     getDocs(ColRef.areas),
//   ])

//   const prefectures = prefecturesSnapshot.docs.map((doc) =>
//     getDocIdWithData(doc),
//   )

//   const prefectureIds = prefectures.reduce((prev: any[], current) => {
//     const result = current.prefecture.includes(keyword)
//       ? [...prev, current.id]
//       : prev
//     return result
//   }, [])

//   const areas = areasSnapshot.docs.map((doc) => getDocIdWithData(doc))
//   const areaIds = areas.reduce((prev: any[], current) => {
//     const result = current.area.includes(keyword) ? [...prev, current.id] : prev
//     return result
//   }, [])

//   mustClause.push({
//     bool: {
//       should: [
//         {
//           terms: {
//             'prefecture.keyword': prefectureIds,
//           },
//         },
//         {
//           terms: {
//             'area.keyword': areaIds,
//           },
//         },
//         {
//           query_string: {
//             fields: ['zip', 'address1', 'city'],
//             query: `*${keyword}*`,
//           },
//         },
//       ],
//     },
//   })

//   return mustClause
// }
