import Cadastro from '@components/pages/colaborador/cadastro'
import { Card, Text } from '@mantine/core'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
export default function VisualizarFornecedor() {
  const router = useRouter()
  const { id } = router.query

  return (
    <>
      <Text fz={'1.5rem'} fw={'bold'} m={'1rem'}>
        Visualizar Colaborador
      </Text>
      <Card>
        <Cadastro id={id} type={'visualizar'} />
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
