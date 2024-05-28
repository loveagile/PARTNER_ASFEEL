import { ELASTIC_INDEX } from '@/constants/common'
import { Exception } from '@/constants/model'
import { ListCategoriesResponse } from '@/features/category/model/category.model'
import { DocRef, getDocData } from '@/libs/firebase/firestore'
import { handleError, parsePageNumber, parseQueryParam } from '@/utils/common'
import { getElasticClient } from '@/utils/elastic'
import { QueryDslBoolQuery } from '@elastic/elasticsearch/lib/api/types'
import { getDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'
import { createIndexIfNotExists } from '../common'

export async function GET(
  request: NextRequest,
): Promise<NextResponse<ListCategoriesResponse | Exception>> {
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
    let largeCategory = []
    let mediumCategory = []
    for (const [key, valueParam] of params.entries()) {
      const value = parseQueryParam(valueParam)

      if (value === undefined || value === null) continue

      switch (key) {
        case 'largeCategory':
          largeCategory.push(value)
          mustClause = [
            ...mustClause,
            {
              terms: {
                'largeCategory.keyword': largeCategory,
              },
            },
          ]
          break
        case 'mediumCategory':
          mediumCategory.push(value)
          mustClause = [
            ...mustClause,
            {
              terms: {
                'mediumCategory.keyword': mediumCategory,
              },
            },
          ]
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
        case 'name':
          mustClause.push({
            terms: {
              _id: [value],
            },
          })
          break
        case 'keyword':
          if (value === '') break

          mustClause.push({
            match: {
              name: decodeURIComponent(value),
            },
            // wildcard: {
            //   name: {
            //     value: `*${decodeURIComponent(value)}*`,
            //   },
            // },
          })
          break
        default:
          break
      }
    }

    await elastic.indices.refresh({
      index: ELASTIC_INDEX.categories,
    })

    const [data, { count: total }, { count: allTotal }] = await Promise.all([
      elastic.search({
        index: ELASTIC_INDEX.categories,
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
        index: ELASTIC_INDEX.categories,
        query: {
          bool: {
            must: mustClause,
            must_not: mustNotClause,
          },
        },
      }),

      elastic.count({
        index: ELASTIC_INDEX.categories,
        query: {
          bool: {
            must_not: mustNotClause,
          },
        },
      }),
    ])

    const categoriesList = await Promise.all(
      data.hits.hits.map(async (item) => {
        const data = item._source as any

        const [mediumCategorySnapshot, largeCategorySnapshot] =
          await Promise.all([
            getDoc(DocRef.mediumCategory(data.mediumCategory)),
            getDoc(DocRef.largeCategory(data.largeCategory)),
          ])

        return {
          ...data,
          id: item._id,
          mediumCategory: getDocData(mediumCategorySnapshot).name,
          largeCategory: getDocData(largeCategorySnapshot).name,
        }
      }),
    )

    return NextResponse.json({
      data: categoriesList as any,
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
