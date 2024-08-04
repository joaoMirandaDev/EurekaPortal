import React, { useState } from 'react'
import {
  CanAccess,
  ITreeMenu,
  useIsExistAuthentication,
  useLink,
  useLogout,
  useMenu,
  useActiveAuthProvider,
  useRefineContext,
  useRouterContext,
  useRouterType,
  useTranslate,
  useWarnAboutChange,
} from '@refinedev/core'
import {
  ActionIcon,
  Box,
  Drawer,
  Navbar,
  NavLink,
  NavLinkStylesNames,
  NavLinkStylesParams,
  ScrollArea,
  MediaQuery,
  Tooltip,
  TooltipProps,
  Styles,
  Flex,
  Divider,
  Button,
} from '@mantine/core'
import { IconList, IconMenu2, IconDashboard, IconLogout } from '@tabler/icons'
import { RefineLayoutSiderProps } from '@refinedev/mantine'
const defaultNavIcon = <IconList size={18} />

export const Menu: React.FC<RefineLayoutSiderProps> = ({ render, meta }) => {
  const [opened, setOpened] = useState(false)

  const routerType = useRouterType()
  const NewLink = useLink()
  const { Link: LegacyLink } = useRouterContext()
  const Link = routerType === 'legacy' ? LegacyLink : NewLink
  const { defaultOpenKeys, menuItems, selectedKey } = useMenu({ meta })
  const isExistAuthentication = useIsExistAuthentication()
  const t = useTranslate()
  const { hasDashboard } = useRefineContext()
  const authProvider = useActiveAuthProvider()
  const { warnWhen, setWarnWhen } = useWarnAboutChange()
  const { mutate: mutateLogout } = useLogout({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  })

  const drawerWidth = () => {
    return 200
  }

  const commonNavLinkStyles: Styles<NavLinkStylesNames, NavLinkStylesParams> = {
    root: {
      display: 'flex',
      fontWeight: 500,
      '&:hover': {
        backgroundColor: '#ffffff1a',
      },
      '&[data-active]': {
        fontWeight: 700,
      },
      justifyContent: opened ? 'center' : 'flex-start',
    },
    icon: {
      marginRight: opened ? 0 : 12,
    },
    body: {
      display: opened ? 'none' : 'flex',
    },
  }

  const commonTooltipProps: Partial<TooltipProps> = {
    disabled: true,
    position: 'right',
    withinPortal: true,
    withArrow: true,
    arrowSize: 8,
    arrowOffset: 12,
    offset: 4,
  }

  const renderTreeView = (tree: ITreeMenu[], selectedKey?: string) => {
    return tree.map(item => {
      const { icon, label, route, name, children } = item

      const isSelected = item.key === selectedKey
      const isParent = children.length > 0

      const additionalLinkProps = isParent
        ? {}
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { component: Link as any, to: route }

      return (
        <CanAccess
          key={item.key}
          resource={name.toLowerCase()}
          action="list"
          params={{
            resource: item,
          }}
        >
          <Tooltip label={label} {...commonTooltipProps}>
            <NavLink
              key={item.key}
              label={opened ? null : label}
              icon={icon ?? defaultNavIcon}
              active={isSelected}
              childrenOffset={opened ? 0 : 12}
              defaultOpened={defaultOpenKeys.includes(item.key || '')}
              styles={commonNavLinkStyles}
              {...additionalLinkProps}
            >
              {isParent && renderTreeView(children, selectedKey)}
            </NavLink>
          </Tooltip>
        </CanAccess>
      )
    })
  }

  const items = renderTreeView(menuItems, selectedKey)

  const dashboard = hasDashboard ? (
    <CanAccess resource="dashboard" action="list">
      <Tooltip
        label={t('dashboard.title', 'Dashboard')}
        {...commonTooltipProps}
      >
        <NavLink
          key="dashboard"
          label={opened ? null : t('dashboard.title', 'Dashboard')}
          icon={<IconDashboard size={18} />}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          component={Link as any}
          to="/"
          active={selectedKey === '/'}
          styles={commonNavLinkStyles}
        />
      </Tooltip>
    </CanAccess>
  ) : null

  const handleLogout = () => {
    if (warnWhen) {
      const confirm = window.confirm(
        t(
          'warnWhenUnsavedChanges',
          'Are you sure you want to leave? You have unsaved changes.'
        )
      )

      if (confirm) {
        setWarnWhen(false)
        mutateLogout()
      }
    } else {
      mutateLogout()
    }
  }

  const logout = isExistAuthentication && (
    <Flex justify={'center'}>
      <Tooltip label={t('components.button.logout')} {...commonTooltipProps}>
        <NavLink
          key="logout"
          label={opened ? null : t('components.button.logout')}
          icon={<IconLogout size={18} />}
          onClick={handleLogout}
          styles={commonNavLinkStyles}
        />
      </Tooltip>
    </Flex>
  )
  const renderSider = () => {
    if (render) {
      return render({
        dashboard,
        logout,
        items,
        collapsed: false,
      })
    }
    return (
      <>
        {dashboard}
        {items}
      </>
    )
  }

  return (
    <>
      <MediaQuery largerThan="md" styles={{ display: 'none' }}>
        <Box sx={{ position: 'fixed', top: 64, left: 0, zIndex: 1199 }}>
          <ActionIcon
            color="white"
            size={36}
            sx={{
              borderRadius: '0 6px 6px 0',
            }}
            onClick={() => setOpened(prev => !prev)}
          >
            <IconMenu2 />
          </ActionIcon>
        </Box>
      </MediaQuery>

      <MediaQuery largerThan="md" styles={{ display: 'none' }}>
        <Drawer
          opened={opened}
          onClose={() => setOpened(false)}
          size={200}
          zIndex={1200}
          withCloseButton={false}
        >
          <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
            {renderSider()}
          </Navbar.Section>
        </Drawer>
      </MediaQuery>

      <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
        <Box
          sx={{
            width: drawerWidth(),
            transition: 'width 200ms ease, min-width 200ms ease',
            flexShrink: 0,
          }}
        />
      </MediaQuery>

      <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
        <Navbar
          width={{ base: drawerWidth() }}
          sx={{
            overflow: 'hidden',
            transition: 'width 200ms ease, min-width 200ms ease',
            position: 'fixed',
            top: 0,
            height: '100vh',
          }}
        >
          <Navbar.Section grow mt="sm" component={ScrollArea} mx="-xs" px="xs">
            {renderSider()}
          </Navbar.Section>
          <Divider />
          <Navbar.Section>
            <Button
              radius={0}
              fullWidth
              onClick={() => mutateLogout()}
              color="red"
            >
              <IconLogout size={18} /> {t('components.button.logout')}
            </Button>
          </Navbar.Section>
        </Navbar>
      </MediaQuery>
    </>
  )
}
