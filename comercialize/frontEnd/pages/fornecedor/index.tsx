import { ErrorNotification, SuccessNotification } from '@components/common'
import SearchBar from '@components/common/filtro'
import PaginationTable from '@components/common/tabela/paginationTable'
import ModalFornecedor from '@components/pages/fornecedor/modal'
import { ActionIcon, Button, Flex, Text, Tooltip } from '@mantine/core'
import { useTranslate } from '@refinedev/core'
import { IconEdit, IconEye, IconTrash, IconUserPlus } from '@tabler/icons'
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
import IFornecedor from 'src/interfaces/fornecedor'
import ISearch from 'src/interfaces/search'
import api from 'src/utils/Api'
import { PAGE_INDEX, PAGE_SIZE } from 'src/utils/Constants'
import { formatarCPFCNPJ, formatarTelefone } from 'src/utils/FormatterUtils'

export default function FornecedorList() {
  const t = useTranslate()
  const navigate = useRouter()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [idCliente, setIdCliente] = useState<number>(0)
  const [sorting, setSorting] = useState<MRT_SortingState>([])
  const [dataCliente, setDataCliente] = useState<IFornecedor[]>([])
  const [resetPesquisa, setResetPesquisa] = useState<boolean>(false)
  const [totalElements, setTotalElements] = useState<number>(0)
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: PAGE_INDEX,
    pageSize: PAGE_SIZE,
  })
  const [filtro, setFiltro] = useState<ISearch>({
    search: '',
    pagina: 0,
    tamanhoPagina: 10,
    id: 'nome_razao_social',
    desc: false,
  })
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
    findAllfornecedor()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, filtro])

  useEffect(() => {
    if (sorting.length == 0) {
      setSorting([{ id: 'nomeRazaoSocial', desc: false }])
    }
    sorting.map(value => {
      setFiltro(prevData => ({ ...prevData, id: value.id, desc: value.desc }))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting])

  const filterCliente = (value: string) => {
    if (value.length > 0) {
      setResetPesquisa(true)
    } else {
      setResetPesquisa(false)
    }
    setFiltro(prevData => ({ ...prevData, search: value, pagina: 0 }))
  }

  const findAllfornecedor = async () => {
    const value = await api.post('/api/fornecedor/list', filtro)
    value.data.content.map((value: { cpfCnpj: string; telefone: string }) => {
      value.cpfCnpj = formatarCPFCNPJ(value.cpfCnpj)
      value.telefone = formatarTelefone(value.telefone)
    })
    setDataCliente(value.data.content)
    setTotalElements(value.data.totalElements)
  }
  const deletefornecedorById = async (id: number) => {
    setIdCliente(id)
    setOpenModal(true)
  }

  const confirmaExclusao = async (confirm: boolean) => {
    if (idCliente && confirm) {
      api
        .delete(`/api/fornecedor/deleteById/${idCliente}`)
        .then(response => {
          SuccessNotification({ message: response.data })
          findAllfornecedor()
          setOpenModal(false)
        })
        .catch(error => {
          ErrorNotification({ message: error })
        })
    } else {
      setOpenModal(false)
    }
  }

  const columns = useMemo<MRT_ColumnDef<IFornecedor>[]>(
    () => [
      {
        accessorKey: 'nomeRazaoSocial',
        header: t('pages.fornecedor.table.nomeRazaoSocial'),
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
        accessorKey: 'cpfCnpj',
        header: t('pages.fornecedor.table.cpfCnpj'),
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
        accessorKey: 'telefone',
        header: t('pages.fornecedor.table.telefone'),
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

  const visualizar = (id: number) => {
    navigate.push(`fornecedor/visualizar/${id}`)
  }

  const editar = (id: number) => {
    navigate.push(`fornecedor/editar/${id}`)
  }

  const validatePermissionRole = () => {
    if (Cookies.get('role') == 'CAIXA') {
      return true
    }
  }

  const rowActions = ({ row }: { row: MRT_Row<IFornecedor> }) => (
    <Flex>
      <Tooltip label={t('pages.fornecedor.tooltip.visualizar')}>
        <ActionIcon
          size="sm"
          disabled={validatePermissionRole()}
          variant="transparent"
          color="orange"
          aria-label="Settings"
          onClick={() => visualizar(row.original.id!)}
        >
          <IconEye style={{ cursor: 'pointer' }} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label={t('pages.fornecedor.tooltip.editar')}>
        <ActionIcon
          size="sm"
          variant="transparent"
          disabled={validatePermissionRole()}
          aria-label="Settings"
          color="blue"
          onClick={() => editar(row.original.id!)}
        >
          <IconEdit />
        </ActionIcon>
      </Tooltip>
      <Tooltip label={t('pages.fornecedor.tooltip.excluir')}>
        <ActionIcon
          size="sm"
          variant="transparent"
          color="red"
          disabled={validatePermissionRole()}
          aria-label="Settings"
          onClick={() => deletefornecedorById(row.original.id!)}
        >
          <IconTrash />
        </ActionIcon>
      </Tooltip>
    </Flex>
  )

  return (
    <>
      <SearchBar
        placeholder={t('pages.fornecedor.placeHoldeSearchBar')}
        clearSearch={resetPesquisa}
        textSearch={t('pages.fornecedor.buttonSearchBar')}
        icone={true}
        onDataFilter={filterCliente}
      />
      <Flex justify={'space-between'} align={'center'} m={10}>
        <Text fz={'1.5rem'} fw={'bold'}>
          Listagem de fornecedores
        </Text>
        <Button
          leftIcon={<IconUserPlus size={16} />}
          disabled={validatePermissionRole()}
          onClick={() => navigate.push('fornecedor/cadastro')}
        >
          {t('pages.fornecedor.buttonCadastro')}
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
        positionActionsColumn="last"
        data={dataCliente}
        state={{
          sorting,
          pagination: {
            pageIndex: filtro.pagina,
            pageSize: filtro.tamanhoPagina,
          },
        }}
        rowCount={totalElements}
      />
      <ModalFornecedor
        openModal={openModal}
        title={t('pages.fornecedor.modal.title')}
        textExclusao={t('pages.fornecedor.modal.text')}
        idCliente={idCliente}
        confirmaExclusao={confirmaExclusao}
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
