import {
  MRT_ColumnDef,
  MRT_Virtualizer,
  MantineReactTable,
  useMantineReactTable,
} from 'mantine-react-table'
import { useInfiniteQuery, QueryFunctionContext } from '@tanstack/react-query'
import { OnChangeFn, SortingState } from '@tanstack/table-core'
import { type UIEvent, useCallback, useEffect, useMemo, useRef } from 'react'
import { MRT_Localization_PT_BR } from 'mantine-react-table/locales/pt-BR'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InfiniteScroll<T extends Record<string, any>> = {
  columns: MRT_ColumnDef<T>[]
  showAction?: boolean
  maxHeight?: number
  queryKey: unknown[]
  queryFn: (context: QueryFunctionContext) => T | Promise<T>
  setSorting: OnChangeFn<SortingState>
  sorting: SortingState
  scrollTop: boolean
}

const InfiniteScrollTable = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>,
>({
  maxHeight = 600,
  columns,
  queryKey,
  queryFn,
  setSorting,
  sorting,
  scrollTop,
}: InfiniteScroll<T>) => {
  const tableContainerRef = useRef<HTMLDivElement>(null) //we can get access to the underlying TableContainer element and react to its scroll events
  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null) //we can get access to the underlying Virtualizer instance and call its scrollToIndex method

  const { data, fetchNextPage, isError, isFetching, isLoading } =
    useInfiniteQuery<T>({
      queryKey,
      queryFn,
      getNextPageParam: (_lastGroup, groups) => groups.length,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    })

  const flatData = useMemo(
    () => data?.pages.flatMap(page => page.data) ?? [],
    [data]
  )

  const totalDBRowCount = data?.pages?.[0]?.meta?.totalElements ?? 0
  const totalFetched = flatData.length

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement
        //once the user has scrolled within 400px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 400 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage()
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  )

  //scroll to top of table when sorting or filters change
  useEffect(() => {
    if (rowVirtualizerInstanceRef.current) {
      try {
        rowVirtualizerInstanceRef.current.scrollToIndex(0)
      } catch (e) {
        console.error(e)
      }
    }
  }, [scrollTop])

  //a check on mount to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current)
  }, [fetchMoreOnBottomReached])

  const table = useMantineReactTable<T>({
    localization: MRT_Localization_PT_BR,
    data: flatData,
    columns,
    enableColumnActions: false,
    enableFilters: false,
    enableSorting: true,
    enablePagination: false,
    enableRowVirtualization: true,
    manualFiltering: true,
    manualSorting: true,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    mantineTableContainerProps: {
      ref: tableContainerRef, //get access to the table container element
      sx: { maxHeight: `${maxHeight}px` }, //give the table a max height
      onScroll: (
        event: UIEvent<HTMLDivElement> //add an event listener to the table container element
      ) => fetchMoreOnBottomReached(event.target as HTMLDivElement),
    },
    mantineToolbarAlertBannerProps: {
      color: 'red',
      children: 'Error loading data',
    },
    initialState: {
      sorting: sorting,
      density: 'xs',
    },
    onSortingChange: setSorting,
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      sorting,
    },
    rowVirtualizerInstanceRef,
    rowVirtualizerProps: { overscan: 10 },
  })

  return <MantineReactTable table={table} />
}

export default InfiniteScrollTable
