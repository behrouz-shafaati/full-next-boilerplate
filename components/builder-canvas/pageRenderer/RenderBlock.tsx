'use server'
import { getBlockRegistry } from '@/components/builder-canvas/singletonBlockRegistry'
import { Block } from '../types'
import { combineClassNames, getVisibilityClass } from '../utils/styleUtils'
import { Settings } from '@/features/settings/interface'

type RestProps = Record<string, unknown>

type RenderBlockProp = {
  siteSettings: Settings
  editroMode: boolean
  item: Block
  pageSlug: string | null
  categorySlug: string | null
  searchParams?: any
}
const RenderBlock = async ({
  siteSettings,
  editroMode = false,
  item,
  pageSlug,
  categorySlug,
  searchParams = {},
  ...rest
}: RenderBlockProp) => {
  const blocks = getBlockRegistry() // برای محتوا دار بودن این برای رسیدن به این کامپوننت هیچ کامپوننتی نباید از use client‌ استفاده کرده باشد
  const visibility = item.styles?.visibility
  const className = getVisibilityClass(visibility)

  const block = blocks[item.type]
  const Component = block?.Renderer
  // const Island = block?.Island
  const EditorComponent = block?.RendererInEditor

  if (editroMode && EditorComponent) {
    {
      return (
        <EditorComponent
          siteSettings={siteSettings}
          blockData={item}
          className={`${className} ${combineClassNames(item.classNames || {})}`}
          pageSlug={pageSlug}
          categorySlug={categorySlug}
          searchParams={searchParams}
        />
      )
    }
  } else {
    if (Component) {
      if (item.type.startsWith('content_')) {
        /**
         * محتواها در صفحه ی مورد نظر از دیتابیس خوانده میشوند و مانند زیر به کامپوننت رندر کننده اصلی داده میشوند و در اینجا همه ی آنها وجود دارند
         * content_post_title={translation?.title}
         *   content_post_cover={post?.image ?? null}
         *   content_post_metadata={metadata}
         * بعد در تابغ زیر هر بلاک محتوای خودش را بر می دارد و نمایش میدهد. مثلا بلاک content_post_title محتوایی که از RenderRows با همین نام آمده را توسط تابع زیر واکشی می کند و آن را نمایش میدهد.
         */
        const node = extractNode(rest, item.type) // محتوای مورد نظر از پراپ های ارسال شده استخراج میشود
        if (node)
          return (
            <>
              <Component
                siteSettings={siteSettings}
                blockData={item}
                className={`${className} ${combineClassNames(
                  item.classNames || {}
                )}`}
                content={node} // به ویژگی content جهت نمایش در جایگاه مورد نظر پاس داده میشود
                pageSlug={pageSlug}
                categorySlug={categorySlug}
                searchParams={searchParams}
              />
            </>
          )
      }
      if (item.type === 'templatePart') {
        return (
          <>
            <Component
              siteSettings={siteSettings}
              blockData={item}
              className={`${className} ${combineClassNames(
                item.classNames || {}
              )}`}
              {...rest} // 👈 همه content_all به صورت داینامیک پاس داده میشه
              pageSlug={pageSlug}
              categorySlug={categorySlug}
              searchParams={searchParams}
            />
          </>
        )
      }

      return (
        <>
          <Component
            siteSettings={siteSettings}
            blockData={item}
            className={`${className} ${combineClassNames(
              item.classNames || {}
            )}`}
            pageSlug={pageSlug}
            categorySlug={categorySlug}
            searchParams={searchParams}
          />
        </>
      )
    }
    return <p>رندر بلاک {item.type} ناموفق بود</p>
  }
}

export default RenderBlock

function extractNode(rest: RestProps, key: string): React.ReactNode | null {
  if (!key.startsWith('content_')) return null
  const value = rest[key]
  if (!value) return null
  return value as React.ReactNode
}
