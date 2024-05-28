import CreateEditLayout from '@/components/layouts/CreateEditLayout'
import PATH from '@/constants/path'
import CreateAccountFeature from '@/features/account/pages/Create'

const CreateAccount = () => {
  return (
    <CreateEditLayout backLink={PATH.account.list}>
      <CreateAccountFeature />
    </CreateEditLayout>
  )
}

export default CreateAccount
