import EditarCpf from '@components/pages/fornecedor/editar/cpf'
import { Title, Card, Divider } from '@mantine/core'
import { useTranslate } from '@refinedev/core'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import IFornecedor from 'src/interfaces/fornecedor'
import api from 'src/utils/Api'
export default function EditarFornecedor() {
  const [dataCliente, setDataCliente] = useState<IFornecedor>()
  const router = useRouter()
  const t = useTranslate()
  const { id } = router.query
  const getFornecedorById = async () => {
    const value = await api.get(`/api/fornecedor/findById/${id}`)
    setDataCliente(value.data)
  }
  useEffect(() => {
    getFornecedorById()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {dataCliente?.cpfCnpj?.length == 11 && (
        <Card>
          <Title fw={700} size="xl">
            {t('pages.fornecedor.titleEdit')}
          </Title>
          <Divider my="md" />
          <EditarCpf fornecedor={dataCliente} />
        </Card>
      )}
      {dataCliente?.cpfCnpj?.length == 14 && (
        <Card>
          <Title fw={700} size="xl">
            {t('pages.fornecedor.titleEdit')}
          </Title>
          <Divider my="md" />
          <EditarCpf fornecedor={dataCliente} />
        </Card>
      )}
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
