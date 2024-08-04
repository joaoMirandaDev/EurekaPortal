export default interface IEmpresa {
  id?: number | null
  avatar: string | undefined
  razaoSocial: string
  nomeFantasia: string
  cnpj: string
  ativo: string
  dataAbertura: string
  telefone?: string
  email?: string
  photo?: string
  file: {
    name?: string
    key?: string
  }
  endereco: {
    id?: number
    estado?: string
    cidade?: string
    cep?: string
    numero?: string
    bairro?: string
    rua?: string
  }
}
