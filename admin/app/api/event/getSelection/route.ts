import {
  QueryFieldFilterConstraint,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'

import { ELASTIC_INDEX, SELECTED_CANDIDATE_STATUS } from '@/constants/common'
import { ColRef, getDocIdWithData } from '@/libs/firebase/firestore'
import { handleError, parsePageNumber, parseQueryParam } from '@/utils/common'
import { getElasticClient } from '@/utils/elastic'
import {
  QueryDslBoolQuery,
  QueryDslQueryContainer,
} from '@elastic/elasticsearch/lib/api/types'

export const GET = async (request: NextRequest) => {
  try {
    const params = request.nextUrl.searchParams
    const projectId = parseQueryParam(params.get('projectId'))

    if (!projectId) {
      throw 'ProjectId is required'
    }

    const elastic = await getElasticClient()

    let defaultMustClause: QueryDslBoolQuery['must'] = []
    let mustClause: QueryDslBoolQuery['must'] = []
    let mustNotClause: QueryDslBoolQuery['must_not'] = []

    const perPageParam = params.get('perPage')
    const pageParam = params.get('page')

    const { page, perPage, from, size } = parsePageNumber(
      pageParam,
      perPageParam,
    )

    let keyword = params.get('keyword')
    keyword = parseQueryParam(keyword)
    if (keyword) {
      keyword = decodeURIComponent(keyword)
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
    }

    const isUnread = parseQueryParam(params.get('isUnread'))
    const isShowNG = parseQueryParam(params.get('isShowNG'))

    const querySelection: QueryFieldFilterConstraint[] = []

    if (isUnread) {
      querySelection.push(where('isUnread', '==', isUnread))
    }

    if (!isShowNG) {
      querySelection.push(
        where('status', 'not-in', [
          SELECTED_CANDIDATE_STATUS.notAdopted,
          SELECTED_CANDIDATE_STATUS.cancel,
        ]),
      )
    }

    const selectionSnap = await getDocs(
      query(ColRef.eventProjectsSelectionList(projectId), ...querySelection),
    )
    // TODO: enable this after having real data
    const selections = selectionSnap.docs.map((doc) => getDocIdWithData(doc))
    if (!selections.length)
      return NextResponse.json({
        data: [],
        pagination: {
          page,
          perPage,
          total: 0,
          allTotal: 0,
        },
      })

    // TODO: remove this after having real data
    // Begin
    // const temp = await elastic.search({
    //   index: ELASTIC_INDEX.privateUsers,
    //   query: {
    //     match_all: {},
    //   },
    //   size: 1000,
    // })

    // const tempAddStatus = !isShowNG
    //   ? []
    //   : [
    //       SELECTED_CANDIDATE_STATUS.notAdopted,
    //       SELECTED_CANDIDATE_STATUS.notStarted,
    //     ]

    // const tempStatus = [
    //   SELECTED_CANDIDATE_STATUS.notStarted,
    //   SELECTED_CANDIDATE_STATUS.adopted,
    //   SELECTED_CANDIDATE_STATUS.inProgress,
    //   SELECTED_CANDIDATE_STATUS.interview,
    //   ...tempAddStatus,
    // ]

    // const selections = temp.hits.hits.map((item) => {
    //   const data = item._source as any
    //   return {
    //     status: tempStatus[Math.floor(Math.random() * tempStatus.length)],
    //     id: data.id,
    //     userId: data.id,
    //     isUnread: false,
    //     applyOrScout: '応募',
    //     interviewDate: Timestamp.now().toMillis(),
    //   }
    // })
    // End

    const addMustClause = handleSearchScoutList(selections)
    mustClause = [...mustClause, ...addMustClause]

    const addDefaultMustClause = handleSearchScoutList(selections)
    defaultMustClause = [...defaultMustClause, ...addDefaultMustClause]

    await elastic.indices.refresh({
      index: ELASTIC_INDEX.privateUsers,
    })

    let [elasticData, { count: total }, { count: allTotal }] =
      await Promise.all([
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

    const result = elasticData.hits.hits.map((item) => {
      const data = item._source as any
      const selection = selections.find(
        (selection) => selection.userId === data.id,
      )

      return {
        ...data,
        occupation: data?.type,
        selectedCandidateStatus: selection?.status,
        isUnread: selection?.isUnread,
        applyOrScout: selection?.applyOrScout,
        interviewDate: selection?.interviewDate,
        lastMessageDate: null,
      }
    })

    let data = result.filter((item) => item)

    return NextResponse.json({
      data,
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

const handleSearchScoutList = (selectionList: any[]) => {
  const mustClauseCandidate: QueryDslBoolQuery['must'] = []
  const should: QueryDslQueryContainer[] = []

  selectionList.map((selection: any) => {
    if (!selection?.userId) return

    should.push({
      match: {
        id: {
          query: selection.userId,
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
