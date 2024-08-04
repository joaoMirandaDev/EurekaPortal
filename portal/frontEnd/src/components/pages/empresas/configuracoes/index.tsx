/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Button, Flex, Group, Tabs, Text } from '@mantine/core'
import { useTranslate } from '@refinedev/core'
import 'dayjs/locale/pt-br'
import { useForm, zodResolver } from '@mantine/form'
import api from 'src/utils/Api'
import { useRouter } from 'next/router'
import { IconArrowAutofitLeft, IconUser } from '@tabler/icons'
import { useEffect, useState } from 'react'
import { validaEmpresa } from '../validation/schemaEmpresa'
import { getImage } from 'src/utils/Arquivo'
import { formatarCPFCNPJ } from 'src/utils/FormatterUtils'
import ListUser from '@components/pages/usuarios'
import { FIND_BY_ID_EMPRESA } from 'src/utils/Routes'
interface IFile {
  name: string
  key: string
}
interface empresa {
  id: number
}
const ConfiguracoesEmpresa: React.FC<empresa> = ({ id }) => {
  const t = useTranslate()
  const [photo, setImagem] = useState<string | null>(null)
  const navigate = useRouter()
  const form = useForm<{
    id: number
    razaoSocial: string
    inscricaoEstadual?: string
    nomeFantasia: string
    cpfResponsavel: string
    cnpj: string
    dataAbertura: Date | null
    ativo: number | null
    email: string
    endereco: {
      cep: string
      cidade: string
      bairro: string
      rua: string
      estado: string
      numero: string
    }
    telefone: string
    file: IFile
  }>({
    initialValues: {
      id: id,
      razaoSocial: '',
      nomeFantasia: '',
      cpfResponsavel: '',
      inscricaoEstadual: '',
      dataAbertura: null,
      cnpj: '',
      telefone: '',
      ativo: 0,
      email: '',
      endereco: {
        rua: '',
        cep: '',
        bairro: '',
        cidade: '',
        estado: '',
        numero: '',
      },
      file: {
        name: '',
        key: '',
      },
    },
    validate: zodResolver(validaEmpresa()),
  })

  useEffect(() => {
    if (id) {
      getempresaById(id.toString())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const getempresaById = async (id: string) => {
    const value = await api.get(FIND_BY_ID_EMPRESA + `${id}`)
    if (value.data.documentos !== null) {
      const photo = await getImage(
        value.data.documentos.route,
        t('messages.getErrorDatabase')
      )
      if (photo) {
        setImagem(photo?.toString())
      }
    }
    form.setValues(value.data)
    form.setFieldValue('dataAbertura', new Date(value.data.dataAbertura))
  }

  const renderButtons = () => {
    return (
      <>
        <Flex mt={20} bottom={0} pos={'relative'} justify={'start'}>
          <Button
            leftIcon={<IconArrowAutofitLeft />}
            onClick={() => navigate.push('/empresas')}
          >
            {t('components.button.voltar')}
          </Button>
        </Flex>
      </>
    )
  }

  const renderTabs = () => {
    return (
      <Tabs defaultValue="user">
        <Tabs.List>
          <Tabs.Tab value="user" icon={<IconUser size="1.5rem" />}>
            {t('pages.empresa.user')}
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="user" pt="xs">
          <ListUser id={form.values.id} status={form.values.ativo!} />
        </Tabs.Panel>
      </Tabs>
    )
  }

  const renderDados = () => {
    return (
      <>
        <Flex align={'center'} display={'flex'} wrap="wrap" justify={'start'}>
          <Avatar
            color="blue"
            style={{ borderRadius: '10' }}
            size={150}
            src={photo}
            alt="With default placeholder"
          />
          <Flex justify={'start'} direction={'column'} ml={'0.5rem'}>
            <Group align={'center'}>
              <Flex>
                <Text fw={'bold'} mr={'0.5rem'}>
                  {t('pages.empresa.cadastro.dadosEmpresarial.razaoSocial')}
                </Text>
                <Text>{form.values.razaoSocial}</Text>
              </Flex>
            </Group>
            <Group>
              <Flex>
                <Text fw={'bold'} mr={'0.5rem'}>
                  {t('pages.empresa.cadastro.dadosEmpresarial.nomeFantasia')}
                </Text>
                <Text>{formatarCPFCNPJ(form.values.nomeFantasia)}</Text>
              </Flex>
            </Group>
            <Group>
              <Flex>
                <Text fw={'bold'} mr={'0.5rem'}>
                  {t('pages.empresa.cadastro.dadosEmpresarial.cnpj')}
                </Text>
                <Text>{formatarCPFCNPJ(form.values.cnpj)}</Text>
              </Flex>
            </Group>
            <Group>
              <Flex>
                <Text fw={'bold'} mr={'0.5rem'}>
                  {t('pages.empresa.cadastro.contatos.contato.email')}
                </Text>
                <Text>{formatarCPFCNPJ(form.values.email)}</Text>
              </Flex>
            </Group>
            <Group>
              <Flex>
                <Text fw={'bold'} mr={'0.5rem'}>
                  {t('pages.empresa.cadastro.contatos.contato.telefone')}
                </Text>
                <Text>{formatarCPFCNPJ(form.values.telefone)}</Text>
              </Flex>
            </Group>
          </Flex>
        </Flex>
      </>
    )
  }

  return (
    <>
      {renderDados()}
      {renderTabs()}
      {renderButtons()}
    </>
  )
}
export default ConfiguracoesEmpresa
