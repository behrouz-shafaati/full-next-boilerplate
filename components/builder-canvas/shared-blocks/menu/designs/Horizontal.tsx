import MenuItemDesktop from '../desktop/MenuItemDesktop'
import MobileMenu from '../mobile/MobileMenu'

type Props = {
  items: any
}

export default function HorizontalMenu({ items, ...props }: Props) {
  return (
    <nav {...props}>
      <div className="container flex items-center justify-between px-4 mx-auto">
        {/* دسکتاپ */}
        <nav className="hidden gap-6 md:flex">
          {items?.map((item) => {
            return (
              <MenuItemDesktop
                key={item.id || item._id}
                item={item}
                {...props}
              />
            )
          })}
        </nav>

        {/* موبایل */}
        <MobileMenu items={items} />
      </div>
    </nav>
  )
}
