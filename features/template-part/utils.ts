import { slugify } from '@/lib/utils'
import templatePartCtrl from './controller'

/**
 * تولید اسلاگ یکتا با بررسی دیتابیس
 */
export async function generateUniqueTemplatePartSlug(
  params: { slug: string; title: string },
  templatePartId: string = ''
): Promise<object> {
  console.log('#2ddf8 params: ', params)
  const baseSlug =
    params.slug != '' && params.slug != null
      ? slugify(params.slug)
      : slugify(params.title)
  console.log('#7437s8 baseSlug: ', baseSlug)
  // if it is update and slug doesn't change remove slug from parameters
  if (templatePartId !== '') {
    const findedTemplatePartBySlug = await templatePartCtrl.findOne({
      filters: { slug: baseSlug },
    })
    if (
      findedTemplatePartBySlug &&
      findedTemplatePartBySlug.id == templatePartId
    ) {
      console.log(
        '#7437s8 found templatePart with same slug: ',
        findedTemplatePartBySlug
      )
      const { slug, ...rest } = params
      return rest
    }
  }

  // if it is new templatePart need to generate new slug
  let slug = baseSlug
  let count = 1
  while (await templatePartCtrl.existSlug(slug)) {
    slug = `${baseSlug}-${count}`
    count++
  }
  console.log('#7437s8 new slug: ', slug)
  return { ...params, slug }
}
