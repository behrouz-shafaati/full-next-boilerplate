import mongoose, { model, Schema } from 'mongoose'
import { MenuSchema, MenuItem } from './interface'

// MenuItem sub-schema
const MenuItemSchema = new Schema<MenuItem>({
  label: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String, required: false },
  subMenu: [
    /* 🔧 Recursive reference */
  ],
})

MenuItemSchema.add({
  subMenu: [MenuItemSchema],
})

const menuSchema = new Schema<MenuSchema>(
  {
    title: { type: String, required: true },
    items: [MenuItemSchema],
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

menuSchema.set('toObject', {
  transform,
})

menuSchema.set('toJSON', {
  transform,
})
export default mongoose.models.menu || model<MenuSchema>('menu', menuSchema)
