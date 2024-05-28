import CreateEditLayout from '@/components/layouts/CreateEditLayout'
import PATH from '@/constants/path'
import CreateQuestionFeature from '@/features/question/pages/Create'

const CreateQuestion = () => {
  return (
    <CreateEditLayout backLink={PATH.question.list}>
      <CreateQuestionFeature />
    </CreateEditLayout>
  )
}

export default CreateQuestion
