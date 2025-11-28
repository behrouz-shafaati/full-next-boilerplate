import MobileMenuListLazy from '../mobile/MobileMenuListLazy'

type Props = {
  items: any
}

export default function VerticalMenu({ items, ...props }: Props) {
  return (
    <nav {...props}>
      <MobileMenuListLazy items={items} />
    </nav>
  )
}
