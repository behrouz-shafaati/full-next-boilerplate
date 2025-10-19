'use client'
import { AlertModal } from '@/components/modal/alert-modal'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Article } from '../../interface'
import { Edit, Eye, MoreHorizontal, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createArticleHref } from '../../utils'
import Link from 'next/link'
import { deleteArticlesAction } from '../../actions'

interface CellActionProps {
  data: Article
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const onConfirm = async () => {
    setLoading(true)
    await deleteArticlesAction([data.id])
    router.refresh()
    setOpen(false)
    setLoading(false)
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {/* <DropdownMenuLabel dir="rtl">عملیات</DropdownMenuLabel> */}
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/articles/${data.id}`)}
          >
            <Edit className="ml-2 h-4 w-4" /> بروزرسانی
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`${createArticleHref(data)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Eye className="ml-2 h-4 w-4" /> مشاهده
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="ml-2 h-4 w-4" /> حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
