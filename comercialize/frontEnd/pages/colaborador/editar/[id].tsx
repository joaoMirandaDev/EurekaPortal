import Cadastro from '@components/pages/colaborador/cadastro'
import { Card, Text } from '@mantine/core'
import { useTranslate } from '@refinedev/core'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
export default function EditarFornecedor() {
  const router = useRouter()
  const t = useTranslate()
  const { id } = router.query

  return (
    <>
      <Text fz={'1.5rem'} fw={'bold'} m={'1rem'}>
        {t('pages.colaborador.cadastro.titleEdit')}
      </Text>
      <Card>
        <Cadastro id={id} />
      </Card>
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
