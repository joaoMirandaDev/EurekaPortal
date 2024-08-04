import { Button, Flex, Grid, Text, TextInput, Title } from '@mantine/core'
import { DateValue } from '@mantine/dates'
import { useTranslate } from '@refinedev/core'
import 'dayjs/locale/pt-br'
import { useForm } from '@mantine/form'
import api from 'src/utils/Api'
import IFornecedor from 'src/interfaces/fornecedor'
import {
  formatarCPFCNPJ,
  formatarTelefone,
  removeformatacaoTelefone,
  removeformatarCPFCNPJ,
} from 'src/utils/FormatterUtils'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { ErrorNotification, SuccessNotification } from '@components/common'
import { IconCircleXFilled, IconDatabasePlus } from '@tabler/icons-react'
export default function CadastroCpf() {
  const t = useTranslate()
  const [dataCliente, setDataCliente] = useState<IFornecedor>()
  const navigate = useRouter()
  const form = useForm({
    initialValues: {
      nomeRazaoSocial: '',
      sobrenome: '',
      cpfCnpj: '',
      rg: '',
      dataNascimento: '',
      cep: '',
      cidade: '',
      bairro: '',
      rua: '',
      numero: '',
      telefone: '',
    },
  })
  const buscarDadosCep = async (value: string) => {
    const dados = await api.get(`/api/endereco/findByRegiao/${value}`)
    setDataCliente(prevData => ({
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
    setDataCliente({ ...dataCliente, [key]: event })
  }
  const saveCliente = async () => {
    await api
      .post(`/api/fornecedor/adicionar`, dataCliente)
      .then(response => {
        navigate.push('/fornecedor')
        SuccessNotification({ message: response.data })
      })
      .catch(error => {
        ErrorNotification({ message: error })
      })
  }

  const renderDadosPessoais = () => (
    <>
      <Title fw={700} size="md">
        {t('pages.fornecedor.cadastro.cpf.title.dadosPessoais')}
      </Title>
      <Grid grow gutter="sm">
        <Grid.Col md={4} lg={2}>
          <TextInput
            defaultValue={dataCliente?.nomeRazaoSocial || ''}
            withAsterisk
            size="xs"
            required
            w={250}
            onChange={event =>
              handleChange(event.target.value, 'nomeRazaoSocial')
            }
            label={t('pages.fornecedor.cadastro.cpf.inputName')}
            placeholder={t('pages.fornecedor.cadastro.cpf.placeHoldInputNome')}
          />
        </Grid.Col>
        <Grid.Col md={4} lg={2}>
          <TextInput
            withAsterisk
            required
            size="xs"
            defaultValue={dataCliente?.sobrenome || ''}
            w={250}
            label={t('pages.fornecedor.cadastro.cpf.inputSobrenome')}
            onChange={event => handleChange(event.target.value, 'sobrenome')}
            placeholder={t(
              'pages.fornecedor.cadastro.cpf.placeHoldInputSobrenome'
            )}
          />
        </Grid.Col>
        <Grid.Col md={4} lg={2}>
          <TextInput
            withAsterisk
            required
            size="xs"
            value={formatarCPFCNPJ(dataCliente?.cpfCnpj || '')}
            w={250}
            onChange={event =>
              handleChange(removeformatarCPFCNPJ(event.target.value), 'cpfCnpj')
            }
            label={t('pages.fornecedor.cadastro.cpf.inputCpf')}
            placeholder={t('pages.fornecedor.cadastro.cpf.placeHoldInputCpf')}
          />
        </Grid.Col>
        <Grid.Col md={4} lg={2}>
          <TextInput
            withAsterisk
            w={250}
            required
            size="xs"
            onChange={event => handleChange(event.target.value, 'rg')}
            defaultValue={dataCliente?.rg || ''}
            label={t('pages.fornecedor.cadastro.cpf.inputRg')}
            placeholder={t('pages.fornecedor.cadastro.cpf.placeHoldInputRg')}
          />
        </Grid.Col>
      </Grid>
    </>
  )

  const renderDadosEndereco = () => (
    <>
      <Title fw={700} mt={20} size="md">
        {t('pages.fornecedor.cadastro.cpf.title.endereco')}
      </Title>
      <Grid grow gutter="sm">
        <Grid.Col md={4} lg={2}>
          <TextInput
            required
            withAsterisk
            size="xs"
            w={250}
            defaultValue={dataCliente?.cep || ''}
            onBlur={e => {
              buscarDadosCep(e.target.value || '')
            }}
            label={t('pages.fornecedor.cadastro.cpf.inputCep')}
            placeholder={t('pages.fornecedor.cadastro.cpf.placeHoldInputCep')}
          />
        </Grid.Col>
        <Grid.Col md={4} lg={2}>
          <TextInput
            withAsterisk
            required
            size="xs"
            w={250}
            defaultValue={dataCliente?.cidade || ''}
            onChange={event => handleChange(event.target.value, 'cidade')}
            label={t('pages.fornecedor.cadastro.cpf.inputCidade')}
            placeholder={t(
              'pages.fornecedor.cadastro.cpf.placeHoldInputCidade'
            )}
          />
        </Grid.Col>
        <Grid.Col md={4} lg={2}>
          <TextInput
            withAsterisk
            required
            w={250}
            size="xs"
            defaultValue={dataCliente?.estado || ''}
            onChange={event => handleChange(event.target.value, 'estado')}
            label={t('pages.fornecedor.cadastro.cpf.inputEstado')}
            placeholder={t(
              'pages.fornecedor.cadastro.cpf.placeHoldInputEstado'
            )}
          />
        </Grid.Col>
        <Grid.Col md={4} lg={2}>
          <TextInput
            withAsterisk
            w={250}
            required
            size="xs"
            defaultValue={dataCliente?.bairro || ''}
            onChange={event => handleChange(event.target.value, 'bairro')}
            label={t('pages.fornecedor.cadastro.cpf.inputBairro')}
            placeholder={t(
              'pages.fornecedor.cadastro.cpf.placeHoldInputBairro'
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
            defaultValue={dataCliente?.rua || ''}
            label={t('pages.fornecedor.cadastro.cpf.inputRua')}
            placeholder={t('pages.fornecedor.cadastro.cpf.placeHoldInputRua')}
          />
        </Grid.Col>
        <Grid.Col md={4} lg={2}>
          <TextInput
            withAsterisk
            required
            w={250}
            size="xs"
            defaultValue={dataCliente?.numero || ''}
            onChange={event => handleChange(event.target.value, 'numero')}
            label={t('pages.fornecedor.cadastro.cpf.inputNumero')}
            placeholder={t(
              'pages.fornecedor.cadastro.cpf.placeHoldInputNumero'
            )}
          />
        </Grid.Col>
      </Grid>
    </>
  )

  const renderContatos = () => (
    <>
      <Text fw={700} mt={20} size="md">
        {t('pages.fornecedor.cadastro.cpf.title.contato')}
      </Text>
      <Grid>
        <Grid.Col md={4} lg={2}>
          <TextInput
            withAsterisk
            w={250}
            size="xs"
            value={formatarTelefone(dataCliente?.telefone || '') || ''}
            onChange={event =>
              handleChange(
                removeformatacaoTelefone(event.target.value),
                'telefone'
              )
            }
            label={t('pages.fornecedor.cadastro.cpf.inputTelefone')}
            placeholder={t(
              'pages.fornecedor.cadastro.cpf.placeHoldInputTelefone'
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
          color="red"
          leftIcon={<IconCircleXFilled />}
          onClick={() => navigate.push('/fornecedor')}
        >
          {t('components.button.cancelar')}
        </Button>
        <Button leftIcon={<IconDatabasePlus />} type="submit" color="green">
          {t('components.button.salvar')}
        </Button>
      </Flex>
    </>
  )

  return (
    <>
      <form onSubmit={form.onSubmit(() => saveCliente())}>
        {renderDadosPessoais()}
        {renderDadosEndereco()}
        {renderContatos()}
        {renderButtons()}
      </form>
    </>
  )
}
