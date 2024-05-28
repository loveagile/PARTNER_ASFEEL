import CreateEditLayout from '@/components/layouts/CreateEditLayout'
import PATH from '@/constants/path'
import CreateCategoryFeature from '@/features/category/pages/Create'

const CreateCategory = () => {
  return (
    <CreateEditLayout backLink={PATH.category.list}>
      <CreateCategoryFeature />
    </CreateEditLayout>
  )
}

export default CreateCategory
