import mongoose, { model, Schema } from 'mongoose'
import { HeaderSchema } from './interface'

const headerSchema = new Schema<HeaderSchema>(
  {
    title: { type: String, required: false },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
      required: true,
    },
    content: {
      type: Schema.Types.Mixed, // whole Header structure as JSON
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

headerSchema
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

headerSchema.set('toObject', {
  transform,
})

headerSchema.set('toJSON', {
  transform,
})
export default mongoose.models.Header ||
  model<HeaderSchema>('Header', headerSchema)
