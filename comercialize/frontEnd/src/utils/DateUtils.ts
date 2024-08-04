import { dateAsString } from './FormatterUtils'

export const dataAtual = () => {
  const dataAtual = new Date()
  return dateAsString(dataAtual)
}
