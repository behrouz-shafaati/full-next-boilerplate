import { Create, Id, QueryFind, Update } from '@/lib/entity/core/interface'
import baseController from '@/lib/entity/core/controller'
import pageSchema from './schema'
import pageService from './service'
import settingsCtrl from '../settings/controller'
import { Page } from './interface'
import categoryCtrl from '../category/controller'

class controller extends baseController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the pageController class extended of the main parent class baseController.
   *
   * @param service - pageService
   *pageCtrl
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
      if (key == 'query' && filters?.query == '') {
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

  async getHomePage() {
    const settings = await settingsCtrl.find({
      filters: { type: 'site-settings' },
    })
    console.log('#2346 settings.data: ', settings.data[0])
    const homePage = await this.findById({ id: settings.data[0].homePageId })
    console.log('#2346 HomePage: ', homePage)
    return homePage
  }

  async existSlug(slug: string): Promise<boolean> {
    const count = await this.countAll({ slug })
    console.log('#7d736 page count: ', count)
    if (count > 0) return true
    return false
  }

  async getAllSlugs(): Promise<{ slug: string }[]> {
    const result = await this.findAll({})
    return result.data.map((page: Page) => ({ slug: page.slug }))
  }

  async generateStaticParams() {
    const pageSlugs = await this.getAllSlugs() // فرض کن فقط slug برمی‌گردونه
    const categorySlug = await categoryCtrl.getAllSlugs()
    return [...pageSlugs, ...categorySlug]
  }
}

const pageCtrl = new controller(new pageService(pageSchema))
export default pageCtrl
