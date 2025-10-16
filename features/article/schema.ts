import mongoose, { model, Schema } from 'mongoose'
import { ArticleSchema } from './interface'
import { createArticleHref } from './utils'

const ArticleTranslationSchema = new Schema(
  {
    lang: { type: String, required: true }, // "fa", "en", "de", ...
    title: { type: String, required: true },
    seoTitle: { type: String, required: true },
    excerpt: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    jsonLd: { type: String, default: '' },
    contentJson: { type: String, default: '' },
    readingTime: { type: Number, default: 0 },
  },
  { _id: false }
)

const articleSchema = new Schema<ArticleSchema>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
      required: true,
    },
    author: {
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
    translations: [ArticleTranslationSchema], // 👈 لیست ترجمه‌ها
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
    publishedAt: { type: Date, default: null }, // تاریخ انتشار
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// تعداد کامنت‌ها (virtual)
articleSchema.virtual('commentsCount', {
  ref: 'articleComment', // نام collection
  localField: '_id', // فیلد محلی (Article._id)
  foreignField: 'article', // فیلد مرتبط در ArticleComment
  count: true, // مهم! فقط تعداد را برمی‌گرداند
})

// const autoPopulate = function (next) {
//   this.populate('image')
//   this.populate('user')
//   this.populate({
//     path: 'tags',
//     select: 'name slug',
//   })
//   next()
// }

articleSchema
  .pre('findOne', function (next: any) {
    this.populate('image')
      .populate('user')
      .populate('author')
      .populate('tags')
      .populate('mainCategory')
      .populate('categories')
      .populate('commentsCount')
    // this.populate({
    //   path: 'tags',
    //   select: 'title slug -_id', // فقط name و slug رو بیار بدون _id
    // })
    next()
  })
  .pre('find', function (next: any) {
    this.populate('image')
      .populate('user')
      .populate('author')
      .populate('tags')
      .populate('mainCategory')
      .populate('categories')
      .populate('commentsCount')
    // this.populate({
    //   path: 'tags',
    //   select: 'title slug -_id', // فقط name و slug رو بیار بدون _id
    // })
    next()
  })
  .pre('findOneAndUpdate', function (next: any) {
    this.populate('image')
      .populate('user')
      .populate('author')
      .populate('tags')
      .populate('mainCategory')
      .populate('categories')
      .populate('commentsCount')
    // this.populate({
    //   path: 'tags',
    //   select: 'title slug -_id', // فقط name و slug رو بیار بدون _id
    // })
    next()
  })

const transform = (doc: any, ret: any, options: any) => {
  const category = ret?.categories[0] || { slug: '' }
  ret.id = ret._id?.toHexString()
  // ret.link = `${category.slug}/${ret.slug}`
  ret.href = createArticleHref(ret)
  delete ret._id
  delete ret.__v
  delete ret.deleted
}

articleSchema.set('toObject', {
  transform,
  virtuals: true,
})

articleSchema.set('toJSON', {
  transform,
  virtuals: true,
})

export default mongoose.models.article ||
  model<ArticleSchema>('article', articleSchema)
