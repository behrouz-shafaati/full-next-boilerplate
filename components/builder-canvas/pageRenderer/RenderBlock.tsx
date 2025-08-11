import { getBlockRegistry } from '@/components/builder-canvas/singletonBlockRegistry'
import { Block } from '../types'
import { getVisibilityClass } from '../utils/styleUtils'

type RenderBlockProp = {
  item: Block
}
const RenderBlock = ({ item }: RenderBlockProp) => {
  const blocks = getBlockRegistry() // برای محتوا دار بودن این برای رسیدن به این کامپوننت هیچ کامپوننتی نباید از use client‌ استفاده کرده باشد
  const visibility = item.styles?.visibility
  const className = getVisibilityClass(visibility)

  const block = blocks[item.type]
  const Component = block?.Renderer

  if (Component) return <Component blockData={item} className={className} />
  return <p>رندر بلاک {item.type} ناموفق بود</p>
}

export default RenderBlock
