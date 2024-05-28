import CreateEditLayout from '@/components/layouts/CreateEditLayout'
import PATH from '@/constants/path'
import UpdateAddressFeature from '@/features/address/pages/Update'

const EditAddress = ({ params }: { params: { id: string } }) => {
  return (
    <CreateEditLayout backLink={PATH.address.list}>
      <UpdateAddressFeature id={params.id} />
    </CreateEditLayout>
  )
}

export default EditAddress
