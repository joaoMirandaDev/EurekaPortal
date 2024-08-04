import IRole from './role'

export default interface IUser {
  id?: number
  login?: string
  dataCadastro?: Date
  role: IRole
  userName: string
  ativo: string
}
