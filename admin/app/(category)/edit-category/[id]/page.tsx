import CreateEditLayout from '@/components/layouts/CreateEditLayout'
import PATH from '@/constants/path'
import UpdateCategoryFeature from '@/features/category/pages/Update'

const EditCategory = ({ params }: { params: { id: string } }) => {
  return (
    <CreateEditLayout backLink={PATH.category.list}>
      <UpdateCategoryFeature id={params.id} />
    </CreateEditLayout>
  )
}

export default EditCategory
