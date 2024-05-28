import CreateEditLayout from '@/components/layouts/CreateEditLayout'
import PATH from '@/constants/path'
import UpdateOrganizationFeature from '@/features/organization/pages/Update'

const EditOrganization = async ({ params }: { params: { id: string } }) => {
  return (
    <CreateEditLayout backLink={PATH.organization.list}>
      <UpdateOrganizationFeature id={params.id} />
    </CreateEditLayout>
  )
}

export default EditOrganization
