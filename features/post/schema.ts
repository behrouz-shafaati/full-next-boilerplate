import mongoose, { model, Schema } from 'mongoose'
import { PostSchema } from './interface'

const postSchema = new Schema<PostSchema>(
  {
    title: { type: String, required: true },
    excerpt: { type: String, default: '' },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
      required: true,
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: 'file',
      default: null,
      required: false,
    },
    slug: { type: String, required: true, unique: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      required: false,
      default: null,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'tag',
        default: [],
      },
    ],
    contentJson: { type: String, default: '' },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// const autoPopulate = function (next) {
//   this.populate('image')
//   this.populate('user')
//   this.populate('category')
//   this.populate({
//     path: 'tags',
//     select: 'name slug',
//   })
//   next()
// }

postSchema
  .pre('findOne', function (next: any) {
    this.populate('image')
    this.populate('user')
    this.populate('category')
    this.populate('tags')
    // this.populate({
    //   path: 'tags',
    //   select: 'title slug -_id', // فقط name و slug رو بیار بدون _id
    // })
    next()
  })
  .pre('find', function (next: any) {
    this.populate('image')
    this.populate('user')
    this.populate('category')
    this.populate('tags')
    // this.populate({
    //   path: 'tags',
    //   select: 'title slug -_id', // فقط name و slug رو بیار بدون _id
    // })
    next()
  })

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
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
