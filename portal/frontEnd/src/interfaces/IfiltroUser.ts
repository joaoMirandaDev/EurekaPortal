import IRole from './role'

export default interface IFiltoUsuario {
  id?: number
  login?: string
  empresa?: number | null | string
  userName?: string
  role: IRole | null
  ativo: number | null | string
  columnOrder?: string
  desc?: boolean
  tamanhoPagina: number
  pagina: number
}
