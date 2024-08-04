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
  IconDownload,
  IconEdit,
  IconTrash,
  IconUserMinus,
  IconUserPlus,
} from '@tabler/icons'
import Cookies from 'js-cookie'
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
import IColaborador from 'src/interfaces/colaborador'
import IFiltoColaborador from 'src/interfaces/IfiltroColaborador'
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
  FIND_ALL_BY_PAGE_COLABORADOR,
  GENERATE_RELATORIO_COLABORADOR,
} from 'src/utils/Routes'

interface IColaboradorProps {
  id: string
  value: string
}

export default function ColaboradorList() {
  const t = useTranslate()
  const [modalConfig, setModalConfig] = useState<ImodalWarning>({
    titleWarning: '',
    descriptionWarning: '',
    confirm: () => {},
  })
  const navigate = useRouter()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [columnFilters, setColumnFilters] = useState<IColaboradorProps[]>([])
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const [dataCliente, setDataCliente] = useState<IColaborador[]>([])
  const [totalElements, setTotalElements] = useState<number>(0)
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: PAGE_INDEX,
    pageSize: PAGE_SIZE,
  })
  const [filtro, setFiltro] = useState<IFiltoColaborador>({
    nome: '',
    sobrenome: '',
    cpf: '',
    estado: '',
    cidade: '',
    ativo: null,
    pagina: 0,
    tamanhoPagina: 10,
    id: 'nome',
    desc: false,
  })
  const resetForm = () => {
    const val = {
      nome: '',
      sobrenome: '',
      cpf: '',
      estado: '',
      cidade: '',
      ativo: null,
      pagina: 0,
      tamanhoPagina: 10,
      id: 'nome',
      desc: false,
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
    findAllColaborador()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, filtro])

  useEffect(() => {
    if (columnFilters.length > 0) {
      resetFiltro()
      columnFilters.forEach(column => {
        switch (column.id) {
          case 'nome':
            filterCliente('nome', column.value)
            break
          case 'sobrenome':
            filterCliente('sobrenome', column.value)
            break
          case 'endereco.cidade':
            filterCliente('cidade', column.value)
            break
          case 'cpf':
            filterCliente('cpf', column.value.replace(/[. -]/g, ''))
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
      setSorting([{ id: 'nome', desc: false }])
    }
    sorting.map(value => {
      setFiltro(prevData => ({ ...prevData, id: value.id, desc: value.desc }))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting])

  const resetFiltro = () => {
    const fill = {
      nome: '',
      sobrenome: '',
      cpf: '',
      estado: '',
      cidade: '',
      ativo: 0,
      pagina: 0,
      tamanhoPagina: 10,
      id: 'nome',
      desc: false,
    }
    setFiltro(fill)
  }

  const closeModal = () => {
    setOpenModal(false)
  }

  const filterCliente = (Key: string, value: string | number) => {
    setFiltro(prevData => ({ ...prevData, [Key]: value, pagina: 0 }))
  }

  const findAllColaborador = async () => {
    const response = await api.post(FIND_ALL_BY_PAGE_COLABORADOR, filtro)
    const colaboradores = response.data.content

    const processedColaboradores = await Promise.all(
      colaboradores.map(
        async (colaborador: {
          file: { key: string }
          cpf: string
          telefone: string
        }) => {
          let photoUrl = null
          if (colaborador.file && colaborador.file.key) {
            photoUrl = await getImage(
              colaborador.file.key,
              t('messages.getErrorDatabase')
            )
          }
          const formattedCpf = formatarCPFCNPJ(colaborador.cpf)
          const formattedTelefone = formatarTelefone(colaborador.telefone)

          return {
            ...colaborador,
            photo: photoUrl,
            cpf: formattedCpf,
            telefone: formattedTelefone,
          }
        }
      )
    )

    setDataCliente(processedColaboradores)
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
        .put(`/api/colaborador/activeOrDisable/${id}/${val}`)
        .then(() => {
          SuccessNotification({
            message:
              val === 1
                ? t('pages.colaborador.message.disable')
                : t('pages.colaborador.message.active'),
          })
          findAllColaborador()
        })
        .catch(() => {
          ErrorNotification({ message: t('components.error.errorGeneric') })
        })
    }
  }

  const confirmaExclusao = async (confirm: boolean, id: number) => {
    if (id && confirm) {
      api
        .delete(`/api/colaborador/deleteById/${id}`)
        .then(response => {
          SuccessNotification({ message: response.data })
          findAllColaborador()
          closeModal()
        })
        .catch(error => {
          ErrorNotification({ message: error })
        })
    }
  }

  const validatePermissionRole = () => {
    if (Cookies.get('role') == 'CAIXA') {
      return true
    }
  }

  const columns = useMemo<MRT_ColumnDef<IColaborador>[]>(
    () => [
      {
        accessorKey: 'nome',
        header: t('pages.colaborador.components.table.nome'),
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
                  Inativo
                </Text>
              )}
            </span>
          </Box>
        ),
      },
      {
        accessorKey: 'sobrenome',
        header: t('pages.colaborador.components.table.sobrenome'),
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
        accessorKey: 'cpf',
        header: t('pages.colaborador.components.table.cpf'),
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
        accessorKey: 'endereco.estado',
        header: t('pages.colaborador.components.table.estado'),
        enableSorting: true,
        filterVariant: 'select',
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
        header: t('pages.colaborador.components.table.cidade'),
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
        header: t('pages.colaborador.components.table.ativo'),
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
      descriptionWarning: t('components.warning.descriptionDeleteColaborador'),
    })
    setOpenModal(true)
  }

  const openDeactivateModal = (id: number, status: string | number) => {
    setModalConfig({
      confirm: val => disableOrActive(val, id, status),
      titleWarning: t('components.warning.alert'),
      descriptionWarning:
        status === 'Ativo'
          ? t('components.warning.descriptionDeactivateColaborador')
          : t('components.warning.descriptionActiveColaborador'),
    })
    setOpenModal(true)
  }

  const getRelatorio = () => {
    api
      .get(GENERATE_RELATORIO_COLABORADOR, { responseType: 'blob' })
      .then(res => {
        downloadByteArrayAsFile(res.data)
      })
      .catch(() => {
        console.error(t('components.error.errorGeneric'))
      })
  }

  const editar = (id: number) => {
    navigate.push(`colaborador/editar/${id}`)
  }

  const renderDetailPanel = ({ row }: { row: MRT_Row<IColaborador> }) => {
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
            <Text fw={'bold'}>
              {row.original.nome} {row.original.sobrenome}
            </Text>
          </Box>
        </Box>
        <Divider size="xs" orientation="vertical" />
        <Flex direction={'column'} w={'50%'}>
          <Text align="center" fw={'bold'}>
            {t('pages.colaborador.components.detailTable.dadosPessoais.title')}
          </Text>
          <Divider size="xs" mb={'0.5rem'} />
          <Flex align={'start'} direction={'column'} ml={'1rem'}>
            <Flex>
              <Text fw={'bold'}>
                {t(
                  'pages.colaborador.components.detailTable.dadosPessoais.cpf'
                )}
              </Text>
              <Text ml={'0.5rem'}>{row.original.cpf}</Text>
            </Flex>
            <Flex>
              <Text fw={'bold'}>
                {t(
                  'pages.colaborador.components.detailTable.dadosPessoais.dataNascimento'
                )}
              </Text>
              <Text ml={'0.5rem'}>
                {row.original.dataNascimento
                  ? row.original.dataNascimento
                  : '-'}
              </Text>
            </Flex>
            <Flex>
              <Text fw={'bold'}>
                {t(
                  'pages.colaborador.components.detailTable.dadosPessoais.dataContratacao'
                )}
              </Text>
              <Text ml={'0.5rem'}>
                {row.original.dataContratoInicial
                  ? row.original.dataContratoInicial
                  : '-'}
              </Text>
            </Flex>
            <Flex>
              <Text fw={'bold'}>
                {t(
                  'pages.colaborador.components.detailTable.dadosPessoais.dataDemissao'
                )}
              </Text>
              <Text ml={'0.5rem'}>
                {row.original.dataContratoFinal
                  ? row.original.dataContratoFinal
                  : '-'}
              </Text>
            </Flex>
            <Flex>
              <Text fw={'bold'}>
                {t(
                  'pages.colaborador.components.detailTable.dadosPessoais.ativo'
                )}
              </Text>
              <Text ml={'0.5rem'}>
                {row.original.ativo ? row.original.ativo : '-'}
              </Text>
            </Flex>
            {(Cookies.get('role') == 'ADMIN' ||
              Cookies.get('role') == 'PROPRIETARIO') && (
              <Flex>
                <Text fw={'bold'}>
                  {t(
                    'pages.colaborador.components.detailTable.dadosPessoais.salario'
                  )}
                </Text>
                <Text ml={'0.5rem'}>
                  {row.original.salario
                    ? row.original.salario.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })
                    : '-'}
                </Text>
              </Flex>
            )}
          </Flex>
        </Flex>
        <Divider size="xs" orientation="vertical" />
        <Flex direction={'column'} w={'50%'}>
          <Text fw={'bold'} align="center">
            {t('pages.colaborador.components.detailTable.endereco.title')}
          </Text>
          <Divider size="xs" mb={'0.5rem'} />
          <Flex align={'start'} direction={'column'} ml={'1rem'}>
            <Flex>
              <Text fw={'bold'}>
                {t('pages.colaborador.components.detailTable.endereco.cidade')}
              </Text>
              <Text ml={'0.5rem'}>
                {row.original.endereco && row.original.endereco.cidade
                  ? row.original.endereco && row.original.endereco.cidade
                  : '-'}
              </Text>
            </Flex>
            <Flex>
              <Text fw={'bold'}>
                {t('pages.colaborador.components.detailTable.endereco.bairro')}
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
                {t('pages.colaborador.components.detailTable.endereco.numero')}
              </Text>
              <Text ml={'0.5rem'}>
                {row.original.endereco && row.original.endereco.numero
                  ? row.original.endereco.numero
                  : '-'}
              </Text>
            </Flex>
            <Flex>
              <Text fw={'bold'}>
                {t('pages.colaborador.components.detailTable.endereco.cep')}
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
            {t('pages.colaborador.components.detailTable.contato.title')}
          </Text>
          <Divider size="xs" mb={'0.5rem'} />
          <Flex align={'start'} direction={'column'} ml={'1rem'}>
            <Flex>
              <Text fw={'bold'}>
                {t('pages.colaborador.components.detailTable.contato.email')}
              </Text>
              <Text ml={'0.5rem'}>{row.original.email}</Text>
            </Flex>
            <Flex>
              <Text fw={'bold'}>
                {t('pages.colaborador.components.detailTable.contato.telefone')}
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

  const rowActions = ({ row }: { row: MRT_Row<IColaborador> }) => (
    <Flex>
      {row.original.ativo === 'Ativo' && (
        <Tooltip label={t('pages.colaborador.buttonEdit')}>
          <ActionIcon
            disabled={validatePermissionRole()}
            size="sm"
            color="blue"
            variant="transparent"
            aria-label="Settings"
            onClick={() => editar(row.original.id!)}
          >
            <IconEdit />
          </ActionIcon>
        </Tooltip>
      )}
      <Tooltip
        label={
          row.original.ativo == 'Ativo'
            ? t('pages.colaborador.disable')
            : t('pages.colaborador.active')
        }
      >
        <ActionIcon
          disabled={validatePermissionRole()}
          size="sm"
          color={row.original.ativo == 'Ativo' ? 'red' : 'green'}
          variant="transparent"
          aria-label="Settings"
          onClick={() =>
            openDeactivateModal(row.original.id!, row.original.ativo)
          }
        >
          {row.original.ativo == 'Ativo' ? <IconUserMinus /> : <IconUserPlus />}
        </ActionIcon>
      </Tooltip>
      <Tooltip label={t('pages.colaborador.buttonDelete')}>
        <ActionIcon
          disabled={validatePermissionRole()}
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
          {t('pages.colaborador.titleListagem')}
        </Text>
        <Flex>
          <Button
            disabled={validatePermissionRole()}
            leftIcon={<IconDownload size={16} />}
            onClick={() => getRelatorio()}
            mr={'0.5rem'}
          >
            {t('pages.colaborador.buttonRelatorio')}
          </Button>
          <Button
            disabled={validatePermissionRole()}
            leftIcon={<IconUserPlus size={16} />}
            onClick={() => navigate.push('colaborador/cadastro')}
          >
            {t('pages.colaborador.buttonCadastro')}
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
