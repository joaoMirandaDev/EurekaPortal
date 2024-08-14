import {
  ActionIcon,
  Flex,
  Group,
  Header as MantineHeader,
  Sx,
  Text,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core'
import {
  useActiveAuthProvider,
  useGetIdentity,
  useLogout,
} from '@refinedev/core'
import { RefineThemedLayoutV2HeaderProps } from '@refinedev/mantine'
import { IconLogout, IconMoonStars, IconSun } from '@tabler/icons'
import React from 'react'
import IUserLogin from 'src/interfaces/user'
import { formatarCPFCNPJ } from 'src/utils/FormatterUtils'

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky,
}) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()
  const authProvider = useActiveAuthProvider()
  const dark = colorScheme === 'dark'
  const borderColor = dark ? theme.colors.dark[6] : theme.colors.gray[2]
  const { data: user } = useGetIdentity<IUserLogin>()
  let stickyStyles: Sx = {}
  if (sticky) {
    stickyStyles = {
      position: `sticky`,
      top: 0,
      zIndex: 1,
    }
  }
  const { mutate: mutateLogout } = useLogout({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  })

  return (
    <MantineHeader
      zIndex={199}
      height={64}
      py={6}
      px="sm"
      sx={{
        borderBottom: `1px solid ${borderColor}`,
        ...stickyStyles,
      }}
    >
      <Flex
        justify="flex-end"
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        <Group>
          <ActionIcon
            variant="outline"
            radius={'lg'}
            color={dark ? 'yellow' : 'primary'}
            onClick={() => toggleColorScheme()}
            title="Toggle color scheme"
          >
            {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
          </ActionIcon>
          <Tooltip label={'Sair'}>
            <ActionIcon
              variant="outline"
              radius={'lg'}
              color={'red'}
              onClick={() => mutateLogout()}
            >
              <IconLogout size={18} />
            </ActionIcon>
          </Tooltip>
          <Flex direction={'column'} align={'center'}>
            <Text fw={'bold'} ff={'cursive'}>
              {user?.nameUser}
            </Text>
            <Text fw={'bold'} ff={'cursive'}>
              {formatarCPFCNPJ(user?.cpf ? user?.cpf : '')}
            </Text>
          </Flex>
        </Group>
      </Flex>
    </MantineHeader>
  )
}
