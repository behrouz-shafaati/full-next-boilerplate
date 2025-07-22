import { blockRegistry } from '../registry/blockRegistry'
import { PageBlock } from '../types'
import { getVisibilityClass } from '../utils/styleUtils'

type RenderBlockProp = {
  item: PageBlock
}
const RenderBlock = ({ item }: RenderBlockProp) => {
  const visibility = item.styles?.visibility
  const className = getVisibilityClass(visibility)

  const block = blockRegistry[item.type]
  const Component = block.Renderer

  return <Component blockData={item} className={className} />
}

export default RenderBlock
