import { Button, Flex, Modal, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useTranslate } from '@refinedev/core'
import { IconAlertTriangle, IconCheck } from '@tabler/icons'
import { IconCircleXFilled } from '@tabler/icons-react'
import { useEffect } from 'react'

interface ModalWarning {
  openModal: boolean
  closeModal: (value: boolean) => void
  confirm: (value: boolean) => void
  titleWarning: string
  descriptionWarning: string
}

export const ModalWarning: React.FC<ModalWarning> = ({
  openModal,
  titleWarning,
  descriptionWarning,
  closeModal,
  confirm,
}) => {
  const t = useTranslate()
  const [opened, { open, close }] = useDisclosure(false)
  useEffect(() => {
    if (openModal) {
      open()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal])
  const exit = () => {
    close()
    closeModal(false)
  }
  const confirmAndClose = () => {
    confirm(true)
    exit()
  }
  return (
    <Modal
      closeOnClickOutside={false}
      closeOnEscape={false}
      opened={opened}
      trapFocus={false}
      centered
      radius={10}
      onClose={() => exit()}
    >
      <Flex align={'center'} justify={'center'} direction={'column'}>
        <IconAlertTriangle size={100} color="#f59f00" />
        <Text fz={'xl'} fw={'bold'}>
          {titleWarning}
        </Text>
        <Text align="center" fz={'sm'}>
          {descriptionWarning}
        </Text>
      </Flex>
      <Flex mt={'1rem'} justify={'space-between'} align={'center'}>
        <Button
          leftIcon={<IconCircleXFilled />}
          color="red"
          onClick={() => exit()}
        >
          {t('components.button.cancelar')}
        </Button>
        <Button
          onClick={() => confirmAndClose()}
          leftIcon={<IconCheck />}
          color="green"
        >
          {t('components.button.confirm')}
        </Button>
      </Flex>
    </Modal>
  )
}
