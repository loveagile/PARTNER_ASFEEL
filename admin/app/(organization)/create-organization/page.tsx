import CreateEditLayout from '@/components/layouts/CreateEditLayout'
import PATH from '@/constants/path'
import CreateOrganizationFeature from '@/features/organization/pages/Create'

const CreateOrganization = async () => {
  return (
    <CreateEditLayout backLink={PATH.organization.list}>
      <CreateOrganizationFeature />
    </CreateEditLayout>
  )
}

export default CreateOrganization
