import { Create, Id, QueryFind, Update } from '@/lib/entity/core/interface'
import baseController from '@/lib/entity/core/controller'
import fileCtrl from '@/lib/entity/file/controller'
import postSchema from './schema'
import postService from './service'

class controller extends baseController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the postController class extended of the main parent class baseController.
   *
   * @param service - postService
   *postCtrl
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
              $concat: ['$title', '$content'],
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

  makeCleanDataBeforeSave(data: any) {
    data.image = data.image == '' ? null : data.image
    data.category = data.category == '' ? null : data.category
    return data
  }

  async find(payload: QueryFind) {
    console.log('#3033 payload:', payload)
    payload.filters = this.standardizationFilters(payload.filters)
    console.log('#3034 payload:', payload)
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
    console.log('#3323 payload:', payload)
    return super.findOneAndUpdate(payload)
  }

  async existSlug(slug: string): Promise<boolean> {
    const count = await this.countAll({ slug })
    console.log('#7736 post count: ', count)
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
}

const postCtrl = new controller(new postService(postSchema))
export default postCtrl
