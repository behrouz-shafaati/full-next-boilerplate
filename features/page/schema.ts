import mongoose, { model, Schema } from 'mongoose'
import { PageSchema } from './interface'

const pageSchema = new Schema<PageSchema>(
  {
    title: { type: String, required: false },
    slug: { type: String, required: false, default: null },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
      required: true,
    },
    content: {
      type: Schema.Types.Mixed, // whole page structure as JSON
      required: true,
    },
    type: {
      type: String,
      enum: ['page', 'template'],
      default: 'page',
    },
    templateFor: { type: String, required: false, unique: false },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

pageSchema
  .pre('findOne', function (next: any) {
    this.populate('user')
    next()
  })
  .pre('find', function (next: any) {
    this.populate('user')
    next()
  })

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
  delete ret._id
  delete ret.__v
  delete ret.deleted
}

pageSchema.set('toObject', {
  transform,
})

pageSchema.set('toJSON', {
  transform,
})
export default mongoose.models.page || model<PageSchema>('page', pageSchema)
