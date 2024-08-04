import { ErrorNotification, SuccessNotification } from '@components/common'
import { ModalWarning } from '@components/common/modalWarning'
import PaginationTable from '@components/common/tabela/paginationTable'
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Text,
  Tooltip,
} from '@mantine/core'
import { useTranslate } from '@refinedev/core'
import {
  IconBuildingFactory2,
  IconDownload,
  IconEdit,
  IconLockAccess,
  IconLockAccessOff,
  IconTrash,
} from '@tabler/icons'
import { IconSettingsCog } from '@tabler/icons-react'
import {
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_Row,
  MRT_SortingState,
} from 'mantine-react-table'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import IEmpresa from 'src/interfaces/empresa'
import IFiltroEmpresa from 'src/interfaces/IfiltroEmpresa'
import ImodalWarning from 'src/interfaces/ImodalWarning'
import api from 'src/utils/Api'
import { downloadByteArrayAsFile, getImage } from 'src/utils/Arquivo'
import { PAGE_INDEX, PAGE_SIZE } from 'src/utils/Constants'
import {
  formataCep,
  formatarCPFCNPJ,
  formatarTelefone,
} from 'src/utils/FormatterUtils'
import {
  DELETE_EMPRESA,
  FIND_ALL_BY_PAGE_EMPRESA,
  GENERATE_RELATORIO_EMPRESA,
} from 'src/utils/Routes'

interface IEmpresaProps {
  id: string
  value: string
}

