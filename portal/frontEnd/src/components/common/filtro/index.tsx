import React from 'react'
import { Button, Tooltip, Box, TextInput, Flex } from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/pro-solid-svg-icons'
import { faCircleXmark, faClose } from '@fortawesome/pro-regular-svg-icons'

interface SearchBarProps {
  placeholder: string
  textSearch: string
  clearSearch: boolean
  icone: boolean
  onDataFilter: (value: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  onDataFilter,
  clearSearch,
  textSearch,
  icone,
}) => {
  const [filter, setFilter] = React.useState('')
  const handleFilter = (value: string) => {
    setFilter('')
    onDataFilter('')
    const valorFormatado = Number(value.replace(/[^a-zA-Z0-9]/g, ''))
    if (valorFormatado) {
      value = valorFormatado.toString()
    }
    if (value) {
      onDataFilter(value)
    }
  }
  const handleClearFilter = () => {
    setFilter('')
    onDataFilter('')
  }

  return (
    <Flex
      maw={'100%'}
      mb={'20px'}
      style={{
        alignItems: 'center',
      }}
    >
      <TextInput
        placeholder={
          !clearSearch
            ? placeholder
            : 'Clique no botão ao lado para resetar a pesquisa'
        }
        value={filter}
        disabled={clearSearch}
        w={'100%'}
        onChange={e => setFilter(e.target.value)}
        rightSection={
          filter && (
            <Tooltip label="Limpar campo" position="top-end" withArrow>
              <Box>
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  style={{
                    display: 'block',
                    opacity: 0.5,
                    cursor: 'pointer',
                  }}
                  onClick={handleClearFilter}
                />
              </Box>
            </Tooltip>
          )
        }
      />
      {!clearSearch && (
        <Button
          fz={'md'}
          variant="filled"
          ml={'10px'}
          onClick={() => handleFilter(filter)}
        >
          {icone && (
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              style={{ marginRight: '10px' }}
            />
          )}
          {textSearch}
        </Button>
      )}
      {clearSearch && (
        <Button
          fz={'md'}
          variant="filled"
          color="red"
          ml={'10px'}
          radius="md"
          onClick={() => handleFilter('')}
        >
          {icone && (
            <FontAwesomeIcon icon={faClose} style={{ marginRight: '10px' }} />
          )}
          Resetar Pesquisa
        </Button>
      )}
    </Flex>
  )
}

export default SearchBar
