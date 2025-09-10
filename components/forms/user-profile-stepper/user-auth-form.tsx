'use client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useActionState, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import GitHubSignInButton from '../../github-auth-button'
import { authenticate } from '@/lib/entity/user/actions'

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
})

type UserFormValue = z.infer<typeof formSchema>

function UserAuthFormComponent() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  const [loading, setLoading] = useState(false)
  const [errorMessage, dispatch] = useActionState(authenticate, undefined)
  const defaultValues = {
    email: '',
    password: '',
  }
  // const defaultValues = {
  //   email: 'behrouz.shafaati@gmail.com',
  //   password: '123456',
  // }
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (data: UserFormValue) => {
    signIn('credentials', {
      email: data.email,
      callbackUrl: callbackUrl ?? '/dashboard',
    })
  }

  return (
    <>
      <Form {...form}>
        <form action={dispatch} className="space-y-2 w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ایمیل</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رمز عبور</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder=""
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <>
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div>

          <Button disabled={loading} className="ml-auto w-full" type="submit">
            ورود
          </Button>
        </form>
      </Form>
      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">یا</span>
        </div>
      </div>
      <GitHubSignInButton /> */}
    </>
  )
}

export default function UserAuthForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserAuthFormComponent />
    </Suspense>
  )
}
