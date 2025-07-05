import { Create, Id, QueryFind, Update } from '@/lib/entity/core/interface'
import baseController from '@/lib/entity/core/controller'
import menuSchema from './schema'
import menuService from './service'

class controller extends baseController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the menuController class extended of the main parent class baseController.
   *
   * @param service - menuService
   *menuCtrl
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
              $concat: ['$label', '$description'],
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

  prepareDataForSave(data: any) {
    data.items = JSON.parse(data.itemsJson)
    return data
  }

  async find(payload: QueryFind) {
    console.log('#3008 payload:', payload)
    payload.filters = this.standardizationFilters(payload.filters)
    console.log('#3009 payload:', payload)
    const result = await super.find(payload)
    console.log('#3010 payload result:', result)
    return result
  }

  async create(payload: Create) {
    console.log('#3018 payload crearte menu:', payload)
    payload.params = this.prepareDataForSave(payload.params)
    console.log('#3010 payload crearte menu:', payload)
    return super.create(payload)
  }

  async findOneAndUpdate(payload: Update) {
    console.log('#30sss11 payload crearte menu:', payload)
    payload.params = this.prepareDataForSave(payload.params)
    console.log('#30sss12 payload crearte menu:', payload)
    return super.findOneAndUpdate(payload)
  }
}

const menuCtrl = new controller(new menuService(menuSchema))
export default menuCtrl
