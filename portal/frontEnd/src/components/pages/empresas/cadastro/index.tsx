/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ActionIcon,
  Avatar,
  Button,
  FileButton,
  Flex,
  Group,
  MultiSelect,
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
import { IconTrash, IconUpload } from '@tabler/icons'
import {
  CREATE_EMPRESA,
  GET_ALL_MODULOS,
  UPLOAD_DOCUMENTOS_TEMP,
} from 'src/utils/Routes'
import { useRef, useEffect, useState } from 'react'
import { validaEmpresa } from '../validation/schemaEmpresa'
import { getImage } from 'src/utils/Arquivo'
interface IFile {
  name: string
  key: string
}
interface empresa {
  id: string | string[] | undefined | null
}
const Cadastro: React.FC<empresa> = ({ id }) => {
  const t = useTranslate()
  const [dataModulos, setDataModulos] = useState<SelectItem[]>([])
  const [photo, setImagem] = useState<string | null>(null)
  const resetRef = useRef<() => void>(null)
  const navigate = useRouter()
  const form = useForm<{
    id: number | null
    razaoSocial: string
    inscricaoEstadual?: string
    nomeFantasia: string
    cpfResponsavel: string
    cnpj: string
    dataAbertura: Date | null
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
    idModulos: string[]
  }>({
    initialValues: {
      id: 0,
      razaoSocial: '',
      nomeFantasia: '',
      cpfResponsavel: '',
      inscricaoEstadual: '',
      dataAbertura: null,
      cnpj: '',
      telefone: '',
      idModulos: [],
      ativo: 0,
      email: '',
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
    validate: zodResolver(validaEmpresa()),
  })
  const buscarDadosCep = async (value: string) => {
    if (value.length === 8 || value !== '') {
      const dados = await api.get(`/api/endereco/findByRegiao/${value}`)
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
      .post(CREATE_EMPRESA, form.values)
      .then(response => {
        navigate.push('/empresas')
        SuccessNotification({ message: response.data })
      })
      .catch(() => {
        ErrorNotification({ message: t('components.error.errorBack') })
      })
  }

  const editar = async () => {
    await api
      .put(`/api/empresa/editar`, form.values)
      .then(() => {
        navigate.push('/empresas')
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
    findAllModulos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (id) {
      getempresaById(id.toString())
      findAllModulos()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const getempresaById = async (id: string) => {
    const value = await api.get(`/api/empresa/findById/${id}`)
    if (value.data.documentos) {
      const photo = await getImage(
        value.data.documentos.route,
        t('messages.getErrorDatabase')
      )
      if (photo) {
        setImagem(photo?.toString())
      }
    }
    form.setValues(value.data)
    form.setFieldValue('dataAbertura', new Date(value.data.dataAbertura))
  }

  const findAllModulos = async () => {
    const value = await api
      .get(GET_ALL_MODULOS)
      .then(response => {
        return response.data.map((data: any) => ({
          value: data.id,
          label: data.nome,
        }))
      })
      .catch(() => {
        ErrorNotification({ message: t('messages.error') })
      })
    setDataModulos(value)
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

  const renderDadosEmpresarial = () => {
    return (
      <Flex mt={'1rem'} direction={'column'}>
        <Flex direction={'column'} align={'center'}>
          <Avatar color="blue" radius="xl" size={150} src={photo} alt="" />
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
        </Flex>
        <Text fw={700} fz="xl">
          {t('pages.empresa.cadastro.dadosEmpresarial.title')}
        </Text>
        <Group align={'center'} spacing="xl">
          <TextInput
            {...form.getInputProps('razaoSocial')}
            value={form.values.razaoSocial}
            withAsterisk
            size="xs"
            w={350}
            onChange={event => handleChange(event.target.value, 'razaoSocial')}
            label={t('pages.empresa.cadastro.dadosEmpresarial.razaoSocial')}
            placeholder={t(
              'pages.empresa.cadastro.dadosEmpresarial.inputRazaoSocial'
            )}
          />

          <TextInput
            withAsterisk
            {...form.getInputProps('nomeFantasia')}
            size="xs"
            defaultValue={form.values?.nomeFantasia}
            w={350}
            label={t('pages.empresa.cadastro.dadosEmpresarial.nomeFantasia')}
            onChange={event => handleChange(event.target.value, 'nomeFantasia')}
            placeholder={t(
              'pages.empresa.cadastro.dadosEmpresarial.inputSobrenome'
            )}
          />

          <TextInput
            withAsterisk
            size="xs"
            {...form.getInputProps('cnpj')}
            value={formatarCPFCNPJ(form.values?.cnpj)}
            w={350}
            onChange={event =>
              handleChange(removeformatarCPFCNPJ(event.target.value), 'cnpj')
            }
            label={t('pages.empresa.cadastro.dadosEmpresarial.cnpj')}
            placeholder={t('pages.empresa.cadastro.dadosEmpresarial.inputCnpj')}
          />
          <TextInput
            size="xs"
            {...form.getInputProps('inscricaoEstadual')}
            value={form.values?.inscricaoEstadual}
            w={350}
            onChange={event =>
              handleChange(
                event.target.value.replace(/[.,\s/]/g, ''),
                'inscricaoEstadual'
              )
            }
            label={t(
              'pages.empresa.cadastro.dadosEmpresarial.inscricaoEstadual'
            )}
            placeholder={t(
              'pages.empresa.cadastro.dadosEmpresarial.inputInscricaoEstadual'
            )}
          />
        </Group>
        <Group align={'center'} spacing="xl" mt={'1rem'}>
          <TextInput
            withAsterisk
            size="xs"
            {...form.getInputProps('cpfResponsavel')}
            value={formatarCPFCNPJ(form.values?.cpfResponsavel)}
            w={350}
            onChange={event =>
              handleChange(
                removeformatarCPFCNPJ(event.target.value),
                'cpfResponsavel'
              )
            }
            label={t('pages.empresa.cadastro.dadosEmpresarial.cpf')}
            placeholder={t('pages.empresa.cadastro.dadosEmpresarial.inputCpf')}
          />
          <DatesProvider
            settings={{
              locale: 'pt-br',
            }}
          >
            <DatePickerInput
              value={form.values.dataAbertura}
              {...form.getInputProps('dataAbertura')}
              onChange={val => handleChange(val, 'dataAbertura')}
              withAsterisk={false}
              clearable
              w={'21.875rem'}
              size="xs"
              label={t('pages.empresa.cadastro.dadosEmpresarial.dataAbertura')}
              placeholder={t(
                'pages.empresa.cadastro.dadosEmpresarial.inputDataAbertura'
              )}
              maxDate={new Date()}
            />
          </DatesProvider>
        </Group>
      </Flex>
    )
  }

  const renderDadosEndereco = () => {
    return (
      <>
        <Title fw={700} mt={'1rem'} fz="xl">
          {t('pages.empresa.cadastro.endereco.title')}
        </Title>
        <Group align={'center'} spacing="xl">
          <TextInput
            withAsterisk
            size="xs"
            w={350}
            {...form.getInputProps('endereco.cep')}
            defaultValue={form.values?.endereco.cep}
            onBlur={e => {
              buscarDadosCep(e.target.value.replace(/[-. ]/g, ''))
            }}
            label={t('pages.empresa.cadastro.endereco.endereco.cep')}
            placeholder={t('pages.empresa.cadastro.endereco.endereco.inputCep')}
          />

          <TextInput
            withAsterisk
            size="xs"
            w={350}
            {...form.getInputProps('endereco.cidade')}
            defaultValue={form.values?.endereco.cidade}
            onChange={event =>
              handleChange(event.target.value, 'endereco.cidade')
            }
            label={t('pages.empresa.cadastro.endereco.endereco.cidade')}
            placeholder={t(
              'pages.empresa.cadastro.endereco.endereco.inputCidade'
            )}
          />

          <TextInput
            withAsterisk
            w={350}
            size="xs"
            {...form.getInputProps('endereco.estado')}
            defaultValue={form.values?.endereco.estado}
            onChange={event =>
              handleChange(event.target.value, 'endereco.estado')
            }
            label={t('pages.empresa.cadastro.endereco.endereco.estado')}
            placeholder={t(
              'pages.empresa.cadastro.endereco.endereco.inputEstado'
            )}
          />

          <TextInput
            withAsterisk
            w={350}
            size="xs"
            {...form.getInputProps('endereco.bairro')}
            defaultValue={form.values?.endereco.bairro}
            onChange={event =>
              handleChange(event.target.value, 'endereco.bairro')
            }
            label={t('pages.empresa.cadastro.endereco.endereco.bairro')}
            placeholder={t(
              'pages.empresa.cadastro.endereco.endereco.inputBairro'
            )}
          />
        </Group>
        <Group align={'center'} spacing="xl" mt={'1rem'}>
          <TextInput
            withAsterisk
            size="xs"
            w={350}
            {...form.getInputProps('endereco.rua')}
            onChange={event => handleChange(event.target.value, 'endereco.rua')}
            defaultValue={form.values?.endereco.rua}
            label={t('pages.empresa.cadastro.endereco.endereco.rua')}
            placeholder={t('pages.empresa.cadastro.endereco.endereco.inputRua')}
          />

          <TextInput
            withAsterisk
            w={350}
            size="xs"
            {...form.getInputProps('endereco.numero')}
            defaultValue={form.values?.endereco.numero}
            onChange={event =>
              handleChange(event.target.value, 'endereco.numero')
            }
            label={t('pages.empresa.cadastro.endereco.endereco.numero')}
            placeholder={t(
              'pages.empresa.cadastro.endereco.endereco.inputNumero'
            )}
          />
        </Group>
      </>
    )
  }

  const renderContatos = () => {
    return (
      <>
        <Text fw={700} mt={'1rem'} fz="xl">
          {t('pages.empresa.cadastro.contatos.title')}
        </Text>
        <Group spacing="xl">
          <TextInput
            withAsterisk
            w={350}
            {...form.getInputProps('telefone')}
            size="xs"
            value={formatarTelefone(form.values?.telefone || '') || ''}
            onChange={event =>
              handleChange(
                removeformatacaoTelefone(event.target.value),
                'telefone'
              )
            }
            label={t('pages.empresa.cadastro.contatos.contato.telefone')}
            placeholder={t(
              'pages.empresa.cadastro.contatos.contato.inputTelefone'
            )}
          />
          <TextInput
            withAsterisk
            w={350}
            size="xs"
            {...form.getInputProps('email')}
            value={formatarTelefone(form.values?.email)}
            onChange={event => handleChange(event.target.value, 'email')}
            label={t('pages.empresa.cadastro.contatos.contato.email')}
            placeholder={t(
              'pages.empresa.cadastro.contatos.contato.inputEmail'
            )}
          />
        </Group>
      </>
    )
  }

  const renderButtons = () => {
    return (
      <>
        <Flex
          mt={'1.5rem'}
          bottom={0}
          pos={'relative'}
          justify={'space-between'}
        >
          <Button
            leftIcon={<IconCircleXFilled />}
            color="red"
            onClick={() => navigate.push('/empresas')}
          >
            {t('components.button.cancelar')}
          </Button>
          <Button
            leftIcon={!id ? <IconDatabasePlus /> : <IconDatabaseEdit />}
            type="submit"
            color="green"
          >
            {!id
              ? t('components.button.salvar')
              : t('components.button.editar')}
          </Button>
        </Flex>
      </>
    )
  }

  const renderModulos = () => {
    return (
      <>
        <Text fw={700} mt={'1rem'} fz="xl">
          {t('pages.empresa.cadastro.modulos.title')}
        </Text>
        <MultiSelect
          {...form.getInputProps('idModulos')}
          withinPortal
          w={350}
          withAsterisk
          value={form.values.idModulos}
          data={dataModulos}
          onChange={event => {
            form.setFieldValue('idModulos', event)
          }}
          label={t('pages.empresa.cadastro.modulos.modulo.modulo')}
          placeholder={t('pages.empresa.cadastro.modulos.modulo.inputModulos')}
        />
      </>
    )
  }

  return (
    <form onSubmit={form.onSubmit(() => (!id ? handleSubmit() : editar()))}>
      {renderDadosEmpresarial()}
      {renderDadosEndereco()}
      {renderContatos()}
      {renderModulos()}
      {renderButtons()}
    </form>
  )
}
export default Cadastro
