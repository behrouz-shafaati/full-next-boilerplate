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
    patchSmall: String,
    patchLarge: String,
    patchMedium: String,
    srcSmall: String,
    srcMedium: String,
    srcLarge: String,
    href: String,
    width: String,
    height: String,
    target: String,
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
    attachedTo: [{ feature: String, id: String, _id: false }],
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Middleware to exclude deleted documents
fileSchema.pre('find', function (next) {
  this.where({ deleted: false })
  next()
})

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id.toHexString()
  ret.extension = ret.mimeType.split('/')[1]
  delete ret._id
  delete ret.__v
  delete ret.deleted
}

fileSchema.set('toObject', { transform })

fileSchema.set('toJSON', { transform })

export default mongoose.models?.file || model<SchemaFile>('file', fileSchema)
