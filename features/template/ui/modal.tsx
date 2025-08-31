'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useRouter } from 'next/navigation'
import { Category } from '@/features/category/interface'
import { Option } from '@/types'
import { createCatrgoryBreadcrumb } from '@/lib/utils'
import Combobox from '@/components/form-fields/combobox'
import { getTemplates } from '../actions'

type TemplateType = 'page' | 'category' | 'single' | 'home'

const existingTemplates: Record<TemplateType, boolean> = {
  page: false,
  category: true, // فرض کنیم برای دسته‌بندی‌ها قالب موجوده
  single: false,
  home: false,
}

export default function CreateTemplateModal({
  onConfirm,
  allCategories,
}: {
  onConfirm: (section: string) => void
  allCategories: Category[]
}) {
  const router = useRouter()
  const [open, setOpen] = useState(true) // 👈 همیشه اول باز باشه
  const [templateFor, setTemplateFor] = useState<string | null>(null)
  const [existsTemplate, setExistsTemplate] = useState<boolean>(false)
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)

  const categoryOptions: Option[] = allCategories.map((category: Category) => {
    return {
      value: `category-${String(category.id)}`,
      label:
        'خانه‌ی دسته‌ی ' + createCatrgoryBreadcrumb(category, category.title),
    }
  })

  const goalTemplateOptions = [
    {
      label: 'تمام صفحات',
      value: 'allPages',
    },
    // {
    //   label: 'صفحه نخست',
    //   value: 'firstPage',
    // },
    {
      label: 'خانه‌ی مقالات',
      value: 'blog',
    },
    {
      label: 'مقاله‌ی تکی',
      value: 'post',
    },
    {
      label: 'آرشیو مقالات',
      value: 'archive',
    },
    {
      label: 'هر دسته بندی',
      value: 'categories',
    },
    ...categoryOptions,
  ]

  const handleSelect = async (val: string) => {
    const section = val as TemplateType
    setTemplateFor(section)
    setLoading(true)

    // 👇 فراخوانی Server Action
    const res = await getTemplates({ filters: { templateFor: section } })
    console.log('#234987u res:', res)
    console.log('#234987u res:', res.data.length > 0)
    setExistsTemplate(res.data.length > 0)
    setLoading(false)
  }

  const handleContinue = () => {
    console.log('#234589766566 hndle continue: ')
    if (!templateFor) return

    if (existsTemplate && !confirmed) {
      // هنوز تأیید نکرده
      setConfirmed(true)
      return
    }
    console.log('#234589766566 hndle templateFor: ', templateFor)

    // ✅ به صفحه ساز اجازه بده ادامه بده
    onConfirm(templateFor)

    // بستن مودال
    setOpen(false)
    setConfirmed(false)
  }

  const handleCancel = () => {
    // برگرده بدون انتخاب
    router.back()
    // setOpen(false)
    // setConfirmed(false)
    // setSelected(null)
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>انتخاب بخش قالب</DialogTitle>
          <DialogDescription>
            مشخص کنید این قالب برای کدام بخش ساخته می‌شود.
          </DialogDescription>
        </DialogHeader>

        <Combobox
          title="هدف قالب:"
          name="templateFor"
          defaultValue={''}
          options={goalTemplateOptions}
          placeholder=""
          onChange={(e) => handleSelect(e.target.value)}
        />
        {loading && (
          <p className="text-sm text-gray-500 mt-2">در حال بررسی...</p>
        )}
        {templateFor && existsTemplate && !confirmed && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>توجه</AlertTitle>
            <AlertDescription>
              برای این بخش قبلاً قالب ساخته شده. اگر ادامه دهید، قالب قبلی پاک
              می‌شود.
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter className="flex justify-between">
          <Button className="ml-2" variant="outline" onClick={handleCancel}>
            بازگشت
          </Button>
          <Button
            className="mr-2"
            variant="default"
            onClick={() => {
              handleContinue()
            }}
          >
            {existsTemplate && !confirmed ? 'تأیید و ادامه' : 'ادامه'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
