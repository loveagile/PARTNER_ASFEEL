import CreateEditLayout from '@/components/layouts/CreateEditLayout'
import PATH from '@/constants/path'
import UpdateCoordinatorFeature from '@/features/coordinator/pages/Update'

const EditCoordinator = ({ params }: { params: { id: string } }) => {
  return (
    <CreateEditLayout backLink={PATH.coordinator.list}>
      <UpdateCoordinatorFeature id={params.id} />
    </CreateEditLayout>
  )
}

export default EditCoordinator
