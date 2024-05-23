import mongoose, { Schema, model } from 'mongoose';
import { SchemaFile } from './interface';

const fileSchema = new Schema<SchemaFile>(
  {
    title: String,
    description: String,
    patch: String,
    alt: String,
    url: String,
    previewPath: String,
    mimeType: String,
    size: Number,
    main: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

fileSchema.set('toObject', {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString();
    ret.extension = ret.mimeType.split('/')[1];
    delete ret._id;
    delete ret.__v;
  },
});

fileSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id.toHexString();
    ret.extension = ret.mimeType.split('/')[1];
    delete ret._id;
    delete ret.__v;
    delete ret.deleted;
  },
});

export default mongoose.models?.file || model<SchemaFile>('file', fileSchema);
