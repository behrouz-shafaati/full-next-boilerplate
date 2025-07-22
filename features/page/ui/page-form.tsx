'use client'
import * as z from 'zod'
import { useActionState, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Heading as HeadingIcon, Trash } from 'lucide-react'
// import { Separator } from "@/components/ui/separator";
import { Heading } from '@/components/ui/heading'
// import FileUpload from "@/components/FileUpload";
import { useToast } from '@/components/ui/use-toast'
import roleCtrl from '@/lib/entity/role/controller'
import { createPage, deletePage, updatePage } from '../actions'
import Text from '@/components/form-fields/text'
import { SubmitButton } from '@/components/form-fields/submit-button'
import { Option } from '@/components/form-fields/combobox'
import { AlertModal } from '@/components/modal/alert-modal'
import PageBuilder from '@/components/page-builder'
import { Category } from '@/features/category/interface'
import { Page, PageContent } from '../interface'

export const IMG_MAX_LIMIT = 3
const formSchema = z.object({
  title: z.string().min(3, { message: 'عنوان معتبر وارد کنید' }),
})

type PageFormValues = z.infer<typeof formSchema>

interface PageFormProps {
  initialData: Page | null
  allTemplates: PageContent[]
  allCategories: Category[]
}

export const PageForm: React.FC<PageFormProps> = ({
  initialData: page,
  allTemplates,
  allCategories,
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
      {/* <div className="flex items-center justify-between">
        {/* <Heading title={title} description={description} /> * /}
        {page && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div> * /}
      {/* <Separator /> */}
      <PageBuilder
        submitFormHandler={dispatch}
        name="contentJson"
        {...(page
          ? { initialContent: { ...page.content, slug: page.slug } }
          : {})}
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
