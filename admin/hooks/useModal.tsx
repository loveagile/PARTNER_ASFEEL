'use client'

import CampaignIcon from '@/public/images/icons/campaign.svg'
import WarningIcon from '@/public/images/icons/warning.svg'
import { App, ModalFuncProps } from 'antd'
import { ModalStaticFunctions } from 'antd/es/modal/confirm'

const showConfirm = (
  modal: Omit<ModalStaticFunctions, 'warn'>,
  props: ModalFuncProps,
) => {
  const buttonStyle = {
    width: '12.5rem',
    height: '3.6rem',
    borderRadius: '1.8rem',
    padding: '0.4rem 2.8rem',
    marginTop: '0.5rem',
  }

  modal.confirm({
    icon: (
      <WarningIcon
        width={80}
        color="#EB4E4D"
        style={{
          marginBottom: '5px',
        }}
      />
    ),
    centered: true,
    okText: '破棄する',
    cancelText: 'キャンセル',
    maskClosable: true,
    content: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          fontSize: '1rem',
        }}
      >
        <span>編集の内容は破棄されます</span>
        <span>よろしいですか？</span>
      </div>
    ),
    ...props,
    className: `custom_modal ${props?.className || ''}`,
    okButtonProps: {
      ...props.okButtonProps,
      style: {
        ...buttonStyle,
        backgroundColor: '#EB4E4D',
        marginLeft: '1.25rem',
        ...props.okButtonProps?.style,
      },
    },
    cancelButtonProps: {
      ...props.cancelButtonProps,
      style: {
        ...buttonStyle,
        backgroundColor: '#AFAFAF',
        color: '#FDFDFD',
        borderColor: '#AFAFAF',
        ...props.cancelButtonProps?.style,
      },
    },
  })
}

const showSuccess = (
  modal: Omit<ModalStaticFunctions, 'warn'>,
  props: ModalFuncProps,
) => {
  return modal.success({
    icon: <CampaignIcon width={80} color="#307DC1" />,
    maskClosable: false,
    centered: true,
    ...props,
    okText: props.okText || '一覧を確認する',
    className: `custom_modal ${props?.className || ''}`,
    okButtonProps: {
      ...props.okButtonProps,
      style: {
        width: '14.5rem',
        height: '3.5rem',
        borderRadius: '6.25rem',
        padding: '0.4rem 2.8rem',
        marginTop: '0.5rem',
        backgroundColor: '#307DC1',
        ...props.okButtonProps?.style,
      },
    },
  })
}

const showError = (
  modal: Omit<ModalStaticFunctions, 'warn'>,
  props: ModalFuncProps,
) => {
  const buttonStyle = {
    width: '12.5rem',
    height: '3.6rem',
    borderRadius: '1.8rem',
    padding: '0.4rem 2.8rem',
    marginTop: '0.5rem',
  }

  modal.confirm({
    icon: (
      <WarningIcon
        width={80}
        color="#EB4E4D"
        style={{
          marginBottom: '5px',
        }}
      />
    ),
    centered: true,
    maskClosable: true,
    ...props,
    className: `custom_modal ${props?.className || ''}`,
    okButtonProps: {
      hidden: true,
      ...props.okButtonProps,
      style: {
        ...buttonStyle,
        backgroundColor: '#EB4E4D',
        marginLeft: '1.25rem',
        ...props.okButtonProps?.style,
      },
    },
    cancelButtonProps: {
      hidden: true,
      ...props.cancelButtonProps,
      style: {
        ...buttonStyle,
        backgroundColor: '#AFAFAF',
        color: '#FDFDFD',
        borderColor: '#AFAFAF',
        ...props.cancelButtonProps?.style,
      },
    },
  })
}

export const useModal = () => {
  const { modal } = App.useApp()

  return {
    showConfirm: (props: ModalFuncProps) => showConfirm(modal, props),
    showSuccess: (props: ModalFuncProps) => showSuccess(modal, props),
    showError: (props: ModalFuncProps) => showError(modal, props),
  }
}

export default useModal
