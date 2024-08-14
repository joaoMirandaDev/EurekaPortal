import Cadastro from '@components/pages/colaborador/cadastro'
import { Card, Flex, Text } from '@mantine/core'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import useWindowWidth from 'src/services/responsive/responsive'
export default function VisualizarFornecedor() {
  const router = useRouter()
  const { id } = router.query
  const windowWidth = useWindowWidth()
  return (
    <Flex
      direction={'column'}
      wrap={'nowrap'}
      style={{ margin: windowWidth < 1280 ? '1rem' : 0 }}
    >
      <Text fz={'1.5rem'} fw={'bold'} m={'0 1rem 1rem 1rem'}>
        Visualizar Colaborador
      </Text>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        m={'0 1rem 1rem 1rem '}
      >
        <Cadastro id={id} type={'visualizar'} />
      </Card>
    </Flex>
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
