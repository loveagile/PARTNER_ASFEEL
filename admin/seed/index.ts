import dotenv from 'dotenv'

dotenv.config({
  path: `.env.local`,
})

import { seedOrganizations } from './seedOrganizations'
import { getElasticClient } from '@/utils/elastic'
import { syncAddress } from './syncAddress'
import { syncClubTypeCategories } from './syncClubTypeCategories'
import { syncOrganizations } from './syncOrganizations'
import { seedAccount } from './seedAccount'
const seedFunc = async () => {
  const elastic = await getElasticClient()

  // Enable this to seed organizations
  // await seedOrganizations(elastic)

  // Enable this to sync address, clubTypeCategories, organizations
  // await syncAddress(elastic)
  // await syncClubTypeCategories(elastic)
  // await syncOrganizations(elastic)

  // Enable this to seed accounts
  await seedAccount()

  console.log('Done')
}

seedFunc()
