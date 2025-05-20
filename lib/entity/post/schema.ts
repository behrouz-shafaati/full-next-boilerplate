import mongoose, { model, Schema } from 'mongoose'
import { PostSchema } from './interface'

const postSchema = new Schema<PostSchema>(
  {
    title: { type: String, required: true },
    content: { type: String, default: '' },
    status: { type: Number, default: 1 },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const statusMap: any = {
  0: 'draft',
  1: 'publish',
}
const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
  ret.status = statusMap[ret.status]
  delete ret._id
  delete ret.__v
  delete ret.deleted
}

postSchema.set('toObject', {
  transform,
})

postSchema.set('toJSON', {
  transform,
})
export default mongoose.models.post || model<PostSchema>('post', postSchema)
