'use client'
import * as z from 'zod'
import { useActionState, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  User as UserIcon,
  Mail as MailIcon,
  Smartphone as PhoneIcon,
  ShieldQuestionIcon,
  KeyRound,
  Trash,
} from 'lucide-react'
// import { Separator } from "@/components/ui/separator";
import { Heading } from '@/components/ui/heading'
// import FileUpload from "@/components/FileUpload";
import { useToast } from '../ui/use-toast'
import roleCtrl from '@/lib/entity/role/controller'
import { createUser, deleteUser, updateUser } from '@/lib/entity/user/actions'
import Text from '../form-fields/text'
import { SubmitButton } from '../form-fields/submit-button'
import MultipleSelector, { Option } from '../form-fields/multiple-selector'
import { AlertModal } from '../modal/alert-modal'
import ProfileUpload from '../form-fields/profile-upload'
import { Role } from '@/lib/entity/role/interface'
// import FileUpload from "../file-upload";

interface ProductFormProps {
  initialData: any | null
}

export const UserForm: React.FC<ProductFormProps> = ({ initialData: user }) => {
  const initialState = { message: null, errors: {} }
  const actionHandler = user
    ? updateUser.bind(null, String(user.id))
    : createUser
  const [state, dispatch] = useActionState(actionHandler as any, initialState)

  const allRoles: Role[] = roleCtrl.getRoles()
  const roleOptions: Option[] = allRoles.map((role) => ({
    label: role.title,
    value: role.slug,
  }))
  const userRoles: Option[] = user?.roles?.map((slug: string) => {
    const findedRole: Role | undefined = allRoles.find(
      (role: Role) => role.slug == slug
    )
    return { label: findedRole?.title, value: slug }
  })

  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)
  const title = user ? 'ویرایش کاربر' : 'افزودن کاربر'
  const description = user ? 'ویرایش یک کاربر' : 'افزودن یک کاربر'
  const toastMessage = user ? 'کاربر بروزرسانی شد' : 'کاربر اضافه شد'
  const action = user ? 'ذخیره تغییرات' : 'ذخیره'

  const onDelete = async () => {
    try {
      setLoading(true)
      DeleteUser(user?.id)
    } catch (error: any) {}
  }

  useEffect(() => {
    if (state.message && state.message !== null)
      toast({
        variant: 'destructive',
        title: '',
        description: state.message,
      })
  }, [state, toast])

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {user && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      {/* <Separator /> */}
      <form action={dispatch} className="space-y-8 w-full">
        <ProfileUpload title="" name="image" defaultValue={user?.image} />
        <div className="md:grid md:grid-cols-3 gap-8">
          {/* First Name */}
          <Text
            title="نام"
            name="firstName"
            defaultValue={user?.firstName || ''}
            placeholder="نام"
            state={state}
            icon={<UserIcon className="w-4 h-4" />}
          />
          {/* Last Name */}
          <Text
            title="نام خانوادگی"
            name="lastName"
            defaultValue={user?.lastName}
            placeholder="نام خانوادگی"
            state={state}
            icon={<UserIcon className="w-4 h-4" />}
          />
          {/* Email */}
          <Text
            title="ایمیل"
            name="email"
            defaultValue={user?.email}
            placeholder="ایمیل"
            state={state}
            icon={<MailIcon className="w-4 h-4" />}
          />
          {/* userName */}
          <Text
            title="نام کاربری"
            name="userName"
            defaultValue={user?.userName}
            placeholder="نام کاربری"
            state={state}
            icon={<MailIcon className="w-4 h-4" />}
          />
          {/* Mobile */}
          <Text
            title="موبایل"
            name="mobile"
            defaultValue={user?.mobile}
            placeholder="موبایل"
            state={state}
            icon={<PhoneIcon className="w-4 h-4" />}
          />
          {/* Roles */}
          <MultipleSelector
            title="نقش"
            name="roles"
            defaultValues={userRoles}
            placeholder="نقش های کاربر را انتخاب کنید"
            state={state}
            defaultSuggestions={roleOptions}
            icon={ShieldQuestionIcon}
          />
          {/* Password */}
          <Text
            title="رمز ورود"
            name="password"
            type="password"
            placeholder="رمز ورود"
            description={
              user &&
              'اگر می خواهید رمز ورود کاربر را تغییر دهید، این فیلد را پر کنید.'
            }
            state={state}
            icon={<KeyRound className="w-4 h-4" />}
          />
        </div>
        <SubmitButton />
      </form>
    </>
  )
}

export function DeleteUser(id: string) {
  const deleteUserWithId = deleteUser.bind(null, id)
  deleteUserWithId()
}
