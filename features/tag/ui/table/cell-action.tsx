'use client'
import { DeleteTag } from '@/features/tag/ui/tag-form'
import { AlertModal } from '@/components/modal/alert-modal'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tag } from '@/features/tag/interface'
import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface CellActionProps {
  data: Tag
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const onConfirm = async () => {
    setLoading(true)
    DeleteTag(data.id)
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
            onClick={() => router.push(`/dashboard/tags/${data.id}`)}
          >
            <Edit className="ml-2 h-4 w-4" /> بروزرسانی
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="ml-2 h-4 w-4" /> حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
