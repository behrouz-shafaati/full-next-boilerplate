'use client'
import { ColumnDef } from '@tanstack/react-table'
import { CheckboxInput as Checkbox } from '@/components/ui/checkbox-input'
import { ArticleComment } from '../../interface'
import { getTranslation } from '@/lib/utils'
import { ArticleCommentItemManage } from './article-comment-item-manage'
import Link from 'next/link'
import { Option } from '@/types'
import { getArticles } from '@/features/article/actions'
import { Article } from '@/features/article/interface'
import { Status } from '@/components/Status'
import { MessageSquareShare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUpdatedUrl } from '@/hooks/use-updated-url'

type FilterType = 'text' | 'select' | 'boolean'

interface FilterConfig {
  type: FilterType
  options?: Option[]
  fetchOptions?: (query: string) => Promise<Option[]>
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    filterConfig?: FilterConfig
  }
}

export const columns: ColumnDef<ArticleComment>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: 'دیدگاه',
    accessorFn: (row) => {
      const translation = getTranslation({
        translations: row.translations,
        locale: row.locale ?? 'fa',
      })
      return JSON.stringify(translation.contentJson) // برای فیلتر پذیری
    },
    cell: ({ row }) => {
      return <ArticleCommentItemManage articleComment={row.original} />
    },
  },
  {
    accessorKey: 'article',
    header: 'مقاله',
    accessorFn: (row) => {
      const translation = getTranslation({
        translations: row.article?.translations,
        locale: row.locale ?? 'fa',
      })
      return translation.title // برای فیلتر پذیری
    },
    cell: ({ row }) => {
      const { buildUrlWithParams } = useUpdatedUrl()
      const article = row.original.article
      const translation = getTranslation({
        translations: article?.translations,
        locale: row.locale ?? 'fa',
      })
      return (
        <div className="flex flex-col gap-2">
          <Link href={article?.href ?? '#'} target="_blank">
            {translation.title}
          </Link>
          <Link
            href={buildUrlWithParams(null, { article: article?.id }) ?? '#'}
            target="_self"
          >
            <Button variant="ghost" size="icon" className="size-10">
              <MessageSquareShare />
            </Button>
          </Link>
        </div>
      )
    },
    meta: {
      filterConfig: {
        type: 'select',
        async fetchOptions(query: string): Promise<Option[]> {
          // به API بزن
          const articleResult = await getArticles({ filters: { query } })
          return articleResult.data.map((article: Article) => {
            const translation = getTranslation({
              translations: article.translations,
            })
            return {
              label: translation.title,
              value: article.id,
            }
          })
        },
        // options: [
        //   { label: 'Active', value: 'active' },
        //   { label: 'Draft', value: 'draft' },
        // ],
      },
    },
  },
  {
    accessorKey: 'status',
    header: 'وضعیت',
    cell: ({ row }) => <Status row={row} />,
    meta: {
      filterConfig: {
        type: 'select',
        options: [
          { label: 'در انتظار بررسی', value: 'pending' },
          { label: 'تایید شده', value: 'approved' },
          { label: 'رد شده', value: 'rejected' },
        ],
      },
    },
  },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <CellAction data={row.original} />,
  // },
]
