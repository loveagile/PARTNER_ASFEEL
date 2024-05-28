import SubCustomTable from '@/components/SubCustomTable'
import { Modal, ModalProps } from 'antd'
import { column } from './column'
import styles from './index.module.scss'

type ModalSelectUsersProps = {
  selectUsers: any[]
  modalProps?: ModalProps
}

const ModalSelectUsers = ({
  selectUsers,
  modalProps,
}: ModalSelectUsersProps) => {
  return (
    <Modal
      width={1060}
      className={styles.select_user_modal}
      title={
        <div className="text-center">
          選択中の{selectUsers?.length || 0}名にスカウトを送信しますか？
        </div>
      }
      closeIcon={null}
      okText="スカウトを送信する"
      cancelText="キャンセル"
      okButtonProps={{
        type: 'primary',
        className: '!bg-core-blue_dark w-[200px] rounded-[30px] h-[56px]',
      }}
      cancelButtonProps={{
        type: 'primary',
        className: '!bg-gray-gray_dark w-[200px] rounded-[30px] h-[56px]',
      }}
      {...modalProps}
    >
      <SubCustomTable
        columns={column({})}
        footer={() => <></>}
        scroll={{ x: 1000 }}
        dataSource={selectUsers}
        rowClassName="cursor-pointer"
      />
    </Modal>
  )
}

export default ModalSelectUsers
