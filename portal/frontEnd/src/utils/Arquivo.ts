import api from 'src/utils/Api'
import { GET_DOCUMENTOS } from './Routes'
import { ErrorNotification } from '@components/common'
interface IFile {
  key: string
  name: string
}
export const downloadByteArrayAsFile = (byteArray: Uint8Array): void => {
  const url = URL.createObjectURL(
    new Blob([byteArray], { type: 'application/pdf' })
  )

  window.open(url)
}

export const getImage = async (val: string, text: string) => {
  try {
    const img: IFile = {
      key: val,
      name: '',
    }
    const response = await api.post(GET_DOCUMENTOS, img, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'blob',
    })
    const contentType = response.headers['content-type'] || 'image/png'
    const blob = new Blob([response.data], { type: contentType })
    return URL.createObjectURL(blob)
  } catch (error) {
    ErrorNotification({ message: text })
  }
}

export const openByteArrayNewTab = (
  byteArray: Uint8Array,
  fileName: string
): void => {
  const type = getContentTypeFromFilename(fileName)
  const blob = new Blob([byteArray], { type })
  const url = URL.createObjectURL(blob)

  const newTab = window.open(url, '_blank')
  if (newTab) newTab.focus()
}

export const getContentTypeFromFilename = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf('.')
  if (lastDotIndex !== -1) {
    const extension = filename.substring(lastDotIndex + 1).toLowerCase()

    switch (extension) {
      case 'pdf':
        return 'application/pdf'
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg'
      case 'png':
        return 'image/png'
      case 'zip':
        return 'application/zip'
      default:
        return 'application/octet-stream'
    }
  } else {
    return 'application/octet-stream'
  }
}
