import axios from 'axios'

export const buscarCep = async (value: string) => {
  const data = axios.get(`https://viacep.com.br/ws/${value}/json/`)
  return data
}
