export const dynamic = 'force-static'

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
