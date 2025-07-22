import { Id, Model, SchemaModel } from '@/lib/entity/core/interface'

export type File = Model & {
  title: string
  extension: string
  description: string
  alt: string
  patch: string
  src: string
  href: string
  mimeType: string
  size: number
  previewPath: string
  main: boolean
}
export type SchemaFile = File & SchemaModel

export type FileDetailsPayload = {
  id: Id
  title: string
  description: string
  alt: string
  href: string
  main: boolean
}

export type FileDetails = FileDetailsPayload & {
  patch: string
  src: string
  mimeType: string
  size: number
  previewPath: string
}
