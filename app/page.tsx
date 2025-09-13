export const dynamic = 'force-static'

import AlbaFallback from '@/components/AlbaFallback'
import { PageRenderer } from '@/components/builder-canvas/pageRenderer'
import pageCtrl from '@/features/page/controller'

export default async function Home() {
  const homePage = await pageCtrl.getHomePage()
  if (homePage != null) return <PageRenderer page={homePage} locale="fa" />

  return <AlbaFallback />
}
