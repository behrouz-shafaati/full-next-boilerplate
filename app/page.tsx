export const dynamic = 'force-static' // must be force-dynamic or cuse crash

import AlbaFallback from '@/components/AlbaFallback'
import { PageRenderer } from '@/components/builder-canvas/pageRenderer'
import RendererRows from '@/components/builder-canvas/pageRenderer/RenderRows'
import pageCtrl from '@/features/page/controller'
import { getSettings } from '@/features/settings/controller'
import templateCtrl from '@/features/template/controller'

export default async function Home() {
  const [siteSettings, homePage, template] = await Promise.all([
    getSettings(),
    pageCtrl.getHomePage(),
    templateCtrl.getTemplate({ slug: 'allPages' }),
  ])
  console.log('------------->template:', template)
  if (homePage != null) {
    if (template) {
      return (
        <>
          <RendererRows
            siteSettings={siteSettings}
            rows={template.content.rows}
            editroMode={false}
            content_all={<PageRenderer page={homePage} locale="fa" />}
          />
        </>
      )
    }
    return <PageRenderer page={homePage} locale="fa" />
  }

  return <AlbaFallback />
}
