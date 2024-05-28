import CreateEditLayout from '@/components/layouts/CreateEditLayout'
import PATH from '@/constants/path'
import UpdateEventFeature from '@/features/event/pages/Update'

const EditEvent = ({ params }: { params: { id: string } }) => {
  return (
    <CreateEditLayout backLink={PATH.event.detail.prepare(params.id)}>
      <UpdateEventFeature id={params.id} />
    </CreateEditLayout>
  )
}

export default EditEvent
