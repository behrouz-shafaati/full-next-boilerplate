import mongoose, { model, Schema } from 'mongoose'
import { ArticleCommentSchema } from './interface'

const ArticleCommentTranslationSchema = new Schema(
  {
    lang: { type: String, required: true }, // "fa", "en", "de", ...
    excerpt: { type: String, default: '' },
    contentJson: { type: String, default: '' },
    readingTime: { type: Number, default: 0 },
  },
  { _id: false }
)

const articleCommentSchema = new Schema<ArticleCommentSchema>(
  {
    // =================> populate with article field make unfiniti loop
    article: {
      type: Schema.Types.ObjectId,
      ref: 'article',
      required: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'articleComment',
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
    translations: [ArticleCommentTranslationSchema], // 👈 لیست ترجمه‌ها
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

articleCommentSchema
  .pre('findOne', function (next: any) {
    this.populate('author')
    this.populate({
      path: 'article',
      select: 'id href translations', // فقط translations رو بیار
      transform: (doc: any) => {
        if (!doc) return doc
        doc = doc.toObject()

        // 🔻 محدود کردن محتوای translations
        doc.translations = (doc?.translations || []).map((t: any) => ({
          lang: t.lang,
          title: t.title,
        }))

        return doc
      },
    })
    next()
  })
  .pre('find', function (next: any) {
    this.populate('author')
    this.populate({
      path: 'article',
      select: 'id href translations', // فقط translations رو بیار
      transform: (doc: any) => {
        if (!doc) return doc
        doc = doc.toObject()

        // 🔻 محدود کردن محتوای translations
        doc.translations = (doc?.translations || []).map((t: any) => ({
          lang: t.lang,
          title: t.title,
        }))

        return doc
      },
    })
    next()
  })
  .pre('findOneAndUpdate', function (next: any) {
    this.populate('author')
    this.populate({
      path: 'article',
      select: 'id href translations', // فقط translations رو بیار
      transform: (doc: any) => {
        if (!doc) return doc
        doc = doc.toObject()

        // 🔻 محدود کردن محتوای translations
        doc.translations = (doc?.translations || []).map((t: any) => ({
          lang: t.lang,
          title: t.title,
        }))

        return doc
      },
    })
    next()
  })

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
  delete ret._id
  delete ret.__v
  delete ret.deleted
}

articleCommentSchema.set('toObject', {
  transform,
})

articleCommentSchema.set('toJSON', {
  transform,
})
export default mongoose.models.articleComment ||
  model<ArticleCommentSchema>('articleComment', articleCommentSchema)
