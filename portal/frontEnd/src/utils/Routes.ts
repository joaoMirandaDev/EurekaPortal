/* Rotas colaborador */
export const CREATE_EMPRESA: string = '/api/empresa/create'
export const DELETE_EMPRESA: string = '/api/empresa/deleteById/'
export const FIND_EMPRESA: string = '/api/empresa/findByCpfCnpj/'
export const FIND_ALL_BY_PAGE_EMPRESA = '/api/empresa/page'
export const GENERATE_RELATORIO_EMPRESA = '/api/empresa/relatorio'
export const FIND_BY_ID_EMPRESA = '/api/empresa/findById/'

/* Rotas usuario */
export const FIND_USUARIO_BY_ID: string = '/api/usuarios/findById/'
export const FIND_BY_USUARIO_LOGIN: string = '/api/usuarios/findByLogin/'
export const VALIDATOR_USUARIO: string = '/api/usuarios/validatorUser/'
export const AUTH_USUARIO: string = '/api/usuarios/auth'
export const FIND_ALL_BY_PAGE_USER: string = '/api/usuarios/page'
export const ACTIVE_OR_DISABLE_USER: string = '/api/usuarios/activeOrDisable'
export const CREATE_USER: string = '/api/usuarios/create'
export const DELETE_USER_BY_ID: string = '/api/usuarios/deleteById/'
export const EDIT_USER: string = '/api/usuarios/edit'

/* Rotas documentos */
export const UPLOAD_DOCUMENTOS_TEMP: string = '/api/arquivos/uploadTemp'
export const GET_DOCUMENTOS: string = '/api/arquivos/image'

/* Rotas Role */
export const GET_ALL_ROLES: string = '/api/role'

/* Rotas Modulos */
export const GET_ALL_MODULOS: string = '/api/modulos/list'
