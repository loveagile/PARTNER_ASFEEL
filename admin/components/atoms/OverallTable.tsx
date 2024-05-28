type OverallProps = {
  total?: number
  allTotal?: number
}

const Overall = ({ total = 0, allTotal = 0 }: OverallProps) => {
  return (
    <span className="text-small text-core-blue">
      <span className="text-h2">{total}</span>
      <span className="mx-1">件</span>
      {allTotal && <span>(総登録件数 : {allTotal}件)</span>}
    </span>
  )
}

export default Overall
