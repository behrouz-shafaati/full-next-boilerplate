import mongoose, { model, Schema } from 'mongoose'
import { CategorySchema } from './interface'

const categorySchema = new Schema<CategorySchema>(
  {
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      default: null,
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    image: { type: Schema.Types.ObjectId, ref: 'file' },
    status: { type: Number, default: 1 },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

categorySchema
  .pre('findOne', function (next: any) {
    this.populate('parent')
    next()
  })
  .pre('find', function (next: any) {
    this.populate('parent')
    next()
  })

const statusMap: any = {
  0: 'inactive',
  1: 'active',
  2: 'stop_sell',
}
const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
  ret.status = statusMap[ret.status]
  delete ret._id
  delete ret.__v
  delete ret.deleted
}

categorySchema.set('toObject', {
  transform,
})

categorySchema.set('toJSON', {
  transform,
})
export default mongoose.models.category ||
  model<CategorySchema>('category', categorySchema)
