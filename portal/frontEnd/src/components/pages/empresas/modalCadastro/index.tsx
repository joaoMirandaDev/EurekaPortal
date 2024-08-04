import {
  Button,
  Flex,
  Modal,
  PasswordInput,
  Select,
  SelectItem,
  TextInput,
} from '@mantine/core'
import { zodResolver, useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useTranslate } from '@refinedev/core'
import {
  IconCircleXFilled,
  IconDatabaseEdit,
  IconDatabasePlus,
} from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import IRole from 'src/interfaces/role'
import api from 'src/utils/Api'
import {
  CREATE_USER,
  EDIT_USER,
  FIND_USUARIO_BY_ID,
  GET_ALL_ROLES,
} from 'src/utils/Routes'
import { validaUsuario } from '../validation/schemaUsuario'
import { ErrorNotification, SuccessNotification } from '@components/common'
import {
  formatarCPFCNPJ,
  removeformatarCPFCNPJ,
} from 'src/utils/FormatterUtils'
import IEmpresaDto from 'src/interfaces/dto/empresaDto'

interface Props {
  idEmpresa: number
  openDrawer: boolean
  idUser: number | null
  closeModal: (value: boolean) => void
}

const ModalCadastro: React.FC<Props> = ({
  idEmpresa,
  openDrawer,
  idUser,
  closeModal,
}) => {
  const [opened, { open, close }] = useDisclosure(false)
  const [role, setRole] = useState<SelectItem[]>([])
  const t = useTranslate()
  const form = useForm<{
    id: number | null
    login: string
    senha: string
    userName: string
    role: IRole
    empresa: IEmpresaDto | null
  }>({
    initialValues: {
      id: null,
      login: '',
      senha: '',
      userName: '',
      role: {
        id: null,
        name: '',
      },
      empresa: {
        id: idEmpresa,
        cnpj: '',
      },
    },
    validate: zodResolver(validaUsuario()),
  })
  const resetForm = () => {
    const data = {
      id: null,
      login: '',
      senha: '',
      userName: '',
      role: {
        id: null,
        name: '',
      },
      empresa: {
        id: idEmpresa,
        cnpj: '',
      },
    }
    form.setValues(data)
  }
  const exit = () => {
    close()
    closeModal(false)
    resetForm()
  }
  useEffect(() => {
    idUser != null ? findUserById() : null
    if (idEmpresa && openDrawer == true) {
      open()
      roles()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idEmpresa, openDrawer])

  const findUserById = () => {
    api
      .get(FIND_USUARIO_BY_ID + `${idUser}`)
      .then(obj => {
        form.setValues(obj.data)
      })
      .catch(error => {
        ErrorNotification({
          title: t('components.status') + ': ' + error.response.status,
          message: t('components.error.errorGeneric'),
        })
      })
  }

  const roles = async () => {
    const dados = await api.get(GET_ALL_ROLES)
    const data = dados.data.map((data: IRole) => ({
      value: data.id,
      label: data.name,
    }))
    setRole(data)
  }

  const create = async () => {
    await api
      .post(CREATE_USER, form.values)
      .then(() => {
        SuccessNotification({ message: t('components.sucess.dataSucess') })
        exit()
      })
      .catch(error => {
        ErrorNotification({
          title: t('components.status') + ': ' + error.response.status,
          message: t('components.error.errorGeneric'),
        })
      })
  }

  const editar = async () => {
    await api
      .put(EDIT_USER, form.values)
      .then(() => {
        SuccessNotification({
          message: t('components.sucess.dataSucess'),
        })
        exit()
      })
      .catch(error => {
        ErrorNotification({
          title: t('components.status') + ': ' + error.response.status,
          message: t('components.error.errorGeneric'),
        })
      })
  }

  const handleChange = (
    event: string | null | number | boolean,
    key: string
  ) => {
    if (key === 'login' && event !== null) {
      event = removeformatarCPFCNPJ(event.toString())
    }

    form.setFieldValue(key, event)
  }

  const renderButtons = () => {
    return (
      <>
        <Flex mt={20} bottom={0} pos={'relative'} justify={'space-between'}>
          <Button
            leftIcon={<IconCircleXFilled />}
            color="red"
            onClick={() => exit()}
          >
            {t('components.button.cancelar')}
          </Button>
          <Button
            leftIcon={idUser ? <IconDatabasePlus /> : <IconDatabaseEdit />}
            type="submit"
            color="green"
          >
            {idUser
              ? t('components.button.editar')
              : t('components.button.salvar')}
          </Button>
        </Flex>
      </>
    )
  }
  return (
    <Modal
      closeOnClickOutside={false}
      closeOnEscape={false}
      centered
      trapFocus={false}
      opened={opened}
      onClose={() => exit()}
      title={t('pages.empresa.cadastro.drawerCadastro.title')}
    >
      <form onSubmit={form.onSubmit(() => (!idUser ? create() : editar()))}>
        <TextInput
          size="xs"
          {...form.getInputProps('userName')}
          defaultValue={form.values.userName || ''}
          onChange={event => handleChange(event.target.value, 'userName')}
          placeholder={t(
            'pages.empresa.cadastro.drawerCadastro.placeHolderNomeUsuario'
          )}
          label={t('pages.empresa.cadastro.drawerCadastro.userName')}
          withAsterisk
        />
        <TextInput
          mt={'1rem'}
          withAsterisk
          size="xs"
          {...form.getInputProps('login')}
          value={formatarCPFCNPJ(form.values?.login)}
          onChange={event =>
            handleChange(removeformatarCPFCNPJ(event.target.value), 'login')
          }
          placeholder={t('pages.empresa.cadastro.drawerCadastro.inputLogin')}
          label={t('pages.empresa.cadastro.drawerCadastro.login')}
        />

        {!idUser && (
          <PasswordInput
            size="xs"
            mt={'1rem'}
            {...form.getInputProps('senha')}
            defaultValue={form.values.senha || ''}
            withAsterisk
            onChange={event => handleChange(event.target.value, 'senha')}
            label={t('pages.empresa.cadastro.drawerCadastro.senha')}
            placeholder={t(
              'pages.empresa.cadastro.drawerCadastro.placeHolderSenha'
            )}
          />
        )}
        <Select
          {...form.getInputProps('role.id')}
          withAsterisk
          mt={'1rem'}
          searchable
          clearable
          label={t('pages.empresa.cadastro.drawerCadastro.perfil')}
          placeholder={t(
            'pages.empresa.cadastro.drawerCadastro.placeHolderPerfil'
          )}
          onChange={event => handleChange(event, 'role.id')}
          withinPortal
          size="xs"
          data={role}
        />
        {renderButtons()}
      </form>
    </Modal>
  )
}
export default ModalCadastro
