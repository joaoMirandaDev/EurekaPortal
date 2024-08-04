export function getToken() {
  return document?.cookie
    ?.split('D_PORTAL_SEGURANCA_AM_SESSION')[1]
    ?.split('ID=')[1]
}

export function getHeaderAxios() {
  return {
    headers: {
      Authorization: getToken(),
    },
  }
}
