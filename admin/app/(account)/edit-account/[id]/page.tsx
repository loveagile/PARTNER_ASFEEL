import CreateEditLayout from '@/components/layouts/CreateEditLayout'
import PATH from '@/constants/path'
import UpdateAccountFeature from '@/features/account/pages/Update'

const EditAccount = ({ params }: { params: { id: string } }) => {
  return (
    <CreateEditLayout backLink={PATH.account.list}>
      <UpdateAccountFeature id={params.id} />
    </CreateEditLayout>
  )
}

export default EditAccount
