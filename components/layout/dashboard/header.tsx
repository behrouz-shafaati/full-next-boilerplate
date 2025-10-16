import ModeToggle from '../theme-toggle/theme-toggle'
import { cn } from '@/lib/utils'
import { MobileSidebar } from './mobile-sidebar'
import { UserNav } from './user-nav'
import Link from 'next/link'
import { Settings } from '@/features/settings/interface'
import Image from 'next/image'

type props = {
  siteSettings: Settings
}

export default function Header({ siteSettings }: props) {
  console.log('##907 siteSettings:', siteSettings)
  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="hidden lg:block">
          <Link href={'/'} target="_self" className="flex items-center">
            <Image
              height={50}
              width={120}
              alt={siteSettings?.site_title}
              src={siteSettings?.favicon?.srcSmall}
              sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, 1280px"
              className="h-auto max-h-10 w-auto"
            />
            <p className="items-center m-0 px-2 text-lg">
              {siteSettings?.site_title}
            </p>
          </Link>
        </div>
        <div className={cn('block lg:!hidden')}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <UserNav />
          <ModeToggle />
        </div>
      </nav>
    </div>
  )
}
