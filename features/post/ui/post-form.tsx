'use client'
import * as z from 'zod'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Braces as PostIcon, Mail as MailIcon, Trash } from 'lucide-react'
// import { Separator } from "@/components/ui/separator";
import { Heading } from '@/components/ui/heading'
// import FileUpload from "@/components/FileUpload";
import { useToast } from '../../../components/ui/use-toast'
import { createPost, deletePost, updatePost } from '@/features/post/actions'
import Text from '../../../components/form-fields/text'
import { SubmitButton } from '../../../components/form-fields/submit-button'
import { AlertModal } from '../../../components/modal/alert-modal'
import FileUpload from '../../../components/form-fields/file-upload'
import Select from '../../../components/form-fields/select'
import TiptapEditor from '@/components/tiptap-editor'
import Combobox from '@/components/form-fields/combobox'
import { Category } from '@/features/category/interface'
import { Option } from '@/types'
import { createCatrgoryBreadcrumb } from '@/lib/utils'
import { Braces as CategoryIcon } from 'lucide-react'
import TagInput from '@/components/form-fields/TagInput'
import { searchTags } from '@/features/tag/actions'
import { Tag } from '@/features/tag/interface'
import MultipleSelec from '@/components/form-fields/multiple-selector'

interface PostFormProps {
  initialData: any | null
  allCategories: Category[]
}

export const PostForm: React.FC<PostFormProps> = ({
  initialData: post,
  allCategories,
}) => {
  const formRef = useRef<HTMLFormElement>(null)
  const initialState = {
    message: null,
    errors: {},
    success: true,
    values: post,
  }

  const actionHandler = post
    ? updatePost.bind(null, String(post.id))
    : createPost
  const [state, dispatch] = useActionState(actionHandler as any, initialState)
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)
  const title = post ? 'ویرایش  مطلب' : 'افزودن مطلب'
  const description = post ? 'ویرایش دسته بندی' : 'افزودن مطلب'

  const categoryOptions: Option[] = allCategories.map((category: Category) => {
    return {
      value: String(category.id),
      label: category.title,
      label: createCatrgoryBreadcrumb(category, category.title),
    }
  })

  const statusOptions = [
    {
      label: 'منتشر شود',
      value: 'published',
    },
    {
      label: 'پیش نویس',
      value: 'draft',
    },
  ]

  const statusDefaultValue = post?.status || 'published'
  const onDelete = async () => {
    try {
      setLoading(true)
      DeletePost(post?.id)
    } catch (error: any) {}
  }

  useEffect(() => {
    if (state.message && state.message !== null)
      toast({
        variant: state.success ? 'default' : 'destructive',
        description: state.message,
      })
  }, [state])

  const submitManually = () => {
    if (formRef.current) {
      formRef.current.requestSubmit() // بهترین راه
    }
  }
  // const defaultC = JSON.parse(
  //   '{"contentJson":{"type":"doc","content":[{"type":"paragraph","attrs":{"dir":"rtl","textAlign":null},"content":[{"type":"text","text":"سلام"}]},{"type":"paragraph","attrs":{"dir":"rtl","textAlign":null},"content":[{"type":"text","text":"s"}]},{"type":"paragraph","attrs":{"dir":"rtl","textAlign":"left"},"content":[{"type":"text","marks":[{"type":"bold"}],"text":"خوبی"}]}]}}'
  // )

  // console.log('@33 post contentJson: ', post?.contentJson)

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
      <form action={dispatch} ref={formRef} className="space-y-8 w-full">
        {/* Product Media image */}
        <div className="md:grid md:grid-cols-3 gap-8">
          <div className="col-span-3">
            {/* Title */}
            <Text
              title="عنوان"
              name="title"
              defaultValue={state?.values?.title || ''}
              placeholder="عنوان"
              state={state}
              icon={<PostIcon className="w-4 h-4" />}
            />
            {/* Title */}
            <Text
              title="نامک در آدرس"
              name="slug"
              defaultValue={post?.slug || ''}
              placeholder="نامک در آدرس"
              state={state}
              icon={<PostIcon className="w-4 h-4" />}
            />
          </div>

          <div className="col-span-3">
            {/* contentJson */}
            <TiptapEditor
              name="contentJson"
              defaultContent={post ? JSON.parse(post?.contentJson) : {}}
              onChangeFiles={submitManually}
            />
          </div>
          <div>
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
          {/* category */}
          <Combobox
            title="دسته"
            name="categories"
            defaultValue={post?.categories[0]?.id || null}
            options={categoryOptions}
            placeholder="دسته"
            state={state}
            icon={<CategoryIcon className="w-4 h-4" />}
          />
          {/* categories */}
          {/* <MultipleSelec
            title="دسته‌ها"
            name="categories"
            defaultValues={
              post?.categories.map((category: Category) => {
                return { label: category.title, value: category.id }
              }) || []
            }
            placeholder="دسته‌ها"
            state={state}
            defaultSuggestions={categoryOptions}
            // icon={ShieldQuestionIcon}
            maxSelected={1}
          /> */}
          <div>
            <TagInput
              name="tags"
              title="برچسب ها"
              placeholder="برچسب ها را وارد کنید..."
              defaultValues={
                post?.tags.map((tag: Tag) => {
                  return { label: tag.title, value: tag.id }
                }) || []
              }
              fetchOptions={searchTags}
            />
          </div>
          <div>
            <FileUpload
              name="image"
              title="پوستر مطلب"
              maxFiles={1}
              defaultValues={post?.image || null}
              onChange={submitManually}
            />
          </div>
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
