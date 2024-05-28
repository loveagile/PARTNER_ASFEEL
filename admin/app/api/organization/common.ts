import { ELASTIC_INDEX, ORGANIZATION_TYPE_LABEL } from '@/constants/common'
import { ErrorValidation } from '@/constants/error'
import { ColRef } from '@/libs/firebase/firestore'
import { addFieldsCreate } from '@/utils/firestore'
import { Client } from '@elastic/elasticsearch'
import { addDoc, documentId, getDocs, query, where } from 'firebase/firestore'

export const organizationMapping = {
  address: {
    properties: {
      address1: {
        type: 'text',
        analyzer: 'kuromoji',
      },
      city: {
        type: 'text',
        analyzer: 'kuromoji',
      },
      prefecture: {
        type: 'text',
        analyzer: 'kuromoji',
      },
      zip: {
        type: 'text',
        fields: {
          keyword: {
            type: 'keyword',
            ignore_above: 256,
          },
        },
      },
    },
  },
  createdAt: {
    type: 'date',
  },
  deletedAt: {
    type: 'date',
  },
  isSuspended: {
    type: 'boolean',
  },
  name: {
    type: 'text',
    analyzer: 'kuromoji',
  },
  nameKana: {
    type: 'text',
    analyzer: 'kuromoji',
  },
  organizationId: {
    type: 'text',
    fields: {
      keyword: {
        type: 'keyword',
        ignore_above: 256,
      },
    },
  },
  organizationType: {
    type: 'text',
    fields: {
      keyword: {
        type: 'keyword',
        ignore_above: 256,
      },
    },
  },
  organizationTypeText: {
    type: 'text',
    analyzer: 'kuromoji',
  },
  phoneNumber: {
    type: 'text',
    fields: {
      keyword: {
        type: 'keyword',
        ignore_above: 256,
      },
    },
  },
  updatedAt: {
    type: 'date',
  },
}

export const createIndexIfNotExists = async (elastic: Client) => {
  const indexExists = await elastic.indices.exists({
    index: ELASTIC_INDEX.organizations,
  })

  if (!indexExists) {
    await elastic.indices.create({
      index: ELASTIC_INDEX.organizations,
      body: {
        mappings: {
          properties: organizationMapping as any,
        },
      },
    })
  }
}

export const checkExistsOrganization = async (
  organizationId: string,
  id?: string,
) => {
  const queryArray = [where('organizationId', '==', organizationId)]

  if (id) {
    queryArray.push(where(documentId(), '!=', id))
  }

  const queryExistsOrganization = query(ColRef.organizations, ...queryArray)

  const existedOrganization = await getDocs(queryExistsOrganization)

  if (existedOrganization.docs.length > 0) {
    throw ErrorValidation.ORGANIZATION_ALREADY_EXISTS
  }
}

export const createOrganizationTypeIfNotExist = async () => {
  const existedOrganizationType = await getDocs(ColRef.organizationType)

  if (existedOrganizationType.docs.length === 0) {
    await addDoc(
      ColRef.organizationType,
      addFieldsCreate({
        name: ORGANIZATION_TYPE_LABEL.PUBLIC_INSTITUTION,
      }),
    )

    await addDoc(
      ColRef.organizationType,
      addFieldsCreate({
        name: ORGANIZATION_TYPE_LABEL.SCHOOL,
      }),
    )

    await addDoc(
      ColRef.organizationType,
      addFieldsCreate({
        name: ORGANIZATION_TYPE_LABEL.OTHERS,
      }),
    )
  }
}
