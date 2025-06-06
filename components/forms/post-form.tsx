'use client'
import * as z from 'zod'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Braces as PostIcon,
  Mail as MailIcon,
  Smartphone as PhoneIcon,
  ShieldQuestionIcon,
  KeyRound,
  Trash,
} from 'lucide-react'
// import { Separator } from "@/components/ui/separator";
import { Heading } from '@/components/ui/heading'
// import FileUpload from "@/components/FileUpload";
import { useToast } from '../ui/use-toast'
import roleCtrl from '@/lib/entity/role/controller'
import { useFormState } from 'react-dom'
import { createPost, deletePost, updatePost } from '@/lib/entity/post/actions'
import Text from '../form-fields/text'
import { SubmitButton } from '../form-fields/submit-button'
import { Option } from '../form-fields/combobox'
import { AlertModal } from '../modal/alert-modal'
import ProfileUpload from '../form-fields/profile-upload'
import Combobox from '../form-fields/combobox'
import { Post } from '@/lib/entity/post/interface'
import { createCatrgoryBreadcrumb } from '@/lib/utils'
import FileUpload from '../form-fields/file-upload'
import Select from '../form-fields/select'
import TiptapEditor from '../tiptap-editor'

const formSchema = z.object({
  title: z.string().min(3, { message: 'عنوان معتبر وارد کنید' }),
  content: z.string({}),
})

interface PostFormProps {
  initialData: any | null
}

export const PostForm: React.FC<PostFormProps> = ({ initialData: post }) => {
  const initialState = { message: null, errors: {} }
  const actionHandler = post
    ? updatePost.bind(null, String(post.id))
    : createPost
  const [state, dispatch] = useFormState(actionHandler as any, initialState)

  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)
  const title = post ? 'ویرایش  مطلب' : 'افزودن مطلب'
  const description = post ? 'ویرایش دسته بندی' : 'افزودن مطلب'
  const toastMessage = post ? ' مطلب بروزرسانی شد' : 'دسته بندی اضافه شد'
  const action = post ? 'ذخیره تغییرات' : 'ذخیره'

  const statusOptions = [
    {
      label: 'منتشر شود',
      value: '1',
    },
    {
      label: 'پیش نویس',
      value: '0',
    },
  ]

  console.log('#22 post:', post)
  const statusDefaultValue = post
    ? String(post?.status) === 'publish'
      ? '1'
      : '0'
    : '1'
  console.log('#299 statusDefaultValue:', statusDefaultValue)
  const onDelete = async () => {
    try {
      setLoading(true)
      DeletePost(post?.id)
    } catch (error: any) {}
  }

  useEffect(() => {
    if (state.message && state.message !== null)
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
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {post && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      {/* <Separator /> */}
      <form action={dispatch} className="space-y-8 w-full">
        {/* Product Media image */}
        <section className="mt-2 rounded-md  p-4 md:mt-0 md:p-6"></section>
        <div className="md:grid md:grid-cols-3 gap-8">
          {/* Title */}
          <Text
            title="عنوان"
            name="title"
            defaultValue={post?.title || ''}
            placeholder="عنوان"
            state={state}
            icon={<PostIcon className="w-4 h-4" />}
          />
          {/* content */}
          <TiptapEditor name="content" defaultContent="سلام" />
          {/* status */}
          <Select
            title="وضعیت"
            name="status"
            defaultValue={statusDefaultValue}
            options={statusOptions}
            placeholder="وضعیت"
            state={state}
            icon={<MailIcon className="w-4 h-4" />}
          />
        </div>
        <SubmitButton />
      </form>
    </>
  )
}

export function DeletePost(id: string) {
  const deletePostWithId = deletePost.bind(null, id)
  deletePostWithId()
}
