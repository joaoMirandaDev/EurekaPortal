/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { cpf, cnpj } from 'cpf-cnpj-validator'
import { IMask } from 'react-imask'

export const checkNullNumber = (number: number | undefined) => {
  if (number === null || number === undefined) {
    return 's/n'
  } else {
    return number
  }
}

export const formatarTelefone = (numero: string) => {
  const numeros = numero?.replace(/\D/g, '')

  if (numeros?.length === 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`
  } else if (numeros?.length === 11) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`
  } else {
    return numero
  }
}

export const formatarCPFCNPJ = (documento: string) => {
  const numeros = documento?.replace(/\D/g, '')
  if (numeros?.length === 11) {
    return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(
      6,
      9
    )}-${numeros.slice(9)}`
  } else if (numeros?.length === 14) {
    return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(
      5,
      8
    )}/${numeros.slice(8, 12)}-${numeros.slice(12)}`
  } else {
    return documento
  }
}

export const removeformatarCPFCNPJ = (dados: string) => {
  const cpfWithoutFormat = dados.replace(/[^\d]/g, '')
  let login: string = ''
  return (login = cpfWithoutFormat)
}

export const removeformatacaoTelefone = (dados: string) => {
  return dados.replaceAll(/[()\s-]+/g, '')
}

export const dateAsString = (date: Date) => {
  return date.toLocaleDateString('pt-br')
}

export const validarCPFCNPJ = (cpfcnpj: string) => {
  if (cpfcnpj.length > 0) {
    if (cpfcnpj.length === 14) {
      return cnpj.isValid(cpfcnpj, false)
    } else {
      return cpf.isValid(cpfcnpj, false)
    }
  }
}

export const formataCep = (val: string) => {
  return val
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1')
}

export const maskCpfCnpj = IMask.createMask({
  mask: [{ mask: '000.000.000-00' }, { mask: '00.000.000/0000-00' }],
})

export const maskCelular = IMask.createMask({
  mask: [{ mask: '(00) 00000-0000' }, { mask: '(00) 0000-0000' }],
})

export const maskCEP = IMask.createMask({
  mask: '00000-000',
})

export const getErrorMessage = (err: unknown) => {
  const erro = Object.getOwnPropertyDescriptors(err as object)
  return erro?.message?.value
}
