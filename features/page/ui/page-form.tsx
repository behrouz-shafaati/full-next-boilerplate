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
import { Page, PageContent, PageTranslationSchema } from '../interface'
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
  const locale = 'fa' //  from formData
  const translation: PageTranslationSchema =
    page?.translations?.find((t: PageTranslationSchema) => t.lang === locale) ||
    page?.translations[0] ||
    {}
  const initialState = {
    message: null,
    errors: {},
    values: { ...page, translation },
  }
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

  const onDelete = async () => {
    try {
      setLoading(true)
      DeletePage(String(page?.id))
    } catch (error: any) {}
  }

  useEffect(() => {
    console.log('#299 page state:', state)
    if (state?.message && state.message !== null)
      toast({
        variant: state.success ? 'default' : 'destructive',
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
        // initialContent={{
        //   ...state?.values?.translation?.content,
        //   slug: state?.values?.slug,
        // }}
        {...(page || state?.values?.translation?.content
          ? {
              initialContent: {
                ...state?.values?.translation?.content,
                slug: state?.values?.slug,
              },
            }
          : { initialContent: { type: 'page', rows: [] } })}
        allTemplates={allTemplates}
        allCategories={allCategories}
      />
    </>
  )
}

export function DeletePage(id: string) {
  const deletePageWithId = deletePage.bind(null, id)
  deletePageWithId()
}
