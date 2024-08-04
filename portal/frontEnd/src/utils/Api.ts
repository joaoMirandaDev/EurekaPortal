import { axiosInstance } from '@refinedev/simple-rest'
import Cookies from 'js-cookie'
import { useLoadingStore } from 'src/stores/LoadingStore'
import { VALIDATOR_USUARIO } from './Routes'
const urlsWOLoading = [VALIDATOR_USUARIO + `${Cookies.get('token')}`]

export const API_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:1080'

axiosInstance.defaults.baseURL = API_URL

axiosInstance.interceptors.request.use(config => {
  const token = Cookies.get('token')

  if (!urlsWOLoading.includes(config.url || '')) {
    useLoadingStore.getState().startLoading()
  }

  if (config.headers && token) {
    config.headers['Authorization'] = `Bearer ${token}`
  } else if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  response => {
    if (!urlsWOLoading.includes(response.config.url || '')) {
      useLoadingStore.getState().stopLoading()
    }
    return response
  },
  error => {
    useLoadingStore.getState().stopLoading()
    return Promise.reject(error)
  }
)

export default axiosInstance
