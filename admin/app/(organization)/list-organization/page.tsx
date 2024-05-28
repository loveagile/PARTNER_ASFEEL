import MainLayout from '@/components/layouts/MainLayout'
import ListOrganizationFeature from '@/features/organization/pages/List'
import { getOrganizationTypes, getPrefectures } from '@/libs/firebase/firestore'

const ListOrganization = async () => {
  const [organizationTypes, prefectures] = await Promise.all([
    getOrganizationTypes(),
    getPrefectures(),
  ])

  return (
    <MainLayout>
      <ListOrganizationFeature
        organizationTypes={organizationTypes}
        prefectures={prefectures}
      />
    </MainLayout>
  )
}

export default ListOrganization
