import { showNotification } from '@mantine/notifications'
import { IconX } from '@tabler/icons'
import INotification from 'src/interfaces/notification'

export const ErrorNotification = ({
  title = 'Erro!',
  message = 'Ocorreu um erro ao executar a operação!',
  icon = <IconX style={{ width: 18, height: 18 }} />,
  loading = false,
  autoClose = 3000,
}: INotification) => {
  showNotification({
    title,
    message,
    icon,
    style: {
      zIndex: 30000,
    },
    loading,
    autoClose,
    color: 'red',
  })
}
