import { showNotification } from '@mantine/notifications'
import { IconAlertTriangle } from '@tabler/icons'
import INotification from 'src/interfaces/notification'

export const WarningNotification = ({
  title = 'Atenção!',
  message = 'Há alguma pendêncio impedindo a operação!',
  icon = <IconAlertTriangle style={{ width: 18, height: 18 }} />,
  loading = false,
  autoClose = 3000,
}: INotification) => {
  showNotification({
    title,
    message,
    icon,
    loading,
    autoClose,
    color: 'orange',
  })
}
