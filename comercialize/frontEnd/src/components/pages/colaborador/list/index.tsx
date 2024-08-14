import { ErrorNotification, SuccessNotification } from '@components/common'
import SearchBar from '@components/common/filtro'
import { ModalWarning } from '@components/common/modalWarning'
import { Paginacao } from '@components/common/pagination'
import {
  ActionIcon,
  Badge,
  Card,
  Flex,
  Group,
  Image,
  Menu,
  Text,
} from '@mantine/core'
import {
  IconDots,
  IconEdit,
  IconEye,
  IconTrash,
  IconUserMinus,
  IconUserPlus,
} from '@tabler/icons'
import { useTranslate } from '@refinedev/core'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import IColaborador from 'src/interfaces/colaborador'
import IFiltoColaborador from 'src/interfaces/IfiltroColaborador'
import ImodalWarning from 'src/interfaces/ImodalWarning'
import api from 'src/utils/Api'
import { getImage } from 'src/utils/Arquivo'
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
    global: '',
  })
  const [dataCliente, setDataCliente] = useState<IColaborador[]>([])
  const [totalPage, setTotalPage] = useState<number>(0)
  const navigate = useRouter()
  const t = useTranslate()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [resetPesquisa, setResetPesquisa] = useState<boolean>(false)
  const [modalConfig, setModalConfig] = useState<ImodalWarning>({
    titleWarning: '',
    descriptionWarning: '',
    confirm: () => {},
  })
  const handleChange = (
    event: number | string,
    key: keyof IFiltoColaborador
  ) => {
    setFiltro(prevState => ({
      ...prevState,
      [key]: event,
    }))
  }

  useEffect(() => {
    findAllColaborador()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro])

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const onDataFilter = (filter: string) => {
    if (filter.length > 0) {
      setResetPesquisa(true)
    } else {
      setResetPesquisa(false)
    }
    handleChange(filter, 'global')
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

  const openDeleteModal = (id: number) => {
    setModalConfig({
      confirm: val => confirmaExclusao(val, id),
      titleWarning: 'Tem certeza ?',
      descriptionWarning:
        'Uma vez deletado, este colaborador será removido permanentemente e não poderá ser recuperado.',
    })
    setOpenModal(true)
  }

  const closeModal = () => {
    setOpenModal(false)
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

  const openDeactivateModal = (id: number, status: string | number) => {
    setModalConfig({
      confirm: val => disableOrActive(val, id, status),
      titleWarning: t('components.warning.alert'),
      descriptionWarning:
        status === 'Ativo'
          ? 'Uma vez desativado, este colaborador não poderá ser ' +
            'pesquisado ou utilizado no sistema até ser reativado.'
          : 'Uma vez ativado, este colaborador estará disponível no ' +
            'sistema e poderá ser pesquisado e utilizado.',
    })
    setOpenModal(true)
  }

  const editar = (id: number) => {
    navigate.push(`colaborador/editar/${id}`)
  }

  return (
    <>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        m={'0 1rem 1rem 1rem '}
      >
        <SearchBar
          placeholder={'Pesquise por nome, sobrenome e cpf.'}
          textSearch={'Pesquisar'}
          clearSearch={resetPesquisa}
          icone={true}
          onDataFilter={onDataFilter}
        />
        {windowWidth < 1280 && (
          <Text fw={'bold'} size={'xs'} mt={'0.5rem'} mb={'0.5rem'}>
            O método de busca global, permite buscar nome, sobrenome e cpf.
          </Text>
        )}
        <Group
          spacing="xs"
          mt={'1rem'}
          position={windowWidth < 1280 ? 'center' : 'left'}
        >
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
                      <Menu.Item
                        icon={<IconEye size={18} />}
                        onClick={() =>
                          navigate.push(`colaborador/visualizar/${val.id}`)
                        }
                      >
                        <Text>Visualizar</Text>
                      </Menu.Item>
                      {val.status === 'Ativo' && (
                        <Menu.Item
                          icon={<IconEdit size={18} />}
                          onClick={() => editar(val.id!)}
                        >
                          <Text> Editar</Text>
                        </Menu.Item>
                      )}
                      <Menu.Item
                        onClick={() => openDeactivateModal(val.id!, val.status)}
                        icon={
                          val.status === 'Ativo' ? (
                            <IconUserMinus size={18} />
                          ) : (
                            <IconUserPlus size={18} />
                          )
                        }
                      >
                        {val.status !== 'Ativo' ? (
                          <Text>Ativar</Text>
                        ) : (
                          <Text>Desativar</Text>
                        )}
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => openDeleteModal(val.id!)}
                        icon={<IconTrash size={18} />}
                      >
                        Deletar
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Flex>
              </Card.Section>
              <Flex align={'center'}>
                <Text fw={'bold'}>{val.nome + ' ' + val.sobrenome!}</Text>
              </Flex>
              <Text fw={'bold'}>Cpf: {formatarCPFCNPJ(val.cpf!)}</Text>
              <Flex justify={'center'} align={'center'}>
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
        <Paginacao
          page={event => handleChange(event, 'pagina')}
          totalPage={totalPage}
        />
      </Card>
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
