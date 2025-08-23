export const dynamic = 'force-static'

import { PageRenderer } from '@/components/builder-canvas/pageRenderer'
import pageCtrl from '@/features/page/controller'

export default async function Home() {
  const homePage = await pageCtrl.getHomePage()
  return <PageRenderer page={homePage} />
}
