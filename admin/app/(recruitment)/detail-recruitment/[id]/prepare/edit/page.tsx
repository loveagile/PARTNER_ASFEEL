import CreateEditLayout from '@/components/layouts/CreateEditLayout'
import PATH from '@/constants/path'
import UpdateRecruitmentFeature from '@/features/recruitment/pages/Update'

const EditRecruitment = ({ params }: { params: { id: string } }) => {
  return (
    <CreateEditLayout backLink={PATH.recruitment.detail.prepare(params.id)}>
      <UpdateRecruitmentFeature id={params.id} />
    </CreateEditLayout>
  )
}

export default EditRecruitment
