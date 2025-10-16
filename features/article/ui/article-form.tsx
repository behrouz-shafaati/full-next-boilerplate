'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Braces as ArticleIcon, Mail as MailIcon, Trash } from 'lucide-react'
// import { Separator } from "@/components/ui/separator";
import { Heading } from '@/components/ui/heading'
// import FileUpload from "@/components/FileUpload";
import { useToast } from '../../../components/ui/use-toast'
import {
  createArticle,
  deleteArticle,
  updateArticle,
} from '@/features/article/actions'
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
import MultipleSelector from '@/components/form-fields/multiple-selector'
import { createArticleHref } from '../utils'
import { SubmitButton } from '@/components/form-fields/submit-button'
import StickyBox from 'react-sticky-box'
import RelatedArticlesDashboard from './dashboard/related-article'
import SeoSnippetForm from './dashboard/seo-snippet-form'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ArticleFormProps {
  initialData: any | null
  allCategories: Category[]
}

export const ArticleForm: React.FC<ArticleFormProps> = ({
  initialData: article,
  allCategories,
}) => {
  const locale = 'fa'
  const translation: any =
    article?.translations?.find((t: any) => t.lang === locale) ||
    article?.translations[0] ||
    {}
  const initialState = {
    message: null,
    errors: {},
    values: { ...article, translation },
  }

  const formRef = useRef<HTMLFormElement>(null)

  const actionHandler = article
    ? updateArticle.bind(null, String(article.id))
    : createArticle
  const [state, dispatch] = useActionState(actionHandler as any, initialState)
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)
  const title = article ? 'ویرایش  مقاله' : 'افزودن مقاله'
  const description = article ? (
    <Link target="_blank" href={createArticleHref(article)}>
      مشاهده مقاله
    </Link>
  ) : (
    'افزودن مقاله'
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
      DeleteArticle(article?.id)
    } catch (error: any) {}
  }

  useEffect(() => {
    console.log('#sdf article state:', state)
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

  console.log(
    '#00000 state?.values?.translation?.contentJson:',
    state?.values?.translation?.contentJson
  )
  console.log('#00000 state?.values?.translation:', state?.values?.translation)
  console.log('#00000 state?.values:', state?.values)
  console.log('#00000 state:', state)
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
        {article && (
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
        <div className=" md:grid md:grid-cols-12 gap-8">
          <input
            type="text"
            name="lang"
            className="hidden"
            value="fa"
            readOnly
          />

          <div className="col-span-12 md:col-span-9">
            {/* Title */}
            <Text
              title="عنوان"
              name="title"
              defaultValue={state?.values?.translation?.title || ''}
              placeholder="عنوان"
              state={state}
              icon={<ArticleIcon className="w-4 h-4" />}
            />
            {/* contentJson */}
            <TiptapEditor
              attachedFilesTo={[
                { feature: 'article', id: article?.id || null },
              ]}
              name="contentJson"
              defaultContent={
                article
                  ? JSON.parse(state?.values?.translation?.contentJson)
                  : {}
              }
              onChangeFiles={submitManually}
              className="h-full"
            />
            <SeoSnippetForm
              defaultValues={state?.values || {}}
              className="mt-6"
            />
            {/* Meta Description */}
            <div className="space-y-1 mt-6">
              <Label htmlFor="metaDescription">اسکیما JSON</Label>
              <Textarea
                id="jsonLd"
                name="jsonLd"
                defaultValue={state?.values?.jsonLd || ''}
                rows={10}
                placeholder={`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "عنوان مقاله",
  "author": {
    "@type": "Person",
    "name": "Behrouz Shafaati"
  }
}`}
              />
            </div>
          </div>
          <div className="relative col-span-12 md:col-span-3">
            <StickyBox offsetBottom={0}>
              <SubmitButton text="ذخیره مقاله" className="my-4 w-full" />
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
              <FileUpload
                name="image"
                title="پوستر مقاله"
                maxFiles={1}
                defaultValues={state.values?.image || null}
                onChange={submitManually}
              />
              <RelatedArticlesDashboard article={article} className="my-4" />
              <div className="h-2"></div>
            </StickyBox>
          </div>
          <div className="col-span-12 md:col-span-9"></div>
          <div className="col-span-12 md:col-span-3"></div>
          {/* <div>
            <MultipleSelector
                    title="مقالات مرتبط"
                    name="relatedArticles"
                    defaultValues={selectedBlock?.content?.tags ?? []}
                    placeholder=""
                    defaultSuggestions={tagOptions}
                    onChange={(values) => {
                      update(selectedBlock?.id as string, 'content', {
                        ...selectedBlock?.content,
                        tags: values,
                      })
                    }}
                    onSearch={searchTags}
                    // icon={ShieldQuestionIcon}
                  />
          </div> */}
        </div>
      </form>
    </>
  )
}

export function DeleteArticle(id: string) {
  const deleteArticleWithId = deleteArticle.bind(null, id)
  deleteArticleWithId()
}
