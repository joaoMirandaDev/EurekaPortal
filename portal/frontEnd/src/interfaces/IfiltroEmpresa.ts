export default interface IFiltoEmpresa {
  razaoSocial?: string
  nomeFantasia?: string
  cnpj?: string
  estado?: string
  cidade?: string
  ativo?: number | null
  columnOrder?: string
  desc?: boolean
  tamanhoPagina: number
  pagina: number
}
