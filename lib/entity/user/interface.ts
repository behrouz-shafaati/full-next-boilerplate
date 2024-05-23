import { Id, Model, SchemaModel } from '@/lib/entity/core/interface';
import { File } from '../file/interface';
import { ShippingAddress } from '../shippingAddress/interface';
// import { Role } from "@entity/role/interface";

type UserBase = {
  roles: string[];
  token?: string;
  mobile?: string;
  mobileVerified: boolean;
  email: string;
  emailVerified: boolean;
  password: string;
  refreshToken: string;
  firstName: string;
  lastName: string;
  name: string;
  country: string;
  state: string;
  city: string;
  address: string;
  about: string;
  image: Id;
  language: string;
  darkMode: boolean;
  active: boolean;
};

export type User = Model &
  UserBase & {
    image: File;
    shippingAddresses: ShippingAddress[];
  };

export type UserSchema = SchemaModel &
  UserBase & {
    image: Id;
  };

export type HaveAccessPayload = {
  userId?: Id;
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  path: string;
};

export type ChangePassword = {
  userId: Id;
  oldPassword: string;
  newPassword: string;
};
