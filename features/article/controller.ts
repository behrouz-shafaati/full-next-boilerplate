import { Create, Id, QueryFind, Update } from '@/lib/entity/core/interface'
import baseController from '@/lib/entity/core/controller'
import fileCtrl from '@/lib/entity/file/controller'
import articleSchema from './schema'
import articleService from './service'
import categoryCtrl from '../category/controller'
import tagCtrl from '../tag/controller'
import {
  createArticleHref,
  getReadingTime,
  updateFileDetailsInContentJson,
} from './utils'
import { Article } from './interface'
import { Category } from '../category/interface'
import { getTranslation, slugify } from '@/lib/utils'
import { FileDetails } from '@/lib/entity/file/interface'

class controller extends baseController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the articleController class extended of the main parent class baseController.
   *
   * @param service - articleService
   *articleCtrl
   * @beta
   */
  constructor(service: any) {
    super(service)
  }

  standardizationFilters(filters: any): any {
    if (typeof filters != 'object') return {}
    for (const [key, value] of Object.entries(filters)) {
      if (key == 'categories' || key == 'tags') filters[key] = { $in: value }
      if (typeof value != 'string') continue
      if (
        key == 'userName' ||
        key == 'fullName' ||
        key == 'email' ||
        key == 'mobile'
      )
        filters[key] = { $regex: new RegExp(value, 'i') }
      if (key == 'query' && filters?.query == '') {
        delete filters.query
      } else if (key == 'query') {
        filters.$or = [
          // سرچ روی slug
          { slug: { $regex: filters.query, $options: 'i' } },

          // سرچ روی translations.title
          { 'translations.title': { $regex: filters.query, $options: 'i' } },

          // سرچ روی translations.excerpt
          { 'translations.excerpt': { $regex: filters.query, $options: 'i' } },

          // سرچ روی translations.contentJson
          {
            'translations.contentJson': {
              $regex: filters.query,
              $options: 'i',
            },
          },
        ]

        delete filters.query
      }

      if (key == 'id') {
        filters._id = value
        delete filters.id
      }
    }
    return filters
  }

  makeCleanDataBeforeSave(data: any) {
    data.image = data.image == '' ? null : data.image
    data.categories = data.categories == '' ? [] : data.categories
    const translation = getTranslation({
      translations: data.translations,
      locale: data.locale,
    })
    const json = JSON.parse(translation.contentJson)
    const plainText =
      json.content
        ?.filter((block: any) => block.type === 'paragraph')
        ?.map((block: any) =>
          block.content?.map((c: any) => c.text || '').join('')
        )
        .join('\n') || ''

    const readingTime = getReadingTime(plainText)
    return { ...data, readingTime }
  }

  async find(payload: QueryFind) {
    payload.filters = this.standardizationFilters(payload.filters)
    const result = await super.find(payload)
    return result
  }

  async create(payload: Create) {
    payload.params = this.makeCleanDataBeforeSave(payload.params)
    console.log('#389 payload:', payload)
    return super.create(payload)
  }

  async findOneAndUpdate(payload: Update) {
    payload.params = this.makeCleanDataBeforeSave(payload.params)
    return super.findOneAndUpdate(payload)
  }

  async existSlug(slug: string): Promise<boolean> {
    const count = await this.countAll({ slug })
    console.log('#7736 article count: ', count)
    if (count > 0) return true
    return false
  }

  async setFileData(contentJson: any) {
    const parsedContent = JSON.parse(contentJson)
    const content = parsedContent?.content || []
    const contentJsonSetedFileData = await Promise.all(
      content.map(async (block: any) => {
        if (block.type === 'image') {
          const image = block.attrs
          const imageFileData = await fileCtrl.findById({ id: image.id })
          return { type: 'image', attrs: imageFileData }
        }
        return block
      })
    )
    return { type: 'doc', content: contentJsonSetedFileData }
  }

  async updateContentJsonFileDetails({
    fileDetails,
  }: {
    fileDetails: FileDetails
  }) {
    const articleId = fileDetails.attachedTo[0].id
    const article = await this.findById({ id: articleId })

    const updatedArticle = updateFileDetailsInContentJson({
      article,
      fileDetails,
    })
    await this.findOneAndUpdate({
      filters: { _id: article.id },
      params: {
        translations: updatedArticle.translations,
        locale: fileDetails.locale,
      },
    })
  }

  async convertCategoriesAndTagSlugToId({
    categorySlugs,
    tagSlugs,
  }: {
    categorySlugs: string[]
    tagSlugs: string[]
  }) {
    const [categoryiesResult, tagsResult] = await Promise.all([
      categoryCtrl.find({ filters: { slug: { $in: categorySlugs } } }),
      tagCtrl.find({ filters: { slug: { $in: tagSlugs } } }),
    ])
    const categoryIds = categoryiesResult.data.map(
      (category: any) => category.id
    )
    const tagIds = tagsResult.data.map((tag: any) => tag.id)
    console.log('#categoryIds:', categoryIds)
    console.log('#tagIds:', tagIds)
    return { categoryIds, tagIds }
  }

  async getAllSlugs() {
    const result = await this.findAll({})
    return result.data.map((article: Article) => ({
      slug: createArticleHref(article),
    }))
  }

  async generateStaticParams() {
    const singlrArticleSlugs = await this.getAllSlugs() // فرض کن فقط slug برمی‌گردونه
    return singlrArticleSlugs
  }

  async generateUniqueArticleSlug(
    params: { slug: string; title: string },
    articleId: string = ''
  ): Promise<object> {
    console.log('#237s8 params: ', params)
    const baseSlug =
      params.slug != '' && params.slug != null
        ? slugify(params.slug)
        : slugify(params.title)
    console.log('#237s8 baseSlug: ', baseSlug)
    // if it is update and slug doesn't change remove slug from parameters
    if (articleId !== '') {
      const findedArticleBySlug = await articleCtrl.findOne({
        filters: { slug: baseSlug },
      })
      if (findedArticleBySlug && findedArticleBySlug.id == articleId) {
        const { slug, ...rest } = params
        return rest
      }
    }

    // if it is new article need to generate new slug
    let slug = baseSlug
    let count = 1
    while (await articleCtrl.existSlug(slug)) {
      slug = `${baseSlug}-${count}`
      count++
    }

    return { ...params, slug }
  }

  async countThisWeek() {
    const now = new Date()
    now.setHours(23, 59, 59, 999) // تا انتهای امروز

    const day = now.getDay()
    const diffToSaturday = day === 6 ? 0 : day + 1

    const firstDayOfWeek = new Date(now)
    firstDayOfWeek.setDate(now.getDate() - diffToSaturday)
    firstDayOfWeek.setHours(0, 0, 0, 0) // ساعت ۰:۰۰ شنبه

    // تعداد مقالات منتشر شده این هفته
    const countThisWeek = await this.countAll({
      status: 'published',
      publishedAt: { $gte: firstDayOfWeek, $lte: now },
    })
    return countThisWeek
  }
}

const articleCtrl = new controller(new articleService(articleSchema))
export default articleCtrl
