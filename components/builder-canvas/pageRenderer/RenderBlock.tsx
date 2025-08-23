import { getBlockRegistry } from '@/components/builder-canvas/singletonBlockRegistry'
import { Block } from '../types'
import { combineClassNames, getVisibilityClass } from '../utils/styleUtils'

type RenderBlockProp = {
  editroMode: boolean
  item: Block
}
const RenderBlock = ({ editroMode = false, item }: RenderBlockProp) => {
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
    if (Component)
      return (
        <Component
          blockData={item}
          className={`${className} ${combineClassNames(item.classNames || {})}`}
        />
      )
    return <p>رندر بلاک {item.type} ناموفق بود</p>
  }
}

export default RenderBlock
