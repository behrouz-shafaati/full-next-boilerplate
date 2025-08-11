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
import { createHeader, deleteHeader, updateHeader } from '../actions'
import Text from '@/components/form-fields/text'
import { SubmitButton } from '@/components/form-fields/submit-button'
import { Option } from '@/components/form-fields/combobox'
import { AlertModal } from '@/components/modal/alert-modal'
import BuilderHeader from '@/components/builder-header'
import { Category } from '@/features/category/interface'
import { Header, HeaderContent } from '../interface'

export const IMG_MAX_LIMIT = 3
const formSchema = z.object({
  title: z.string().min(3, { message: 'عنوان معتبر وارد کنید' }),
})

type HeaderFormValues = z.infer<typeof formSchema>

interface HeaderFormProps {
  initialData: Header | null
}

export const Form: React.FC<HeaderFormProps> = ({ initialData: Header }) => {
  const initialState = { message: null, errors: {} }
  const actionHandler = Header
    ? updateHeader.bind(null, String(Header.id))
    : createHeader
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
  const title = Header ? 'ویرایش سربرگ' : 'افزودن سربرگ'
  const description = Header ? 'ویرایش سربرگ' : 'افزودن سربرگ'
  const toastMessage = Header ? 'سربرگ بروزرسانی شد' : 'سربرگ اضافه شد'
  const action = Header ? 'ذخیره تغییرات' : 'ذخیره'

  console.log('#299 Header:', Header?.content.rows)
  const onDelete = async () => {
    try {
      setLoading(true)
      DeleteHeader(String(Header?.id))
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
        {Header && (
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
      <BuilderHeader
        name="contentJson"
        submitFormHandler={dispatch}
        {...(Header ? { initialContent: { ...Header.content } } : {})}
      />
    </>
  )
}

export function DeleteHeader(id: string) {
  const deleteHeaderWithId = deleteHeader.bind(null, id)
  deleteHeaderWithId()
}
