export type PageContent = {
  rows: PageRow[]
}

export type PageRow = {
  id: string // UUID
  columns: PageColumn[]
}

export type PageColumn = {
  id: string // UUID
  width: number // مثلاً 6 یعنی 6 از 12 (مثل Bootstrap)
  blocks: PageBlock[]
}

export type PageBlock = {
  id: string // UUID
  // The type is not updatable.
  type: 'text' | 'image' | 'video' | 'gallery' | 'form' | 'product' | 'custom'
  data: Record<string, any>
}
