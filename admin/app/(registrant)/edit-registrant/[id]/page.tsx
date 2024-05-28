import CreateEditLayout from '@/components/layouts/CreateEditLayout'
import PATH from '@/constants/path'
import UpdateRegistrantFeature from '@/features/registrant/pages/Update'

const EditRegistrant = async ({ params }: { params: { id: string } }) => {
  return (
    <CreateEditLayout backLink={PATH.registrant.list}>
      <UpdateRegistrantFeature id={params.id} />
    </CreateEditLayout>
  )
}

export default EditRegistrant
