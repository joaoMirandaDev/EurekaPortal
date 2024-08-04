/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MRT_PaginationState,
  MantineReactTable,
  type MRT_ColumnDef,
  MRT_TableState,
  MRT_Row,
  MRT_TableInstance,
  MRT_SortingState,
  useMantineReactTable,
} from 'mantine-react-table'
import { ReactNode } from 'react'
import { MRT_Localization_PT_BR } from 'mantine-react-table/locales/pt-BR'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Tabela<T extends Record<string, any>> = {
  columns: MRT_ColumnDef<T>[]
  data: T[]
  rowCount: number
  setPagination: React.Dispatch<React.SetStateAction<MRT_PaginationState>>
  enablePinning?: boolean
  enableClickToCopy?: boolean
  renderDetailPanel: (props: {
    row: MRT_Row<T>
    table: MRT_TableInstance<T>
  }) => ReactNode
  initialState?: Partial<MRT_TableState<T>>
  onColumnFiltersChange: any
  enableRowActions?: boolean
  positionActionsColumn?: 'first' | 'last'
  state?: Partial<MRT_TableState<T>>
  rowActions?: (props: {
    row: MRT_Row<T>
    table: MRT_TableInstance<T>
  }) => ReactNode
  enableSorting?: boolean
  setSorting?: React.Dispatch<React.SetStateAction<MRT_SortingState>>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PaginationTable = <T extends Record<string, any>>({
  columns,
  data,
  rowCount,
  setPagination,
  initialState,
  enableClickToCopy,
  renderDetailPanel,
  onColumnFiltersChange,
  enablePinning = false,
  state,
  enableRowActions = false,
  positionActionsColumn = 'last',
  rowActions,
  enableSorting = false,
  setSorting,
}: Tabela<T>) => {
  const table = useMantineReactTable<T>({
    columns,
    data,
    enablePinning: enablePinning,
    enableTopToolbar: true,
    enableBottomToolbar: true,
    enableClickToCopy: enableClickToCopy,
    manualPagination: true,
    manualFiltering: true,
    onColumnFiltersChange: onColumnFiltersChange,
    enablePagination: true,
    enableDensityToggle: true,
    enableFullScreenToggle: false,
    enableRowActions: enableRowActions,
    enableColumnActions: true,
    enableColumnDragging: true,
    enableColumnOrdering: true,
    enableEditing: false,
    enableGlobalFilter: false,
    enableSortingRemoval: false,
    enableGrouping: true,
    localization: MRT_Localization_PT_BR,
    enableHiding: true,
    positionActionsColumn: positionActionsColumn,
    enableSorting: enableSorting,
    manualSorting: enableSorting,
    onSortingChange: setSorting,
    enableColumnFilterModes: true,
    enableFacetedValues: true,
    enableRowSelection: false,
    renderDetailPanel: renderDetailPanel,
    paginationDisplayMode: 'pages',
    enableFilterMatchHighlighting: false,
    positionToolbarAlertBanner: 'bottom',
    mantinePaginationProps: {
      radius: 'xl',
      size: 'lg',
    },
    renderRowActions: rowActions,
    onPaginationChange: setPagination,
    rowCount: rowCount,
    mantineTableProps: {
      sx: {
        marginRight: -10000,
      },
    },
    initialState,
    state,
  })

  return <MantineReactTable table={table} />
}

export default PaginationTable
