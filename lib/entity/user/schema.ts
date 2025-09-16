import { hashPassword } from '@/lib/utils'
import mongoose, { Schema, model } from 'mongoose'
import { UserSchema } from '@/lib/entity/user/interface'

const userSchema = new Schema<UserSchema>(
  {
    roles: { type: [String], required: true },
    mobile: { type: String, required: false, unique: true },
    mobileVerified: { type: Boolean, default: false },
    email: { type: String, required: false, unique: true },
    emailVerified: { type: Boolean, default: false },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    country: String,
    state: String,
    city: String,
    address: String,
    about: String,
    image: {
      type: Schema.Types.ObjectId,
      ref: 'file',
      default: null,
      required: false,
    },
    language: String,
    darkMode: Boolean,
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

userSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  mobile: 'text',
})

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password)
  }
  next()
})

userSchema
  .pre('findOne', function (next: any) {
    this.populate('image')
    next()
  })
  .pre('find', function (next: any) {
    this.populate('image')
    next()
  })

const transform = (doc: any, ret: any, options: any) => {
  ret.id = ret._id?.toHexString()
  ret.name =
    ret.firstName && ret.lastName
      ? `${ret.firstName} ${ret.lastName}`
      : ret.email
  delete ret._id
  delete ret.__v
  // delete ret.password;
  delete ret.deleted
}

userSchema.set('toObject', {
  transform,
})

userSchema.set('toJSON', {
  transform,
})

export default mongoose.models?.user || model<UserSchema>('user', userSchema)
