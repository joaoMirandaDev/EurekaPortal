import React, { useState } from 'react'
import {
  Button,
  Card,
  PasswordInput,
  InputBase,
  Group,
  Stack,
  Flex,
  Image,
} from '@mantine/core'
import { maskCpfCnpj } from 'src/utils/FormatterUtils'
import { useLogin, useTranslate } from '@refinedev/core'
import { IMaskInput } from 'react-imask'
import LOGO from '../../public/images/logo_transparent.png'
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
    <Flex
      align="center"
      direction="column"
      justify="center"
      h={'100vh'}
      bg={'#6741D9'}
    >
      <Group align="center" position="center">
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          styles={{
            root: {
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            },
          }}
        >
          <Card.Section px={80} py={30}>
            <Image
              maw={150}
              mx="auto"
              radius="md"
              src={LOGO.src}
              alt="Random image"
            />
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
