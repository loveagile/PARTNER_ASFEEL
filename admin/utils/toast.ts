import { toast } from 'react-hot-toast'

export const appToastSuccess = (message: string, duration?: number) =>
  toast.success(message, { id: 'success', duration })

export const appToastError = (message: string) =>
  toast.error(message, { id: 'error' })

export const appToastWarn = (
  message: string,
  option?: {
    duration?: number
  },
) => toast(message, { id: 'warn', icon: '⚠️', duration: option?.duration })
