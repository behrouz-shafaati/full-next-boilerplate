import { slugify } from '@/lib/utils'
import pageCtrl from './controller'

/**
 * تولید اسلاگ یکتا با بررسی دیتابیس
 */
export async function generateUniquePageSlug(
  params: { slug: string; title: string },
  pageId: string = ''
): Promise<object> {
  console.log('#2ddf8 params: ', params)
  const baseSlug =
    params.slug != '' && params.slug != null
      ? slugify(params.slug)
      : slugify(params.title)
  console.log('#7437s8 baseSlug: ', baseSlug)
  // if it is update and slug doesn't change remove slug from parameters
  if (pageId !== '') {
    const findedPageBySlug = await pageCtrl.findOne({
      filters: { slug: baseSlug },
    })
    if (findedPageBySlug && findedPageBySlug.id == pageId) {
      console.log('#7437s8 found page with same slug: ', findedPageBySlug)
      const { slug, ...rest } = params
      return rest
    }
  }

  // if it is new page need to generate new slug
  let slug = baseSlug
  let count = 1
  while (await pageCtrl.existSlug(slug)) {
    slug = `${baseSlug}-${count}`
    count++
  }
  console.log('#7437s8 new slug: ', slug)
  return { ...params, slug }
}
