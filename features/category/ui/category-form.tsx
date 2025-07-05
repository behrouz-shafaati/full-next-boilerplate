'use client'
import * as z from 'zod'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Braces as CategoryIcon, Mail as MailIcon, Trash } from 'lucide-react'
// import { Separator } from "@/components/ui/separator";
import { Heading } from '@/components/ui/heading'
// import FileUpload from "@/components/FileUpload";
import { useToast } from '../../../components/ui/use-toast'
import roleCtrl from '@/lib/entity/role/controller'
import { useFormState } from 'react-dom'
import { createCategory, deleteCategory, updateCategory } from '../actions'
import Text from '../../../components/form-fields/text'
import { SubmitButton } from '../../../components/form-fields/submit-button'
import { Option } from '../../../components/form-fields/combobox'
import { AlertModal } from '../../../components/modal/alert-modal'
import Combobox from '../../../components/form-fields/combobox'
import { Category } from '../interface'
import { createCatrgoryBreadcrumb } from '@/lib/utils'
import FileUpload from '../../../components/form-fields/file-upload'
import Select from '../../../components/form-fields/select'

export const IMG_MAX_LIMIT = 1

interface CategoryFormProps {
  initialData: any | null
  allCategories: Category[]
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData: category,
  allCategories,
}) => {
  const formRef = useRef<HTMLFormElement>(null)
  const initialState = { message: null, errors: {} }
  const actionHandler = category
    ? updateCategory.bind(null, String(category.id))
    : createCategory
  const [state, dispatch] = useActionState(actionHandler as any, initialState)

  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const title = category ? 'ویرایش دسته بندی' : 'افزودن دسته بندی'
  const description = category ? 'ویرایش دسته بندی' : 'افزودن دسته بندی'

  const parentOptions: Option[] = allCategories.map((category: Category) => {
    return {
      value: String(category.id),
      label: createCatrgoryBreadcrumb(category, category.title),
    }
  })

  const statusOptions = [
    {
      label: 'فعال',
      value: '1',
    },
    {
      label: 'غیر فعال',
      value: '0',
    },
  ]

  console.log('#299 category:', category)
  const statusDefaultValue = category
    ? String(category?.status) === 'active'
      ? '1'
      : '0'
    : '1'
  console.log('#299 statusDefaultValue:', statusDefaultValue)
  const onDelete = async () => {
    try {
      setLoading(true)
      DeleteCategory(category?.id)
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (!formRef.current) return

      const formData = new FormData(formRef.current)
      const entries = Object.fromEntries(formData.entries())

      console.log('[🔁 فرم هر 5 ثانیه]:', entries)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

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
        {category && (
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
      <form action={dispatch} className="space-y-8 w-full" ref={formRef}>
        {/* Product Media image */}
        <section className="mt-2 rounded-md  p-4 md:mt-0 md:p-6">
          <FileUpload
            title="تصویر شاخص دسته بندی"
            name="image"
            state={state}
            maxFiles={1}
            allowedFileTypes={{ 'image/*': [] }}
            defaultValues={category?.image}
          />
        </section>
        <div className="md:grid md:grid-cols-3 gap-8">
          {/* Title */}
          <Text
            title="عنوان"
            name="title"
            defaultValue={category?.title || ''}
            placeholder="عنوان"
            state={state}
            icon={<CategoryIcon className="w-4 h-4" />}
          />
          {/* Parent */}
          <Combobox
            title="دسته والد"
            name="parent"
            defaultValue={category?.parent?.id}
            options={parentOptions}
            placeholder="دسته والد"
            state={state}
            icon={<CategoryIcon className="w-4 h-4" />}
          />
          {/* description */}
          <Text
            title="توضیحات"
            name="description"
            defaultValue={category?.description}
            placeholder="توضیحات"
            state={state}
            icon={<MailIcon className="w-4 h-4" />}
          />
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

export function DeleteCategory(id: string) {
  const deleteCategoryWithId = deleteCategory.bind(null, id)
  deleteCategoryWithId()
}
