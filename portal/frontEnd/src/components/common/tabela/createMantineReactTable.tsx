import { Text } from '@mantine/core'
import {
  MRT_TableOptions,
  MRT_TableState,
  useMantineReactTable,
} from 'mantine-react-table'
import { MRT_Localization_PT_BR } from 'mantine-react-table/locales/pt-BR'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props<T extends Record<string, any>> {
  customProps?: Omit<MRT_TableOptions<T>, 'initialState'>
  height?: number
  initialState?: Partial<MRT_TableState<T>>
  state?: Partial<MRT_TableState<T>>
}

const CreateMantineReactTable = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>,
>({
  customProps,
  height,
  initialState = {},
  state,
}: Props<T>) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const mantineReactTableProps: MRT_TableOptions<T> = {
    localization: MRT_Localization_PT_BR,
    enableColumnActions: false,
    enableFilters: false,
    enableHiding: false,
    enablePagination: false,
    enableStickyHeader: true,
    enableSorting: false,
    manualFiltering: false,
    manualSorting: false,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    mantineTableContainerProps: {
      sx: {
        '@media (max-width: 768px)': {
          maxHeight: '150px',
          height: `calc(${height}px - 350px)`,
        },

        /* Para telas médias (de 768px a 1024px) */
        '@media (min-width: 769px) and (max-width: 1024px)': {
          maxHeight: '300px',
          height: `calc(${height}px - 300px)`,
        },

        /* Para telas grandes (de 1025px a 1200px) */
        '@media (min-width: 1025px) and (max-width: 1200px)': {
          maxHeight: '400px',
          height: `calc(${height}px - 200px)`,
        },

        /* Para telas muito grandes (acima de 1200px) */
        '@media (min-width: 1201px) and (max-width: 1400px)': {
          maxHeight: '450px',
          height: `calc(${height}px - 120px)`,
        },

        '@media (min-width: 1401px) and (max-width: 1600px)': {
          maxHeight: '600px',
          height: `calc(${height}px - 50px)`,
        },

        '@media (min-width: 1601px)': {
          maxHeight: '700px',
          height: `calc(${height}px - 0px)`,
        },
      },
    },
    initialState: {
      density: 'xs',
      ...initialState,
    },
    state: {
      ...state,
    },
    renderEmptyRowsFallback: () => (
      <Text fw="lighter" italic style={{ textAlign: 'center' }} size={16}>
        Não há registros a serem exibidos
      </Text>
    ),
  }

  return useMantineReactTable<T>({ ...mantineReactTableProps, ...customProps })
}

export default CreateMantineReactTable
