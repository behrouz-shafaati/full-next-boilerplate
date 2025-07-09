import mongoose, { model, Schema } from 'mongoose'
import { SettingsSchema } from './interface'

const settingsSchema = new Schema<SettingsSchema>(
  {
    type: { type: String, default: 'site-settings', unique: true }, // مهم!
    homePageId: { type: Schema.Types.ObjectId, ref: 'page' },
    primaryMenuId: String,
    footerMenuId: String,
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
export default mongoose.models.settings ||
  model<SettingsSchema>('settings', settingsSchema)
