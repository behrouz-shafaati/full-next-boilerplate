import mongoose from 'mongoose';
import { Types } from 'mongoose';
import { Id, Pagination, QueryFind, QueryResponse } from './interface';
import dbConnect from '@/lib/dbConnect';

// a function that recive json object, convert it to json string, the convert to json object and return it
function toObject(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}
function standardizationFilters(filters: any): any {
  if (typeof filters != 'object') return {};
  for (const [key, value] of Object.entries(filters)) {
    if (typeof value != 'string') continue;
    // for id
    if (key == 'id') {
      filters._id = value;
      delete filters.id;
    }
  }
  return filters;
}

const defaultPagination: Pagination = {
  page: 0,
  perPage: 15,
};

export default class service {
  private model: any;
  constructor(model: any) {
    this.model = model;
  }

  /**
   * Find documents in the MongoDB collection based on specified filters, pagination, and sort order.
   * @param filters - The filters to apply when querying the collection. Default is an empty object.
   * @param pagination - The pagination configuration. Default is a predefined pagination object.
   * @param sort - The sort order for the returned documents. Default is to sort by createdAt field in descending order.
   * @returns A Promise that resolves to a QueryResponse object containing the retrieved documents, pagination information, and total document count.
   */
  async find(
    filters = {},
    pagination: Pagination = defaultPagination,
    sort = { createdAt: -1 }
  ): Promise<QueryResponse<any>> {
    // Connect to the MongoDB database
    await dbConnect();
    // Standardize and update the filters
    filters = standardizationFilters(filters);

    // Calculate the skip value for pagination
    // The page start from 0
    const page: number = (pagination.page as number) - 1;
    let skip: number = page > 0 ? page * pagination.perPage : 0;

    // Add deleted:false filter to exclude deleted documents
    filters = { ...filters, deleted: false };

    // Find documents in the collection based on filters, sort order, and pagination
    // Get the total count of documents that match the filters
    const [result, totalDocuments] = await Promise.all([
      this.model.find(filters).sort(sort).skip(skip).limit(pagination.perPage),
      this.model.countDocuments(filters),
    ]);

    // Disconnect from the MongoDB database
    // mongoose.disconnect();

    // Calculate the next page value for pagination
    let nextPage: number =
      page * pagination.perPage >= totalDocuments ? 0 : page + 1;

    // Calculate the total number of pages based on the document count and pagination
    const totalPages: number = Math.ceil(totalDocuments / pagination.perPage);

    // If there are no documents or all documents are returned, set nextPage to 0
    if (!result.length || result.length == totalDocuments) nextPage = 0;

    // Return the QueryResponse object with the retrieved documents, pagination information, and total document count
    return toObject({
      data: result,
      nextPage,
      totalPages,
      totalDocuments,
    });
  }

  async findAll(
    filters = {},
    sort = { createdAt: -1 },
    populate?: string
  ): Promise<QueryResponse<any>> {
    // Connect to the MongoDB database
    await dbConnect();
    filters = { ...filters, deleted: false };
    let result: any;
    if (populate)
      result = await this.model.find(filters).populate(populate).sort(sort);
    else result = await this.model.find(filters).sort(sort);

    const totalDocuments: number = await this.model.countDocuments(filters);
    // Disconnect from the MongoDB database
    // mongoose.disconnect();
    let nextPage: number = 0;
    const totalPages: number = 1;
    return toObject({
      data: result,
      nextPage,
      totalPages,
      totalDocuments,
    });
  }

  async findById(_id: string) {
    if (!_id || _id == '') return null;
    // Connect to the MongoDB database
    await dbConnect();
    return toObject(await this.model.findById({ _id, deleted: false }));
  }
  async findOne(filters: object = {}, populate?: string) {
    // Connect to the MongoDB database
    await dbConnect();
    filters = standardizationFilters(filters);
    if (typeof filters === 'string' || filters instanceof Types.ObjectId) {
      // eslint-disable-next-line no-param-reassign
      filters = {
        _id: filters,
      };
    }
    if (populate) {
      return await this.model
        .findOne({ ...filters, deleted: false })
        .populate(populate);
    }
    return toObject(await this.model.findOne({ ...filters, deleted: false }));
  }
  async create(data: object) {
    // Connect to the MongoDB database
    await dbConnect();
    return toObject(await this.model.create(data));
    // Disconnect from the MongoDB database
    // mongoose.disconnect();
  }

  /**
   * Find one document based on the given filters and update it with the provided data.
   * @param filters - The filters to search for the document.
   * @param data - The data to update the document with.
   * @returns The updated document.
   */
  async findOneAndUpdate(filters: any, data: object) {
    // Connect to the MongoDB database
    await dbConnect();
    // Convert string or ObjectId filters to an object if necessary
    if (typeof filters === 'string' || filters instanceof Types.ObjectId) {
      // eslint-disable-next-line no-param-reassign
      filters = {
        _id: filters,
      };
    }
    // Add 'deleted' filter to exclude deleted documents
    filters = { ...filters, deleted: false };
    // Find and update the document, and return the updated document
    return toObject(
      await this.model.findOneAndUpdate(filters, data, { new: true })
    );
  }

  async updateMany(filters: any, data: object, options: object = {}) {
    // Connect to the MongoDB database
    await dbConnect();
    filters = { ...filters, deleted: false };
    return toObject(await this.model.updateMany(filters, data, options));
  }
  async countDocuments(filters: any): Promise<number> {
    // Connect to the MongoDB database
    await dbConnect();
    if (typeof filters === 'string' || filters instanceof Types.ObjectId) {
      // eslint-disable-next-line no-param-reassign
      filters = {
        _id: filters,
      };
    }
    filters = { ...filters, deleted: false };
    console.log('count filters:', filters);
    return this.model.countDocuments(filters);
  }

  async delete(ids: Id[]) {
    // Connect to the MongoDB database
    await dbConnect();
    try {
      const result: any = await this.model.updateMany(
        {
          _id: { $in: ids },
        },
        { deleted: true },
        { multi: true }
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteMany(filters: object, fullDelete = false) {
    // Connect to the MongoDB database
    await dbConnect();
    try {
      if (fullDelete) {
        console.log('#872 fullDelete filters:', filters);
        const result: any = await this.model.deleteMany(filters);
        return result;
      }
      const result: any = await this.model.updateMany(
        filters,
        { deleted: true },
        { multi: true }
      );
      return result;
    } catch (error) {
      console.log('#872 error: ', error);
    }
  }
}
