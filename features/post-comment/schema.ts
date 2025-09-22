import mongoose, { model, Schema } from 'mongoose'
import { PostCommentSchema } from './interface'

const PostCommentTranslationSchema = new Schema(
  {
    lang: { type: String, required: true }, // "fa", "en", "de", ...
    excerpt: { type: String, default: '' },
    contentJson: { type: String, default: '' },
    readingTime: { type: Number, default: 0 },
  },
  { _id: false }
)

const postCommentSchema = new Schema<PostCommentSchema>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: 'post',
      required: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'postComment',
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
    },
    authorName: { type: String, default: null },
    locale: { type: String, required: true },
    translations: [PostCommentTranslationSchema], // 👈 لیست ترجمه‌ها
    type: {
      type: String,
      enum: ['comment', 'question'],
      default: 'comment',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)
postCommentSchema
  .pre('findOne', function (next: any) {
    this.populate('author')
    this.populate('post')
    next()
  })
  .pre('find', function (next: any) {
    this.populate('author')
    this.populate('post')
    next()
  })
  .pre('findOneAndUpdate', function (next: any) {
    this.populate('author')
    this.populate('post')
    next()
  })

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
  delete ret._id
  delete ret.__v
  delete ret.deleted
}

postCommentSchema.set('toObject', {
  transform,
})

postCommentSchema.set('toJSON', {
  transform,
})
export default mongoose.models.postComment ||
  model<PostCommentSchema>('postComment', postCommentSchema)
