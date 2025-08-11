import { slugify } from '@/lib/utils'
import headerCtrl from './controller'

/**
 * تولید اسلاگ یکتا با بررسی دیتابیس
 */
export async function generateUniqueHeaderSlug(
  params: { slug: string; title: string },
  headerId: string = ''
): Promise<object> {
  console.log('#2ddf8 params: ', params)
  const baseSlug =
    params.slug != '' && params.slug != null
      ? slugify(params.slug)
      : slugify(params.title)
  console.log('#7437s8 baseSlug: ', baseSlug)
  // if it is update and slug doesn't change remove slug from parameters
  if (headerId !== '') {
    const findedHeaderBySlug = await headerCtrl.findOne({
      filters: { slug: baseSlug },
    })
    if (findedHeaderBySlug && findedHeaderBySlug.id == headerId) {
      console.log('#7437s8 found header with same slug: ', findedHeaderBySlug)
      const { slug, ...rest } = params
      return rest
    }
  }

  // if it is new header need to generate new slug
  let slug = baseSlug
  let count = 1
  while (await headerCtrl.existSlug(slug)) {
    slug = `${baseSlug}-${count}`
    count++
  }
  console.log('#7437s8 new slug: ', slug)
  return { ...params, slug }
}
