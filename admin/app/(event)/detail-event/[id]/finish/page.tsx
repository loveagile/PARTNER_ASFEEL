import CreateEditLayout from '@/components/layouts/CreateEditLayout'
import PATH from '@/constants/path'
import DetailEventFeature from '@/features/event/pages/Detail'

export default function Page({ params }: { params: { id: string } }) {
  return (
    <CreateEditLayout
      backLink={PATH.event.list.finish}
      layoutProps={{
        className: 'bg-gray-white',
      }}
    >
      <DetailEventFeature id={params.id} />
    </CreateEditLayout>
  )
}
