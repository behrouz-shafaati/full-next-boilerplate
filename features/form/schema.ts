import mongoose, { model, Schema } from 'mongoose'
import { FormSchema } from './interface'

const FieldSchema = new Schema(
  {
    label: { type: String, required: true }, // متن نمایشی فیلد
    name: { type: String, required: true }, // name فیلد در HTML
    type: {
      type: String,
      enum: [
        'text',
        'email',
        'textarea',
        'select',
        'checkbox',
        'radio',
        'number',
        'date',
      ],
      required: true,
    },
    options: [String], // برای select یا radio
    required: { type: Boolean, default: false },
    placeholder: String,
    defaultValue: String,
  },
  { _id: false }
)

const TranslationSchema = new Schema(
  {
    lang: { type: String, required: true }, // "fa", "en", "de", ...
    content: {
      type: Schema.Types.Mixed, // whole page structure as JSON
      required: true,
    },
    fields: { type: [FieldSchema] },
    successMessage: { type: String, default: '' },
  },
  { _id: false }
)

const formSchema = new Schema<FormSchema>(
  {
    title: { type: String, required: false },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
      required: true,
    },
    translations: [TranslationSchema],
    status: {
      type: String,
      enum: ['deactive', 'active'],
      default: 'active',
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// formSchema
//   .pre('findOne', function (next: any) {
//     this.populate('user')
//     next()
//   })
//   .pre('find', function (next: any) {
//     this.populate('user')
//     next()
//   })

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
  delete ret._id
  delete ret.__v
  delete ret.deleted
}

formSchema.set('toObject', {
  transform,
})

formSchema.set('toJSON', {
  transform,
})
export default mongoose.models.Form || model<FormSchema>('Form', formSchema)
