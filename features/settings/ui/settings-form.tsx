'use client'
import * as z from 'zod'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Braces as SettingsIcon, Mail as MailIcon, Trash } from 'lucide-react'
// import { Separator } from "@/components/ui/separator";
import { Heading } from '@/components/ui/heading'
// import FileUpload from "@/components/FileUpload";
import { useToast } from '../../../components/ui/use-toast'
import { updateSettings } from '@/features/settings/actions'
import Text from '../../../components/form-fields/text'
import { SubmitButton } from '../../../components/form-fields/submit-button'
import { AlertModal } from '../../../components/modal/alert-modal'
import FileUpload from '../../../components/form-fields/file-upload'
import Select from '../../../components/form-fields/select'
import TiptapEditor from '@/components/tiptap-editor'
import { PageContent, PageTranslationSchema } from '@/features/page/interface'
import { Settings } from '../interface'
import Combobox from '@/components/form-fields/combobox'
import { Option, State } from '@/types'
import { HomeIcon } from 'lucide-react'
import { getTranslation } from '@/lib/utils'
import Switch from '@/components/form-fields/switch'

interface SettingsFormProps {
  settings: Settings
  allPages: PageContent[]
}

export const SettingsForm: React.FC<SettingsFormProps> = ({
  settings,
  allPages,
}) => {
  const locale = 'fa'
  const formRef = useRef<HTMLFormElement>(null)
  const initialState: State = { message: null, errors: {}, success: true }
  const [state, dispatch] = useActionState(updateSettings as any, initialState)
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)
  const title = 'تنظیمات'
  const description = ''
  const toastMessage = settings ? ' مطلب بروزرسانی شد' : 'دسته بندی اضافه شد'
  const action = settings ? 'ذخیره تغییرات' : 'ذخیره'

  const pagesOptions: Option[] = allPages.map((p: PageContent) => {
    const translation: PageTranslationSchema = getTranslation({
      translations: p.translations,
      locale,
    })
    return {
      value: String(p.id),
      label: translation?.title,
    }
  })

  const onDelete = async () => {
    try {
      setLoading(true)
      DeleteSettings(settings?.id)
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

  // console.log('@33 settings contentJson: ', settings?.contentJson)

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
        {settings && (
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
          {/* first page */}
          <Combobox
            title="صفحه نخست"
            name="homePageId"
            defaultValue={String(settings?.homePageId)}
            options={pagesOptions}
            placeholder=""
            state={state}
            icon={<HomeIcon className="w-4 h-4" />}
          />
          {/* default header */}
          {/* <Combobox
            title="سربرگ پیش فرض"
            name="defaultHeaderId"
            defaultValue={String(settings?.defaultHeaderId)}
            options={headersOptions}
            placeholder=""
            state={state}
            icon={<HomeIcon className="w-4 h-4" />}
          /> */}

          <Switch
            name="commentApprovalRequired"
            title="نمایش دیدگاه‌ها فقط بعد از تأیید/بررسی"
            defaultChecked={settings?.commentApprovalRequired ?? true}
          />
        </div>
        <SubmitButton />
      </form>
    </>
  )
}

export function DeleteSettings(id: string) {}
