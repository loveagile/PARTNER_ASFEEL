type Mapping = {
  index: string
  properties: {
    [key: string]: {
      type: 'text'
      analyzer: 'kuromoji'
    }
  }
}

const mappings: Mapping[] = [
  {
    index: 'leaderswantedprojects',
    properties: {
      organizationName: { type: 'text', analyzer: 'kuromoji' },
      eventName: { type: 'text', analyzer: 'kuromoji' },
    },
  },
  {
    index: 'leaderswantedprojectsscoutlist',
    properties: {
      organization: { type: 'text', analyzer: 'kuromoji' },
      type: { type: 'text', analyzer: 'kuromoji' },
    },
  },
  {
    index: 'leaderswantedprojectsselectionlist',
    properties: {
      organization: { type: 'text', analyzer: 'kuromoji' },
      type: { type: 'text', analyzer: 'kuromoji' },
    },
  },
  {
    index: 'eventprojects',
    properties: {
      title: { type: 'text', analyzer: 'kuromoji' },
      organizer: { type: 'text', analyzer: 'kuromoji' },
    },
  },
  {
    index: 'eventprojectsscoutlist',
    properties: {
      organization: { type: 'text', analyzer: 'kuromoji' },
      type: { type: 'text', analyzer: 'kuromoji' },
    },
  },
  {
    index: 'privateusers',
    properties: {
      prefecture: { type: 'text', analyzer: 'kuromoji' },
      onlyClubs: { type: 'text', analyzer: 'kuromoji' },
      organization: { type: 'text', analyzer: 'kuromoji' },
      type: { type: 'text', analyzer: 'kuromoji' },
    },
  },
  {
    index: 'messagerooms',
    properties: {
      organizationName: { type: 'text', analyzer: 'kuromoji' },
      eventName: { type: 'text', analyzer: 'kuromoji' },
    },
  },
]

export { mappings }
