import { AuthBindings, Authenticated, Refine } from '@refinedev/core'
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar'
import {
  notificationProvider,
  RefineThemes,
  ThemedLayoutV2,
  ThemedTitleV2,
} from '@refinedev/mantine'
import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from '@refinedev/nextjs-router'
import type { NextPage } from 'next'
import { AppProps } from 'next/app'
import api from 'src/utils/Api'
import { Header } from '@components/common/header'
import {
  ColorScheme,
  ColorSchemeProvider,
  Global,
  LoadingOverlay,
  MantineProvider,
} from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { NotificationsProvider } from '@mantine/notifications'
import dataProvider from '@refinedev/simple-rest'
import { appWithTranslation, useTranslation } from 'next-i18next'
import ILogin from 'src/interfaces/login'
import {
  clearDados,
  loginAuth,
  verifyUserExpired,
} from './../src/services/authetication/authentication'
import { useRouter } from 'next/router'
import { IconAffiliate, IconUsers } from '@tabler/icons'
import { Menu } from '@components/common/side'
import { useLoadingStore } from 'src/stores/LoadingStore'
import Cookies from 'js-cookie'
import { SuccessNotification } from '@components/common'
import { AUTH_USUARIO, FIND_COLABORADOR } from 'src/utils/Routes'

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  noLayout?: boolean
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  const isLoading = useLoadingStore(state => state.isLoading)
  const authProvider: AuthBindings = {
    login: async ({ username, password }) => {
      clearDados()
      const user: ILogin = {
        login: username,
        senha: password,
      }
      const data = await loginAuth(user)
      if (data) {
        const value = await api.get(
          FIND_COLABORADOR + `${Cookies.get('dados_usuario')}`
        )
        Cookies.set('name', value.data.nome)
        SuccessNotification({
          message: 'Seja bem vindo(a) ' + value.data.nome + ' !',
        })
        return {
          authenticated: true,
          redirectTo: '/colaborador',
          success: true,
        }
      }
      return {
        success: false,
        authenticated: false,
        error: {
          message: 'Login failed',
          name: 'Dados invalidos',
        },
      }
    },
    check: async () => {
      try {
        const check: boolean = await verifyUserExpired()
        if (check) {
          return {
            authenticated: true,
          }
        } else {
          return {
            authenticated: false,
            redirectTo: '/login',
          }
        }
      } catch (error) {
        return {
          authenticated: false,
          redirectTo: '/login',
        }
      }
    },
    logout: async () => {
      clearDados()
      return {
        success: true,
        authenticated: false,
        redirectTo: '/login',
      }
    },
    onError: async () => ({}),
  }
  const router = useRouter()
  const renderComponent = () => {
    if (router.pathname === '/login') {
      return <Component {...pageProps} />
    }

    return (
      <ThemedLayoutV2
        initialSiderCollapsed={false}
        Header={() => <Header />}
        dashboard={true}
        Sider={() => <Menu />}
        Title={({ collapsed }) => (
          <ThemedTitleV2 collapsed={collapsed} text="SISTEMA" />
        )}
      >
        <Authenticated
          appendCurrentPathToQuery={false}
          loading
          key={'authenticated'}
        >
          <Component {...pageProps} />
        </Authenticated>
      </ThemedLayoutV2>
    )
  }

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'dark',
    getInitialValueInEffect: true,
  })
  const { t, i18n } = useTranslation()
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === 'light' ? 'dark' : 'light'))
  }

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  }

  return (
    <>
      <RefineKbarProvider>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            theme={{
              ...RefineThemes.Blue,
              colorScheme: colorScheme,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontFamilyMonospace: 'Monaco, Courier, monospace',
              headings: { fontFamily: "'Plus Jakarta Sans', sans-serif" },
              components: {
                InputLabel: {
                  defaultProps: {
                    fw: 'bold',
                  },
                },
                Drawer: {
                  defaultProps: {
                    zIndex: 100000,
                    fw: 'bold',
                  },
                },
                Tooltip: {
                  defaultProps: {
                    zIndex: 100000,
                    fw: 'bold',
                  },
                },
                Select: {
                  defaultProps: {
                    zIndex: 1000000,
                    fw: 'bold',
                  },
                },
                Modal: {
                  defaultProps: {
                    zIndex: 100000,
                  },
                },
                Button: {
                  defaultProps: {
                    fw: 'bold',
                  },
                },
                Input: {
                  defaultProps: {
                    fw: 'bold',
                  },
                },
                Title: {
                  defaultProps: {
                    fw: 'bold',
                  },
                },
              },
            }}
            withNormalizeCSS
            withGlobalStyles
          >
            <LoadingOverlay
              visible={isLoading}
              overlayOpacity={0.6}
              zIndex={1000000}
              style={{
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
              }}
            />
            <Global styles={{ body: { WebkitFontSmoothing: 'auto' } }} />
            <NotificationsProvider position="top-center">
              <Refine
                authProvider={authProvider}
                routerProvider={routerProvider}
                dataProvider={dataProvider(AUTH_USUARIO)}
                notificationProvider={notificationProvider}
                i18nProvider={i18nProvider}
                resources={[
                  {
                    name: 'colaborador',
                    show: '/colaborador/visualizar/:id',
                    list: '/colaborador',
                    create: '/colaborador/cadastro',
                    edit: '/colaborador/editar/:id',
                    meta: {
                      canDelete: false,
                      label: 'Colaboradores',
                      icon: <IconUsers />,
                    },
                  },
                  {
                    name: 'fornecedor',
                    show: '/fornecedor/visualizar/:id',
                    list: '/fornecedor',
                    create: '/fornecedor/cadastro',
                    edit: '/fornecedor/editar/:id',
                    meta: {
                      canDelete: false,
                      label: 'Fornecedores',
                      icon: <IconAffiliate />,
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                }}
              >
                {renderComponent()}
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </RefineKbarProvider>
    </>
  )
}

export default appWithTranslation(MyApp)
