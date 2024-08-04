import React, { useState } from 'react'
import {
  Button,
  Card,
  PasswordInput,
  InputBase,
  Group,
  Stack,
  Text,
  Flex,
} from '@mantine/core'
import { maskCpfCnpj } from 'src/utils/FormatterUtils'
import { useLogin, useTranslate } from '@refinedev/core'
import { IMaskInput } from 'react-imask'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function Login() {
  const t = useTranslate()
  const [senha, setSenha] = useState('')
  const [user, setUser] = useState('')
  const { mutate } = useLogin<LoginVariables>()
  const handleLogin = async () => {
    const loginVariables: LoginVariables = {
      username: user,
      password: senha,
    }
    await mutate(loginVariables)
  }
  type LoginVariables = {
    username: string
    password: string
  }

  return (
    <Flex align="center" direction="column" justify="center" h={'100vh'}>
      <Group align="center" position="center">
        <Card radius="md" shadow="sm" withBorder w={450}>
          <Card.Section px={80} py={30}>
            <Text
              color="blue"
              sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
              ta="center"
              fz="xl"
              fw={700}
            >
              {t('pages.login.title')}
            </Text>
          </Card.Section>
          <Stack spacing="xs">
            <InputBase
              onKeyUp={e => {
                // key up como tratativa para paste (ctrl + v)
                setUser((e.target as HTMLInputElement).value)
              }}
              component={IMaskInput}
              mask={maskCpfCnpj}
              required
              placeholder={t('pages.login.cpf')}
            />
            <PasswordInput
              placeholder={t('pages.login.senha')}
              value={senha}
              onChange={e => setSenha(e.target.value)}
            />
            <Button onClick={handleLogin}>{t('pages.login.entrar')}</Button>
          </Stack>
        </Card>
      </Group>
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
