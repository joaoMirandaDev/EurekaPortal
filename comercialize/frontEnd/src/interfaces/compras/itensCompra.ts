import IMercadoria from '../mercadoria'

export default interface IItemCompra {
  id?: number
  mercadoria?: IMercadoria | null
  quantidade?: number
  data?: Date
  valorCompra?: number
  valorUnitario?: number
  quantidadeFinal?: number
}
