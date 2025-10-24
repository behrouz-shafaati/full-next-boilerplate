'use client'
import { Suspense, useActionState, useEffect, useState } from 'react'
import { loginAction } from '@/features/user/actions'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'
import Text from '@/components/form-fields/text'
import { KeyRound, UserIcon } from 'lucide-react'
import Password from '@/components/form-fields/password'
import { SubmitButton } from '@/components/form-fields/submit-button'
import { ActionsState } from '@/types'

function UserAuthFormComponent() {
  const initialState: ActionsState = {
    values: {},
    message: null,
    errors: {},
    success: false,
  }
  const [state, dispatch] = useActionState(loginAction as any, initialState)

  useEffect(() => {
    if (state?.message && state?.message !== null)
      toast({
        variant: state?.success ? 'default' : 'destructive',
        title: '',
        description: state?.message,
      })
  }, [state])

  return (
    <>
      <form action={dispatch} className="space-y-2 w-full">
        {/* Identifier */}
        <Text
          title="ایمیل یا موبایل"
          name="identifier"
          defaultValue={state?.values?.identifier || ''}
          placeholder=""
          state={state}
          icon={<UserIcon className="w-4 h-4" />}
        />

        {/* Password */}
        <Password
          title="رمز ورود"
          name="password"
          placeholder="******"
          defaultValue={state?.values?.password || ''}
          description={''}
          state={state}
          icon={<KeyRound className="w-4 h-4" />}
        />

        <SubmitButton text="ورود" className="w-full" />
      </form>
    </>
  )
}

export default function LoginForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">ورود</h1>
          <p className="text-sm text-muted-foreground">
            برای ورود به حساب کاربری فرم زیر را پر کنید
          </p>
        </div>
        <UserAuthFormComponent />
        <div className="text-center text-sm">
          حساب کاربری ندارید؟{' '}
          <Link
            href="/signup"
            className="underline underline-offset-4 hover:text-primary"
          >
            ثبت نام کنید
          </Link>
        </div>
        <div className="text-center text-sm">
          رمز ورود را فراموش کرده‌اید؟{' '}
          <Link
            href="/resetPass"
            className="underline underline-offset-4 hover:text-primary"
          >
            بازنشانی رمز ورود
          </Link>
        </div>
      </div>
    </Suspense>
  )
}
