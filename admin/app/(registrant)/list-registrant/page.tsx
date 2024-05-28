import MainLayout from '@/components/layouts/MainLayout'
import ListRegistrantFeature from '@/features/registrant/pages/List'
import { getClubTypes, getPrefectures } from '@/libs/firebase/firestore'

const ListRegistrant = async () => {
  const [clubTypes, prefectures] = await Promise.all([
    getClubTypes(),
    getPrefectures(),
  ])
  return (
    <MainLayout>
      <ListRegistrantFeature clubTypes={clubTypes} prefectures={prefectures} />
    </MainLayout>
  )
}

export default ListRegistrant
