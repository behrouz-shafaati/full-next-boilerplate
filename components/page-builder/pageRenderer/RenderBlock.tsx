import { blockRegistry } from '../registry/blockRegistry'
import { PageBlock } from '../types'

type RenderBlockProp = {
  item: PageBlock
}
const RenderBlock = ({ item }: RenderBlockProp) => {
  const block = blockRegistry[item.type]
  const Component = block.Renderer

  return <Component blockData={item} />
}

export default RenderBlock
