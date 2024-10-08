/* Rotas colaborador */
export const CREATE_COLABORADOR: string = '/api/colaborador/create'
export const FIND_COLABORADOR: string = '/api/colaborador/findByCpfCnpj/'
export const FIND_COLABORADOR_BY_ID: string = '/api/colaborador/findById/'
export const FIND_ALL_BY_PAGE_COLABORADOR = '/api/colaborador/page'
export const GENERATE_RELATORIO_COLABORADOR =
  '/api/colaborador/relatorioPagamentoColaborador/'

/* Rotas usuario */
export const FIND_BY_USUARIO_LOGIN: string = '/api/usuarios/findByLogin/'
export const VALIDATOR_USUARIO: string = '/api/usuarios/validatorUser/'
export const AUTH_USUARIO: string = '/api/usuarios/auth'
export const AUTH_LOGOUT: string = '/api/usuarios/logout'

/* Rotas documentos */
export const UPLOAD_DOCUMENTOS_TEMP: string = '/api/arquivos/uploadTemp'
export const GET_DOCUMENTOS: string = '/api/arquivos/image'

/* Rotas cargos */
export const FIND_ALL_CARGOS: string = '/api/cargo/findAll'
