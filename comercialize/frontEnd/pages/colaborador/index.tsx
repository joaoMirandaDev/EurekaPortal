import { ErrorNotification, SuccessNotification } from '@components/common'
import { ModalWarning } from '@components/common/modalWarning'
import PaginationTable from '@components/common/tabela/paginationTable'
import ViewColaborador from '@components/pages/colaborador/list'
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Flex,
  Switch,
  Text,
  Tooltip,
} from '@mantine/core'
import { useTranslate } from '@refinedev/core'
import {
  IconEdit,
  IconLayoutGrid,
  IconList,
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
import useWindowWidth from 'src/services/responsive/responsive'
import api from 'src/utils/Api'
import { getImage } from 'src/utils/Arquivo'
import { PAGE_INDEX, PAGE_SIZE } from 'src/utils/Constants'
import { formatarCPFCNPJ, formatarTelefone } from 'src/utils/FormatterUtils'
import { FIND_ALL_BY_PAGE_COLABORADOR } from 'src/utils/Routes'
import { validatePermissionRole } from 'src/utils/ValidatePermissionRole'

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
  const [checked, setChecked] = useState(true)
  const navigate = useRouter()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [columnFilters, setColumnFilters] = useState<IColaboradorProps[]>([])
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const [dataCliente, setDataCliente] = useState<IColaborador[]>([])
  const windowWidth = useWindowWidth()
  const [totalElements, setTotalElements] = useState<number>(0)
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: PAGE_INDEX,
    pageSize: PAGE_SIZE,
  })
  const CNPJ: string = 'cnpj'
  const [filtro, setFiltro] = useState<IFiltoColaborador>({
    nome: '',
    sobrenome: '',
    cpf: '',
    estado: '',
    cargo: '',
    cidade: '',
    cnpj: Cookies.get(CNPJ),
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
      cargo: '',
      estado: '',
      cidade: '',
      cnpj: Cookies.get(CNPJ),
      ativo: null,
      pagina: 0,
      tamanhoPagina: 10,
      id: 'nome',
      desc: false,
    }
    setFiltro(val)
  }

  useEffect(() => {
    if (windowWidth < 1200) {
      setChecked(false)
    } else {
      setChecked(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowWidth])
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
          case 'cargo.nome':
            filterCliente('cargo', column.value)
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
      cnpj: Cookies.get(CNPJ),
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

  const columns = useMemo<MRT_ColumnDef<IColaborador>[]>(
    () => [
      {
        accessorKey: 'nome',
        header: 'Nome',
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
              {row.original.status === 'Ativo' ? (
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
        header: 'Sobrenome',
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
        header: 'Cpf',
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
        accessorKey: 'cargo.nome',
        header: 'Cargo',
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
        header: 'Estado',
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
        header: 'Cidade',
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
        accessorKey: 'status',
        header: 'Status',
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
        Cell: ({ renderedCellValue }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span>
              {renderedCellValue === 'Ativo' ? (
                <Text fw={'bold'} color="green">
                  Ativo
                </Text>
              ) : (
                <Text fw={'bold'} color="red">
                  Inativo
                </Text>
              )}
            </span>
          </Box>
        ),
      },
    ],
    []
  )

  const openDeleteModal = (id: number) => {
    setModalConfig({
      confirm: val => confirmaExclusao(val, id),
      titleWarning: 'Tem certeza ?',
      descriptionWarning:
        'Uma vez deletado, este colaborador será removido permanentemente e não poderá ser recuperado.',
    })
    setOpenModal(true)
  }

  const openDeactivateModal = (id: number, status: string | number) => {
    setModalConfig({
      confirm: val => disableOrActive(val, id, status),
      titleWarning: t('components.warning.alert'),
      descriptionWarning:
        status === 'Ativo'
          ? 'Uma vez desativado, este colaborador não poderá ser' +
            'pesquisado ou utilizado no sistema até ser reativado.'
          : 'Uma vez ativado, este colaborador estará disponível no' +
            'sistema e poderá ser pesquisado e utilizado.',
    })
    setOpenModal(true)
  }

  const editar = (id: number) => {
    navigate.push(`colaborador/editar/${id}`)
  }

  const rowActions = ({ row }: { row: MRT_Row<IColaborador> }) => (
    <Flex>
      {row.original.status === 'Ativo' && (
        <Tooltip label="Editar">
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
      <Tooltip label={row.original.status == 'Ativo' ? 'Ativar' : 'Desativar'}>
        <ActionIcon
          disabled={validatePermissionRole()}
          size="sm"
          color={row.original.status == 'Ativo' ? 'red' : 'green'}
          variant="transparent"
          aria-label="Settings"
          onClick={() =>
            openDeactivateModal(row.original.id!, row.original.status)
          }
        >
          {row.original.status == 'Ativo' ? (
            <IconUserMinus />
          ) : (
            <IconUserPlus />
          )}
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Deletar">
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
      <Flex justify={'flex-end'} align={'center'} mb={'1rem'}>
        <Flex align={'center'}>
          {windowWidth > 1200 && (
            <Switch
              checked={checked}
              mr={'0.5rem'}
              onChange={event => setChecked(event.currentTarget.checked)}
              size="lg"
              onLabel={<IconList size="1rem" stroke={2.5} />}
              offLabel={<IconLayoutGrid size="1rem" stroke={2.5} />}
            />
          )}
          <Button
            disabled={validatePermissionRole()}
            leftIcon={<IconUserPlus size={16} />}
            onClick={() => navigate.push('colaborador/cadastro')}
          >
            Cadastrar
          </Button>
        </Flex>
      </Flex>
      {checked ? (
        <PaginationTable
          setSorting={setSorting}
          columns={columns}
          rowActions={rowActions}
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
      ) : (
        <ViewColaborador />
      )}
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
