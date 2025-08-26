'use client'
import * as z from 'zod'
import { useActionState, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import roleCtrl from '@/lib/entity/role/controller'
import { createTemplate, deleteTemplate, updateTemplate } from '../actions'
import { Option } from '@/components/form-fields/combobox'
import { AlertModal } from '@/components/modal/alert-modal'
import BuilderTemplate from '@/components/builder-template'
import { Template } from '../interface'
import { Category } from '@/features/category/interface'
import CreateTemplateModal from './modal'

export const IMG_MAX_LIMIT = 3
const formSchema = z.object({
  title: z.string().min(3, { message: 'عنوان معتبر وارد کنید' }),
})

type TemplateFormValues = z.infer<typeof formSchema>

interface TemplateFormProps {
  allCategories: Category[]
  initialData: Template | null
}

const defaultInitialValue = {
  title: '',
  type: 'template',
  status: 'published',
  rows: [],
}

export const Form: React.FC<TemplateFormProps> = ({
  allCategories,
  initialData: Template,
}) => {
  const [defaultValue, setDefaultValue] = useState(defaultInitialValue)
  const [templateFor, setTemplateFor] = useState<string | null>(null)
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(!!Template)
  const initialState = { message: null, errors: {} }
  const actionHandler = Template
    ? updateTemplate.bind(null, String(Template.id))
    : createTemplate
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
  const title = Template ? 'ویرایش قالب' : 'افزودن قالب'
  const description = Template ? 'ویرایش قالب' : 'افزودن قالب'
  const toastMessage = Template ? 'قالب بروزرسانی شد' : 'قالب اضافه شد'
  const action = Template ? 'ذخیره تغییرات' : 'ذخیره'

  const handleTemplateConfirm = (section: string) => {
    console.log('✅ کاربر انتخاب کرد:', section)
    setDefaultValue((state) => ({ ...state, templateFor: [section] }))
    setTemplateFor(section)
    // اینجا می‌تونی استیت بسازی که مشخص کنه قالب برای کدوم بخشه
    setShowTemplateBuilder(true)
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      DeleteTemplate(String(Template?.id))
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
        {Template && (
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
      {!showTemplateBuilder && (
        <CreateTemplateModal
          onConfirm={handleTemplateConfirm}
          allCategories={allCategories}
        />
      )}
      {showTemplateBuilder && (
        <BuilderTemplate
          name="contentJson"
          submitFormHandler={dispatch}
          allCategories={allCategories}
          {...(Template
            ? {
                initialContent: {
                  ...Template.content,
                },
              }
            : { initialContent: { ...defaultValue } })}
        />
      )}
    </>
  )
}

export function DeleteTemplate(id: string) {
  const deleteTemplateWithId = deleteTemplate.bind(null, id)
  deleteTemplateWithId()
}
