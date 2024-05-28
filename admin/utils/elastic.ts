import { ClientOptions } from '@elastic/elasticsearch'

const createElasticSearchClient = async (options: ClientOptions) => {
  const { Client } = await import('@elastic/elasticsearch')

  return new Client(options)
}

const getOptions = () => {
  const cloud = process.env.ELASTIC_CLOUD_ID
  const username = process.env.ELASTIC_USERNAME || ''
  const password = process.env.ELASTIC_PASSWORD || ''

  return {
    cloud,
    username,
    password,
  }
}

const DEFAULTS: ClientOptions = {
  node: 'http://localhost:9200',
}

const getElasticOptions = (): ClientOptions => {
  // remember to define "getOptions" to get your credentials!
  const { cloud, password, username } = getOptions()

  // this branch is for prod (i.e. cloud is provided)
  if (cloud) {
    return {
      cloud: {
        id: cloud,
      },
      auth: {
        username,
        password,
      },
    }
  }

  // this branch is for dev
  return {
    node: DEFAULTS.node,
  }
}

export const getElasticClient = () => {
  return createElasticSearchClient(getElasticOptions())
}

export const COMMON_TEXT_PROPERTY = {
  keyword: {
    type: 'keyword',
    ignore_above: 256,
  },
}
