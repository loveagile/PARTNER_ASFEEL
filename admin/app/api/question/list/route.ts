import { ELASTIC_INDEX } from '@/constants/common'
import { Exception } from '@/constants/model'
import { ListQuestionsResponse } from '@/features/question/model/question.model'
import { DocRef, getDocData } from '@/libs/firebase/firestore'
import { handleError, parsePageNumber, parseQueryParam } from '@/utils/common'
import { getElasticClient } from '@/utils/elastic'
import { QueryDslBoolQuery } from '@elastic/elasticsearch/lib/api/types'
import { getDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'
import { createIndexIfNotExists } from '../common'

export async function GET(
  request: NextRequest,
): Promise<NextResponse<ListQuestionsResponse | Exception>> {
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

    let isPublish = []
    for (const [key, valueParam] of params.entries()) {
      const value = parseQueryParam(valueParam)

      if (value === undefined || value === null) continue

      switch (key) {
        case 'prefecture':
          mustClause.push({
            match: {
              prefecture: value,
            },
          })
          break
        case 'isPublish':
          isPublish.push(value)
          mustClause = [
            ...mustClause,
            {
              terms: {
                isPublish,
              },
            },
          ]
          break
        case 'keyword':
          if (value === '') break
          mustClause.push({
            match: {
              question: decodeURIComponent(value),
            },
            // wildcard: {
            //   question: {
            //     value: `${decodeURIComponent(value)}*`,
            //   },
            // },
          })
          break
        default:
          break
      }
    }

    await elastic.indices.refresh({
      index: ELASTIC_INDEX.questions,
    })

    const [data, { count: total }, { count: allTotal }] = await Promise.all([
      elastic.search({
        index: ELASTIC_INDEX.questions,
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
        index: ELASTIC_INDEX.questions,
        query: {
          bool: {
            must: mustClause,
            must_not: mustNotClause,
          },
        },
      }),

      elastic.count({
        index: ELASTIC_INDEX.questions,
        query: {
          bool: {
            must_not: mustNotClause,
          },
        },
      }),
    ])

    const questionsList = await Promise.all(
      data.hits.hits.map(async (item) => {
        const data = item._source as any

        const prefectureSnapshot = await getDoc(
          DocRef.prefecture(data.prefecture),
        )

        return {
          ...data,
          id: item._id,
          prefecture: getDocData(prefectureSnapshot).prefecture,
        }
      }),
    )

    return NextResponse.json({
      data: questionsList as any,
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
