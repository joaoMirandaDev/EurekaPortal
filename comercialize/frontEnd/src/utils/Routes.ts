/* Rotas colaborador */
export const CREATE_COLABORADOR: string = '/api/colaborador/create'
export const FIND_COLABORADOR: string = '/api/colaborador/findByCpfCnpj/'
export const FIND_ALL_BY_PAGE_COLABORADOR = '/api/colaborador/page'
export const GENERATE_RELATORIO_COLABORADOR =
  '/api/colaborador/relatorioPagamentoColaborador'

/* Rotas usuario */
export const FIND_BY_USUARIO_LOGIN: string = '/api/usuarios/findByLogin/'
export const VALIDATOR_USUARIO: string = '/api/usuarios/validatorUser/'
export const AUTH_USUARIO: string = '/api/usuarios/auth'

/* Rotas documentos */
export const UPLOAD_DOCUMENTOS_TEMP: string = '/api/arquivos/uploadTemp'
export const GET_DOCUMENTOS: string = '/api/arquivos/image'
