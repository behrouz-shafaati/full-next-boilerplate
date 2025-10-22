'use client'
import { Suspense, useActionState, useEffect, useState } from 'react'
import { signUpAction } from '@/features/user/actions'
import Link from 'next/link'
import { toast } from '@/components/ui/use-toast'
import Text from '@/components/form-fields/text'
import { KeyRound, MailIcon, PhoneIcon, UserIcon } from 'lucide-react'
import Password from '@/components/form-fields/password'
import { SubmitButton } from '@/components/form-fields/submit-button'
import { ActionsState } from '@/types'

function UserAuthFormComponent() {
  const initialState: ActionsState = {
    message: null,
    errors: {},
    success: false,
  }
  const [loading, setLoading] = useState(false)
  const [state, dispatch] = useActionState(signUpAction as any, initialState)

  useEffect(() => {
    if (state.message && state.message !== null)
      toast({
        variant: state.success ? 'default' : 'destructive',
        title: '',
        description: state.message,
      })
  }, [state])

  return (
    <>
      <form action={dispatch} className="space-y-2 w-full">
        {/* First Name */}
        <Text
          title="نام"
          name="firstName"
          defaultValue={state.values?.firstName || ''}
          placeholder="نام"
          state={state}
          icon={<UserIcon className="w-4 h-4" />}
        />
        {/* Last Name */}
        <Text
          title="نام خانوادگی"
          name="lastName"
          defaultValue={state.values?.lastName || ''}
          placeholder="نام خانوادگی"
          state={state}
          icon={<UserIcon className="w-4 h-4" />}
        />
        {/* Email */}
        <Text
          title="ایمیل"
          name="email"
          defaultValue={state.values?.email || ''}
          placeholder="ایمیل"
          state={state}
          icon={<MailIcon className="w-4 h-4" />}
        />
        {/* Mobile */}
        <Text
          title="موبایل"
          name="mobile"
          defaultValue={state.values?.mobile || ''}
          placeholder="موبایل"
          state={state}
          icon={<PhoneIcon className="w-4 h-4" />}
        />
        {/* Password */}
        <Password
          autoComplete="off"
          title="رمز ورود"
          name="password"
          placeholder="******"
          defaultValue={state.values?.password || ''}
          description={''}
          state={state}
          icon={<KeyRound className="w-4 h-4" />}
        />
        {/* Confirm Password Field */}
        <Password
          title="تایید رمز ورود"
          name="confirmPassword"
          placeholder="******"
          defaultValue={state.values?.confirmPassword || ''}
          description={''}
          state={state}
          icon={<KeyRound className="w-4 h-4" />}
        />

        <SubmitButton text="ثبت نام" className="w-full" />
        {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">یا</span>
        </div>
      </div>
      <GitHubSignInButton /> */}
      </form>
    </>
  )
}

export default function SignupForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">ثبت نام</h1>
          <p className="text-sm text-muted-foreground">
            برای ایجاد حساب کاربری فرم زیر را پر کنید
          </p>
        </div>
        <UserAuthFormComponent />
        <div className="text-center text-sm">
          حساب کاربری دارید؟{' '}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            وارد شوید
          </Link>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          با کلیک بر روی ادامه، با{' '}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            شرایط استفاده از خدمات
          </Link>{' '}
          و{' '}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            حریم خصوصی
          </Link>{' '}
          ما موافقت می کنید.
        </p>
      </div>
    </Suspense>
  )
}
