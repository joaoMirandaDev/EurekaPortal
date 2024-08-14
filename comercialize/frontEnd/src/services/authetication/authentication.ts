/* eslint-disable react-hooks/rules-of-hooks */
import jwtDecode from 'jwt-decode'
import Cookies from 'js-cookie'
import { removeformatarCPFCNPJ } from 'src/utils/FormatterUtils'
import ILogin from 'src/interfaces/login'
import api from 'src/utils/Api'
import {
  AUTH_LOGOUT,
  AUTH_USUARIO,
  FIND_BY_USUARIO_LOGIN,
  VALIDATOR_USUARIO,
} from 'src/utils/Routes'

const TOKEN_COOKIE_KEY: string = 'token'
const USER_COOKIE_KEY: string = 'user'
const CPF: string = 'cpf'
const NAMEUSER: string = 'nome_user'
const ROLE: string = 'role'
const NOME_FANTASIA: string = 'nome_fantasia'
const CNPJ: string = 'cnpj'
const ID_EMPRESA: string = 'id_empresa'

// Function to remove all cookies
const removeAllCookies = () => {
  const cookies = Object.keys(Cookies.get())
  cookies.forEach(cookie => {
    Cookies.remove(cookie)
  })
}

const clearAuthentication = () => {
  removeAllCookies()
}

export const logout = async () => {
  await api.post(AUTH_LOGOUT)
}

export const loginAuth = async (credentials: ILogin) => {
  credentials.login = removeformatarCPFCNPJ(credentials.login)
  await api
    .post(AUTH_USUARIO, credentials)
    .then(async response => {
      const token = response.data.token
      const user = jwtDecode(token)
      Cookies.set(TOKEN_COOKIE_KEY, token, { expires: 1, secure: true })
      Cookies.set(USER_COOKIE_KEY, JSON.stringify(user), {
        expires: 1,
        secure: true,
      })
      const getUserCookie: string = Cookies.get('user') ?? ''
      const userCookie = JSON.parse(getUserCookie)
      const usuario = userCookie.sub
      Cookies.set(CPF, usuario, { expires: 1, secure: true })
      await api
        .get(FIND_BY_USUARIO_LOGIN + `${response.data.login}`)
        .then(async response => {
          Cookies.set(ID_EMPRESA, response.data.empresaDto.id)
          Cookies.set(
            CNPJ,
            removeformatarCPFCNPJ(response.data.empresaDto.cnpj)
          )
          Cookies.set(NAMEUSER, response.data.userName)
          Cookies.set(ROLE, response.data.role.name)
          Cookies.set(NOME_FANTASIA, response.data.empresaDto.nomeFantasia!)
        })
    })
    .catch(() => {
      return false
    })
  return true
}

export const clearDados = () => {
  removeAllCookies()
  clearAuthentication()
}

export const verifyUserExpired = async () => {
  if (TOKEN_COOKIE_KEY !== 'undefined' || TOKEN_COOKIE_KEY !== undefined) {
    const check = await api
      .get(VALIDATOR_USUARIO + `${Cookies.get(TOKEN_COOKIE_KEY)}`)
      .then(response => {
        if (!response.data) {
          removeAllCookies()
          clearAuthentication()
          return response.data
        }
        return response.data
      })
      .catch(() => {
        removeAllCookies()
        clearAuthentication()
        return false
      })
    return check
  }
}
