import mongoose, { Schema, model } from 'mongoose'
import { SchemaFile } from './interface'

const FileTranslationSchema = new Schema(
  {
    lang: { type: String, required: false, default: null }, // "fa", "en", "de", ...
    title: { type: String, required: true },
    description: { type: String, default: '' },
    alt: String,
  },
  { _id: false }
)

const fileSchema = new Schema<SchemaFile>(
  {
    translations: [FileTranslationSchema], // 👈 لیست ترجمه‌ها
    patch: String,
    src: String,
    href: String,
    previewPath: String,
    mimeType: String,
    size: Number,
    main: { type: Boolean, default: false },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
      required: true,
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Middleware to exclude deleted documents
fileSchema.pre('find', function (next) {
  this.where({ deleted: false })
  next()
})

fileSchema.set('toObject', {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString()
    ret.extension = ret.mimeType.split('/')[1]
    delete ret._id
    delete ret.__v
  },
})

fileSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString()
    ret.extension = ret.mimeType.split('/')[1]
    delete ret._id
    delete ret.__v
    delete ret.deleted
  },
})

export default mongoose.models?.file || model<SchemaFile>('file', fileSchema)
