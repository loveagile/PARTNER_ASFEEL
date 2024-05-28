import { QueryDslBoolQuery } from '@elastic/elasticsearch/lib/api/types'
import lodash from 'lodash'
import { NextRequest, NextResponse } from 'next/server'

import { ELASTIC_INDEX } from '@/constants/common'
import { Registrant } from '@/features/registrant/models/registrant.model'
import { handleError, parsePageNumber, parseQueryParam } from '@/utils/common'
import { getElasticClient } from '@/utils/elastic'

import { getTimestampFromDocument } from '@/utils/time'
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

    let { page, perPage, from, size } = parsePageNumber(pageParam, perPageParam)
    let genders = []
    let isSuspended = []
    let ages: number[] = []
    for (const [key, valueParam] of params.entries()) {
      const value = parseQueryParam(valueParam)

      if (value === undefined || value === null) continue

      switch (key) {
        case 'clubType': {
          const keyword = decodeURIComponent(value)
          if (keyword === '') break

          mustClause.push({
            bool: {
              should: [
                // cũ trong ES
                {
                  match: {
                    'club.運動系': keyword,
                  },
                },
                // cũ trong ES
                {
                  match: {
                    'club.文化系': keyword,
                  },
                },
                // mới trong ES
                {
                  match: {
                    onlyClubs: keyword,
                  },
                },
                // mới trong ES
                {
                  match: {
                    groupedClubStrings: keyword,
                  },
                },
              ],
            },
          })
          break
        }
        case 'keyword': {
          const keyword = decodeURIComponent(value)
          if (keyword === '') break

          mustClause.push({
            bool: {
              should: [
                {
                  multi_match: {
                    query: keyword,
                    fields: ['userName', 'id', 'type', 'organization', 'userIdOfPrefecture'],
                  },
                },
              ],
            },
          })
          break
        }
        case 'gender': {
          const keyword = decodeURIComponent(value)
          if (keyword === '') break

          genders.push(keyword)
          mustClause = [
            ...mustClause,
            {
              terms: {
                gender: genders,
              },
            },
          ]
          break
        }
        case 'age':
          if (lodash.isNumber(+value) && !lodash.isNaN(+value)) {
            ages.push(+value)
          }
          break
        case 'license': {
          switch (value) {
            case 'teacherLicenseStatus-having':
              mustClause.push({
                bool: {
                  should: [
                    // trong ES thì đang lưu là teacherLicenseState
                    {
                      match: {
                        teacherLicenseState: true,
                      },
                    },
                    // code bên coordinator thì là teacherLicenseStatus
                    {
                      match: {
                        teacherLicenseStatus: true,
                      },
                    },
                    // đúng ra trong firebase phải là teacherLicenseStatus enum
                    {
                      match: {
                        teacherLicenseStatus: 'having',
                      },
                    },
                  ],
                },
              })
              break
            case 'teacherLicenseStatus-scheduledAcquisition':
              mustClause.push({
                bool: {
                  should: [
                    // code bên coordinator thì là teacherLicenseNote
                    {
                      match: {
                        teacherLicenseNote: true,
                      },
                    },
                    // đúng ra trong firebase phải là teacherLicenseStatus enum
                    {
                      match: {
                        teacherLicenseStatus: 'scheduledAcquisition',
                      },
                    },
                  ],
                },
              })
              break
            case 'otherLicense':
              mustClause.push({
                match: {
                  otherLicense: true,
                },
              })
              break
            case 'hasDriverLicense':
              mustClause.push({
                match: {
                  hasDriverLicense: true,
                },
              })
              break
          }
          break
        }
        case 'other': {
          switch (value) {
            case 'isExpeditionPossible':
              mustClause.push({
                bool: {
                  should: [
                    // code bên coordinator thì là isExpeditionPossible
                    {
                      match: {
                        isExpeditionPossible: true,
                      },
                    },
                    // đúng ra trong firebase phải là teacherLicenseStatus enum
                    {
                      match: {
                        isExpeditionPossible: 'possible',
                      },
                    },
                  ],
                },
              })
              break
            case 'experience':
              mustClause.push({
                match: {
                  experience: true,
                },
              })
              break
          }
          break
        }
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
        default:
          break
      }
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

    await elastic.indices.refresh({
      index: ELASTIC_INDEX.privateUsers,
    })

    let [data, { count: total }, { count: allTotal }] = await Promise.all([
      elastic.search({
        index: ELASTIC_INDEX.privateUsers,
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
        index: ELASTIC_INDEX.privateUsers,
        query: {
          bool: {
            must: mustClause,
            must_not: mustNotClause,
          },
        },
      }),

      elastic.count({
        index: ELASTIC_INDEX.privateUsers,
        query: {
          bool: {
            must_not: mustNotClause,
          },
        },
      }),
    ])

    let registrants = await Promise.all(
      data.hits.hits.map(async (item: any) => {
        let data = item._source as any
        // const clubs: string[] = []

        // Object.values(data?.club || {}).forEach((subClub: any) => {
        //   clubs.push(...subClub)
        // })

        return {
          ...data,
          id: item._id,
          userIdOfPrefecture: lodash.get(data, 'userIdOfPrefecture'),
          occupation: lodash.get(data, 'type'),
          createdAt: getTimestampFromDocument(lodash.get(data, 'createdAt')),
          updatedAt: getTimestampFromDocument(lodash.get(data, 'updatedAt')),
          // clubs,
        } as Registrant
      }),
    )

    return NextResponse.json({
      data: registrants,
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
