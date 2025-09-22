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
import { AlertModal } from '../../../components/modal/alert-modal'
import FileUpload from '../../../components/form-fields/file-upload'
import Select from '../../../components/form-fields/select'
import TiptapEditor from '@/components/tiptap-editor'
import Combobox from '@/components/form-fields/combobox'
import {
  Category,
  CategoryTranslationSchema,
} from '@/features/category/interface'
import { Option } from '@/types'
import { createCatrgoryBreadcrumb } from '@/lib/utils'
import { Braces as CategoryIcon } from 'lucide-react'
import TagInput from '@/components/form-fields/TagInput'
import { searchTags } from '@/features/tag/actions'
import { Tag, TagTranslationSchema } from '@/features/tag/interface'
import MultipleSelec from '@/components/form-fields/multiple-selector'
import Link from 'next/link'
import { createPostHref } from '../utils'

interface PostFormProps {
  initialData: any | null
  allCategories: Category[]
}

export const PostForm: React.FC<PostFormProps> = ({
  initialData: post,
  allCategories,
}) => {
  const locale = 'fa'
  const translation: any =
    post?.translations?.find((t: any) => t.lang === locale) ||
    post?.translations[0] ||
    {}
  const initialState = {
    message: null,
    errors: {},
    values: { ...post, translation },
  }

  const formRef = useRef<HTMLFormElement>(null)

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
  const description = post ? (
    <Link target="_blank" href={createPostHref(post)}>
      مشاهده مطلب
    </Link>
  ) : (
    'افزودن مطلب'
  )

  const categoryOptions: Option[] = allCategories.map((category: Category) => {
    const translation: any =
      category?.translations?.find((t: any) => t.lang === locale) ||
      category?.translations[0] ||
      {}
    return {
      value: String(category.id),
      label: createCatrgoryBreadcrumb(category, translation?.title),
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
  const onDelete = async () => {
    try {
      setLoading(true)
      DeletePost(post?.id)
    } catch (error: any) {}
  }

  useEffect(() => {
    console.log('#sdf post state:', state)
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
  const categoriesArray = Array.isArray(state.values?.categories)
    ? state.values?.categories
    : []
  const tagsArray = Array.isArray(state.values?.tags) ? state.values?.tags : []
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
            <input
              type="text"
              name="lang"
              className="hidden"
              value="fa"
              readOnly
            />
            {/* Title */}
            <Text
              title="عنوان"
              name="title"
              defaultValue={state?.values?.translation?.title || ''}
              placeholder="عنوان"
              state={state}
              icon={<PostIcon className="w-4 h-4" />}
            />
            {/* Title */}
            <Text
              title="نامک در آدرس"
              name="slug"
              defaultValue={state?.values?.slug || ''}
              placeholder="نامک در آدرس"
              state={state}
              icon={<PostIcon className="w-4 h-4" />}
            />
          </div>

          <div>
            {/* status */}
            <Select
              title="وضعیت"
              name="status"
              defaultValue={state?.values?.status || 'published'}
              options={statusOptions}
              placeholder="وضعیت"
              state={state}
              icon={<MailIcon className="w-4 h-4" />}
            />
          </div>
          {/* category */}
          <Combobox
            title="دسته اصلی"
            name="mainCategory"
            defaultValue={state.values?.mainCategory?.id || null}
            options={categoryOptions}
            placeholder="دسته اصلی"
            state={state}
            icon={<CategoryIcon className="w-4 h-4" />}
          />
          {/* categories */}
          <MultipleSelec
            title="سایر دسته‌ها"
            name="categories"
            defaultValues={
              categoriesArray.map((category: Category) => {
                const translation: CategoryTranslationSchema =
                  category?.translations?.find(
                    (t: CategoryTranslationSchema) => t.lang === locale
                  ) ||
                  category?.translations[0] ||
                  {}
                return { label: translation?.title, value: category.id }
              }) || []
            }
            placeholder="دسته‌ها"
            state={state}
            defaultSuggestions={categoryOptions}
            // icon={ShieldQuestionIcon}
            // maxSelected={1}
          />
          <div>
            <TagInput
              name="tags"
              title="برچسب ها"
              placeholder="برچسب ها را وارد کنید..."
              defaultValues={
                tagsArray.map((tag: Tag) => {
                  const translation: TagTranslationSchema =
                    tag?.translations?.find(
                      (t: CategoryTranslationSchema) => t.lang === locale
                    ) ||
                    tag?.translations[0] ||
                    {}
                  return { label: translation?.title, value: tag.id }
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
              defaultValues={state.values?.image || null}
              onChange={submitManually}
            />
          </div>

          <div className="col-span-3">
            {/* contentJson */}
            <TiptapEditor
              attachedTo={[{ feature: 'post', id: post?.id || null }]}
              name="contentJson"
              defaultContent={
                post ? JSON.parse(state?.values?.translation?.contentJson) : {}
              }
              onChangeFiles={submitManually}
              showSubmitButton={true}
            />
          </div>
        </div>
      </form>
    </>
  )
}

export function DeletePost(id: string) {
  const deletePostWithId = deletePost.bind(null, id)
  deletePostWithId()
}
