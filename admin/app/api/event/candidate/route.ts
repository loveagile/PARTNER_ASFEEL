import { NextRequest, NextResponse } from 'next/server'
import lodash from 'lodash'

import { handleError, parsePageNumber, parseQueryParam } from '@/utils/common'
import { getElasticClient } from '@/utils/elastic'
import {
  QueryDslBoolQuery,
  QueryDslQueryContainer,
} from '@elastic/elasticsearch/lib/api/types'

import { getDoc, getDocs } from 'firebase/firestore'
import { ColRef, DocRef, getDocIdWithData } from '@/libs/firebase/firestore'
import {
  ELASTIC_INDEX,
  SCOUT_STATUS,
  SCOUT_STATUS_OPTIONS,
} from '@/constants/common'
import { Registrant } from '@/features/registrant/models/registrant.model'
import { getTimestampFromDocument } from '@/utils/time'

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams
    const elastic = await getElasticClient()

    const isUnSendOnly = parseQueryParam(params.get('isUnSendOnly'))
    let projectId = params.get('projectId')
    if (!projectId) {
      throw 'ProjectId is required'
    }

    let defaultMustClause: QueryDslBoolQuery['must'] = []
    let mustClause: QueryDslBoolQuery['must'] = []
    let mustNotClause: QueryDslBoolQuery['must_not'] = []

    const perPageParam = params.get('perPage')
    const pageParam = params.get('page')

    let { page, perPage, from, size } = parsePageNumber(pageParam, perPageParam)
    let genders = []
    let ages: number[] = []
    const allScoutListSnapshot = await getDocs(
      ColRef.eventProjectsScoutList(projectId),
    )

    const allScoutList = allScoutListSnapshot.docs.map((doc) =>
      getDocIdWithData(doc),
    )

    if (!allScoutList.length)
      return NextResponse.json({
        data: [],
        pagination: {
          page,
          perPage,
          total: 0,
          allTotal: 0,
        },
      })

    let scoutList = [...allScoutList]

    if (isUnSendOnly) {
      scoutList = allScoutList.filter(
        (scout) => scout.status === SCOUT_STATUS.unsend,
      )
    }

    const addMustClause = handleSearchScoutList(params, scoutList)
    mustClause = [...mustClause, ...addMustClause]

    const addDefaultMustClause = handleSearchScoutList(params, allScoutList)
    defaultMustClause = [...defaultMustClause, ...addDefaultMustClause]

    for (const [key, valueParam] of params.entries()) {
      const value = parseQueryParam(valueParam)

      if (value === undefined || value === null) continue

      switch (key) {
        case 'zipCode': {
          defaultMustClause.push({
            match: {
              zipCode: value,
            },
          })
          mustClause.push({
            match: {
              zipCode: value,
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
                    fields: ['userName', 'id', 'type', 'organization'],
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
            must: defaultMustClause,
            must_not: mustNotClause,
          },
        },
      }),
    ])

    let registrants = await Promise.all(
      data.hits.hits.map(async (item: any) => {
        let data = item._source as any
        const clubs: string[] = []

        Object.values(data?.club || {}).forEach((subClub: any) => {
          clubs.push(...subClub)
        })

        for (let i = 0; i < scoutList.length; i++) {
          const scout = scoutList[i]
          if (scout.userId === item._id) {
            if (scout?.status === SCOUT_STATUS.scouted) {
              const scoutedProjectSnap = await getDoc(
                DocRef.scoutedProject(projectId!, scout.userId),
              )

              if (!scoutedProjectSnap.exists()) {
                return
              }

              const scoutedProject = getDocIdWithData(scoutedProjectSnap)

              data = {
                ...data,
                scoutSendDate: scoutedProject?.createdAt?.seconds,
              }
            }

            data = {
              ...data,
              scoutStatus: SCOUT_STATUS_OPTIONS.find(
                (option) => option.value === scout.status,
              ),
            }
          }
        }

        return {
          ...data,
          id: item._id,
          occupation: lodash.get(data, 'type'),
          createdAt: getTimestampFromDocument(lodash.get(data, 'createdAt')),
          updatedAt: getTimestampFromDocument(lodash.get(data, 'updatedAt')),
          clubs,
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

const handleSearchScoutList = (params: URLSearchParams, scoutList: any[]) => {
  const mustClauseCandidate: QueryDslBoolQuery['must'] = []
  const should: QueryDslQueryContainer[] = []

  scoutList.map((scout: any) => {
    if (!scout?.userId) return

    should.push({
      match: {
        id: {
          query: scout.userId,
          operator: 'and',
        },
      },
    })
  })

  mustClauseCandidate.push({
    bool: {
      should,
    },
  })

  return mustClauseCandidate
}
