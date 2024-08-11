export default interface IFiltoColaborador {
  search?: string | Date | string
  id?: string
  desc?: boolean
  pagina: number
  tamanhoPagina: number
  cnpj?: string
  nome?: string
  sobrenome?: string
  cargo?: string
  cpf?: string
  estado?: string
  global?: string
  cidade?: string
  ativo?: number | string | null
}
