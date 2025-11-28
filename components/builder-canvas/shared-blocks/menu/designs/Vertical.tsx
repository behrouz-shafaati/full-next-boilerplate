import MobileMenuLazy from '../mobile/MobileMenuLazy'

type Props = {
  items: any
}

export default function VerticalMenu({ items, ...props }: Props) {
  return (
    <nav {...props}>
      <MobileMenuLazy items={items} />
    </nav>
  )
}
