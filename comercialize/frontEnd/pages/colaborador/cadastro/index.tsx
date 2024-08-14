import Cadastro from '@components/pages/colaborador/cadastro'
import { Card, Flex, Text } from '@mantine/core'
import { useTranslate } from '@refinedev/core'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import useWindowWidth from 'src/services/responsive/responsive'

export default function ColaboradorCadastro() {
  const t = useTranslate()
  const windowWidth = useWindowWidth()
  return (
    <Flex
      direction={'column'}
      wrap={'nowrap'}
      style={{ margin: windowWidth < 1280 ? '1rem' : 0 }}
    >
      <Text fz={'1.5rem'} fw={'bold'} m={'0 1rem 1rem 1rem'}>
        {t('pages.colaborador.cadastro.title')}
      </Text>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        m={'0 1rem 1rem 1rem '}
      >
        {<Cadastro id={null} type={null} />}
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
