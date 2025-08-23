import { slugify } from '@/lib/utils'
import templateCtrl from './controller'

/**
 * تولید اسلاگ یکتا با بررسی دیتابیس
 */
export async function generateUniqueTemplateSlug(
  params: { slug: string; title: string },
  templateId: string = ''
): Promise<object> {
  console.log('#2ddf8 params: ', params)
  const baseSlug =
    params.slug != '' && params.slug != null
      ? slugify(params.slug)
      : slugify(params.title)
  console.log('#7437s8 baseSlug: ', baseSlug)
  // if it is update and slug doesn't change remove slug from parameters
  if (templateId !== '') {
    const findedTemplateBySlug = await templateCtrl.findOne({
      filters: { slug: baseSlug },
    })
    if (findedTemplateBySlug && findedTemplateBySlug.id == templateId) {
      console.log(
        '#7437s8 found template with same slug: ',
        findedTemplateBySlug
      )
      const { slug, ...rest } = params
      return rest
    }
  }

  // if it is new template need to generate new slug
  let slug = baseSlug
  let count = 1
  while (await templateCtrl.existSlug(slug)) {
    slug = `${baseSlug}-${count}`
    count++
  }
  console.log('#7437s8 new slug: ', slug)
  return { ...params, slug }
}
