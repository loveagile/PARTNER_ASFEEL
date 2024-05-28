import CreateEditLayout from '@/components/layouts/CreateEditLayout'
import PATH from '@/constants/path'
import CreateCoordinatorFeature from '@/features/coordinator/pages/Create'

const CreateCoordinator = () => {
  return (
    <CreateEditLayout backLink={PATH.coordinator.list}>
      <CreateCoordinatorFeature />
    </CreateEditLayout>
  )
}

export default CreateCoordinator
