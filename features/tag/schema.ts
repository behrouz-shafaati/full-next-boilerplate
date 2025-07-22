import mongoose, { model, Schema } from 'mongoose'
import { TagSchema } from './interface'

const tagSchema = new Schema<TagSchema>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    image: { type: Schema.Types.ObjectId, ref: 'file' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

tagSchema
  .pre('findOne', function (next: any) {
    this.populate('image')
    this.where({ deleted: false })
    next()
  })
  .pre('find', function (next: any) {
    this.populate('image')
    this.where({ deleted: false })
    next()
  })

// ایندکس‌ها برای بهبود عملکرد
tagSchema.index({ title: 1 })
tagSchema.index({ status: 1 })

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
  delete ret._id
  delete ret.__v
  delete ret.deleted
}

tagSchema.set('toObject', {
  transform,
})

tagSchema.set('toJSON', {
  transform,
})
export default mongoose.models.tag || model<TagSchema>('tag', tagSchema)
