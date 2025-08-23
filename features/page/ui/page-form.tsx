'use client'
import * as z from 'zod'
import { useActionState, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import roleCtrl from '@/lib/entity/role/controller'
import { createPage, deletePage, updatePage } from '../actions'
import { Option } from '@/components/form-fields/combobox'
import { AlertModal } from '@/components/modal/alert-modal'
import { Category } from '@/features/category/interface'
import { Page, PageContent } from '../interface'
import BuilderPage from '@/components/builder-page'

export const IMG_MAX_LIMIT = 3
const formSchema = z.object({
  title: z.string().min(3, { message: 'عنوان معتبر وارد کنید' }),
})

type PageFormValues = z.infer<typeof formSchema>

interface PageFormProps {
  initialData: Page | null
  allTemplates: PageContent[]
  allCategories: Category[]
  allHeaders: Header[]
}

export const PageForm: React.FC<PageFormProps> = ({
  initialData: page,
  allTemplates,
  allCategories,
  allHeaders,
}) => {
  const initialState = { message: null, errors: {} }
  const actionHandler = page
    ? updatePage.bind(null, String(page.id))
    : createPage
  const [state, dispatch] = useActionState(actionHandler as any, initialState)
  const roleOptions: Option[] = roleCtrl.getRoles().map((role) => ({
    label: role.title,
    value: role.slug,
  }))

  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)
  const title = page ? 'ویرایش برگه' : 'افزودن برگه'
  const description = page ? 'ویرایش برگه' : 'افزودن برگه'
  const toastMessage = page ? 'برگه بروزرسانی شد' : 'برگه اضافه شد'
  const action = page ? 'ذخیره تغییرات' : 'ذخیره'

  console.log('#299 page:', page?.content.rows)
  const onDelete = async () => {
    try {
      setLoading(true)
      DeletePage(String(page?.id))
    } catch (error: any) {}
  }

  useEffect(() => {
    if (state?.message && state.message !== null)
      toast({
        variant: 'destructive',
        title: '',
        description: state.message,
      })
  }, [state])

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <BuilderPage
        title="صفحه ساز"
        submitFormHandler={dispatch}
        name="contentJson"
        {...(page
          ? { initialContent: { ...page.content, slug: page.slug } }
          : { initialContent: { type: 'page', rows: [] } })}
        allTemplates={allTemplates}
        allCategories={allCategories}
      />
      {/* <PageBuilder
        submitFormHandler={dispatch}
        name="contentJson"
        {...(page
          ? { initialContent: { ...page.content, slug: page.slug } }
          : {})}
        allTemplates={allTemplates}
        allCategories={allCategories}
      /> */}
    </>
  )
}

export function DeletePage(id: string) {
  const deletePageWithId = deletePage.bind(null, id)
  deletePageWithId()
}
