import { Id, Model, SchemaModel } from '@/lib/entity/core/interface';

export type File = Model & {
  title: string;
  extension: string;
  description: string;
  alt: string;
  patch: string;
  url: string;
  mimeType: string;
  size: number;
  previewPath: string;
  main: boolean;
};
export type SchemaFile = File & SchemaModel;

export type FileDetailsPayload = {
  id: Id;
  title: string;
  description: string;
  alt: string;
  main: boolean;
};

export type FileDetails = FileDetailsPayload & {
  patch: string;
  url: string;
  mimeType: string;
  size: number;
  previewPath: string;
};
