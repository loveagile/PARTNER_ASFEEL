import { useSearchParams } from 'next/navigation'
import { IoSend } from 'react-icons/io5'

function SendLinkConfirmPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <>
      <h1 className="text-center text-h3 text-gray-black pc:text-h2">
        以下のアドレスに
        <br />
        メールを送信しました
      </h1>
      <div className="mt-7 flex flex-col pc:mt-10">
        <div className="mx-auto inline-block text-[60px] text-core-blue pc:text-[80px]">
          <IoSend />
        </div>
        <p className="mt-7 text-h3 pc:mt-10 pc:text-h2">
          {email || 'example@mail.com'}
        </p>
      </div>
      <p className="mt-7 text-center text-timestamp text-gray-black pc:mt-10 pc:text-body_pc">
        パスワード再設定のご案内をお送りいたしました
        <br />
        メールをご確認ください
      </p>
    </>
  )
}

export default SendLinkConfirmPage
