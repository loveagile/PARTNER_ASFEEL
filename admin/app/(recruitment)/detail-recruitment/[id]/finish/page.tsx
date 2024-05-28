import CreateEditLayout from '@/components/layouts/CreateEditLayout'
import PATH from '@/constants/path'
import EditRecruitmentFeature from '@/features/recruitment/pages/Detail'

export default function Page({ params }: { params: { id: string } }) {
  return (
    <CreateEditLayout
      backLink={PATH.recruitment.list.finish}
      layoutProps={{
        className: 'bg-gray-white',
      }}
    >
      <EditRecruitmentFeature id={params.id} />
    </CreateEditLayout>
  )
}
