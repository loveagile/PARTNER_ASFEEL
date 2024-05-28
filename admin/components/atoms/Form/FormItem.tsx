'use client'

import { ErrorValidation } from '@/constants/error'
import { Form, FormItemProps as ANTDFormItemProps } from 'antd'

type FormItemProps = ANTDFormItemProps & {
  isCheckEmoji?: boolean
}

const FormItem = ({ rules, ...props }: FormItemProps) => {
  const newRules = rules || []

  if (props.isCheckEmoji) {
    newRules.push({
      validator: (_, value) => {
        if (value && value.match(ErrorValidation.EMOJI_NOT_ALLOWED.regex)) {
          return Promise.reject(ErrorValidation.EMOJI_NOT_ALLOWED.message)
        }
        return Promise.resolve()
      },
    })
  }

  return <Form.Item rules={newRules} {...props} validateFirst />
}

export default FormItem
