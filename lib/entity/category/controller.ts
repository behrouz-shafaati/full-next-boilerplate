import { Create, Id, QueryFind, Update } from '@/lib/entity/core/interface';
import baseController from '@/lib/entity/core/controller';
import categorySchema from './schema';
import categoryService from './service';

class controller extends baseController {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the categoryController class extended of the main parent class baseController.
   *
   * @param service - categoryService
   *categoryCtrl
   * @beta
   */
  constructor(service: any) {
    super(service);
  }

  standardizationFilters(filters: any): any {
    if (typeof filters != 'object') return {};
    for (const [key, value] of Object.entries(filters)) {
      if (typeof value != 'string') continue;
      if (
        key == 'userName' ||
        key == 'fullName' ||
        key == 'email' ||
        key == 'mobile'
      )
        filters[key] = { $regex: new RegExp(value, 'i') };
      if (key == 'query' && filters?.query == '') {
        delete filters.query;
      } else if (key == 'query') {
        filters.$expr = {
          $regexMatch: {
            input: {
              $concat: ['$title', '$description'],
            },
            regex: filters.query,
            options: 'i',
          },
        };
        delete filters.query;
      }

      if (key == 'id') {
        filters._id = value;
        delete filters.id;
      }
    }
    return filters;
  }

  async find(payload: QueryFind) {
    console.log('#3008 payload:', payload);
    payload.filters = this.standardizationFilters(payload.filters);
    console.log('#3009 payload:', payload);
    const result = await super.find(payload);
    console.log('#3010 payload result:', result);
    return result;
  }

  async create(payload: Create) {
    console.log('#385 payload:', payload);
    payload.params.parentId == 'null' ? '' : payload.params.parentId;
    return super.create(payload);
  }

  async findOneAndUpdate(payload: Update) {
    payload.params.parentId =
      payload.params.parentId == 'null' ? null : payload.params.parentId;

    console.log('#3326 payload:', payload);
    return super.findOneAndUpdate(payload);
  }
}

const categoryCtrl = new controller(new categoryService(categorySchema));
export default categoryCtrl;
