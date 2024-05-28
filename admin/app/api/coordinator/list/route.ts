import { ELASTIC_INDEX, PROJECT_TYPE_OPTIONS } from '@/constants/common'
import { Exception } from '@/constants/model'
import { ListCoordinatorsResponse } from '@/features/coordinator/model/coordinator.model'
import {
  ColRef,
  DocRef,
  getDocData,
  getDocIdWithData,
} from '@/libs/firebase/firestore'
import { handleError, parsePageNumber, parseQueryParam } from '@/utils/common'
import { getElasticClient } from '@/utils/elastic'
import { QueryDslBoolQuery } from '@elastic/elasticsearch/lib/api/types'
import { getDoc, getDocs } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'
import { createIndexIfNotExists } from '../common'

export async function GET(
  request: NextRequest,
): Promise<NextResponse<ListCoordinatorsResponse | Exception>> {
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

    let mustClauseObject: { [key: string]: any } = {}
    for (const [key, valueParam] of params.entries()) {
      if (key === 'page' || key === 'perPage') continue

      const value = parseQueryParam(valueParam)

      if (value === undefined || value === null) continue

      if (key === 'keyword') {
        const decodeValue = decodeURIComponent(value)
        if (decodeValue) {
          const searchKeywordClause = await handleSearchKeyword(decodeValue)
          mustClause = [...mustClause, ...searchKeywordClause]
        }
        continue
      }

      const currentValues = mustClauseObject[key] || []
      mustClauseObject[key] = currentValues.concat(value)
    }

    for (const [key, value] of Object.entries(mustClauseObject)) {
      let termsKey = `${key}.keyword`

      if (key === 'isSuspended') {
        termsKey = key
      }

      mustClause = [
        ...mustClause,
        {
          terms: {
            [termsKey]: value,
          },
        },
      ]
    }

    await elastic.indices.refresh({
      index: ELASTIC_INDEX.coordinators,
    })

    const [data, { count: total }, { count: allTotal }] = await Promise.all([
      elastic.search({
        index: ELASTIC_INDEX.coordinators,
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
        index: ELASTIC_INDEX.coordinators,
        query: {
          bool: {
            must: mustClause,
            must_not: mustNotClause,
          },
        },
      }),

      elastic.count({
        index: ELASTIC_INDEX.coordinators,
        query: {
          bool: {
            must_not: mustNotClause,
          },
        },
      }),
    ])

    const coordinatorsList = await Promise.all(
      data.hits.hits.map(async (item) => {
        const data = item._source as any

        const [prefecturesSnapshot, organizationTypeSnapshot] =
          await Promise.all([
            getDoc(DocRef.prefecture(data.prefectures)),
            getDoc(DocRef.organizationType(data.organizationType)),
          ])

        return {
          ...data,
          prefectures: getDocData(prefecturesSnapshot).prefecture,
          organizationType: getDocData(organizationTypeSnapshot).name,
          id: item._id,
        }
      }),
    )

    return NextResponse.json({
      data: coordinatorsList as any,
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

const handleSearchKeyword = async (keyword: string) => {
  const mustClause: QueryDslBoolQuery['must'] = []
  const [prefecturesSnapshot, organizationTypeSnapshot] = await Promise.all([
    getDocs(ColRef.prefectures),
    getDocs(ColRef.organizationType),
  ])

  const prefectures = prefecturesSnapshot.docs.map((doc) =>
    getDocIdWithData(doc),
  )

  const prefectureIds = prefectures.reduce((prev: any[], current) => {
    const result = current.prefecture.includes(keyword)
      ? [...prev, current.id]
      : prev
    return result
  }, [])

  // const cities = citiesSnapshot.docs.map((doc) => getDocIdWithData(doc))
  // const cityIds = cities.reduce((prev: any[], current) => {
  //   const result = current.city.includes(keyword) ? [...prev, current.id] : prev
  //   return result
  // }, [])

  const projectTypeValues = PROJECT_TYPE_OPTIONS.reduce(
    (item: any[], current) =>
      current.label.includes(keyword) ? [...item, current.value] : [],
    [],
  )

  const organizationType = organizationTypeSnapshot.docs.map((doc) =>
    getDocIdWithData(doc),
  )

  const organizationTypeIds = organizationType.reduce(
    (prev: any[], current) => {
      const result = current.name.includes(keyword)
      return result ? [...prev, current.id] : prev
    },
    [],
  )

  mustClause.push({
    bool: {
      should: [
        {
          terms: {
            'prefectures.keyword': prefectureIds,
          },
        },
        {
          terms: {
            'projectType.keyword': projectTypeValues,
          },
        },
        {
          terms: {
            'organizationType.keyword': organizationTypeIds,
          },
        },
        // {
        //   wildcard: {
        //     organizationName: `*${keyword}*`,
        //   },
        // },
        {
          match: {
            organizationName: keyword,
          },
        },
        {
          query_string: {
            default_field: 'coordinatorIdOfPrefecture',
            query: `*${keyword}*`,
          },
        },
      ],
    },
  })

  return mustClause
}
