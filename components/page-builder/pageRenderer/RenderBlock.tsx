import { blockRegistry } from '../registry/blockRegistry'
import { PageBlock } from '../types'

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

const getVisibilityClass = (visibility: {
  mobile?: boolean
  tablet?: boolean
  desktop?: boolean
}) => {
  const { mobile = true, tablet = true, desktop = true } = visibility || {}

  const classList: string[] = []

  // موبایل: پایه‌ای‌ترین حالت (پیش‌فرض Tailwind)
  if (mobile === false) {
    classList.push('hidden')
  } else {
    classList.push('block')
  }

  // تبلت
  if (tablet === false) {
    classList.push('md:hidden')
  } else {
    classList.push('md:block')
  }

  // دسکتاپ
  if (desktop === false) {
    classList.push('lg:hidden')
  } else {
    classList.push('lg:block')
  }

  return classList.join(' ')
}
