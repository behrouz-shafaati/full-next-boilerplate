import mongoose, { model, Schema } from 'mongoose'
import { PostSchema } from './interface'

const PostTranslationSchema = new Schema(
  {
    lang: { type: String, required: true }, // "fa", "en", "de", ...
    title: { type: String, required: true },
    excerpt: { type: String, default: '' },
    contentJson: { type: String, default: '' },
    readingTime: { type: Number, default: 0 },
  },
  { _id: false }
)

const postSchema = new Schema<PostSchema>(
  {
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
    translations: [PostTranslationSchema], // 👈 لیست ترجمه‌ها
    mainCategory: {
      type: Schema.Types.ObjectId,
      ref: 'category',
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'category',
        default: [],
      },
    ],
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'tag',
        default: [],
      },
    ],
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
    this.populate('tags')
    this.populate('mainCategory')
    this.populate('categories')
    // this.populate({
    //   path: 'tags',
    //   select: 'title slug -_id', // فقط name و slug رو بیار بدون _id
    // })
    next()
  })
  .pre('find', function (next: any) {
    this.populate('image')
    this.populate('user')
    this.populate('tags')
    this.populate('mainCategory')
    this.populate('categories')
    // this.populate({
    //   path: 'tags',
    //   select: 'title slug -_id', // فقط name و slug رو بیار بدون _id
    // })
    next()
  })

const transform = (doc: any, ret: any, options: any) => {
  const category = ret?.categories[0] || { slug: '' }
  ret.id = ret._id?.toHexString()
  ret.link = `${category.slug}/${ret.slug}`
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
