import mongoose, { model, Schema } from 'mongoose'
import { SettingsSchema } from './interface'

const InfoTranslationSchema = new Schema(
  {
    lang: { type: String, required: true }, // "fa", "en", "de", ...
    site_title: { type: String, default: '' },
    site_introduction: { type: String, default: '' },
  },
  { _id: false }
)

const FarazsmsSchema = new Schema(
  {
    farazsms_apiKey: String,
    farazsms_verifyPatternCode: String,
    farazsms_from_number: String,
  },
  { _id: false }
)

const settingsSchema = new Schema<SettingsSchema>(
  {
    type: { type: String, default: 'site-settings', unique: true }, // مهم!
    infoTranslations: [InfoTranslationSchema],
    homePageId: { type: Schema.Types.ObjectId, ref: 'page', default: null },
    commentApprovalRequired: { type: Boolean, default: true },
    emailVerificationRequired: { type: Boolean, default: false },
    mobileVerificationRequired: { type: Boolean, default: false },
    defaultHeaderId: { type: Schema.Types.ObjectId, ref: 'header' },
    favicon: {
      type: Schema.Types.ObjectId,
      ref: 'file',
      default: null,
      required: false,
    },
    mail_host: String,
    mail_port: String,
    mail_username: String,
    mail_password: String,
    desktopHeaderHeight: Number,
    tabletHeaderHeight: Number,
    mobileHeaderHeight: Number,
    farazsms: FarazsmsSchema,
    theme: {
      primaryColor: String,
      backgroundColor: String,
      darkMode: Boolean,
    },
    integrations: {
      googleAnalyticsId: String,
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
  delete ret._id
  delete ret.__v
  delete ret.deleted
}

settingsSchema.set('toObject', {
  transform,
})

settingsSchema.set('toJSON', {
  transform,
})

settingsSchema
  .pre('findOne', function (next: any) {
    this.populate('favicon')
    next()
  })
  .pre('find', function (next: any) {
    this.populate('favicon')
    next()
  })
  .pre('findOneAndUpdate', function (next: any) {
    this.populate('favicon')
    next()
  })
export default mongoose.models.settings ||
  model<SettingsSchema>('settings', settingsSchema)
