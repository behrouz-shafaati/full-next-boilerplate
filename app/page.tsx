export const dynamic = 'force-static'

import ModeToggle from '@/components/layout/theme-toggle/theme-toggle'
import { PageRenderer } from '@/components/page-builder/pageRenderer'
import pageCtrl from '@/features/page/controller'

export default async function Home() {
  const homePage = await pageCtrl.getHomePage()
  return <PageRenderer page={homePage} />
}
