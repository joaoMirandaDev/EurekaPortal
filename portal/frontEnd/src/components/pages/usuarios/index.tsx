import PaginationTable from '@components/common/tabela/paginationTableBasic'
import { ActionIcon, Box, Button, Flex, Text, Tooltip } from '@mantine/core'
import { useTranslate } from '@refinedev/core'
import {
  IconEdit,
  IconLockAccess,
  IconLockAccessOff,
  IconTrash,
  IconUserPlus,
} from '@tabler/icons'
import {
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_Row,
  MRT_SortingState,
} from 'mantine-react-table'
import api from 'src/utils/Api'
import React, { useEffect, useMemo, useState } from 'react'
import IFiltoUsuario from 'src/interfaces/IfiltroUser'
import IUser from 'src/interfaces/IUser'
import { PAGE_INDEX, PAGE_SIZE } from 'src/utils/Constants'
import {
  ACTIVE_OR_DISABLE_USER,
  DELETE_USER_BY_ID,
  FIND_ALL_BY_PAGE_USER,
} from 'src/utils/Routes'
import ImodalWarning from 'src/interfaces/ImodalWarning'
import { ModalWarning } from '@components/common/modalWarning'
import { ErrorNotification, SuccessNotification } from '@components/common'
import ModalCadastro from '../empresas/modalCadastro'

interface empresa {
  id: number
  status: number
}

interface IUserProps {
  id: string
  value: string
}

const ListUser: React.FC<empresa> = ({ id, status }) => {
  const t = useTranslate()
  const [modalConfig, setModalConfig] = useState<ImodalWarning>({
    titleWarning: '',
    descriptionWarning: '',
    confirm: () => {},
  })
  const [data, setData] = useState<IUser[]>([])
  const [columnFilters, setColumnFilters] = useState<IUserProps[]>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [idUser, setIdUser] = useState<number | null>(null)
  const [opened, setOpened] = useState<boolean>(false)
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const [totalElements, setTotalElements] = useState<number>(0)
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: PAGE_INDEX,
    pageSize: PAGE_SIZE,
  })
  const [filtro, setFiltro] = useState<IFiltoUsuario>({
    login: '',
    empresa: id,
    userName: '',
    ativo: null,
    role: null,
    columnOrder: 'userName',
    desc: false,
    tamanhoPagina: 4,
    pagina: 0,
  })
  const resetForm = () => {
    const val = {
      login: '',
      empresa: id,
      ativo: null,
      userName: '',
      role: null,
      columnOrder: 'userName',
      desc: false,
      tamanhoPagina: 4,
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
    getPageUserByIdEmpresa()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, filtro])
  useEffect(() => {
    if (id) {
      getPageUserByIdEmpresa()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])
  useEffect(() => {
    if (columnFilters.length > 0) {
      resetForm()
      columnFilters.forEach(column => {
        switch (column.id) {
          case 'userName':
            filterUser('userName', column.value)
            break
          case 'role.name':
            filterUser('role', column.value)
            break
          case 'login':
            filterUser('login', column.value.replace(/[. -]/g, ''))
            break
          case 'ativo':
            {
              const val = column.value === 'Ativo' ? 0 : 1
              filterUser('ativo', val)
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
      setSorting([{ id: 'userName', desc: false }])
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

  const filterUser = (Key: string, value: string | number) => {
    setFiltro(prevData => ({ ...prevData, [Key]: value, pagina: 0 }))
  }

  const getPageUserByIdEmpresa = async () => {
    const response = await api.post(FIND_ALL_BY_PAGE_USER, filtro)
    setData(response.data.content)
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
        .put(ACTIVE_OR_DISABLE_USER + `/${id}/${val}`)
        .then(() => {
          SuccessNotification({
            message:
              val === 1
                ? t('pages.user.message.disable')
                : t('pages.user.message.active'),
          })
          getPageUserByIdEmpresa()
        })
        .catch(() => {
          ErrorNotification({ message: t('components.error.errorGeneric') })
        })
    }
  }

  const closeModalCadastroUser = () => {
    setOpened(false)
    setIdUser(null)
    getPageUserByIdEmpresa()
  }

  const openDeactivateModal = (id: number, status: string | number) => {
    setModalConfig({
      confirm: val => disableOrActive(val, id, status),
      titleWarning: t('components.warning.alert'),
      descriptionWarning:
        status === 'Ativo'
          ? t('components.warning.descriptionDisableUsuario')
          : t('components.warning.descriptionActiveUsuario'),
    })
    setOpenModal(true)
  }

  const closeModal = () => {
    setOpenModal(false)
  }

  const openDeleteModal = (id: number) => {
    setModalConfig({
      confirm: val => confirmaExclusao(val, id),
      titleWarning: t('components.warning.alert'),
      descriptionWarning: t('components.warning.descriptionDeleteUsuario'),
    })
    setOpenModal(true)
  }

  const confirmaExclusao = async (confirm: boolean, id: number) => {
    if (id && confirm) {
      api
        .delete(DELETE_USER_BY_ID + `${id}`)
        .then(() => {
          SuccessNotification({ message: t('components.sucess.deleteSucess') })
          getPageUserByIdEmpresa()
          closeModal()
        })
        .catch(() => {
          ErrorNotification({ message: t('components.error.deleteError') })
        })
    }
  }

  const columns = useMemo<MRT_ColumnDef<IUser>[]>(
    () => [
      {
        accessorKey: 'userName',
        header: t('pages.user.table.userName'),
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
        accessorKey: 'login',
        header: t('pages.user.table.login'),
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
        accessorKey: 'role.name',
        header: t('pages.user.table.role'),
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
        accessorKey: 'ativo',
        header: t('pages.user.table.status'),
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

  const openModalUser = (val: number | null) => {
    setIdUser(null)
    if (val != null) {
      setIdUser(val)
    }
    setOpened(true)
  }

  const rowActions = ({ row }: { row: MRT_Row<IUser> }) => (
    <Flex>
      <Tooltip label={t('pages.user.tooltip.editUser')}>
        <ActionIcon
          size="sm"
          disabled={row.original.ativo != 'Ativo' || status !== 0}
          color="blue"
          variant="transparent"
          aria-label="Settings"
          onClick={() => openModalUser(row.original.id!)}
        >
          <IconEdit />
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
          disabled={status !== 0}
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
      <Tooltip label={t('pages.user.tooltip.deleteUser')}>
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
      <Flex align={'center'} justify={'end'} m={'1rem'}>
        <Button
          leftIcon={<IconUserPlus size={16} />}
          onClick={() => openModalUser(null)}
        >
          {t('pages.empresa.cadastro.usuario.buttonCadastro')}
        </Button>
      </Flex>
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
        data={data}
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
      <ModalCadastro
        idUser={idUser}
        closeModal={closeModalCadastroUser}
        idEmpresa={id?.valueOf()}
        openDrawer={opened}
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
export default ListUser
