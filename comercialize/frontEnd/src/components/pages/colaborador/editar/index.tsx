import {
  Button,
  Flex,
  Grid,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { DateValue } from '@mantine/dates'
import { useTranslate } from '@refinedev/core'
import 'dayjs/locale/pt-br'
import { useForm } from '@mantine/form'
import api from 'src/utils/Api'
import {
  formatarCPFCNPJ,
  formatarTelefone,
  removeformatacaoTelefone,
  removeformatarCPFCNPJ,
} from 'src/utils/FormatterUtils'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ErrorNotification, SuccessNotification } from '@components/common'
import IColaborador from 'src/interfaces/colaborador'
import { IconCircleXFilled, IconDatabaseEdit } from '@tabler/icons-react'
interface EditarColaborador {
  idColaborador: string | string[] | undefined
}
const EditarColaborador: React.FC<EditarColaborador> = ({ idColaborador }) => {
  const t = useTranslate()
  const [dataColaborador, setDataColaborador] = useState<IColaborador>()
  const navigate = useRouter()
  const form = useForm({
    initialValues: {
      nome: '',
      sobrenome: '',
      cpf: '',
      rg: '',
      cep: '',
      cidade: '',
      bairro: '',
      rua: '',
      numero: '',
      telefone: '',
      senha: '',
    },
  })
  const getFornecedorById = async () => {
    const value = await api.get(`/api/colaborador/findById/${idColaborador}`)
    setDataColaborador(value.data)
  }
  useEffect(() => {
    getFornecedorById()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const buscarDadosCep = async (value: string) => {
    const dados = await api.get(`/api/endereco/findByRegiao/${value}`)
    setDataColaborador(prevData => ({
      ...prevData,
      cep: value,
      bairro: dados.data.bairro,
      estado: dados.data.uf,
      cidade: dados.data.localidade + '-' + dados.data.uf,
      rua: dados.data.logradouro,
    }))
  }
  const handleChange = (
    event: string | number | boolean | DateValue,
    key: string
  ) => {
    setDataColaborador({ ...dataColaborador, [key]: event })
  }

  const editar = async () => {
    await api
      .put(`/api/colaborador/editar`, dataColaborador)
      .then(() => {
        navigate.push('/colaborador')
        SuccessNotification({
          message: t('pages.colaborador.editar.sucesso'),
        })
      })
      .catch(error => {
        ErrorNotification({ message: error })
      })
  }

  const renderDadosPessoais = () => (
    <>
      <Title fw={700} size="md">
        {t('pages.colaborador.cadastro.cpf.title.dadosPessoais')}
      </Title>
      <Grid grow gutter="sm">
        <Grid.Col md={4} lg={2}>
          <TextInput
            defaultValue={dataColaborador?.nome || ''}
            withAsterisk
            size="xs"
            required
            w={250}
            onChange={event => handleChange(event.target.value, 'nome')}
            label={t('pages.colaborador.cadastro.cpf.inputName')}
            placeholder={t('pages.colaborador.cadastro.cpf.placeHoldInputNome')}
          />
        </Grid.Col>
        <Grid.Col md={4} lg={2}>
          <TextInput
            withAsterisk
            required
            size="xs"
            defaultValue={dataColaborador?.sobrenome || ''}
            w={250}
            label={t('pages.colaborador.cadastro.cpf.inputSobrenome')}
            onChange={event => handleChange(event.target.value, 'sobrenome')}
            placeholder={t(
              'pages.colaborador.cadastro.cpf.placeHoldInputSobrenome'
            )}
          />
        </Grid.Col>
        <Grid.Col md={4} lg={2}>
          <TextInput
            withAsterisk
            required
            size="xs"
            disabled
            value={formatarCPFCNPJ(dataColaborador?.cpf || '')}
            w={250}
            onChange={event =>
              handleChange(removeformatarCPFCNPJ(event.target.value), 'cpf')
            }
            label={t('pages.colaborador.cadastro.cpf.inputCpf')}
            placeholder={t('pages.colaborador.cadastro.cpf.placeHoldInputCpf')}
          />
        </Grid.Col>
        <Grid.Col md={4} lg={2}>
          <TextInput
            withAsterisk
            w={250}
            required
            size="xs"
            onChange={event => handleChange(event.target.value, 'rg')}
            defaultValue={dataColaborador?.rg || ''}
            label={t('pages.colaborador.cadastro.cpf.inputRg')}
            placeholder={t('pages.colaborador.cadastro.cpf.placeHoldInputRg')}
          />
        </Grid.Col>
      </Grid>
    </>
  )

  const renderDadosEndereco = () => (
    <>
      <Title fw={700} mt={20} size="md">
        {t('pages.colaborador.cadastro.cpf.title.endereco')}
      </Title>
      <Grid grow gutter="sm">
        <Grid.Col md={4} lg={2}>
          <TextInput
            required
            withAsterisk
            size="xs"
            w={250}
            defaultValue={dataColaborador?.cep || ''}
            onBlur={e => {
              buscarDadosCep(e.target.value || '')
            }}
            label={t('pages.colaborador.cadastro.cpf.inputCep')}
            placeholder={t('pages.colaborador.cadastro.cpf.placeHoldInputCep')}
          />
        </Grid.Col>
        <Grid.Col md={4} lg={2}>
          <TextInput
            withAsterisk
            required
            size="xs"
            w={250}
            defaultValue={dataColaborador?.cidade || ''}
            onChange={event => handleChange(event.target.value, 'cidade')}
            label={t('pages.colaborador.cadastro.cpf.inputCidade')}
            placeholder={t(
              'pages.colaborador.cadastro.cpf.placeHoldInputCidade'
            )}
          />
        </Grid.Col>
        <Grid.Col md={4} lg={2}>
          <TextInput
            withAsterisk
            required
            w={250}
            size="xs"
            defaultValue={dataColaborador?.estado || ''}
            onChange={event => handleChange(event.target.value, 'estado')}
            label={t('pages.colaborador.cadastro.cpf.inputEstado')}
            placeholder={t(
              'pages.colaborador.cadastro.cpf.placeHoldInputEstado'
            )}
          />
        </Grid.Col>
        <Grid.Col md={4} lg={2}>
          <TextInput
            withAsterisk
            w={250}
            required
            size="xs"
            defaultValue={dataColaborador?.bairro || ''}
            onChange={event => handleChange(event.target.value, 'bairro')}
            label={t('pages.colaborador.cadastro.cpf.inputBairro')}
            placeholder={t(
              'pages.colaborador.cadastro.cpf.placeHoldInputBairro'
            )}
          />
        </Grid.Col>
        <Grid.Col md={4} lg={2}>
          <TextInput
            withAsterisk
            size="xs"
            w={250}
            required
            onChange={event => handleChange(event.target.value, 'rua')}
            defaultValue={dataColaborador?.rua || ''}
            label={t('pages.colaborador.cadastro.cpf.inputRua')}
            placeholder={t('pages.colaborador.cadastro.cpf.placeHoldInputRua')}
          />
        </Grid.Col>
        <Grid.Col md={4} lg={2}>
          <TextInput
            withAsterisk
            required
            w={250}
            size="xs"
            defaultValue={dataColaborador?.numero || ''}
            onChange={event => handleChange(event.target.value, 'numero')}
            label={t('pages.colaborador.cadastro.cpf.inputNumero')}
            placeholder={t(
              'pages.colaborador.cadastro.cpf.placeHoldInputNumero'
            )}
          />
        </Grid.Col>
      </Grid>
    </>
  )

  const renderContatos = () => (
    <>
      <Text fw={700} mt={20} size="md">
        {t('pages.colaborador.cadastro.cpf.title.contato')}
      </Text>
      <Grid>
        <Grid.Col md={4} lg={2}>
          <TextInput
            withAsterisk
            w={250}
            size="xs"
            value={formatarTelefone(dataColaborador?.telefone || '') || ''}
            onChange={event =>
              handleChange(
                removeformatacaoTelefone(event.target.value),
                'telefone'
              )
            }
            label={t('pages.colaborador.cadastro.cpf.inputTelefone')}
            placeholder={t(
              'pages.colaborador.cadastro.cpf.placeHoldInputTelefone'
            )}
          />
        </Grid.Col>
      </Grid>
    </>
  )

  const renderUsuario = () => (
    <>
      <Text fw={700} mt={20} size="md">
        {t('pages.colaborador.cadastro.cpf.title.usuario')}
      </Text>
      <Grid grow gutter="sm">
        <Grid.Col md={4} lg={2}>
          <PasswordInput
            withAsterisk
            w={250}
            size="xs"
            value={dataColaborador?.senha || ''}
            onChange={event => handleChange(event.target.value, 'senha')}
            label={t('pages.colaborador.cadastro.cpf.inputUsuario')}
            placeholder={t(
              'pages.colaborador.cadastro.cpf.placeHoldInputSenha'
            )}
          />
        </Grid.Col>
      </Grid>
    </>
  )

  const renderButtons = () => (
    <>
      <Flex mt={20} justify={'space-between'}>
        <Button
          leftIcon={<IconCircleXFilled />}
          color="red"
          onClick={() => navigate.push('/colaborador')}
        >
          {t('components.button.cancelar')}
        </Button>
        <Button leftIcon={<IconDatabaseEdit />} type="submit" color="green">
          {t('components.button.salvar')}
        </Button>
      </Flex>
    </>
  )

  return (
    <>
      <form onSubmit={form.onSubmit(() => editar())}>
        {renderDadosPessoais()}
        {renderDadosEndereco()}
        {renderContatos()}
        {renderUsuario()}
        {renderButtons()}
      </form>
    </>
  )
}
export default EditarColaborador
