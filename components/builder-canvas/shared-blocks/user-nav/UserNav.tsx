import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
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
// import { logout } from '@/lib/auth'
import { User } from '@/lib/entity/user/interface'
import { Block } from '../../types'
import { computedStyles } from '../../utils/styleUtils'
type props = {
  user: User
  blockData: {
    content: {}
    type: 'userNav'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement>

export function UserNav({ blockData, user, ...props }: props) {
  const { content, settings, styles } = blockData || {}
  if (user) {
    return (
      <div
        style={{
          ...computedStyles(blockData?.styles || {}),
        }}
        {...props}
      >
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image ?? ''} alt={user?.name ?? ''} />
                <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
              </Avatar>
            </Button>
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
              <DropdownMenuItem>
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
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <form
                className="w-full flex  top-0 left-0 h-full"
                action={async () => {
                  await fetch('/api/logout', {
                    method: 'POST',
                  })
                  window.location.href = '/login' // یا هر صفحه‌ای که می‌خوای
                }}
              >
                <button className="w-full h-full flex">
                  خروج <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
}