export default function EmpresaList() {
  const t = useTranslate()
  const [modalConfig, setModalConfig] = useState<ImodalWarning>({
    titleWarning: '',
    descriptionWarning: '',
    confirm: () => {},
  })
  const navigate = useRouter()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [columnFilters, setColumnFilters] = useState<IEmpresaProps[]>([])
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const [dataCliente, setDataCliente] = useState<IEmpresa[]>([])
  const [totalElements, setTotalElements] = useState<number>(0)
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: PAGE_INDEX,
    pageSize: PAGE_SIZE,
  })
  const [filtro, setFiltro] = useState<IFiltroEmpresa>({
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    estado: '',
    cidade: '',
    ativo: null,
    columnOrder: 'razaoSocial',
    desc: false,
    tamanhoPagina: 10,
    pagina: 0,
  })
  const resetForm = () => {
    const val = {
      razaoSocial: '',
      nomeFantasia: '',
      cnpj: '',
      estado: '',
      cidade: '',
      ativo: null,
      columnOrder: 'razaoSocial',
      desc: false,
      tamanhoPagina: 10,
      pagina: 0,
    }
    setFiltro(val)
  }
  useEffect(() => {
    if (
      pagination.pageIndex !== filtro.pagina ||
      pagination.pageSize !== filtro.tamanhoPagina
    ) {
      const localFiltro = {
        ...filtro,
        tamanhoPagina: pagination.pageSize,
        pagina: pagination.pageIndex,
      }
      setFiltro(localFiltro)
    }
    findAllByPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, filtro])

  useEffect(() => {
    if (columnFilters.length > 0) {
      resetForm()
      columnFilters.forEach(column => {
        switch (column.id) {
          case 'razaoSocial':
            filterCliente('razaoSocial', column.value)
            break
          case 'nomeFantasia':
            filterCliente('nomeFantasia', column.value)
            break
          case 'endereco.cidade':
            filterCliente('cidade', column.value)
            break
          case 'cnpj':
            filterCliente('cnpj', column.value.replace(/[. -]/g, ''))
            break
          case 'endereco.estado':
            filterCliente('estado', column.value)
            break
          case 'ativo':
            {
              const val = column.value === 'Ativo' ? 0 : 1
              filterCliente('ativo', val)
            }
            break
          default:
            break
        }
      })
    } else {
      resetForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters])

  useEffect(() => {
    if (sorting.length == 0) {
      setSorting([{ id: 'razaoSocial', desc: false }])
    }
    sorting.map(value => {
      setFiltro(prevData => ({
        ...prevData,
        columnOrder: value.id,
        desc: value.desc,
      }))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting])

  const closeModal = () => {
    setOpenModal(false)
  }

  const filterCliente = (Key: string, value: string | number) => {
    setFiltro(prevData => ({ ...prevData, [Key]: value, pagina: 0 }))
  }

  const findAllByPage = async () => {
    const response = await api.post(FIND_ALL_BY_PAGE_EMPRESA, filtro)
    const empresaes = response.data.content

    const processedempresaes = await Promise.all(
      empresaes.map(
        async (empresa: {
          file: { key: string }
          cpf: string
          telefone: string
        }) => {
          let photoUrl = null
          if (empresa.file && empresa.file.key) {
            photoUrl = await getImage(
              empresa.file.key,
              t('messages.getErrorDatabase')
            )
          }
          const formattedCpf = formatarCPFCNPJ(empresa.cpf)
          const formattedTelefone = formatarTelefone(empresa.telefone)

          return {
            ...empresa,
            photo: photoUrl,
            cpf: formattedCpf,
            telefone: formattedTelefone,
          }
        }
      )
    )

    setDataCliente(processedempresaes)
    setTotalElements(response.data.totalElements)
  }

  const disableOrActive = async (
    confirm: boolean,
    id: number,
    status: string | number
  ) => {
    if (confirm && id && status) {
      const val = status === 'Ativo' ? 1 : 0
      api
        .put(`/api/empresa/activeOrDisable/${id}/${val}`)
        .then(() => {
          SuccessNotification({
            message:
              val === 1
                ? t('pages.empresa.message.disable')
                : t('pages.empresa.message.active'),
          })
          findAllByPage()
        })
        .catch(() => {
          ErrorNotification({ message: t('components.error.errorGeneric') })
        })
    }
  }

  const confirmaExclusao = async (confirm: boolean, id: number) => {
    if (id && confirm) {
      api
        .delete(DELETE_EMPRESA + `${id}`)
        .then(() => {
          SuccessNotification({ message: t('components.sucess.deleteSucess') })
          findAllByPage()
          closeModal()
        })
        .catch(() => {
          ErrorNotification({ message: t('components.error.deleteError') })
        })
    }
  }

  const columns = useMemo<MRT_ColumnDef<IEmpresa>[]>(
    () => [
      {
        accessorKey: 'razaoSocial',
        header: t('pages.empresa.components.table.razaoSocial'),
        enableSorting: true,
        enableColumnFilter: true,
        size: 15,
        minSize: 10,
        maxSize: 30,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        mantineTableHeadCellProps: {
          align: 'center',
        },
        Cell: ({ renderedCellValue, row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <Avatar
              size="md"
              alt="avatar"
              color="blue"
              src={row.original.photo}
              style={{ borderRadius: '100%' }}
            />
            <span>
              {renderedCellValue}
              {row.original.ativo === 'Ativo' ? (
                ''
              ) : (
                <Text fw={'bold'} color="red">
                  {t('components.common.statusInativo')}
                </Text>
              )}
            </span>
          </Box>
        ),
      },
      {
        accessorKey: 'nomeFantasia',
        header: t('pages.empresa.components.table.nomeFantasia'),
        enableSorting: true,
        enableColumnFilter: true,
        size: 15,
        minSize: 10,
        maxSize: 30,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        mantineTableHeadCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'cnpj',
        header: t('pages.empresa.components.table.cnpj'),
        enableSorting: true,
        enableColumnFilter: true,
        size: 15,
        minSize: 10,
        maxSize: 30,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        mantineTableHeadCellProps: {
          align: 'center',
        },
        Cell: ({ row }) => {
          return row.original.cnpj ? formatarCPFCNPJ(row.original.cnpj) : '-'
        },
      },
      {
        accessorKey: 'endereco.estado',
        header: t('pages.empresa.components.table.estado'),
        enableSorting: true,
        enableColumnFilter: true,
        size: 15,
        minSize: 10,
        maxSize: 30,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        mantineTableHeadCellProps: {
          align: 'center',
        },
        Cell: ({ row }) => {
          return row.original.endereco && row.original.endereco.estado != null
            ? row.original.endereco.estado
            : '-'
        },
      },
      {
        accessorKey: 'endereco.cidade',
        header: t('pages.empresa.components.table.cidade'),
        enableSorting: true,
        enableColumnFilter: true,
        size: 15,
        minSize: 10,
        maxSize: 30,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        mantineTableHeadCellProps: {
          align: 'center',
        },
        Cell: ({ row }) => {
          return row.original.endereco && row.original.endereco.cidade != null
            ? row.original.endereco.cidade
            : '-'
        },
      },
      {
        accessorKey: 'ativo',
        header: t('pages.empresa.components.table.ativo'),
        filterVariant: 'select',
        enableSorting: true,
        enableColumnFilter: true,
        size: 15,
        minSize: 10,
        maxSize: 30,
        mantineTableBodyCellProps: {
          align: 'center',
        },
        mantineTableHeadCellProps: {
          align: 'center',
        },
      },
    ],
    [t]
  )

  const openDeleteModal = (id: number) => {
    setModalConfig({
      confirm: val => confirmaExclusao(val, id),
      titleWarning: t('components.warning.alert'),
      descriptionWarning: t('components.warning.descriptionDeleteEmpresa'),
    })
    setOpenModal(true)
  }

  const openDeactivateModal = (id: number, status: string | number) => {
    setModalConfig({
      confirm: val => disableOrActive(val, id, status),
      titleWarning: t('components.warning.alert'),
      descriptionWarning:
        status === 'Ativo'
          ? t('components.warning.descriptionDisableEmpresa')
          : t('components.warning.descriptionActiveEmpresa'),
    })
    setOpenModal(true)
  }

  const getRelatorio = () => {
    api
      .get(GENERATE_RELATORIO_EMPRESA, { responseType: 'blob' })
      .then(res => {
        downloadByteArrayAsFile(res.data)
      })
      .catch(() => {
        console.error(t('components.error.errorGeneric'))
      })
  }

  const editar = (id: number) => {
    navigate.push(`empresas/editar/${id}`)
  }

  const config = (id: number) => {
    navigate.push(`empresas/configuracoes/${id}`)
  }

  const renderDetailPanel = ({ row }: { row: MRT_Row<IEmpresa> }) => {
    return (
      <Flex>
        <Box
          w={'50%'}
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '16px',
            padding: '16px',
          }}
        >
          <Avatar
            color="blue"
            style={{ borderRadius: '100%' }}
            size={150}
            src={row.original.photo?.toString()}
            alt="With default placeholder"
          />
          <Box sx={{ textAlign: 'center' }}>
            <Text fw={'bold'}>{row.original.nomeFantasia}</Text>
          </Box>
        </Box>
        <Divider size="xs" orientation="vertical" />
        <Flex direction={'column'} w={'50%'}>
          <Text align="center" fw={'bold'}>
            {t('pages.empresa.components.detailTable.dadosEmpresarial.title')}
          </Text>
          <Divider size="xs" mb={'0.5rem'} />
          <Flex align={'start'} direction={'column'} ml={'1rem'}>
            <Flex>
              <Text fw={'bold'}>
                {t(
                  'pages.empresa.components.detailTable.dadosEmpresarial.cnpj'
                )}
              </Text>
              <Text ml={'0.5rem'}>{formatarCPFCNPJ(row.original.cnpj)}</Text>
            </Flex>
            <Flex>
              <Text fw={'bold'}>
                {t(
                  'pages.empresa.components.detailTable.dadosEmpresarial.nomeFantasia'
                )}
              </Text>
              <Text ml={'0.5rem'}>{row.original.nomeFantasia}</Text>
            </Flex>
            <Flex>
              <Text fw={'bold'}>
                {t(
                  'pages.empresa.components.detailTable.dadosEmpresarial.razaoSocial'
                )}
              </Text>
              <Text ml={'0.5rem'}>{row.original.razaoSocial}</Text>
            </Flex>
            <Flex>
              <Text fw={'bold'}>
                {t(
                  'pages.empresa.components.detailTable.dadosEmpresarial.dataAbertura'
                )}
              </Text>
              <Text ml={'0.5rem'}>
                {row.original.dataAbertura ? row.original.dataAbertura : '-'}
              </Text>
            </Flex>
            <Flex>
              <Text fw={'bold'}>
                {t(
                  'pages.empresa.components.detailTable.dadosEmpresarial.ativo'
                )}
              </Text>
              <Text ml={'0.5rem'}>
                {row.original.ativo ? row.original.ativo : '-'}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Divider size="xs" orientation="vertical" />
        <Flex direction={'column'} w={'50%'}>
          <Text fw={'bold'} align="center">
            {t('pages.empresa.components.detailTable.endereco.title')}
          </Text>
          <Divider size="xs" mb={'0.5rem'} />
          <Flex align={'start'} direction={'column'} ml={'1rem'}>
            <Flex>
              <Text fw={'bold'}>
                {t('pages.empresa.components.detailTable.endereco.cidade')}
              </Text>
              <Text ml={'0.5rem'}>
                {row.original.endereco && row.original.endereco.cidade
                  ? row.original.endereco && row.original.endereco.cidade
                  : '-'}
              </Text>
            </Flex>
            <Flex>
              <Text fw={'bold'}>
                {t('pages.empresa.components.detailTable.endereco.bairro')}
              </Text>
              <Text ml={'0.5rem'}>
                {row.original.endereco && row.original.endereco.bairro
                  ? row.original.endereco.bairro
                  : '-'}
              </Text>
            </Flex>
            <Flex>
              <Text fw={'bold'}>Estado:</Text>
              <Text ml={'0.5rem'}>
                {row.original.endereco && row.original.endereco.estado
                  ? row.original.endereco.estado
                  : '-'}
              </Text>
            </Flex>
            <Flex>
              <Text fw={'bold'}>
                {t('pages.empresa.components.detailTable.endereco.numero')}
              </Text>
              <Text ml={'0.5rem'}>
                {row.original.endereco && row.original.endereco.numero
                  ? row.original.endereco.numero
                  : '-'}
              </Text>
            </Flex>
            <Flex>
              <Text fw={'bold'}>
                {t('pages.empresa.components.detailTable.endereco.cep')}
              </Text>
              <Text ml={'0.5rem'}>
                {row.original.endereco && row.original.endereco.cep
                  ? formataCep(row.original.endereco.cep)
                  : '-'}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Divider size="xs" orientation="vertical" />
        <Flex direction={'column'} w={'50%'}>
          <Text fw={'bold'} align="center">
            {t('pages.empresa.components.detailTable.contato.title')}
          </Text>
          <Divider size="xs" mb={'0.5rem'} />
          <Flex align={'start'} direction={'column'} ml={'1rem'}>
            <Flex>
              <Text fw={'bold'}>
                {t('pages.empresa.components.detailTable.contato.email')}
              </Text>
              <Text ml={'0.5rem'}>{row.original.email}</Text>
            </Flex>
            <Flex>
              <Text fw={'bold'}>
                {t('pages.empresa.components.detailTable.contato.telefone')}
              </Text>
              <Text ml={'0.5rem'}>
                {row.original.telefone
                  ? formatarTelefone(row.original.telefone)
                  : '-'}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    )
  }

  const rowActions = ({ row }: { row: MRT_Row<IEmpresa> }) => (
    <Flex>
      <Tooltip label={t('pages.empresa.buttonEdit')}>
        <ActionIcon
          size="sm"
          disabled={row.original.ativo !== 'Ativo'}
          color="blue"
          variant="transparent"
          aria-label="Settings"
          onClick={() => editar(row.original.id!)}
        >
          <IconEdit />
        </ActionIcon>
      </Tooltip>
      <Tooltip label={t('pages.empresa.buttonConfig')}>
        <ActionIcon
          size="sm"
          color="teal"
          variant="transparent"
          aria-label="Settings"
          onClick={() => config(row.original.id!)}
        >
          <IconSettingsCog />
        </ActionIcon>
      </Tooltip>
      <Tooltip
        label={
          row.original.ativo == 'Ativo'
            ? t('pages.empresa.disable')
            : t('pages.empresa.active')
        }
      >
        <ActionIcon
          size="sm"
          color={row.original.ativo == 'Ativo' ? 'red' : 'green'}
          variant="transparent"
          aria-label="Settings"
          onClick={() =>
            openDeactivateModal(row.original.id!, row.original.ativo)
          }
        >
          {row.original.ativo == 'Ativo' ? (
            <IconLockAccessOff />
          ) : (
            <IconLockAccess />
          )}
        </ActionIcon>
      </Tooltip>
      <Tooltip label={t('pages.empresa.buttonDelete')}>
        <ActionIcon
          size="sm"
          color="red"
          variant="transparent"
          aria-label="Settings"
          onClick={() => openDeleteModal(row.original.id!)}
        >
          <IconTrash />
        </ActionIcon>
      </Tooltip>
    </Flex>
  )

  return (
    <>
      <Flex justify={'space-between'} align={'center'} m={'1rem'}>
        <Text fz={'1.5rem'} fw={'bold'}>
          {t('pages.empresa.titleListagem')}
        </Text>
        <Flex>
          <Button
            leftIcon={<IconDownload size={16} />}
            onClick={() => getRelatorio()}
            mr={'0.5rem'}
          >
            {t('pages.empresa.buttonRelatorio')}
          </Button>
          <Button
            leftIcon={<IconBuildingFactory2 size={16} />}
            onClick={() => navigate.push('empresas/cadastro')}
          >
            {t('pages.empresa.buttonCadastro')}
          </Button>
        </Flex>
      </Flex>
      <PaginationTable
        setSorting={setSorting}
        columns={columns}
        rowActions={rowActions}
        renderDetailPanel={renderDetailPanel}
        setPagination={setPagination}
        enableRowActions
        enableSorting
        enableClickToCopy
        onColumnFiltersChange={setColumnFilters}
        positionActionsColumn="last"
        data={dataCliente}
        state={{
          columnFilters,
          sorting,
          pagination: {
            pageIndex: filtro.pagina,
            pageSize: filtro.tamanhoPagina,
          },
        }}
        rowCount={totalElements}
      />
      <ModalWarning
        confirm={modalConfig.confirm}
        titleWarning={modalConfig.titleWarning}
        descriptionWarning={modalConfig.descriptionWarning}
        openModal={openModal}
        closeModal={closeModal}
      />
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
