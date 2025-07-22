'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Braces as TagIcon, Mail as MailIcon, Trash } from 'lucide-react'
// import { Separator } from "@/components/ui/separator";
import { Heading } from '@/components/ui/heading'
// import FileUpload from "@/components/FileUpload";
import { useToast } from '../../../components/ui/use-toast'
import { createTag, deleteTag, updateTag } from '../actions'
import Text from '../../../components/form-fields/text'
import { SubmitButton } from '../../../components/form-fields/submit-button'
import { AlertModal } from '../../../components/modal/alert-modal'
import { Tag } from '../interface'
import FileUpload from '../../../components/form-fields/file-upload'
import Select from '../../../components/form-fields/select'

export const IMG_MAX_LIMIT = 1

interface TagFormProps {
  initialData: any | null
  allTags: Tag[]
}

export const TagForm: React.FC<TagFormProps> = ({ initialData: tag }) => {
  const formRef = useRef<HTMLFormElement>(null)
  const initialState = { message: null, errors: {} }
  const actionHandler = tag ? updateTag.bind(null, String(tag.id)) : createTag
  const [state, dispatch] = useActionState(actionHandler as any, initialState)

  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const title = tag ? 'ویرایش برچسب' : 'افزودن برچسب'
  const description = tag ? 'ویرایش برچسب' : 'افزودن برچسب'

  const statusOptions = [
    {
      label: 'فعال',
      value: 'active',
    },
    {
      label: 'غیر فعال',
      value: 'inactive',
    },
  ]

  console.log('#299 tag:', tag)
  const statusDefaultValue = tag ? tag?.status : 'active'
  console.log('#299 statusDefaultValue:', statusDefaultValue)
  const onDelete = async () => {
    try {
      setLoading(true)
      DeleteTag(tag?.id)
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
        {tag && (
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
            title="تصویر شاخص برچسب"
            name="image"
            state={state}
            maxFiles={1}
            allowedFileTypes={{ 'image/*': [] }}
            defaultValues={tag?.image}
          />
        </section>
        <div className="md:grid md:grid-cols-3 gap-8">
          {/* Title */}
          <Text
            title="عنوان"
            name="title"
            defaultValue={tag?.title || ''}
            placeholder="عنوان"
            state={state}
            icon={<TagIcon className="w-4 h-4" />}
          />
          <Text
            title="نامک"
            name="slug"
            defaultValue={tag?.slug || ''}
            placeholder="نامک"
            state={state}
            icon={<TagIcon className="w-4 h-4" />}
          />
          {/* description */}
          <Text
            title="توضیحات"
            name="description"
            defaultValue={tag?.description}
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

export function DeleteTag(id: string) {
  const deleteTagWithId = deleteTag.bind(null, id)
  deleteTagWithId()
}
