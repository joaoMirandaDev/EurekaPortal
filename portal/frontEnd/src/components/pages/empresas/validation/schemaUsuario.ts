/* eslint-disable react-hooks/rules-of-hooks */
import z from 'zod'
import { useTranslate } from '@refinedev/core'
const validaUsuario = () => {
  const t = useTranslate()
  return z.object({
    id: z.optional(z.number().nullable()),
    login: z
      .string()
      .nonempty({ message: t('components.error.requiredField') }),
    senha: z
      .string()
      .nonempty({ message: t('components.error.requiredField') }),
    userName: z
      .string()
      .nonempty({ message: t('components.error.requiredField') }),
    role: z
      .object({
        id: z.optional(z.number()),
        name: z.optional(z.string()),
      })
      .optional(),
    empresa: z.object({
      id: z
        .number({ required_error: t('components.error.requiredField') })
        .positive(),
    }),
  })
}

export { validaUsuario }
