import { getBlockRegistry } from '@/components/builder-canvas/singletonBlockRegistry'
import { Block } from '../types'
import { combineClassNames, getVisibilityClass } from '../utils/styleUtils'

type RestProps = Record<string, unknown>

type RenderBlockProp = {
  editroMode: boolean
  item: Block
  contents: React.ReactNode[]
}
const RenderBlock = ({
  editroMode = false,
  item,
  ...rest
}: RenderBlockProp) => {
  const blocks = getBlockRegistry() // برای محتوا دار بودن این برای رسیدن به این کامپوننت هیچ کامپوننتی نباید از use client‌ استفاده کرده باشد
  const visibility = item.styles?.visibility
  const className = getVisibilityClass(visibility)

  const block = blocks[item.type]
  const Component = block?.Renderer
  const EditorComponent = block?.RendererInEditor
  if (editroMode && EditorComponent) {
    {
      return (
        <EditorComponent
          blockData={item}
          className={`${className} ${combineClassNames(item.classNames || {})}`}
        />
      )
    }
  } else {
    if (Component) {
      if (item.type.startsWith('content_')) {
        const node = extractNode(rest, item.type) // محتوای مورد نظر استخراج میشود
        if (node)
          return (
            <Component
              blockData={item}
              className={`${className} ${combineClassNames(
                item.classNames || {}
              )}`}
              content={node} // به ویژگی content جهت نمایش در جایگاه مورد نظر پاس داده میشود
            />
          )
      }
      if (item.type === 'templatePart') {
        return (
          <Component
            blockData={item}
            className={`${className} ${combineClassNames(
              item.classNames || {}
            )}`}
            {...rest} // 👈 همه content_all به صورت داینامیک پاس داده میشه
          />
        )
      }
      return (
        <Component
          blockData={item}
          className={`${className} ${combineClassNames(item.classNames || {})}`}
        />
      )
    }
    return <p>رندر بلاک {item.type} ناموفق بود</p>
  }
}

export default RenderBlock

export function extractNode(
  rest: RestProps,
  key: string
): React.ReactNode | null {
  if (!key.startsWith('content_')) return null
  const value = rest[key]
  if (!value) return null
  return value as React.ReactNode
}
