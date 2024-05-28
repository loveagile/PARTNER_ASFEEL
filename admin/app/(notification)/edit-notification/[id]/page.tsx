import CreateEditLayout from '@/components/layouts/CreateEditLayout'
import PATH from '@/constants/path'
import UpdateNotificationFeature from '@/features/notification/pages/Update'

const EditNotification = ({ params }: { params: { id: string } }) => {
  return (
    <CreateEditLayout backLink={PATH.notification.list}>
      <UpdateNotificationFeature id={params.id} />
    </CreateEditLayout>
  )
}

export default EditNotification
