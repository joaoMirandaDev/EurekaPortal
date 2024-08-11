import { Pagination } from '@mantine/core'
import { usePagination } from '@mantine/hooks'
import { useEffect } from 'react'

interface Page {
  page: (value: number) => void
  totalPage: number
}
export const Paginacao: React.FC<Page> = ({ page, totalPage }) => {
  const pagination = usePagination({ total: 18, initialPage: 1 })

  useEffect(() => {
    page(pagination.active - 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.active])
  return (
    <Pagination
      onChange={page => {
        pagination.setPage(page)
      }}
      total={totalPage}
      position="right"
      mt={'0.5rem'}
    />
  )
}
