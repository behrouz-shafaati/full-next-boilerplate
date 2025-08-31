import { Create, Id, QueryFind, Update } from '@/lib/entity/core/interface'
import baseController from '@/lib/entity/core/controller'
import templateSchema from './schema'
import templateService from './service'
import settingsCtrl from '../settings/controller'
import categoryCtrl from '../category/controller'

class controller extends baseController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the templateController class extended of the main parent class baseController.
   *
   * @param service - templateService
   *templateCtrl
   * @beta
   */
  constructor(service: any) {
    super(service)
  }

  standardizationFilters(filters: any): any {
    if (typeof filters != 'object') return {}
    for (const [key, value] of Object.entries(filters)) {
      if (typeof value != 'string') continue
      if (
        key == 'userName' ||
        key == 'fullName' ||
        key == 'email' ||
        key == 'mobile'
      )
        filters[key] = { $regex: new RegExp(value, 'i') }
      else if (key == 'query' && filters?.query == '') {
        delete filters.query
      } else if (key == 'query') {
        filters.$expr = {
          $regexMatch: {
            input: {
              $concat: ['$title', '$description'],
            },
            regex: filters.query,
            options: 'i',
          },
        }
        delete filters.query
      } else if (key == 'templateFor') {
      }

      if (key == 'id') {
        filters._id = value
        delete filters.id
      }
    }
    return filters
  }

  async find(payload: QueryFind) {
    payload.filters = this.standardizationFilters(payload.filters)
    const result = await super.find(payload)
    return result
  }

  async create(payload: Create) {
    return super.create(payload)
  }

  async findOneAndUpdate(payload: Update) {
    return super.findOneAndUpdate(payload)
  }

  async existSlug(slug: string): Promise<boolean> {
    const count = await this.countAll({ slug })
    console.log('#7d736 Template count: ', count)
    if (count > 0) return true
    return false
  }

  /**
   * Automatic template detection based on input slug
   * @param param0 Object: {slug: string}
   * @returns
   */

  async getTemplate({ slug }: getTemplateProp) {
    let categoriesTemplateResult
    if (slug == '') return null
    switch (slug) {
      case 'archive': // آرشیو مقالات
        const [archiveTemplateResult] = await Promise.all([
          this.find({ filters: { templateFor: 'archive', status: 'active' } }),
        ])
        if (archiveTemplateResult.data[0] != undefined)
          return archiveTemplateResult.data[0]
        break
      case 'categories': // برای هر نوع دسته بندی
        ;[categoriesTemplateResult] = await Promise.all([
          this.find({
            filters: { templateFor: 'categories', status: 'active' },
          }),
        ])
        if (categoriesTemplateResult.data[0] != undefined)
          return categoriesTemplateResult.data[0]
        break
      case 'blog': // وبلاگ
        const [blogTemplateResult] = await Promise.all([
          this.find({ filters: { templateFor: 'blog', status: 'active' } }),
        ])
        if (blogTemplateResult.data[0] != undefined)
          return blogTemplateResult.data[0]
        break
      case 'post': // مقاله تکی
        const [postTemplateResult] = await Promise.all([
          this.find({ filters: { templateFor: 'post', status: 'active' } }),
        ])
        if (postTemplateResult.data[0] != undefined)
          return postTemplateResult.data[0]
        break
      default:
        // بررسی کند که یک دسته بندی خاص اگر هست قالب آن را برگرداند
        const categoryResult = await categoryCtrl.find({ filters: { slug } })
        if (categoryResult) {
          const [categoryTemplateResult] = await Promise.all([
            this.find({
              filters: {
                templateFor: `category-${categoryResult.data[0]?.id}`,
                status: 'active',
              },
            }),
          ])
          if (
            categoryTemplateResult.data[0] != undefined &&
            categoryTemplateResult.data.length
          )
            return categoryTemplateResult.data[0]
        }
        // اگر این دسته قالب مخصوصی نداشت از قالب عمومی برای تمام دسته ها استفاده شود
        ;[categoriesTemplateResult] = await Promise.all([
          this.find({
            filters: { templateFor: 'categories', status: 'active' },
          }),
        ])
        if (categoriesTemplateResult.data[0] != undefined)
          return categoriesTemplateResult.data[0]
    }

    // در غیر این صورت قالب عمومی سایت برگردد
    const [allPageTemplateResult] = await Promise.all([
      this.find({ filters: { templateFor: 'allPages', status: 'active' } }),
    ])
    console.log(
      '#2 allPageTemplateResult.data[0]:',
      allPageTemplateResult.data[0]
    )
    if (allPageTemplateResult.data[0] != undefined)
      return allPageTemplateResult.data[0]
    return null
  }
}

type getTemplateProp = {
  slug: 'allPages' | 'blog' | 'categories' | 'archive' | 'post' | 'category'
}

const templateCtrl = new controller(new templateService(templateSchema))
export default templateCtrl
