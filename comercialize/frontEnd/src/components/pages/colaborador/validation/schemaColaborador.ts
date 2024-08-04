/* eslint-disable react-hooks/rules-of-hooks */
import z from 'zod'
import { useTranslate } from '@refinedev/core'
const validaColaborador = () => {
  const t = useTranslate()
  return z.object({
    id: z.optional(z.number()),
    nome: z.string().nonempty({ message: t('components.error.requiredField') }),
    cargo: z
      .string()
      .nonempty({ message: t('components.error.requiredField') }),
    sobrenome: z
      .string()
      .nonempty({ message: t('components.error.requiredField') }),
    cpf: z
      .string()
      .nonempty({ message: t('components.error.requiredField') })
      .min(11, { message: t('components.error.cpfField') })
      .max(11, { message: t('components.error.cpfField') }),
    rg: z.string().nonempty({ message: t('components.error.requiredField') }),
    dataNascimento: z
      .date()
      .max(new Date(), { message: t('components.error.dateInvalid') }),
    dataContratoInicial: z
      .date()
      .max(new Date(), { message: t('components.error.dateInvalid') }),
    sexo: z.string().nonempty({ message: t('components.error.requiredField') }),
    salario: z
      .number()
      .positive({ message: t('components.error.requiredField') }),
    email: z
      .string()
      .nonempty({ message: t('components.error.requiredField') })
      .email({ message: t('components.error.emailInvalid') })
      .transform(val => val.split('@')[1]),
    telefone: z
      .string()
      .nonempty({ message: t('components.error.requiredField') }),
    file: z
      .object({
        name: z.optional(z.string()),
        key: z.optional(z.string()),
      })
      .optional(),
    endereco: z.object({
      cep: z
        .string()
        .nonempty({ message: t('components.error.requiredField') })
        .min(8, { message: t('components.error.cepInvalid') })
        .max(8, { message: t('components.error.cepInvalid') }),
      numero: z
        .string()
        .nonempty({ message: t('components.error.requiredField') }),
      cidade: z
        .string()
        .nonempty({ message: t('components.error.requiredField') }),
      bairro: z
        .string()
        .nonempty({ message: t('components.error.requiredField') }),
      rua: z
        .string()
        .nonempty({ message: t('components.error.requiredField') }),
      estado: z
        .string()
        .nonempty({ message: t('components.error.requiredField') }),
    }),
  })
}

export { validaColaborador }
