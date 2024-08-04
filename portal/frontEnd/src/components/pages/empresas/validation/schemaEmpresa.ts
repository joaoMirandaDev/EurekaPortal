/* eslint-disable react-hooks/rules-of-hooks */
import z from 'zod'
import { useTranslate } from '@refinedev/core'
const validaEmpresa = () => {
  const t = useTranslate()
  return z.object({
    id: z.optional(z.number()),
    razaoSocial: z
      .string()
      .nonempty({ message: t('components.error.requiredField') }),
    nomeFantasia: z
      .string()
      .nonempty({ message: t('components.error.requiredField') }),
    inscricaoEstadual: z.optional(z.string()),
    cpfResponsavel: z
      .string()
      .nonempty({ message: t('components.error.requiredField') })
      .min(11, { message: t('components.error.cpfField') })
      .max(11, { message: t('components.error.cpfField') }),
    cnpj: z
      .string()
      .nonempty({ message: t('components.error.requiredField') })
      .min(14, { message: t('components.error.cnpjField') })
      .max(14, { message: t('components.error.cnpjField') }),
    dataAbertura: z
      .date()
      .max(new Date(), { message: t('components.error.dateInvalid') }),
    email: z
      .string()
      .nonempty({ message: t('components.error.requiredField') })
      .email({ message: t('components.error.emailInvalid') })
      .transform(val => val.split('@')[1]),
    telefone: z
      .string()
      .nonempty({ message: t('components.error.requiredField') }),
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
    idModulos: z
      .array(z.number())
      .nonempty({ message: t('components.error.requiredField') }),
  })
}

export { validaEmpresa }
