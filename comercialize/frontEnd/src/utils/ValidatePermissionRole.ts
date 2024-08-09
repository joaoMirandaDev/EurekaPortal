import Cookies from 'js-cookie'

const ROLE = {
  ADMIN: 'ADMIN',
  CEO: 'CEO',
  GERENTE: 'GERENTE',
  CAIXA: 'CAIXA',
  PORTAL: 'PORTAL',
  ASSISTENCIA: 'ASSISTENCIA',
  VENDEDOR: 'VENDEDOR',
}

export const validatePermissionRole = () => {
  if (
    Cookies.get('role') == ROLE.CAIXA ||
    Cookies.get('role') == ROLE.ASSISTENCIA ||
    Cookies.get('role') == ROLE.VENDEDOR
  ) {
    return true
  }
}
