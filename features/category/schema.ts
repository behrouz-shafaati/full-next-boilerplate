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
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    image: { type: Schema.Types.ObjectId, ref: 'file' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

categorySchema
  .pre('save', function (next) {
    if (this.parent?.toString() === this._id?.toString()) {
      return next(new Error('A category cannot be its own parent.'))
    }
    next()
  })
  .pre('findOne', function (next: any) {
    this.populate('parent')
    this.populate('image')
    this.where({ deleted: false })
    next()
  })
  .pre('find', function (next: any) {
    this.populate('parent')
    this.populate('image')
    this.where({ deleted: false })
    next()
  })

// ایندکس‌ها برای بهبود عملکرد
categorySchema.index({ title: 1 })
categorySchema.index({ status: 1 })

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
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
