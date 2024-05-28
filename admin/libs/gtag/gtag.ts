export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_MEASUREMENT_ID || ''
export const pageView = (url: string) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
    debug_mode: process.env.NODE_ENV === 'development',
  })
}

const actions = {
  like: 'like',
  vote: 'vote',
  preVote: 'pre_vote',
  donate: 'donate',
  preDonate: 'pre_donate',
  connectWallet: 'connect_wallet',
  productPost: 'product_post',
  productEdit: 'product_edit',
  login: 'login',
  logout: 'logout',
  goToProductPage: 'go_to_product_page',
} as const

type ActionList = keyof typeof actions

const categories = {
  product: 'product',
  user: 'user',
} as const
type CategoryList = keyof typeof categories
/**
 * アクションイベントを送信
 */
export const actionEvent = ({
  action,
  category,
  label,
  value = '',
}: {
  action: ActionList
  category: CategoryList
  label: string
  value?: string
}) => {
  if (!GA_MEASUREMENT_ID) {
    return
  }

  window.gtag('event', action, {
    event_category: category,
    event_label: JSON.stringify(label),
    value,
  })
}
