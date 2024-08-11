import {
  ActionIcon,
  Badge,
  Card,
  Flex,
  Group,
  Image,
  Menu,
  Pagination,
  Text,
} from '@mantine/core'
import {
  IconDots,
  IconEdit,
  IconTrash,
  IconUserMinus,
  IconUserPlus,
} from '@tabler/icons'
import Cookies from 'js-cookie'
import { MRT_PaginationState } from 'mantine-react-table'
import { useEffect, useState } from 'react'
import IColaborador from 'src/interfaces/colaborador'
import IFiltoColaborador from 'src/interfaces/IfiltroColaborador'
import api from 'src/utils/Api'
import { getImage } from 'src/utils/Arquivo'
import { PAGE_INDEX, PAGE_SIZE } from 'src/utils/Constants'
import { formatarCPFCNPJ, formatarTelefone } from 'src/utils/FormatterUtils'
import { FIND_ALL_BY_PAGE_COLABORADOR } from 'src/utils/Routes'

export default function ViewColaborador() {
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
    tamanhoPagina: 18,
    id: 'nome',
    desc: false,
  })
  const [dataCliente, setDataCliente] = useState<IColaborador[]>([])
  const [totalPage, setTotalPage] = useState<number>(0)
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: PAGE_INDEX,
    pageSize: PAGE_SIZE,
  })
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [currentPage, setCurrentPage] = useState<number>(1)

  useEffect(() => {
    findAllColaborador()
    const handleResize = () => setWindowWidth(window.innerWidth)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (pagination.pageIndex !== filtro.pagina) {
      const localFiltro = {
        ...filtro,
        pagina: pagination.pageIndex,
      }
      setFiltro(localFiltro)
    }
    findAllColaborador()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, filtro])

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
              'Erro ao buscar dados'
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
    setTotalPage(response.data.totalPages)
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group spacing="xs" position={windowWidth < 1300 ? 'center' : 'left'}>
        {dataCliente.map((val, index) => (
          <Card key={index} shadow="sm" radius="md" withBorder>
            <Card.Section>
              <Image
                fit={'fill'}
                src={val.photo}
                height={150}
                alt="With default placeholder"
                withPlaceholder
              />
              <Flex justify={'end'}>
                <Menu withinPortal shadow="sm">
                  <Menu.Target>
                    <ActionIcon>
                      <IconDots size="1rem" />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item icon={<IconEdit size={18} />} color="#228BE6">
                      <Text color="blue"> Editar</Text>
                    </Menu.Item>
                    <Menu.Item
                      icon={
                        val.status === 'Ativo' ? (
                          <IconUserMinus color="#fa5252" size={18} />
                        ) : (
                          <IconUserPlus color="#40c057" size={18} />
                        )
                      }
                    >
                      {val.status !== 'Ativo' ? (
                        <Text color="green">Ativar</Text>
                      ) : (
                        <Text color="red">Desativar</Text>
                      )}
                    </Menu.Item>
                    <Menu.Item icon={<IconTrash size={18} />} color="red">
                      Deletar
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Flex>
            </Card.Section>
            <Flex justify={'center'} mt="md" mb="xs">
              <Text weight={500}>{val.nome + ' ' + val.sobrenome!}</Text>
              <Badge
                color={val.status === 'Ativo' ? 'green' : 'red'}
                variant="light"
              >
                {val.status}
              </Badge>
            </Flex>
          </Card>
        ))}
      </Group>
      <Pagination
        value={currentPage}
        onChange={page => {
          setCurrentPage(page)
          setPagination({ ...pagination, pageIndex: page - 1 })
        }}
        total={totalPage}
        position="right"
        mt={'0.5rem'}
      />
    </Card>
  )
}
