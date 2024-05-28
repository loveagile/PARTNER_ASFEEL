import CreateEditLayout from '@/components/layouts/CreateEditLayout'
import PATH from '@/constants/path'
import CreateNotificationFeature from '@/features/notification/pages/Create'

const CreateNotification = () => {
  return (
    <CreateEditLayout backLink={PATH.notification.list}>
      <CreateNotificationFeature />
    </CreateEditLayout>
  )
}

export default CreateNotification
