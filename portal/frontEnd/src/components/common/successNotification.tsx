import { showNotification } from '@mantine/notifications'
import { IconCheck } from '@tabler/icons'
import INotification from 'src/interfaces/notification'

export const SuccessNotification = ({
  title = 'Sucesso!',
  message = 'Operação executada com sucesso!',
  icon = <IconCheck style={{ width: 18, height: 18 }} />,
  loading = false,
  autoClose = 3000,
}: INotification) => {
  showNotification({
    title,
    message,
    icon,
    loading,
    autoClose,
    color: 'green',
  })
}
