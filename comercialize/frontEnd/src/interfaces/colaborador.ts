export default interface IColaborador {
  avatar: string | undefined
  salario: number
  dataContratoFinal: string
  dataContratoInicial: string
  dataNascimento: string
  ativo: string | number
  id?: number
  sobrenome?: string
  nome?: string
  cpf?: string
  rg?: string
  isUsuario?: number
  telefone?: string
  email?: string
  senha?: string
  role?: number
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
