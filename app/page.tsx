export const dynamic = 'force-static' // must be force-dynamic or cuse crash

import AlbaFallback from '@/components/AlbaFallback'
import { PageRenderer } from '@/components/builder-canvas/pageRenderer'
import pageCtrl from '@/features/page/controller'

export default async function Home() {
  const locale = 'fa'
  const [homePage] = await Promise.all([pageCtrl.getHomePage()])
  if (homePage != null) {
    return <PageRenderer page={homePage} locale={locale} />
  }
  return <AlbaFallback />
}
