import CreateEditLayout from '@/components/layouts/CreateEditLayout'
import PATH from '@/constants/path'
import CreateAddressFeature from '@/features/address/pages/Create'

const CreateAddress = () => {
  return (
    <CreateEditLayout backLink={PATH.address.list}>
      <CreateAddressFeature />
    </CreateEditLayout>
  )
}

export default CreateAddress
