import { Button, Card, Divider, Flex, Group, Text, Title } from '@mantine/core'
import { useTranslate } from '@refinedev/core'
import { IconArrowBarLeft } from '@tabler/icons'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import IFornecedor from 'src/interfaces/fornecedor'
import api from 'src/utils/Api'
import { formatarCPFCNPJ, formatarTelefone } from 'src/utils/FormatterUtils'

export default function ShowFornecedor() {
  const t = useTranslate()
  const [dataCliente, setDataCliente] = useState<IFornecedor>()
  const [date, setDate] = useState<Date>()
  const navigate = useRouter()
  const router = useRouter()
  const { id } = router.query
  const [, setTitle] = useState<string>('')
  const findByFornecedorId = async () => {
    const value = await api.get(`/api/fornecedor/findById/${id}`)
    setDataCliente(value.data)
  }
  useEffect(() => {
    findByFornecedorId()
    setDate(dataCliente?.dataNascimento)
    if (dataCliente?.cpfCnpj && dataCliente?.cpfCnpj?.length == 11) {
      setTitle(t('pages.fornecedor.cadastro.cpf.title.dadosPessoais'))
    } else {
      setTitle(t('pages.fornecedor.cadastro.cpf.title.dadosEmpresariais'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    setDate(dataCliente?.dataNascimento)
  }, [dataCliente])

  const renderDadosPessoais = () => (
    <>
      <Title fw={700} size="md" mb={20}>
        {t('pages.fornecedor.cadastro.cpf.title.dadosPessoais')}
      </Title>
      <Flex
        wrap={'wrap'}
        justify="flex-start"
        align="flex-start"
        gap="md"
        direction="column"
      >
        <Group mr={20}>
          <Text fw={'bold'}>
            {t('pages.fornecedor.cadastro.cpf.inputName')} :
          </Text>
          {dataCliente?.nomeRazaoSocial}
        </Group>
        <Group mr={20}>
          <Text fw={'bold'}>
            {t('pages.fornecedor.cadastro.cpf.inputSobrenome')} :
          </Text>
          {dataCliente?.sobrenome}
        </Group>
        <Group mr={20}>
          <Text fw={'bold'}>
            {t('pages.fornecedor.cadastro.cpf.inputCpf')} :
          </Text>
          {formatarCPFCNPJ(dataCliente?.cpfCnpj || '')}
        </Group>
        <Group mr={20}>
          <Text fw={'bold'}>
            {t('pages.fornecedor.cadastro.cpf.inputRg')} :
          </Text>
          {dataCliente?.rg}
        </Group>
        <Group mr={20}>
          <Text fw={'bold'}>
            {t('pages.fornecedor.cadastro.cpf.inputData')} :
          </Text>
          {date?.toString()}
        </Group>
      </Flex>
    </>
  )
  const renderDadosEndereco = () => (
    <>
      <Title fw={700} mt={20} size="md" mb={20}>
        {t('pages.fornecedor.cadastro.cpf.title.endereco')}
      </Title>
      <Flex
        wrap={'wrap'}
        justify="flex-start"
        align="flex-start"
        gap="md"
        direction="column"
      >
        <Group mr={20}>
          <Text fw={'bold'}>
            {t('pages.fornecedor.cadastro.cpf.inputCep')} :
          </Text>
          {dataCliente?.cep}
        </Group>
        <Group mr={20}>
          <Text fw={'bold'}>
            {t('pages.fornecedor.cadastro.cpf.inputCidade')} :{' '}
          </Text>
          {dataCliente?.cidade}
        </Group>
        <Group mr={20}>
          <Text fw={'bold'}>
            {t('pages.fornecedor.cadastro.cpf.inputBairro')} :{' '}
          </Text>
          {dataCliente?.bairro}
        </Group>
        <Group mr={20}>
          <Text fw={'bold'}>
            {t('pages.fornecedor.cadastro.cpf.inputRua')} :
          </Text>
          {dataCliente?.rua}
        </Group>
        <Group mr={20}>
          <Text fw={'bold'}>
            {t('pages.fornecedor.cadastro.cpf.inputNumero')} :{' '}
          </Text>
          {dataCliente?.numero}
        </Group>
      </Flex>
    </>
  )

  const renderButtons = () => (
    <>
      <Flex mt={20} justify={'flex-start'}>
        <Button
          leftIcon={<IconArrowBarLeft />}
          onClick={() => navigate.push('/fornecedor')}
        >
          {t('components.button.voltar')}
        </Button>
      </Flex>
    </>
  )

  const renderContatos = () => (
    <>
      <Title fw={700} mt={20} size="md" mb={20}>
        {t('pages.fornecedor.cadastro.cpf.title.contato')}
      </Title>
      <Flex
        wrap={'wrap'}
        justify="flex-start"
        align="flex-start"
        gap="md"
        direction="column"
      >
        <Group mr={20}>
          <Text fw={'bold'}>
            {t('pages.fornecedor.cadastro.cpf.inputTelefone')} :{' '}
          </Text>
          {formatarTelefone(dataCliente?.telefone || '')}
        </Group>
      </Flex>
    </>
  )
  return (
    <>
      <Card>
        {renderDadosPessoais()}
        <Divider />
        {renderDadosEndereco()}
        <Divider />
        {renderContatos()}
      </Card>
      {renderButtons()}
    </>
  )
}
export const getServerSideProps: GetServerSideProps = async context => {
  const translateProps = await serverSideTranslations(context.locale ?? 'pt', [
    'common',
  ])

  return {
    props: {
      ...translateProps,
    },
  }
}
