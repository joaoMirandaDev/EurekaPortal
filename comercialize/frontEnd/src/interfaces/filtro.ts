export default interface IFiltro {
  nomeRazaoSocial?: string
  nomeFantasia?: string
  cpfCnpj?: string
  telefone?: string
  pagina: number
  tamanhoPagina: number
  ordem?: 'ASC' | 'DESC'
}
