/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ActionIcon,
  Avatar,
  Button,
  FileButton,
  Flex,
  Group,
  NumberInput,
  Select,
  SelectItem,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { DatePickerInput, DateValue, DatesProvider } from '@mantine/dates'
import { useTranslate } from '@refinedev/core'
import 'dayjs/locale/pt-br'
import { useForm, zodResolver } from '@mantine/form'
import api from 'src/utils/Api'
import {
  formatarCPFCNPJ,
  formatarTelefone,
  removeformatacaoTelefone,
  removeformatarCPFCNPJ,
} from 'src/utils/FormatterUtils'
import { useRouter } from 'next/router'
import { ErrorNotification, SuccessNotification } from '@components/common'
import {
  IconCircleXFilled,
  IconDatabaseEdit,
  IconDatabasePlus,
} from '@tabler/icons-react'
import { IconArrowLeft, IconTrash, IconUpload } from '@tabler/icons'
import {
  CREATE_COLABORADOR,
  FIND_ALL_CARGOS,
  UPLOAD_DOCUMENTOS_TEMP,
} from 'src/utils/Routes'
import { useRef, useEffect, useState } from 'react'
import { validaColaborador } from '../validation/schemaColaborador'
import ICargo from 'src/interfaces/cargo'
import { getImage } from 'src/utils/Arquivo'
import Cookies from 'js-cookie'
interface IFile {
  name: string
  key: string
}
interface Colaborador {
  id: string | string[] | undefined | null
  type: string | null
}
const Cadastro: React.FC<Colaborador> = ({ id, type }) => {
  const t = useTranslate()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [photo, setImagem] = useState<string | null>(null)
  const [dataCargo, setDataCargo] = useState<SelectItem[]>([])
  const resetRef = useRef<() => void>(null)
  const navigate = useRouter()
  const form = useForm<{
    id: number | null
    nome: string
    sobrenome: string
    cpf: string
    rg: string
    dataNascimento: Date | null
    dataContratoInicial: Date | null
    sexo: string
    salario: number
    status: number
    cnpjEmpresa: string
    cargo: ICargo
    ativo: number | null
    email: string
    endereco: {
      cep: string
      cidade: string
      bairro: string
      rua: string
      estado: string
      numero: string
    }
    telefone: string
    file: IFile
  }>({
    initialValues: {
      id: null,
      nome: '',
      sobrenome: '',
      dataNascimento: null,
      cnpjEmpresa: Cookies.get('cnpj')!,
      status: 0,
      dataContratoInicial: null,
      sexo: '',
      cpf: '',
      rg: '',
      telefone: '',
      cargo: {
        id: null,
        ativo: null,
        nome: '',
      },
      ativo: 0,
      email: '',
      salario: 0,
      endereco: {
        rua: '',
        cep: '',
        bairro: '',
        cidade: '',
        estado: '',
        numero: '',
      },
      file: {
        name: '',
        key: '',
      },
    },
    validate: zodResolver(validaColaborador()),
  })
  const buscarDadosCep = async (value: string) => {
    if (value.length === 8 || value !== '') {
      const dados = await api.get(
        `/api/endereco/findByRegiao/${value.replace(/[-. ]/g, '')}`
      )
      handleChange(dados.data.cep, 'endereco.cep'.replace(/[-. ]/g, ''))
      handleChange(dados.data.bairro, 'endereco.bairro')
      handleChange(dados.data.localidade, 'endereco.cidade')
      handleChange(dados.data.logradouro, 'endereco.rua')
      handleChange(dados.data.uf, 'endereco.estado')
    }
  }

  const handleChange = (
    event: string | number | boolean | DateValue | File,
    key: string
  ) => {
    form.setFieldValue(key, event)
  }
  const handleSubmit = async () => {
    await api
      .post(CREATE_COLABORADOR, form.values)
      .then(response => {
        navigate.push('/colaborador')
        SuccessNotification({ message: response.data })
      })
      .catch(() => {
        ErrorNotification({ message: t('components.error.errorBack') })
      })
  }

  const editar = async () => {
    await api
      .put(`/api/colaborador/editar`, form.values)
      .then(() => {
        navigate.push('/colaborador')
        SuccessNotification({
          message: t('components.sucess.dataSucess'),
        })
      })
      .catch(error => {
        ErrorNotification({
          title: t('components.status') + ': ' + error.response.status,
          message: t('components.error.errorGeneric'),
        })
      })
  }

  useEffect(() => {
    if (id) {
      getColaboradorById(id.toString())
    }
    findAllCargos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const findAllCargos = () => {
    api.get(FIND_ALL_CARGOS).then(response => {
      const data = response.data.map((data: ICargo) => ({
        value: data.id,
        label: data.nome,
      }))
      setDataCargo(data)
    })
  }

  const getColaboradorById = async (id: string) => {
    const value = await api.get(`/api/colaborador/findById/${id}`)
    if (value.data.documentos) {
      const photo = await getImage(
        value.data.documentos.route,
        t('messages.getErrorDatabase')
      )
      if (photo) {
        setImagem(photo)
      }
    }
    form.setValues(value.data)
    form.setFieldValue(
      'dataContratoInicial',
      new Date(value.data.dataContratoInicial)
    )
    form.setFieldValue('dataNascimento', new Date(value.data.dataNascimento))
    form.setFieldValue('cnpjEmpresa', Cookies.get('cnpj')!)
  }

  const uploadPhoto = async (file: File) => {
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      await api
        .post(UPLOAD_DOCUMENTOS_TEMP, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          setImagem(URL.createObjectURL(file).toString())
          form.setFieldValue('file.name', file.name)
          form.setFieldValue('file.key', response.data)
        })
        .catch(() => {
          ErrorNotification({ message: t('messages.error') })
        })
    }
  }

  const resetImage = () => {
    setImagem('')
    resetRef.current?.()
    form.setFieldValue('file.name', '')
    form.setFieldValue('file.key', '')
  }

  const renderDadosPessoais = () => {
    return (
      <Flex mt={'1rem'} direction={'column'}>
        <Flex direction={'column'} align={'center'}>
          <Avatar color="blue" radius="xl" size={150} src={photo} alt="" />
          {type !== 'visualizar' && (
            <Flex mt={'0.5rem'}>
              <FileButton
                resetRef={resetRef}
                onChange={file => uploadPhoto(file!)}
                accept="image/png,image/jpeg"
              >
                {props => (
                  <ActionIcon color="blue" {...props}>
                    {<IconUpload />}
                  </ActionIcon>
                )}
              </FileButton>
              {photo && (
                <ActionIcon onClick={() => resetImage()} color="red">
                  {<IconTrash />}
                </ActionIcon>
              )}
            </Flex>
          )}
        </Flex>
        <Text fw={700}>
          {t('pages.colaborador.cadastro.dadosPessoais.title')}
        </Text>
        <Group align={'center'}>
          <TextInput
            {...form.getInputProps('nome')}
            disabled={type == 'visualizar'}
            value={form.values.nome}
            withAsterisk
            size="xs"
            w={windowWidth < 1280 ? 150 : 250}
            onChange={event => handleChange(event.target.value, 'nome')}
            label={t('pages.colaborador.cadastro.dadosPessoais.nome')}
            placeholder={t(
              'pages.colaborador.cadastro.dadosPessoais.inputNome'
            )}
          />

          <TextInput
            withAsterisk
            {...form.getInputProps('sobrenome')}
            size="xs"
            disabled={type == 'visualizar'}
            defaultValue={form.values?.sobrenome}
            w={windowWidth < 1280 ? 150 : 250}
            label={t('pages.colaborador.cadastro.dadosPessoais.sobrenome')}
            onChange={event => handleChange(event.target.value, 'sobrenome')}
            placeholder={t(
              'pages.colaborador.cadastro.dadosPessoais.inputSobrenome'
            )}
          />

          <Select
            {...form.getInputProps('sexo')}
            size={'xs'}
            disabled={type == 'visualizar'}
            w={windowWidth < 1280 ? 150 : 250}
            label={t('pages.colaborador.cadastro.dadosPessoais.sexo')}
            placeholder={t(
              'pages.colaborador.cadastro.dadosPessoais.inputSexo'
            )}
            data={[
              { value: 'Masculino', label: 'Masculino' },
              { value: 'Feminino', label: 'Feminino' },
            ]}
          />

          <TextInput
            withAsterisk
            size="xs"
            {...form.getInputProps('cpf')}
            value={formatarCPFCNPJ(form.values?.cpf)}
            w={windowWidth < 1280 ? 150 : 250}
            onChange={event =>
              handleChange(removeformatarCPFCNPJ(event.target.value), 'cpf')
            }
            disabled={type == 'visualizar'}
            label={t('pages.colaborador.cadastro.dadosPessoais.cpf')}
            placeholder={t('pages.colaborador.cadastro.dadosPessoais.inputCpf')}
          />

          <TextInput
            disabled={type == 'visualizar'}
            withAsterisk
            w={windowWidth < 1280 ? 150 : 250}
            {...form.getInputProps('rg')}
            size="xs"
            onChange={event =>
              handleChange(removeformatarCPFCNPJ(event.target.value), 'rg')
            }
            defaultValue={form.values?.rg || ''}
            label={t('pages.colaborador.cadastro.dadosPessoais.rg')}
            placeholder={t('pages.colaborador.cadastro.dadosPessoais.inputRg')}
          />
          <DatesProvider
            settings={{
              locale: 'pt-br',
            }}
          >
            <DatePickerInput
              value={form.values.dataNascimento}
              {...form.getInputProps('dataNascimento')}
              onChange={val => handleChange(val, 'dataNascimento')}
              withAsterisk={false}
              disabled={type == 'visualizar'}
              clearable
              w={windowWidth < 1280 ? '9.375rem' : '15.625rem'}
              size="xs"
              label={t(
                'pages.colaborador.cadastro.dadosPessoais.dataNascimento'
              )}
              placeholder={t(
                'pages.colaborador.cadastro.dadosPessoais.inputDataNascimento'
              )}
              maxDate={new Date()}
            />
            <DatePickerInput
              value={form.values.dataContratoInicial}
              {...form.getInputProps('dataContratoInicial')}
              withAsterisk={false}
              disabled={type == 'visualizar'}
              size="xs"
              clearable
              onChange={val => handleChange(val, 'dataContratoInicial')}
              label={t(
                'pages.colaborador.cadastro.dadosPessoais.dataContratacao'
              )}
              placeholder={t(
                'pages.colaborador.cadastro.dadosPessoais.inputDataContratacao'
              )}
              maxDate={new Date()}
              w={windowWidth < 1280 ? '9.375rem' : '15.625rem'}
            />
          </DatesProvider>
        </Group>
      </Flex>
    )
  }

  const renderDadosEndereco = () => {
    return (
      <>
        <Title fw={700} mt={'1rem'} size="md">
          {t('pages.colaborador.cadastro.endereco.title')}
        </Title>
        <Group align={'center'}>
          <TextInput
            withAsterisk
            disabled={type == 'visualizar'}
            size="xs"
            w={windowWidth < 1280 ? 150 : 250}
            {...form.getInputProps('endereco.cep')}
            defaultValue={form.values?.endereco.cep}
            onBlur={e => {
              buscarDadosCep(e.target.value.replace(/[-. ]/g, ''))
            }}
            label={t('pages.colaborador.cadastro.endereco.endereco.cep')}
            placeholder={t(
              'pages.colaborador.cadastro.endereco.endereco.inputCep'
            )}
          />

          <TextInput
            withAsterisk
            size="xs"
            w={windowWidth < 1280 ? 150 : 250}
            {...form.getInputProps('endereco.cidade')}
            defaultValue={form.values?.endereco.cidade}
            disabled={type == 'visualizar'}
            onChange={event =>
              handleChange(event.target.value, 'endereco.cidade')
            }
            label={t('pages.colaborador.cadastro.endereco.endereco.cidade')}
            placeholder={t(
              'pages.colaborador.cadastro.endereco.endereco.inputCidade'
            )}
          />

          <TextInput
            withAsterisk
            disabled={type == 'visualizar'}
            w={windowWidth < 1280 ? 150 : 250}
            size="xs"
            {...form.getInputProps('endereco.estado')}
            defaultValue={form.values?.endereco.estado}
            onChange={event =>
              handleChange(event.target.value, 'endereco.estado')
            }
            label={t('pages.colaborador.cadastro.endereco.endereco.estado')}
            placeholder={t(
              'pages.colaborador.cadastro.endereco.endereco.inputEstado'
            )}
          />

          <TextInput
            withAsterisk
            disabled={type == 'visualizar'}
            w={windowWidth < 1280 ? 150 : 250}
            size="xs"
            {...form.getInputProps('endereco.bairro')}
            defaultValue={form.values?.endereco.bairro}
            onChange={event =>
              handleChange(event.target.value, 'endereco.bairro')
            }
            label={t('pages.colaborador.cadastro.endereco.endereco.bairro')}
            placeholder={t(
              'pages.colaborador.cadastro.endereco.endereco.inputBairro'
            )}
          />

          <TextInput
            withAsterisk
            size="xs"
            disabled={type == 'visualizar'}
            w={windowWidth < 1280 ? 150 : 250}
            {...form.getInputProps('endereco.rua')}
            onChange={event => handleChange(event.target.value, 'endereco.rua')}
            defaultValue={form.values?.endereco.rua}
            label={t('pages.colaborador.cadastro.endereco.endereco.rua')}
            placeholder={t(
              'pages.colaborador.cadastro.endereco.endereco.inputRua'
            )}
          />

          <TextInput
            withAsterisk
            disabled={type == 'visualizar'}
            w={windowWidth < 1280 ? 150 : 250}
            size="xs"
            {...form.getInputProps('endereco.numero')}
            defaultValue={form.values?.endereco.numero}
            onChange={event =>
              handleChange(event.target.value, 'endereco.numero')
            }
            label={t('pages.colaborador.cadastro.endereco.endereco.numero')}
            placeholder={t(
              'pages.colaborador.cadastro.endereco.endereco.inputNumero'
            )}
          />
        </Group>
      </>
    )
  }

  const renderContatos = () => {
    return (
      <>
        <Text fw={700} mt={'1rem'} size="md">
          {t('pages.colaborador.cadastro.contatos.title')}
        </Text>
        <Group>
          <TextInput
            disabled={type == 'visualizar'}
            withAsterisk
            w={windowWidth < 1280 ? 150 : 250}
            {...form.getInputProps('telefone')}
            size="xs"
            value={formatarTelefone(form.values?.telefone || '') || ''}
            onChange={event =>
              handleChange(
                removeformatacaoTelefone(event.target.value),
                'telefone'
              )
            }
            label={t('pages.colaborador.cadastro.contatos.contato.telefone')}
            placeholder={t(
              'pages.colaborador.cadastro.contatos.contato.inputTelefone'
            )}
          />
          <TextInput
            withAsterisk
            w={windowWidth < 1280 ? 150 : 250}
            size="xs"
            disabled={type == 'visualizar'}
            {...form.getInputProps('email')}
            value={formatarTelefone(form.values?.email)}
            onChange={event => handleChange(event.target.value, 'email')}
            label={t('pages.colaborador.cadastro.contatos.contato.email')}
            placeholder={t(
              'pages.colaborador.cadastro.contatos.contato.inputEmail'
            )}
          />
        </Group>
      </>
    )
  }

  const renderDadosAdministrativos = () => {
    return (
      <>
        <Text fw={700} mt={'1rem'} size="md">
          {t('pages.colaborador.cadastro.administrativo.title')}
        </Text>
        <Group>
          <Select
            {...form.getInputProps('cargo.id')}
            size={'xs'}
            disabled={type == 'visualizar'}
            w={windowWidth < 1280 ? 150 : 250}
            onChange={event => handleChange(event, 'cargo.id')}
            label={t('pages.colaborador.cadastro.administrativo.cargo')}
            placeholder={t(
              'pages.colaborador.cadastro.administrativo.inputCargo'
            )}
            data={dataCargo}
          />
          <NumberInput
            withAsterisk
            hideControls
            {...form.getInputProps('salario')}
            min={0}
            w={windowWidth < 1280 ? 150 : 250}
            size="xs"
            precision={2}
            decimalSeparator=","
            disabled={type == 'visualizar'}
            thousandsSeparator="."
            value={form.values?.salario}
            onChange={event => handleChange(event, 'salario')}
            label={t('pages.colaborador.cadastro.administrativo.salario')}
            placeholder={t(
              'pages.colaborador.cadastro.administrativo.inputSalario'
            )}
          />
        </Group>
      </>
    )
  }

  const renderButtons = () => {
    return (
      <>
        <Flex mt={20} bottom={0} pos={'relative'} justify={'space-between'}>
          <Button
            leftIcon={
              type === 'visualizar' ? <IconArrowLeft /> : <IconCircleXFilled />
            }
            color={type === 'visualizar' ? '' : 'red'}
            onClick={() => navigate.push('/colaborador')}
          >
            {type === 'visualizar' ? 'Voltar' : t('components.button.cancelar')}
          </Button>
          {type !== 'visualizar' && (
            <Button
              leftIcon={!id ? <IconDatabasePlus /> : <IconDatabaseEdit />}
              type="submit"
              color="green"
            >
              {!id
                ? t('components.button.salvar')
                : t('components.button.editar')}
            </Button>
          )}
        </Flex>
      </>
    )
  }

  return (
    <form onSubmit={form.onSubmit(() => (!id ? handleSubmit() : editar()))}>
      {renderDadosPessoais()}
      {renderDadosEndereco()}
      {renderContatos()}
      {renderDadosAdministrativos()}
      {renderButtons()}
    </form>
  )
}
export default Cadastro
