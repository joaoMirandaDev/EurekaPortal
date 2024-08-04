import { ReactNode } from 'react'

export default interface INotification {
  title?: string
  message?: string
  icon?: ReactNode
  loading?: boolean
  autoClose?: number
}
