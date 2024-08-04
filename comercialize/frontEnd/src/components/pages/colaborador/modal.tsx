import { Box, Button, Flex, Modal, Text } from '@mantine/core'

import { useDisclosure } from '@mantine/hooks'
import api from 'src/utils/Api'
import { useEffect, useState } from 'react'
import Icolaborador from 'src/interfaces/colaborador'
import { formatarCPFCNPJ } from 'src/utils/FormatterUtils'
import { useTranslate } from '@refinedev/core'
import { IconCircleXFilled, IconTrash } from '@tabler/icons-react'
interface ModalColaborador {
  openModal: boolean
  idCliente: number
  title: string
  textExclusao: string
  confirmaExclusao: (value: boolean) => void
}

const ModalColaborador: React.FC<ModalColaborador> = ({
  openModal,
  idCliente,
  title,
  textExclusao,
  confirmaExclusao,
}) => {
  const t = useTranslate()
  const [opened, { open, close }] = useDisclosure(false)
  const [data, setData] = useState<Icolaborador>()
  useEffect(() => {
    if (openModal) {
      open()
      getCliente()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, openModal])

  const getCliente = async () => {
    const dados = await api.get(`api/colaborador/findById/${idCliente}`)
    setData(dados.data)
  }

  const setConfirmacao = () => {
    confirmaExclusao(true)
    close()
  }

  const cancelaExclusao = () => {
    confirmaExclusao(false)
    close()
  }

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      size={620}
      closeOnClickOutside={false}
      withCloseButton={false}
      radius={'md'}
      closeOnEscape={false}
      trapFocus={false}
      title={title}
    >
      <Box>
        <Flex>
          <Text fw={700}>{textExclusao}</Text>
          <Text ml={10} fw={500}>
            {data?.nome + ' -'}
          </Text>
          <Text fw={500}>{formatarCPFCNPJ(data?.cpf || '')}</Text>
        </Flex>
      </Box>
      <Flex mt={20} justify={'space-between'}>
        <Button
          leftIcon={<IconCircleXFilled />}
          color="red"
          onClick={cancelaExclusao}
        >
          {t('components.button.cancelar')}
        </Button>
        <Button leftIcon={<IconTrash />} color="green" onClick={setConfirmacao}>
          {t('components.button.confirmar')}
        </Button>
      </Flex>
    </Modal>
  )
}

export default ModalColaborador
