import CreateEditLayout from '@/components/layouts/CreateEditLayout'
import PATH from '@/constants/path'
import UpdateQuestionFeature from '@/features/question/pages/Update'

const EditQuestion = ({ params }: { params: { id: string } }) => {
  return (
    <CreateEditLayout backLink={PATH.question.list}>
      <UpdateQuestionFeature id={params.id} />
    </CreateEditLayout>
  )
}

export default EditQuestion
