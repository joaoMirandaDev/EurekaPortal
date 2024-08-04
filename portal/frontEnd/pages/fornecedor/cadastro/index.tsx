import CadastroCnpj from '@components/pages/fornecedor/cadastro/cnpj'
import CadastroCpf from '@components/pages/fornecedor/cadastro/cpf'
import { Card, Divider, Group, Radio, Text, Title } from '@mantine/core'
import { useTranslate } from '@refinedev/core'
import { Space } from 'antd'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState } from 'react'

export default function FornecedorCadastro() {
  const [selectedOption, setSelectedOption] = useState('cpf')
  const t = useTranslate()
  const handleOptionChange = (event: string) => {
    setSelectedOption(event)
  }

  return (
    <>
      <Card>
        <Title fw={700} size="xl">
          {t('pages.fornecedor.title')}
        </Title>
        <Divider my="md" />
        <Text fw={700} size="md">
          {t('pages.fornecedor.cadastro.radioButton.title')}
        </Text>
        <Text size="xs">
          {t('pages.fornecedor.cadastro.radioButton.description')}
        </Text>
        <Radio.Group
          onChange={setSelectedOption}
          value={selectedOption}
          withAsterisk
        >
          <Space direction="horizontal">
            <Group mt={10}>
              <Radio
                checked
                onChange={() => handleOptionChange('cpf')}
                value={'cpf'}
                label="CPF"
              ></Radio>
              <Radio
                onChange={() => handleOptionChange('cnpj')}
                label="CNPJ"
                value={'cnpj'}
              ></Radio>
            </Group>
          </Space>
        </Radio.Group>
        <Divider my="md" />
        {selectedOption === 'cpf' && <CadastroCpf />}
        {selectedOption === 'cnpj' && <CadastroCnpj />}
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
