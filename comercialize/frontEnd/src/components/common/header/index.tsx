import {
  ActionIcon,
  Avatar,
  Flex,
  Group,
  Header as MantineHeader,
  Menu,
  Sx,
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
        align={'center'}
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        <Group mr={'0.5rem'}>
          <ActionIcon
            variant="outline"
            radius={'lg'}
            color={dark ? 'yellow' : 'primary'}
            onClick={() => toggleColorScheme()}
            title="Toggle color scheme"
          >
            {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
          </ActionIcon>
        </Group>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Avatar
              mr={'0.5rem'}
              style={{ cursor: 'pointer' }}
              color="blue"
              radius="xl"
            >
              {user?.nameUser ? user?.nameUser.slice(0, 2) : ''}
            </Avatar>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>{user?.nameUser}</Menu.Label>
            <Menu.Divider />
            <Menu.Item
              color={'red'}
              onClick={() => mutateLogout()}
              icon={<IconLogout size={14} />}
            >
              Sair
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>
    </MantineHeader>
  )
}
