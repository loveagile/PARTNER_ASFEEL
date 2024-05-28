import React from 'react'

export default function useLoadMore(keyword: any, page: any, fetchData: any) {
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState<any[]>([])
  const [hasMore, setHasMore] = React.useState(false)

  React.useEffect(() => {
    setData([])
  }, [keyword])

  React.useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const response = await fetchData(keyword, page)
        setData((preData) => [...(page !== 1 ? preData : []), ...response])
        setHasMore(response.length > 0)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    })()
  }, [keyword, page])

  return { loading, data, hasMore }
}
