import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button, ButtonProps } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getSession, logout } from '@/lib/auth'
import { can } from '@/lib/utils/can.server'
import { Session } from '@/types'
import Link from 'next/link'
import React from 'react'

const AvatarButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button ref={ref} {...props} />
)
AvatarButton.displayName = 'AvatarButton'

export async function UserNav() {
  const { user } = (await getSession()) as Session
  const userRoles = user?.roles || []
  const canCreateArticle = await can(userRoles, 'article.create', false)
  if (user) {
    return (
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <AvatarButton
            variant="ghost"
            className="relative h-8 w-8 rounded-full"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.image?.srcSmall ?? ''}
                alt={user?.name ?? ''}
              />
              <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
            </Avatar>
          </AvatarButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {canCreateArticle && (
              <DropdownMenuItem className="p-0">
                <Link
                  href="/dashboard/articles/create"
                  className="w-full flex justify-between py-1.5 px-2"
                >
                  <span>افزودن مقاله</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="p-0">
              <Link
                href="/dashboard"
                className="w-full flex justify-between py-1.5 px-2"
              >
                <span>داشبورد</span>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
                پروفایل
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                صورتحساب
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                تنظیمات
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem> */}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <form
              className="w-full flex  top-0 left-0 h-full"
              action={async () => {
                'use server'
                await logout()
              }}
            >
              <button className="w-full h-full flex">
                خروج <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
}
