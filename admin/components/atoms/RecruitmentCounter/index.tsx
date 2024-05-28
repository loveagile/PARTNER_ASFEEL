import styles from './index.module.scss'

type CounterProps = {
  record: any
}

const RecruitmentCounter = ({ record }: CounterProps) => {
  const { recruitCount, adoptCount, selectCount } = record || {}

  return (
    <div className="flex w-fit overflow-hidden rounded bg-gray-gray_lighter">
      <span className={styles.recruitment_count}>
        <span className="mr-3">募集</span>
        <span className={styles.counter}>
          {recruitCount || <span className={styles.no_count}>-</span>}
        </span>
      </span>
      <span className={styles.recruitment_count}>
        <span className="mr-3">採用</span>
        <span className={styles.counter}>
          {adoptCount || <span className={styles.no_count}>-</span>}
        </span>
      </span>
      <span className={styles.recruitment_count}>
        <span className="mr-3">選考</span>
        <span className={styles.counter}>
          {selectCount || <span className={styles.no_count}>-</span>}
        </span>
      </span>
    </div>
  )
}

export default RecruitmentCounter
